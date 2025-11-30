/**
 * Midtrans Payment Routes
 *
 * Routes untuk payment flow:
 * - POST /api/v1/payments/snap - Create Snap transaction (auth required)
 * - GET /api/v1/payments/snap/status/:orderId - Check status (auth required)
 * - POST /api/v1/payments/webhook - Webhook handler (NO auth - dari Midtrans)
 */

const express = require("express");
const router = express.Router();
const controller = require("./midtrans.controller");
const auth = require("../../middlewares/auth");
const { paymentLimiter, webhookLimiter } = require("../../middlewares/rateLimiter");

/**
 * @swagger
 * /payments/snap:
 *   post:
 *     summary: Create Midtrans Snap transaction
 *     description: Membuat transaksi pembayaran menggunakan Midtrans Snap. Diperlukan untuk checkout booking.
 *     tags:
 *       - Payment
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sewaId
 *             properties:
 *               sewaId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       201:
 *         description: Payment transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Payment token created
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     redirectUrl:
 *                       type: string
 *                       format: url
 *                     orderId:
 *                       type: string
 *                     paymentId:
 *                       type: integer
 *       400:
 *         description: Booking tidak ditemukan atau sudah dibayar
 *       401:
 *         description: Authentication required
 *       429:
 *         description: Rate limit exceeded - max 10 requests per minute
 */
router.post("/snap", auth, paymentLimiter, controller.createPayment);

/**
 * @swagger
 * /payments/snap/status/{orderId}:
 *   get:
 *     summary: Check payment transaction status
 *     description: Mengecek status pembayaran di Midtrans berdasarkan order ID
 *     tags:
 *       - Payment
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "sewa-42-1700000000"
 *         description: Order ID dari Midtrans
 *     responses:
 *       200:
 *         description: Payment status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       example: "sewa-42-1700000000"
 *                     transactionStatus:
 *                       type: string
 *                       enum: [pending, settlement, deny, cancel, expire, failure]
 *                       example: settlement
 *                     paymentType:
 *                       type: string
 *                       example: credit_card
 *                     fraudStatus:
 *                       type: string
 *                       enum: [accept, challenge, deny]
 *                       example: accept
 *       404:
 *         description: Order tidak ditemukan
 *       401:
 *         description: Authentication required
 */
router.get("/snap/status/:orderId", auth, paymentLimiter, controller.checkStatus);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Midtrans webhook handler
 *     description: Webhook endpoint untuk Midtrans notification. Dipanggil otomatis oleh Midtrans ketika ada status update pembayaran. JANGAN pakai auth di endpoint ini.
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_time:
 *                 type: string
 *                 format: date-time
 *               transaction_status:
 *                 type: string
 *                 enum: [pending, settlement, deny, cancel, expire, failure]
 *               order_id:
 *                 type: string
 *               payment_type:
 *                 type: string
 *               fraud_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Webhook processed
 *       400:
 *         description: Invalid webhook data
 *       429:
 *         description: Rate limit exceeded (100/minute per IP)
 */
router.post("/webhook", webhookLimiter, express.json(), controller.handleWebhook);

module.exports = router;
