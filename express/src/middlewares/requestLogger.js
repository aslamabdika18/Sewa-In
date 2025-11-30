/**
 * Request Logger Middleware
 * 
 * Comprehensive request/response logging with:
 * - Correlation IDs for request tracking
 * - Response time measurement
 * - Performance metrics (slow query detection)
 * - User tracking for audit
 * - Error flagging
 */

const { logRequest, logResponse, logError } = require('../config/logger');
const { getOrCreateCorrelationId } = require('../utils/correlationId');

/**
 * Request logger middleware
 * Catat informasi request dan track waktu response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
module.exports = (req, res, next) => {
  // Generate or retrieve correlation ID
  const correlationId = getOrCreateCorrelationId(req);
  
  // Store in request for use in downstream handlers
  req.correlationId = correlationId;
  
  // Also add to response headers so client can track
  res.setHeader('x-correlation-id', correlationId);

  // Catat waktu mulai request
  const startTime = Date.now();

  // Extract informasi user dari auth
  const userId = req.user?.id || null;

  // Log incoming request
  logRequest(req.method, req.originalUrl, userId, req.ip, correlationId, req.query, req.body);

  // Simpan original res.json untuk intercept response
  const originalJson = res.json;
  const originalSend = res.send;

  // Flag untuk mencegah logging ganda
  let hasLogged = false;

  // Fungsi helper untuk log response (hanya sekali)
  const logResponseOnce = function (data) {
    if (hasLogged) return;
    hasLogged = true;

    // Hitung durasi request
    const duration = Date.now() - startTime;
    
    // Estimate response size
    const responseSize = typeof data === 'string' ? data.length : JSON.stringify(data).length;

    // Log response dengan correlation ID
    logResponse(req.method, req.originalUrl, res.statusCode, duration, userId, correlationId, responseSize);
  };

  // Override res.json untuk log response
  res.json = function (data) {
    logResponseOnce(data);

    // Panggil original res.json
    return originalJson.call(this, data);
  };

  // Also override send for non-JSON responses
  res.send = function (data) {
    logResponseOnce(data);

    // Panggil original res.send
    return originalSend.call(this, data);
  };

  // Handle errors in downstream middleware/routes
  const originalNext = next;
  next = function (err) {
    if (err) {
      const duration = Date.now() - startTime;
      // Log error dengan correlation ID
      logError(err, {
        correlationId,
        method: req.method,
        path: req.originalUrl,
        userId: userId || 'anonymous',
        duration,
      });
    }
    originalNext.apply(this, arguments);
  };

  // Lanjut ke middleware selanjutnya
  next();
};
