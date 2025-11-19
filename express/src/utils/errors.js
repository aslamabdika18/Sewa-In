/**
 * HTTP Error Utilities
 * 
 * Standard HTTP error responses dengan consistent format
 * Memudahkan error handling di controllers
 * 
 * Usage:
 *   throw Errors.badRequest('Email sudah terdaftar')
 *   throw Errors.unauthorized('Invalid credentials')
 *   throw Errors.notFound('User not found')
 */

const { AppError } = require('../middlewares/errorHandler');

/**
 * 400 Bad Request
 * Input validation failed
 */
function badRequest(message = 'Request tidak valid', errorCode = 'BAD_REQUEST') {
  return new AppError(message, 400, errorCode);
}

/**
 * 401 Unauthorized
 * Authentication required or failed
 */
function unauthorized(message = 'Anda perlu login terlebih dahulu', errorCode = 'UNAUTHORIZED') {
  return new AppError(message, 401, errorCode);
}

/**
 * 403 Forbidden
 * User authenticated but not authorized
 */
function forbidden(message = 'Anda tidak memiliki akses ke resource ini', errorCode = 'FORBIDDEN') {
  return new AppError(message, 403, errorCode);
}

/**
 * 404 Not Found
 * Resource tidak ditemukan
 */
function notFound(message = 'Resource tidak ditemukan', errorCode = 'NOT_FOUND') {
  return new AppError(message, 404, errorCode);
}

/**
 * 409 Conflict
 * Duplicate entry, race condition, atau conflict dengan state saat ini
 */
function conflict(message = 'Data conflict', errorCode = 'CONFLICT') {
  return new AppError(message, 409, errorCode);
}

/**
 * 429 Too Many Requests
 * Rate limit exceeded
 */
function tooManyRequests(message = 'Terlalu banyak requests', errorCode = 'RATE_LIMIT') {
  return new AppError(message, 429, errorCode);
}

/**
 * 422 Unprocessable Entity
 * Business logic validation failed
 */
function unprocessableEntity(message = 'Data tidak dapat diproses', errorCode = 'UNPROCESSABLE_ENTITY') {
  return new AppError(message, 422, errorCode);
}

/**
 * 500 Internal Server Error
 * Unexpected server error
 */
function internalError(message = 'Terjadi kesalahan pada server', errorCode = 'INTERNAL_ERROR') {
  return new AppError(message, 500, errorCode);
}

/**
 * 503 Service Unavailable
 * Server maintenance atau database down
 */
function serviceUnavailable(message = 'Service sedang tidak tersedia', errorCode = 'SERVICE_UNAVAILABLE') {
  return new AppError(message, 503, errorCode);
}

/**
 * Custom error dengan status code
 */
function custom(message, statusCode, errorCode) {
  return new AppError(message, statusCode, errorCode);
}

module.exports = {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  tooManyRequests,
  unprocessableEntity,
  internalError,
  serviceUnavailable,
  custom,
  AppError
};
