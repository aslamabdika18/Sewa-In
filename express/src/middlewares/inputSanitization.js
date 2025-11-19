/**
 * Input Sanitization Middleware
 * 
 * Provides comprehensive input validation and sanitization:
 * - Request size limits
 * - Content-Type validation
 * - Malicious payload detection
 * - String sanitization
 * - Recursive object sanitization
 */

const logger = require('../config/logger');

/**
 * Sanitize string values to prevent injection attacks
 * Removes/escapes potentially dangerous characters
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  // HTML entity encoding for dangerous characters
  const htmlEncoding = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '&': '&amp;'
  };

  let sanitized = str;

  // First, encode HTML special characters
  Object.entries(htmlEncoding).forEach(([char, encoded]) => {
    sanitized = sanitized.replace(new RegExp(char, 'g'), encoded);
  });

  // Remove NULL bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters (except tab, newline, carriage return)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
}

/**
 * Recursively sanitize object values
 * Walks through nested objects and arrays
 */
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;

  // Handle strings
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const sanitized = {};
    Object.keys(obj).forEach(key => {
      // Sanitize the key (prevent __proto__ pollution)
      if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    });
    return sanitized;
  }

  // Return primitives as-is (numbers, booleans, etc)
  return obj;
}

/**
 * Detect suspicious patterns in input
 * Identifies potential SQL injection, XSS, or other attacks
 */
function detectSuspiciousPatterns(obj, path = '') {
  const suspiciousPatterns = [
    // SQL injection patterns
    /(\bOR\b|\bAND\b|--|;)\s*\d*\s*=\s*\d*/gi,
    /UNION\s+SELECT/gi,
    /INSERT\s+INTO/gi,
    /DELETE\s+FROM/gi,
    /UPDATE\s+SET/gi,
    /DROP\s+(TABLE|DATABASE)/gi,
    /EXEC\s*\(/gi,
    /EXECUTE\s*\(/gi,

    // XSS patterns
    /<script[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onload=, onclick=, etc
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,

    // Command injection
    /[;`$(){}[\]|&<>]/,

    // Path traversal
    /\.\.\//,
    /\.\.\\/
  ];

  if (typeof obj === 'string') {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(obj)) {
        logger.logError('Suspicious input detected', {
          path,
          pattern: pattern.toString(),
          sample: obj.substring(0, 50)
        });
        return true;
      }
    }
  }

  // Recursively check nested objects
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (detectSuspiciousPatterns(obj[key], `${path}.${key}`)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Validate request size limits
 * Prevents large payload attacks
 */
function validateRequestSize(req, res, next) {
  const contentLength = parseInt(req.get('content-length') || '0');
  
  // Max size: 1MB for JSON, 10MB for file uploads
  const maxSize = req.path.includes('/upload') ? 10485760 : 1048576;

  if (contentLength > maxSize) {
    logger.logError('Request too large', {
      contentLength,
      maxSize,
      path: req.path
    });

    return res.status(413).json({
      success: false,
      message: `Request entity too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
      errorCode: 'PAYLOAD_TOO_LARGE'
    });
  }

  next();
}

/**
 * Validate content-type
 * Ensures request content matches declared type
 */
function validateContentType(req, res, next) {
  // Skip validation for GET/HEAD/DELETE or if no body
  if (['GET', 'HEAD', 'DELETE'].includes(req.method)) {
    return next();
  }

  // Skip if no content-type header
  if (!req.get('content-type')) {
    return next();
  }

  const contentType = req.get('content-type').split(';')[0].trim();
  
  // Allow only specific content types
  const allowedContentTypes = [
    'application/json',
    'application/x-www-form-urlencoded',
    'text/plain',
    'multipart/form-data'
  ];

  if (!allowedContentTypes.some(type => contentType.includes(type))) {
    logger.logError('Invalid content-type', {
      contentType,
      path: req.path
    });

    return res.status(415).json({
      success: false,
      message: 'Unsupported media type. Allowed: application/json',
      errorCode: 'UNSUPPORTED_MEDIA_TYPE'
    });
  }

  next();
}

/**
 * Main input sanitization middleware
 * Applies all validation and sanitization checks
 */
function inputSanitization(req, res, next) {
  // 1. Validate request size
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = req.path.includes('/upload') ? 10485760 : 1048576;

  if (contentLength > maxSize) {
    logger.logError('Request too large', { contentLength, maxSize });
    return res.status(413).json({
      success: false,
      message: `Request too large. Max: ${maxSize / 1024 / 1024}MB`
    });
  }

  // 2. Validate content-type
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('content-type');
    if (contentType && !contentType.includes('application/json') && 
        !contentType.includes('form-urlencoded') &&
        !contentType.includes('multipart/form-data')) {
      return res.status(415).json({
        success: false,
        message: 'Unsupported content type'
      });
    }
  }

  // 3. Check for suspicious patterns
  const suspiciousBody = detectSuspiciousPatterns(req.body);
  const suspiciousQuery = detectSuspiciousPatterns(req.query);
  const suspiciousParams = detectSuspiciousPatterns(req.params);

  if (suspiciousBody || suspiciousQuery || suspiciousParams) {
    logger.logError('Suspicious input detected', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });

    return res.status(400).json({
      success: false,
      message: 'Invalid input detected',
      errorCode: 'INVALID_INPUT'
    });
  }

  // 4. Sanitize all inputs
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
}

module.exports = {
  inputSanitization,
  sanitizeString,
  sanitizeObject,
  detectSuspiciousPatterns,
  validateRequestSize,
  validateContentType,
  securityHeaders: require('./securityHeaders')
};
