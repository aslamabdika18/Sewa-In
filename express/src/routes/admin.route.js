/**
 * Audit Admin Routes
 * 
 * Routes for querying and analyzing audit logs
 * Admin-only access for compliance and debugging
 */

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { checkRole } = require('../middlewares/checkRole');
const auditService = require('../utils/auditLog');
const logger = require('../config/logger');

/**
 * @swagger
 * /admin/audit:
 *   get:
 *     summary: Get audit logs (Admin only)
 *     description: Retrieve audit logs with optional filters for compliance and debugging
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 50
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by admin user
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, RESTORE]
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *           enum: [Barang, Category, User, Payment]
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Audit logs retrieved
 *       403:
 *         description: Admin access required
 */
router.get('/', auth, checkRole('ADMIN'), async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      entity,
      entityId,
      startDate,
      endDate,
    } = req.query;

    const logs = await auditService.getAuditLogs({
      userId: userId ? parseInt(userId) : null,
      action,
      entity,
      entityId: entityId ? parseInt(entityId) : null,
      startDate,
      endDate,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      statusCode: 200,
      message: 'Audit logs retrieved successfully',
      data: logs.data,
      pagination: logs.pagination,
    });
  } catch (error) {
    logger.error({ type: 'AUDIT_GET_ERROR', error: error.message });
    next(error);
  }
});

/**
 * @swagger
 * /admin/audit/entity/{entity}/{id}:
 *   get:
 *     summary: Get audit history for specific entity
 *     description: View all changes made to a specific resource
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Barang, Category, User, Payment]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entity history retrieved
 *       403:
 *         description: Admin access required
 */
router.get('/entity/:entity/:id', auth, checkRole('ADMIN'), async (req, res, next) => {
  try {
    const { entity, id } = req.params;

    const history = await auditService.getEntityAuditHistory(entity, parseInt(id));

    res.json({
      statusCode: 200,
      message: 'Entity audit history retrieved',
      data: history,
    });
  } catch (error) {
    logger.error({ type: 'AUDIT_HISTORY_ERROR', error: error.message });
    next(error);
  }
});

/**
 * @swagger
 * /admin/audit/user/{userId}:
 *   get:
 *     summary: Get user's audit activity
 *     description: View all admin operations performed by a specific user
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: User activity retrieved
 *       403:
 *         description: Admin access required
 */
router.get('/user/:userId', auth, checkRole('ADMIN'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const activity = await auditService.getUserAuditActivity(
      parseInt(userId),
      parseInt(limit)
    );

    res.json({
      statusCode: 200,
      message: 'User audit activity retrieved',
      data: activity,
    });
  } catch (error) {
    logger.error({ type: 'AUDIT_USER_ERROR', error: error.message });
    next(error);
  }
});

/**
 * @swagger
 * /admin/audit/stats:
 *   get:
 *     summary: Get audit statistics
 *     description: Get summary statistics about audit activity
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 byAction:
 *                   type: object
 *                   example:
 *                     CREATE: 150
 *                     UPDATE: 450
 *                     DELETE: 25
 *                 byEntity:
 *                   type: object
 *                   example:
 *                     Barang: 300
 *                     Category: 100
 *                     User: 50
 *                 topUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       count:
 *                         type: integer
 *                 total:
 *                   type: integer
 *       403:
 *         description: Admin access required
 */
router.get('/stats', auth, checkRole('ADMIN'), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await auditService.getAuditStats({
      startDate,
      endDate,
    });

    res.json({
      statusCode: 200,
      message: 'Audit statistics retrieved',
      data: stats,
    });
  } catch (error) {
    logger.error({ type: 'AUDIT_STATS_ERROR', error: error.message });
    next(error);
  }
});

module.exports = router;
