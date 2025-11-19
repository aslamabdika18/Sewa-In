/**
 * Audit Middleware
 * 
 * Automatically logs admin operations to AuditLog table
 * Tracks: who, what, when, where, and how changed
 */

const { auditLog } = require('../utils/auditLog');
const { logger } = require('../config/logger');

/**
 * Audit middleware for tracking admin operations
 * 
 * Use on admin-only routes to automatically track changes
 * 
 * @param {string} entityType - Type of entity being modified (Barang, Category, User, Payment)
 * @param {string} action - Type of action (CREATE, UPDATE, DELETE, RESTORE)
 * @returns {Function} Express middleware
 * 
 * @example
 * // Track all barang updates
 * router.put('/:id', auth, checkRole('ADMIN'), auditMiddleware('Barang', 'UPDATE'), controller);
 * 
 * // Track all barang deletions
 * router.delete('/:id', auth, checkRole('ADMIN'), auditMiddleware('Barang', 'DELETE'), controller);
 */
const auditMiddleware = (entityType, action) => {
  return async (req, res, next) => {
    // Store original data for comparison later
    req.auditData = {
      entityType,
      action,
      entityId: req.params.id ? parseInt(req.params.id) : null,
      correlationId: req.correlationId,
      ipAddress: req.ip,
      userId: req.user?.id,
      originalBody: req.body ? { ...req.body } : null,
    };

    // Intercept response to capture result
    const originalJson = res.json;
    res.json = function (data) {
      // After response is sent, log audit event
      if (res.statusCode < 400 && req.auditData.userId) {
        // Only log successful operations
        setImmediate(() => {
          logAuditEvent(req, res, data);
        });
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Log audit event after operation completes
 * 
 * @private
 */
const logAuditEvent = async (req, res, response) => {
  try {
    const { entityType, action, entityId, correlationId, ipAddress, userId, originalBody } = req.auditData;

    // Extract the entity ID from response if not in params
    let finalEntityId = entityId;
    if (!finalEntityId && response?.data?.id) {
      finalEntityId = response.data.id;
    }

    if (!finalEntityId) {
      logger.warn({
        type: 'AUDIT_NO_ID',
        message: 'Could not determine entity ID for audit log',
        entityType,
        action,
      });
      return;
    }

    // Prepare changes object
    const changes = {
      before: {},
      after: response?.data || {},
    };

    if (action === 'UPDATE' && originalBody) {
      changes.before = originalBody;
    }

    // Log to audit table
    await auditLog({
      userId,
      action,
      entity: entityType,
      entityId: finalEntityId,
      changes,
      details: `${action} via API endpoint`,
      ipAddress,
      correlationId,
    });
  } catch (error) {
    logger.error({
      type: 'AUDIT_MIDDLEWARE_ERROR',
      message: 'Failed to log audit event',
      error: error.message,
      entityType: req.auditData?.entityType,
      action: req.auditData?.action,
    });
    // Don't throw - audit failure shouldn't break the operation
  }
};

/**
 * Helper to manually log audit event
 * Use in controllers when middleware auto-logging isn't sufficient
 * 
 * @param {Object} req - Express request
 * @param {string} entityType - Entity type (Barang, Category, etc)
 * @param {string} action - Action type (CREATE, UPDATE, DELETE, RESTORE)
 * @param {number} entityId - ID of entity
 * @param {Object} changes - Changes object {before: {}, after: {}}
 * @param {string} details - Additional details
 * @returns {Promise<Object>} Created audit log
 * 
 * @example
 * // In controller
 * await manualAuditLog(req, 'Payment', 'UPDATE', paymentId, {
 *   before: { status: 'PENDING' },
 *   after: { status: 'SUCCESS' }
 * });
 */
const manualAuditLog = async (req, entityType, action, entityId, changes, details) => {
  if (!req.user?.id) {
    logger.warn('Audit log attempted without authenticated user');
    return null;
  }

  return auditLog({
    userId: req.user.id,
    action,
    entity: entityType,
    entityId,
    changes,
    details,
    ipAddress: req.ip,
    correlationId: req.correlationId,
  });
};

module.exports = {
  auditMiddleware,
  manualAuditLog,
};
