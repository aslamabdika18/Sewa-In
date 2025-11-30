/**
 * Audit Logging Service
 * 
 * Tracks all administrative operations for compliance and debugging
 * Logs: who, what, when, where, and how data changed
 */

const { prisma } = require('../config/database');
const logger = require('../config/logger');

/**
 * Log an audit event
 * 
 * @param {Object} options - Audit log options
 * @param {number} options.userId - ID of user performing action
 * @param {string} options.action - Action type: CREATE, UPDATE, DELETE, RESTORE
 * @param {string} options.entity - Entity type: Barang, Category, User, Payment
 * @param {number} options.entityId - ID of entity being modified
 * @param {Object} options.changes - Changes object {before: {}, after: {}}
 * @param {string} options.details - Additional context
 * @param {string} options.ipAddress - IP address of requester
 * @param {string} options.correlationId - Request correlation ID
 * @returns {Promise<Object>} Created audit log
 * 
 * @example
 * await auditLog({
 *   userId: 1,
 *   action: 'UPDATE',
 *   entity: 'Barang',
 *   entityId: 5,
 *   changes: {
 *     before: { name: 'Old Name', price: 100000 },
 *     after: { name: 'New Name', price: 150000 }
 *   },
 *   details: 'Price updated due to market changes',
 *   ipAddress: '192.168.1.100',
 *   correlationId: '550e8400-...'
 * });
 */
const auditLog = async ({
  userId,
  action,
  entity,
  entityId,
  changes = null,
  details = null,
  ipAddress = null,
  correlationId = null,
}) => {
  try {
    // Validate required fields
    if (!userId || !action || !entity || !entityId) {
      logger.warn({
        type: 'AUDIT_INVALID',
        message: 'Invalid audit log parameters',
        userId,
        action,
        entity,
        entityId,
      });
      return null;
    }

    // Create audit log entry
    const audit = await prisma.auditLog.create({
      data: {
        userId,
        action: action.toUpperCase(),
        entity,
        entityId,
        changes: changes ? JSON.stringify(changes) : null,
        details: details || null,
        ipAddress: ipAddress || null,
        correlationId: correlationId || null,
      },
    });

    // Also log to application logs
    logger.info({
      type: 'AUDIT',
      action: action.toUpperCase(),
      entity,
      entityId,
      userId,
      correlationId,
      changes: changes ? Object.keys(changes.after || {}) : [],
    });

    return audit;
  } catch (error) {
    logger.error({
      type: 'AUDIT_ERROR',
      message: 'Failed to create audit log',
      error: error.message,
      userId,
      action,
      entity,
      entityId,
    });
    throw error;
  }
};

/**
 * Get audit logs with filters
 * 
 * @param {Object} filters - Filter options
 * @param {number} filters.userId - Filter by user
 * @param {string} filters.action - Filter by action (CREATE, UPDATE, DELETE)
 * @param {string} filters.entity - Filter by entity type
 * @param {number} filters.entityId - Filter by specific entity
 * @param {Date} filters.startDate - Filter from date
 * @param {Date} filters.endDate - Filter to date
 * @param {number} filters.page - Page number (default 1)
 * @param {number} filters.limit - Items per page (default 50)
 * @returns {Promise<Object>} Paginated audit logs
 */
const getAuditLogs = async ({
  userId = null,
  action = null,
  entity = null,
  entityId = null,
  startDate = null,
  endDate = null,
  page = 1,
  limit = 50,
} = {}) => {
  try {
    const where = {};

    if (userId) where.userId = userId;
    if (action) where.action = action.toUpperCase();
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs.map(log => ({
        ...log,
        changes: log.changes ? JSON.parse(log.changes) : null,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error({
      type: 'AUDIT_QUERY_ERROR',
      message: 'Failed to fetch audit logs',
      error: error.message,
    });
    throw error;
  }
};

/**
 * Get audit history for specific entity
 * Shows all changes made to a single resource
 * 
 * @param {string} entity - Entity type
 * @param {number} entityId - Entity ID
 * @returns {Promise<Array>} List of changes
 */
const getEntityAuditHistory = async (entity, entityId) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        entity,
        entityId,
      },
      orderBy: { createdAt: 'asc' },
    });

    return logs.map(log => ({
      ...log,
      changes: log.changes ? JSON.parse(log.changes) : null,
    }));
  } catch (error) {
    logger.error({
      type: 'AUDIT_HISTORY_ERROR',
      message: 'Failed to fetch entity history',
      entity,
      entityId,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Get user's recent admin activity
 * 
 * @param {number} userId - Admin user ID
 * @param {number} limit - Number of recent actions (default 20)
 * @returns {Promise<Array>} Recent audit logs
 */
const getUserAuditActivity = async (userId, limit = 20) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return logs.map(log => ({
      ...log,
      changes: log.changes ? JSON.parse(log.changes) : null,
    }));
  } catch (error) {
    logger.error({
      type: 'AUDIT_USER_ERROR',
      message: 'Failed to fetch user audit activity',
      userId,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Get statistics about audit activity
 * 
 * @param {Object} options - Filter options
 * @param {Date} options.startDate - Start date for range
 * @param {Date} options.endDate - End date for range
 * @returns {Promise<Object>} Audit statistics
 */
const getAuditStats = async ({ startDate = null, endDate = null } = {}) => {
  try {
    const where = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Count by action
    const byAction = await prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: true,
    });

    // Count by entity
    const byEntity = await prisma.auditLog.groupBy({
      by: ['entity'],
      where,
      _count: true,
    });

    // Count by user
    const byUser = await prisma.auditLog.groupBy({
      by: ['userId'],
      where,
      _count: true,
      orderBy: { _count: { userId: 'desc' } },
      take: 10, // Top 10 users
    });

    return {
      byAction: byAction.reduce((acc, row) => {
        acc[row.action] = row._count;
        return acc;
      }, {}),
      byEntity: byEntity.reduce((acc, row) => {
        acc[row.entity] = row._count;
        return acc;
      }, {}),
      topUsers: byUser.map(row => ({
        userId: row.userId,
        count: row._count,
      })),
      total: byAction.reduce((sum, row) => sum + row._count, 0),
    };
  } catch (error) {
    logger.error({
      type: 'AUDIT_STATS_ERROR',
      message: 'Failed to calculate audit statistics',
      error: error.message,
    });
    throw error;
  }
};

/**
 * Delete old audit logs (retention policy)
 * Useful for GDPR compliance and storage management
 * 
 * @param {number} daysOld - Delete logs older than this many days (default 90)
 * @returns {Promise<number>} Number of deleted records
 */
const cleanupOldAuditLogs = async (daysOld = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    logger.info({
      type: 'AUDIT_CLEANUP',
      message: `Deleted ${result.count} old audit logs`,
      daysOld,
      deletedCount: result.count,
    });

    return result.count;
  } catch (error) {
    logger.error({
      type: 'AUDIT_CLEANUP_ERROR',
      message: 'Failed to cleanup old audit logs',
      daysOld,
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  auditLog,
  getAuditLogs,
  getEntityAuditHistory,
  getUserAuditActivity,
  getAuditStats,
  cleanupOldAuditLogs,
};
