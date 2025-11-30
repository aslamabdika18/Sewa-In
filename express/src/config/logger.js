/**
 * Logger Configuration
 * 
 * Menggunakan Pino - modern JSON logger yang cepat dan efisien
 * Dipakai oleh Netflix, Uber, dan banyak perusahaan teknologi besar
 * 
 * Features:
 * - Structured JSON logging
 * - Low overhead (fast performance)
 * - File dan console output
 * - Request/Response tracking
 * - Error stack traces
 */

const pino = require('pino');
const path = require('path');
const fs = require('fs');

// Buat direktori logs jika belum ada
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Konfigurasi transport (output) untuk Pino
 * - Console: untuk development (readable format)
 * - File: untuk production (JSON format untuk parsing)
 */
const transport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        // Pretty-print logs untuk development (warna, format readable)
        colorize: true,
        singleLine: false,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

/**
 * Base logger instance
 * Digunakan untuk aplikasi-wide logging
 */
const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    // Timestamp setiap log
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  isDevelopment ? pino.transport(transport) : process.stdout
);

/**
 * File logger untuk production
 * Simpan semua logs ke file untuk audit trail
 */
const fileLogger = isDevelopment
  ? null
  : pino(
      {
        level: 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.destination({
        pathname: path.join(logsDir, 'app.log'),
        mkdir: true,
      })
    );

/**
 * Error logger untuk production
 * Simpan error logs terpisah untuk monitoring
 */
const errorLogger = isDevelopment
  ? null
  : pino(
      {
        level: 'error',
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.destination({
        pathname: path.join(logsDir, 'error.log'),
        mkdir: true,
      })
    );

/**
 * Log utility functions
 */

// Log request with correlation ID
logger.logRequest = (method, path, userId, ip, correlationId, query, body) => {
  const requestData = {
    type: 'REQUEST',
    correlationId,
    method,
    path,
    userId: userId || 'anonymous',
    ip,
    ...(query && Object.keys(query).length > 0 && { query }),
    ...(body && Object.keys(body).length > 0 && { bodyKeys: Object.keys(body) }), // Log keys only, not sensitive values
  };

  logger.info(requestData, `${method} ${path}`);

  if (fileLogger) {
    fileLogger.info(requestData, `${method} ${path}`);
  }
};

// Log response with correlation ID and performance metrics
logger.logResponse = (method, path, statusCode, duration, userId, correlationId, responseSize = 0) => {
  const level = statusCode >= 400 ? 'warn' : 'info';
  const isSlowQuery = duration > 1000; // Flag queries slower than 1 second
  
  const responseData = {
    type: 'RESPONSE',
    correlationId,
    method,
    path,
    statusCode,
    duration,
    durationMs: `${duration}ms`,
    userId: userId || 'anonymous',
    ...(responseSize > 0 && { responseSize }), // Size in bytes
    ...(isSlowQuery && { slowQuery: true }), // Flag slow queries
    ...(statusCode >= 500 && { error: true }), // Flag server errors
  };

  logger[level](responseData, `${method} ${path} - ${statusCode} (${duration}ms)`);

  if (fileLogger) {
    fileLogger[level](responseData, `${method} ${path} - ${statusCode} (${duration}ms)`);
  }
};

// Log error with correlation ID and context
logger.logError = (error, context = {}) => {
  const errorData = {
    type: 'ERROR',
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode || 500,
    correlationId: context.correlationId || 'unknown',
    ...context,
  };

  logger.error(errorData, error.message);

  if (errorLogger) {
    errorLogger.error(errorData, error.message);
  }
};

// Log authentication with correlation ID
logger.logAuth = (action, userId, success, message = '', correlationId = 'unknown') => {
  const level = success ? 'info' : 'warn';
  const authData = {
    type: 'AUTH',
    action,
    correlationId,
    userId,
    success,
    message: message || undefined,
  };

  logger[level](authData, `Auth ${action}: ${success ? 'SUCCESS' : 'FAILED'} ${message}`);

  if (fileLogger) {
    fileLogger[level](authData, `Auth ${action}: ${success ? 'SUCCESS' : 'FAILED'} ${message}`);
  }
};

// Log payment with correlation ID and transaction tracking
logger.logPayment = (action, sewaId, amount, status, message = '', correlationId = 'unknown') => {
  const paymentData = {
    type: 'PAYMENT',
    action,
    correlationId,
    sewaId,
    amount,
    status,
    message: message || undefined,
    timestamp: new Date().toISOString(),
  };

  logger.info(paymentData, `Payment ${action}: Sewa #${sewaId} - ${status} ${message}`);

  if (fileLogger) {
    fileLogger.info(paymentData, `Payment ${action}: Sewa #${sewaId} - ${status} ${message}`);
  }
};

module.exports = logger;
