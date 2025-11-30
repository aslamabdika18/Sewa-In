/**
 * Validation Middleware
 * 
 * Cara pakai:
 * router.post('/', validateBody(barangCreateSchema), controller.create)
 * 
 * Features:
 * - Zod schema validation
 * - SQL injection detection
 * - Input sanitization
 * - User-friendly error messages
 * - Validated data attached ke req.validated
 */

const { ZodError } = require('zod');
const { checkSQLInjection } = require('../utils/validation');

/**
 * Check untuk SQL injection patterns di string values
 */
function detectInject(data) {
  const checkValue = (value) => {
    if (typeof value === 'string') {
      return checkSQLInjection(value);
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  return checkValue(data);
}

/**
 * Validate request body menggunakan Zod schema
 * 
 * @param {ZodSchema} schema - Zod schema untuk validation
 * @returns {Function} Express middleware
 */
function validateBody(schema) {
  return (req, res, next) => {
    try {
      // Security: Check untuk SQL injection attempts
      if (detectInject(req.body)) {
        return res.status(400).json({
          success: false,
          message: 'Input mengandung pattern yang tidak valid',
          errorCode: 'INVALID_INPUT'
        });
      }

      // Parse dengan Zod schema
      const validated = schema.parse(req.body);
      req.validated = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError && error.errors) {
        // Format Zod errors jadi user-friendly
        const formattedErrors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {});

        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: formattedErrors,
          errorCode: 'VALIDATION_ERROR'
        });
      }

      // Jika error bukan ZodError, propagate ke error handler
      next(error);
    }
  };
}

/**
 * Validate request query menggunakan Zod schema
 * 
 * @param {ZodSchema} schema - Zod schema untuk validation
 * @returns {Function} Express middleware
 */
function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.validated = { ...req.validated, ...validated };
      next();
    } catch (error) {
      if (error instanceof ZodError && error.errors) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {});

        return res.status(400).json({
          success: false,
          message: 'Validasi query gagal',
          errors: formattedErrors
        });
      }

      next(error);
    }
  };
}

/**
 * Validate request params menggunakan Zod schema
 * 
 * @param {ZodSchema} schema - Zod schema untuk validation
 * @returns {Function} Express middleware
 */
function validateParams(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.params);
      req.validated = { ...req.validated, ...validated };
      next();
    } catch (error) {
      if (error instanceof ZodError && error.errors) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {});

        return res.status(400).json({
          success: false,
          message: 'Validasi parameter gagal',
          errors: formattedErrors
        });
      }

      next(error);
    }
  };
}

module.exports = {
  validateBody,
  validateQuery,
  validateParams
};
