/**
 * Response Format Utilities
 * 
 * Standard response format untuk consistency
 * 
 * Success Response:
 * {
 *   "success": true,
 *   "message": "string",
 *   "data": {...},
 *   "pagination": {...} | null
 * }
 * 
 * Error Response:
 * {
 *   "success": false,
 *   "message": "string",
 *   "errorCode": "ERROR_CODE",
 *   "statusCode": 400
 * }
 */

/**
 * Send success response
 * 
 * Usage:
 *   return success(res, data, 'Data berhasil diambil', null, 200)
 *   return success(res, items, 'Items loaded', pagination, 200)
 */
function success(res, data, message = 'OK', pagination = null, status = 200) {
  const response = {
    success: true,
    message,
    data
  };

  // Add pagination jika ada
  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(status).json(response);
}

/**
 * Send error response (legacy, prefer using error handler)
 * 
 * Better practice: throw AppError di controller, let error handler catch it
 * 
 * Usage:
 *   return error(res, 'Email sudah terdaftar', 409)
 */
function error(res, message = 'Terjadi kesalahan', status = 400, errorCode = null) {
  const response = {
    success: false,
    message,
    statusCode: status
  };

  if (errorCode) {
    response.errorCode = errorCode;
  }

  return res.status(status).json(response);
}

/**
 * Created (201) response
 * 
 * Usage:
 *   return created(res, newUser, 'User berhasil dibuat')
 */
function created(res, data, message = 'Data berhasil dibuat') {
  return success(res, data, message, null, 201);
}

/**
 * No Content (204) response
 * 
 * Usage:
 *   return noContent(res)
 */
function noContent(res) {
  return res.status(204).send();
}

/**
 * Accepted (202) response for async operations
 * 
 * Usage:
 *   return accepted(res, { taskId: '123' }, 'Request diterima, sedang diproses')
 */
function accepted(res, data, message = 'Request diterima') {
  return success(res, data, message, null, 202);
}

// Exports
module.exports = {
  success,
  error,
  created,
  noContent,
  accepted
};

// Legacy exports for backward compatibility
module.exports.success = success;
module.exports.error = error;
