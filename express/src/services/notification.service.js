/**
 * Notification Service
 * 
 * High-level notification service that handles business logic
 * Sends emails for booking and payment events
 */

const { sendEmail } = require('./email.service');
const emailConfig = require('../config/email');
const logger = require('../config/logger');
const prisma = require('../config/database');

/**
 * Format date for display
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format currency to IDR
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Send booking confirmation email
 * 
 * @param {Object} sewa - Sewa record with user and items included
 * @returns {Promise<void>}
 */
async function sendBookingConfirmation(sewa) {
  try {
    // Get full sewa details with items and barang info
    const fullSewa = await prisma.sewa.findUnique({
      where: { id: sewa.id },
      include: {
        user: true,
        items: {
          include: { barang: true }
        }
      }
    });

    if (!fullSewa) {
      throw new Error(`Sewa ${sewa.id} not found`);
    }

    const itemsList = fullSewa.items
      .map(item => `<li>${item.barang.name} × ${item.quantity}</li>`)
      .join('');

    const duration = Math.ceil(
      (new Date(fullSewa.endDate) - new Date(fullSewa.startDate)) / (1000 * 60 * 60 * 24)
    );

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .booking-details { background-color: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
          strong { color: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Konfirmasi Pemesanan ${emailConfig.templates.appName}</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${fullSewa.user.name}</strong>,</p>
            <p>Terima kasih telah melakukan pemesanan di ${emailConfig.templates.appName}. Berikut adalah detail pemesanan Anda:</p>
            
            <div class="booking-details">
              <h3>📋 Detail Pemesanan</h3>
              <p><strong>ID Pemesanan:</strong> #${fullSewa.id}</p>
              <p><strong>Tanggal Pemesanan:</strong> ${formatDate(fullSewa.createdAt)}</p>
              <p><strong>Tanggal Mulai:</strong> ${formatDate(fullSewa.startDate)}</p>
              <p><strong>Tanggal Berakhir:</strong> ${formatDate(fullSewa.endDate)}</p>
              <p><strong>Durasi:</strong> ${duration} hari</p>
              
              <h4>Barang yang Disewa:</h4>
              <ul>${itemsList}</ul>
              
              <p><strong>Total Harga:</strong> ${formatCurrency(fullSewa.totalPrice)}</p>
              <p><strong>Status:</strong> ${fullSewa.status}</p>
            </div>

            <h3>💳 Langkah Selanjutnya</h3>
            <p>Silakan lakukan pembayaran untuk mengkonfirmasi pemesanan Anda. Anda dapat melakukan pembayaran melalui link pembayaran yang akan dikirim dalam email terpisah.</p>

            <p>Jika Anda memiliki pertanyaan atau butuh bantuan, hubungi tim support kami di <strong>${emailConfig.templates.supportEmail}</strong>.</p>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${emailConfig.templates.appName}. Semua hak dilindungi.</p>
              <p>Email ini adalah notifikasi otomatis, harap jangan membalas email ini.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: fullSewa.user.email,
      subject: `Konfirmasi Pemesanan #${fullSewa.id} - ${emailConfig.templates.appName}`,
      html
    });

    logger.logRequest(`✉️  Booking confirmation email sent`, {
      sewaId: fullSewa.id,
      email: fullSewa.user.email
    });
  } catch (err) {
    logger.logError(`❌ Failed to send booking confirmation`, {
      sewaId: sewa.id,
      error: err.message
    });
    throw err;
  }
}

/**
 * Send payment successful notification email
 * 
 * @param {number} sewaId - ID of sewa record
 * @param {number} amount - Payment amount
 * @returns {Promise<void>}
 */
async function sendPaymentSuccess(sewaId, amount) {
  try {
    const sewa = await prisma.sewa.findUnique({
      where: { id: sewaId },
      include: {
        user: true,
        items: { include: { barang: true } }
      }
    });

    if (!sewa) {
      throw new Error(`Sewa ${sewaId} not found`);
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .success-badge { background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; margin: 15px 0; }
          .details { background-color: white; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Pembayaran Berhasil</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${sewa.user.name}</strong>,</p>
            
            <div class="success-badge">
              Pembayaran Anda sebesar ${formatCurrency(amount)} telah diterima
            </div>

            <p>Terima kasih atas pembayaran Anda! Pemesanan Anda sekarang telah dikonfirmasi dan siap untuk diambil.</p>

            <div class="details">
              <h3>💰 Rincian Pembayaran</h3>
              <p><strong>ID Pemesanan:</strong> #${sewa.id}</p>
              <p><strong>Jumlah Pembayaran:</strong> ${formatCurrency(amount)}</p>
              <p><strong>Tanggal Pembayaran:</strong> ${formatDate(new Date())}</p>
              <p><strong>Metode Pembayaran:</strong> Midtrans Payment Gateway</p>

              <h4>Tanggal Penyewaan:</h4>
              <p><strong>Mulai:</strong> ${formatDate(sewa.startDate)}</p>
              <p><strong>Berakhir:</strong> ${formatDate(sewa.endDate)}</p>
            </div>

            <h3>📦 Informasi Pengambilan</h3>
            <p>Anda dapat mengambil barang yang disewa mulai dari tanggal <strong>${formatDate(sewa.startDate)}</strong>. Silakan hubungi kami atau kunjungi toko kami untuk menyelesaikan proses pengambilan.</p>

            <p>Jika ada pertanyaan, hubungi kami di <strong>${emailConfig.templates.supportEmail}</strong>.</p>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${emailConfig.templates.appName}. Semua hak dilindungi.</p>
              <p>Email ini adalah notifikasi otomatis, harap jangan membalas email ini.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: sewa.user.email,
      subject: `Pembayaran Berhasil - Pemesanan #${sewa.id} ${emailConfig.templates.appName}`,
      html
    });

    logger.logRequest(`✉️  Payment success email sent`, {
      sewaId,
      email: sewa.user.email,
      amount
    });
  } catch (err) {
    logger.logError(`❌ Failed to send payment success email`, {
      sewaId,
      error: err.message
    });
    throw err;
  }
}

/**
 * Send booking cancellation email
 * 
 * @param {number} sewaId - ID of cancelled sewa
 * @param {string} reason - Reason for cancellation
 * @returns {Promise<void>}
 */
async function sendBookingCancellation(sewaId, reason = 'Permintaan pembatalan pengguna') {
  try {
    const sewa = await prisma.sewa.findUnique({
      where: { id: sewaId },
      include: {
        user: true,
        items: { include: { barang: true } }
      }
    });

    if (!sewa) {
      throw new Error(`Sewa ${sewaId} not found`);
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .details { background-color: white; padding: 15px; border-left: 4px solid #f44336; margin: 15px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Pemesanan Dibatalkan</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${sewa.user.name}</strong>,</p>
            <p>Pemesanan Anda telah dibatalkan. Berikut adalah detail pembatalan:</p>

            <div class="details">
              <h3>📋 Detail Pemesanan</h3>
              <p><strong>ID Pemesanan:</strong> #${sewa.id}</p>
              <p><strong>Tanggal Pembatalan:</strong> ${formatDate(new Date())}</p>
              <p><strong>Alasan Pembatalan:</strong> ${reason}</p>
              <p><strong>Total Harga:</strong> ${formatCurrency(sewa.totalPrice)}</p>
            </div>

            <h3>💰 Pengembalian Dana</h3>
            <p>Jika Anda telah melakukan pembayaran, pengembalian dana akan diproses dalam waktu 3-5 hari kerja ke rekening asal Anda.</p>

            <p>Jika ada pertanyaan tentang pembatalan ini, silakan hubungi support kami di <strong>${emailConfig.templates.supportEmail}</strong>.</p>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${emailConfig.templates.appName}. Semua hak dilindungi.</p>
              <p>Email ini adalah notifikasi otomatis, harap jangan membalas email ini.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: sewa.user.email,
      subject: `Pembatalan Pemesanan #${sewa.id} - ${emailConfig.templates.appName}`,
      html
    });

    logger.logRequest(`✉️  Booking cancellation email sent`, {
      sewaId,
      email: sewa.user.email
    });
  } catch (err) {
    logger.logError(`❌ Failed to send booking cancellation email`, {
      sewaId,
      error: err.message
    });
    throw err;
  }
}

/**
 * Send booking reminder email
 * Sent 1 day before booking starts
 * 
 * @param {number} sewaId - ID of sewa record
 * @returns {Promise<void>}
 */
async function sendBookingReminder(sewaId) {
  try {
    const sewa = await prisma.sewa.findUnique({
      where: { id: sewaId },
      include: {
        user: true,
        items: { include: { barang: true } }
      }
    });

    if (!sewa) {
      throw new Error(`Sewa ${sewaId} not found`);
    }

    const itemsList = sewa.items
      .map(item => `<li>${item.barang.name}</li>`)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF9800; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .alert { background-color: #fff3cd; border-left: 4px solid #FF9800; padding: 15px; margin: 15px 0; }
          .details { background-color: white; padding: 15px; border-left: 4px solid #FF9800; margin: 15px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Reminder Pemesanan Anda</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${sewa.user.name}</strong>,</p>
            
            <div class="alert">
              <strong>⚠️ Pengingat:</strong> Pemesanan Anda akan dimulai <strong>besok (${formatDate(sewa.startDate)})</strong>
            </div>

            <p>Ini adalah pengingat bahwa pemesanan Anda akan dimulai dalam 24 jam. Pastikan Anda siap untuk mengambil barang-barang yang disewa.</p>

            <div class="details">
              <h3>📋 Detail Pemesanan</h3>
              <p><strong>ID Pemesanan:</strong> #${sewa.id}</p>
              <p><strong>Tanggal Mulai:</strong> ${formatDate(sewa.startDate)}</p>
              <p><strong>Tanggal Berakhir:</strong> ${formatDate(sewa.endDate)}</p>

              <h4>Barang yang Disewa:</h4>
              <ul>${itemsList}</ul>
            </div>

            <h3>✅ Checklist Pengambilan</h3>
            <ul>
              <li>Siapkan dokumen identitas (KTP/SIM)</li>
              <li>Siapkan nomor pesanan Anda (#${sewa.id})</li>
              <li>Hubungi kami untuk mengonfirmasi jadwal pengambilan</li>
              <li>Periksa kondisi semua barang saat pengambilan</li>
            </ul>

            <p>Jika ada perubahan jadwal atau pertanyaan, segera hubungi support kami di <strong>${emailConfig.templates.supportEmail}</strong>.</p>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${emailConfig.templates.appName}. Semua hak dilindungi.</p>
              <p>Email ini adalah notifikasi otomatis, harap jangan membalas email ini.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: sewa.user.email,
      subject: `Reminder: Pemesanan #${sewa.id} Dimulai Besok - ${emailConfig.templates.appName}`,
      html
    });

    logger.logRequest(`✉️  Booking reminder email sent`, {
      sewaId,
      email: sewa.user.email
    });
  } catch (err) {
    logger.logError(`❌ Failed to send booking reminder email`, {
      sewaId,
      error: err.message
    });
    throw err;
  }
}

module.exports = {
  sendBookingConfirmation,
  sendPaymentSuccess,
  sendBookingCancellation,
  sendBookingReminder
};
