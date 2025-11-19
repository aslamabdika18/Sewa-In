/**
 * Midtrans Payment Controller
 * 
 * Handle payment endpoints:
 * - POST /payments/create - Create snap transaction
 * - GET /payments/status/:orderId - Check transaction status
 * - POST /payments/webhook - Handle Midtrans webhook
 */

const midtransService = require("./midtrans.service");
const NotificationService = require("../../services/notification.service");
const { success } = require("../../utils/response");
const logger = require("../../config/logger");

/**
 * CREATE PAYMENT - Create Midtrans Snap transaction
 * 
 * Body: { sewaId: number }
 * Response: { token, redirectUrl, orderId, paymentId }
 */
module.exports.createPayment = async (req, res, next) => {
  try {
    const { sewaId } = req.body;

    if (!sewaId) {
      return res.status(400).json({
        success: false,
        message: 'sewaId wajib diisi'
      });
    }

    const payment = await midtransService.createSnapTransaction(sewaId);

    return success(
      res,
      payment,
      "Snap transaction berhasil dibuat. Silakan lanjut ke pembayaran.",
      null,
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * CHECK PAYMENT STATUS
 * 
 * Params: orderId
 * Response: { orderId, transactionStatus, paymentType, fraudStatus }
 */
module.exports.checkStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'orderId wajib diisi'
      });
    }

    const status = await midtransService.getTransactionStatus(orderId);

    return success(
      res,
      status,
      "Status transaksi berhasil diambil"
    );
  } catch (err) {
    next(err);
  }
};

/**
 * WEBHOOK HANDLER - Handle Midtrans notification
 * 
 * Endpoint ini dipanggil oleh Midtrans ketika ada update status pembayaran
 * PENTING: Jangan pakai auth middleware untuk endpoint ini!
 * IDEMPOTENT: Jika webhook dipanggil 2x, hanya diproses 1x
 * 
 * Request dari Midtrans:
 * - order_id
 * - transaction_status (capture, settlement, pending, deny, cancel, expire)
 * - fraud_status
 * - payment_type
 * - transaction_id
 */
module.exports.handleWebhook = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const notification = req.body;

    // Log incoming webhook
    console.log('📝 Webhook received:', {
      orderId: notification.order_id,
      transactionId: notification.transaction_id,
      status: notification.transaction_status,
      timestamp: new Date().toISOString()
    });

    // Validate notification dari Midtrans
    if (!notification.order_id) {
      console.warn('⚠️  Invalid webhook - missing order_id');
      return res.status(200).json({
        success: false,
        message: 'Invalid notification format'
      });
    }

    // Process notification (idempotent)
    const result = await midtransService.handleNotification(notification);

    const processingTime = Date.now() - startTime;

    // Send payment success email asynchronously if payment just succeeded (first time processing)
    if (result.paymentStatus === 'PAID' && !result.isRetry && result.sewaId) {
      setImmediate(async () => {
        try {
          await NotificationService.sendPaymentSuccess(result.sewaId, result.amount);
          logger.logRequest(`✉️  Payment success email sent`, { 
            sewaId: result.sewaId,
            transactionId: notification.transaction_id 
          });
        } catch (err) {
          logger.logError(`Failed to send payment success email`, {
            sewaId: result.sewaId,
            error: err.message
          });
        }
      });
    }

    // Log success
    if (result.isRetry) {
      console.log('✅ Webhook already processed (retry):', {
        transactionId: notification.transaction_id,
        paymentId: result.paymentId,
        status: result.paymentStatus,
        processingTimeMs: processingTime
      });
    } else {
      console.log('✅ Webhook processed successfully:', {
        transactionId: notification.transaction_id,
        paymentId: result.paymentId,
        status: result.paymentStatus,
        sewaId: result.sewaId,
        processingTimeMs: processingTime
      });
    }

    // Respond 200 OK to Midtrans (ALWAYS 200 for webhooks)
    return res.status(200).json({
      success: true,
      message: 'Webhook processed',
      data: result
    });
  } catch (err) {
    const processingTime = Date.now() - startTime;
    
    // Log error
    console.error('❌ Webhook error:', {
      error: err.message,
      orderId: req.body?.order_id,
      transactionId: req.body?.transaction_id,
      processingTimeMs: processingTime,
      stack: err.stack
    });

    // Jangan throw error untuk webhook - selalu respond 200
    // Ini penting agar Midtrans tidak retry berkali-kali
    return res.status(200).json({
      success: false,
      message: err.message
    });
  }
};
