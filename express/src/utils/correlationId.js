/**
 * Correlation ID Utilities
 * 
 * Used to track requests across logs for debugging
 * Each request gets a unique UUID that's logged with every entry
 * 
 * Example flow:
 * 1. Request comes in: POST /api/v1/sewa
 * 2. Generate correlationId: 550e8400-e29b-41d4-a716-446655440000
 * 3. Log every operation with this ID
 * 4. Can search logs: grep "550e8400" logs/app.log
 * 5. See entire request lifecycle
 */

const crypto = require('crypto');

/**
 * Generate unique correlation ID for tracking request
 * Format: UUID v4
 * 
 * @returns {string} Unique correlation ID
 */
const generateCorrelationId = () => {
  // Use crypto.randomUUID if available (Node 15.7+), else fallback
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback: generate UUID v4 manually
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

/**
 * Get correlation ID from request
 * Priority: 
 * 1. x-correlation-id header (if client provides)
 * 2. x-request-id header (fallback)
 * 3. Generate new if not provided
 * 
 * @param {Object} req - Express request object
 * @returns {string} Correlation ID
 */
const getOrCreateCorrelationId = (req) => {
  // Check if client provided correlation ID
  const existingId = 
    req.headers['x-correlation-id'] || 
    req.headers['x-request-id'];
  
  if (existingId && typeof existingId === 'string') {
    return existingId;
  }
  
  // Generate new ID
  return generateCorrelationId();
};

/**
 * Add correlation ID to context for passing between functions
 * 
 * Usage:
 * const correlationId = getOrCreateCorrelationId(req);
 * req.correlationId = correlationId;
 * // Now available in all downstream handlers
 */

module.exports = {
  generateCorrelationId,
  getOrCreateCorrelationId,
};
