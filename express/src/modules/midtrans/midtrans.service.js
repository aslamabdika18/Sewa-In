/**
 * Midtrans Payment Service
 * 
 * Handle semua payment operations:
 * - Create snap transaction untuk payment
 * - Check transaction status
 * - Handle webhook notifications
 * - Update payment record di database
 */

const prisma = require("../../config/database");
const midtransClient = require('midtrans-client');
const crypto = require('crypto');

/**
 * VERIFY WEBHOOK SIGNATURE
 * 
 * Midtrans mengirim signature untuk verifikasi authenticity webhook
 * Signature = MD5(order_id + status_code + gross_amount + server_key)
 * 
 * @param {Object} notification - Webhook notification dari Midtrans
 * @param {string} signature - Signature dari Midtrans header
 * @returns {boolean} True jika signature valid
 */
function verifyWebhookSignature(notification, signature) {
  // Midtrans signature verification
  // Signature = MD5(order_id + status_code + gross_amount + server_key)
  
  const orderId = notification.order_id;
  const statusCode = notification.status_code || notification.transaction_status;
  const grossAmount = notification.gross_amount;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  // Build the signature input
  const signatureInput = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  
  // Generate hash
  const expectedSignature = crypto
    .createHash('md5')
    .update(signatureInput)
    .digest('hex');

  // Compare signatures
  return expectedSignature === signature;
}

/**
 * Initialize Midtrans Snap client
 */
function getSnapClient() {
  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });

  return snap;
}

/**
 * Initialize Midtrans Core client untuk check status
 */
function getCorClient() {
  const core = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });

  return core;
}

/**
 * CREATE SNAP TRANSACTION
 * 
 * @param {number} sewaId - ID dari sewa record
 * @returns {Promise<Object>} Snap token dan redirect URL
 */
module.exports.verifyWebhookSignature = verifyWebhookSignature;

module.exports.createSnapTransaction = async (sewaId) => {
  const sewa = await prisma.sewa.findUnique({
    where: { id: sewaId },
    include: {
      user: true,
      items: {
        include: { barang: true }
      }
    }
  });

  if (!sewa) {
    throw new Error('Sewa tidak ditemukan');
  }

  if (sewa.status !== 'PENDING') {
    throw new Error(`Sewa dengan status ${sewa.status} tidak bisa dibayar`);
  }

  // Calculate duration
  const duration = Math.ceil(
    (new Date(sewa.endDate) - new Date(sewa.startDate)) / (1000 * 60 * 60 * 24)
  );

  // Prepare item details untuk Midtrans
  const itemDetails = sewa.items.map(item => ({
    id: `sewa_item_${item.id}`,
    price: item.barang.pricePerDay * item.quantity * duration,
    quantity: 1,
    name: `${item.barang.name} (${item.quantity}x x ${duration} hari)`
  }));

  // Prepare parameter untuk Snap API
  const orderId = `SEWA-${sewa.id}-${Date.now()}`;
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: sewa.totalPrice
    },
    credit_card: {
      secure: true
    },
    customer_details: {
      first_name: sewa.user.name,
      email: sewa.user.email,
      phone: sewa.user.phone || ''
    },
    item_details: itemDetails
  };

  try {
    const snap = getSnapClient();
    const transaction = await snap.createTransaction(parameter);

    // Save payment record ke database
    const payment = await prisma.payment.create({
      data: {
        sewaId,
        amount: sewa.totalPrice,
        method: 'MIDTRANS_SNAP',
        status: 'PENDING'
      }
    });

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId: orderId,
      paymentId: payment.id
    };
  } catch (error) {
    throw new Error(`Gagal membuat transaksi Midtrans: ${error.message}`);
  }
};

/**
 * GET TRANSACTION STATUS dari Midtrans
 * 
 * @param {string} orderId - Order ID dari Midtrans
 * @returns {Promise<Object>} Status transaksi
 */
module.exports.getTransactionStatus = async (orderId) => {
  try {
    const core = getCorClient();
    const status = await core.transaction.status(orderId);

    return {
      orderId,
      transactionStatus: status.transaction_status,
      paymentType: status.payment_type,
      fraudStatus: status.fraud_status
    };
  } catch (error) {
    throw new Error(`Gagal mengambil status transaksi: ${error.message}`);
  }
};

/**
 * HANDLE WEBHOOK NOTIFICATION dari Midtrans
 * 
 * Dipanggil oleh Midtrans ketika ada update status pembayaran
 * IDEMPOTENT: Jika webhook dipanggil 2x, hanya diproses 1x
 * 
 * @param {Object} notification - Webhook notification dari Midtrans
 * @returns {Promise<Object>} Update result
 */
module.exports.handleNotification = async (notification) => {
  const {
    order_id,
    transaction_status,
    fraud_status,
    payment_type,
    transaction_id
  } = notification;

  // IDEMPOTENCY CHECK: Cek apakah webhook sudah diprocess sebelumnya
  // transaction_id dari Midtrans unique per transaksi
  const alreadyProcessed = await prisma.payment.findFirst({
    where: { webhookProcessedId: transaction_id }
  });

  if (alreadyProcessed) {
    // Webhook sudah diprocess sebelumnya, return result lama
    return {
      success: true,
      message: 'Webhook already processed',
      isRetry: true,
      paymentId: alreadyProcessed.id,
      paymentStatus: alreadyProcessed.status,
      sewaId: alreadyProcessed.sewaId
    };
  }

  // Extract sewaId dari order_id (format: SEWA-{sewaId}-{timestamp})
  const sewaId = parseInt(order_id.split('-')[1]);

  // Find sewa
  const sewa = await prisma.sewa.findUnique({
    where: { id: sewaId }
  });

  if (!sewa) {
    throw new Error(`Sewa dengan ID ${sewaId} tidak ditemukan`);
  }

  // Find payment
  let payment = await prisma.payment.findFirst({
    where: { sewaId }
  });

  // Determine payment status dari Midtrans response
  let paymentStatus = 'PENDING';

  if (transaction_status === 'capture') {
    if (fraud_status === 'challenge') {
      paymentStatus = 'PENDING';
    } else if (fraud_status === 'accept') {
      paymentStatus = 'SUCCESS';
    }
  } else if (transaction_status === 'settlement') {
    paymentStatus = 'SUCCESS';
  } else if (transaction_status === 'deny') {
    paymentStatus = 'FAILED';
  } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
    paymentStatus = 'FAILED';
  } else if (transaction_status === 'pending') {
    paymentStatus = 'PENDING';
  }

  // Update atau create payment record WITH webhookProcessedId
  if (payment) {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus,
        method: 'MIDTRANS_SNAP',
        webhookProcessedId: transaction_id  // Track webhook processing
      }
    });
  } else {
    payment = await prisma.payment.create({
      data: {
        sewaId,
        amount: sewa.totalPrice,
        method: 'MIDTRANS_SNAP',
        status: paymentStatus,
        webhookProcessedId: transaction_id  // Track webhook processing
      }
    });
  }

  // Update sewa status based on payment (hanya jika payment status berubah)
  if (paymentStatus === 'SUCCESS') {
    await prisma.sewa.update({
      where: { id: sewaId },
      data: { status: 'PAID' }
    });
  } else if (paymentStatus === 'FAILED') {
    // Jika payment failed, sewa tetap PENDING (user bisa retry)
    await prisma.sewa.update({
      where: { id: sewaId },
      data: { status: 'PENDING' }
    });
  }

  return {
    success: true,
    message: 'Webhook processed',
    isRetry: false,
    paymentId: payment.id,
    paymentStatus,
    sewaId: sewaId
  };
};
