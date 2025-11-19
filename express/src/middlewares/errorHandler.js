/**
 * Error Handler Middleware
 * 
 * CRITICAL: Centralized error handling untuk semua error di aplikasi
 * Struktur error handling:
 * 1. Prisma errors (database)
 * 2. Validation errors (Zod)
 * 3. Custom AppErrors (expected errors)
 * 4. Unexpected errors (development vs production)
 * 
 * Pastikan middleware ini di-register PALING AKHIR di app.js
 * 
 * Contoh di app.js:
 * app.use('/api/v1', routes)
 * app.use(errorHandler)  // <--- HARUS PALING AKHIR
 * 
 * Error Response Format:
 * {
 *   "success": false,
 *   "message": "Error message yang user-friendly",
 *   "errorCode": "ERROR_CODE",
 *   "statusCode": 400,
 *   "details": {...} // Only in development
 * }
 */

/**
 * Custom AppError class untuk consistent error handling
 * 
 * Usage:
 *   throw new AppError('User not found', 404)
 *   throw new AppError('Unauthorized', 401)
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Mark sebagai expected error

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Prisma errors dengan mapping ke HTTP status codes
 */
function handlePrismaError(err) {
  // P2002: Unique constraint failed
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(
      `${field} sudah terdaftar. Gunakan ${field} yang berbeda.`,
      409,
      'DUPLICATE_ENTRY'
    );
  }

  // P2025: Record not found
  if (err.code === 'P2025') {
    return new AppError(
      'Data tidak ditemukan',
      404,
      'NOT_FOUND'
    );
  }

  // P2003: Foreign key constraint failed
  if (err.code === 'P2003') {
    return new AppError(
      'Referensi data tidak valid. Data terkait tidak ditemukan.',
      400,
      'INVALID_REFERENCE'
    );
  }

  // P2014: Required relation violation
  if (err.code === 'P2014') {
    return new AppError(
      'Tidak bisa menghapus data ini karena masih digunakan.',
      409,
      'CONSTRAINT_VIOLATION'
    );
  }

  // P2028: Transaction timeout / serialization failure
  if (err.code === 'P2028') {
    return new AppError(
      'Terjadi konflik transaksi. Silakan coba lagi.',
      409,
      'TRANSACTION_CONFLICT'
    );
  }

  // P2015: Related record not found
  if (err.code === 'P2015') {
    return new AppError(
      'Data terkait tidak ditemukan.',
      404,
      'RELATED_NOT_FOUND'
    );
  }

  // Unknown Prisma error
  return new AppError(
    'Terjadi kesalahan database. Silakan hubungi support.',
    500,
    'DATABASE_ERROR'
  );
}

/**
 * Handle validation errors
 */
function handleValidationError(err) {
  if (err.name === 'ZodError') {
    return {
      statusCode: 400,
      message: 'Validasi data gagal',
      errorCode: 'VALIDATION_ERROR',
      errors: err.errors.reduce((acc, e) => {
        acc[e.path.join('.')] = e.message;
        return acc;
      }, {})
    };
  }

  return null;
}

/**
 * Handle JWT errors
 */
function handleJWTError(err) {
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Token tidak valid', 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    return new AppError('Token sudah expired. Silakan login kembali.', 401, 'TOKEN_EXPIRED');
  }

  return null;
}

/**
 * Format error response
 */
function formatErrorResponse(err, isDevelopment = false) {
  const response = {
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    statusCode: err.statusCode || 500
  };

  // Add error code if available
  if (err.errorCode) {
    response.errorCode = err.errorCode;
  }

  // Add details in development
  if (isDevelopment) {
    response.details = {
      stack: err.stack,
      ...(err.code && { prismaCode: err.code }),
      ...(err.meta && { meta: err.meta })
    };
  }

  return response;
}

/**
 * Centralized error handler middleware
 */
function errorHandler(err, req, res, next) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  let error = err;

  // Log error untuk monitoring
  console.error({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    statusCode: error.statusCode || 500,
    message: error.message,
    userId: req.user?.id,
    ...(isDevelopment && { stack: error.stack })
  });

  // Handle Prisma errors
  if (error.code && (error.code.startsWith('P') || error.code.startsWith('P'))) {
    error = handlePrismaError(error);
  }

  // Handle JWT errors
  const jwtError = handleJWTError(error);
  if (jwtError) {
    error = jwtError;
  }

  // Handle validation errors
  const validationError = handleValidationError(error);
  if (validationError) {
    return res.status(validationError.statusCode).json(validationError);
  }

  // Handle operational errors (AppError)
  if (error.isOperational) {
    return res.status(error.statusCode).json(
      formatErrorResponse(error, isDevelopment)
    );
  }

  // Handle unexpected errors (non-operational)
  if (isDevelopment) {
    // Development: show full error details
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      error: error
    });
  }

  // Production: hide sensitive details
  return res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server. Tim kami sudah diberitahu.',
    errorCode: 'INTERNAL_ERROR',
    statusCode: 500
  });
}

module.exports = {
  AppError,
  errorHandler
};
