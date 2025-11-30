/**
 * Email Service
 * 
 * Enhanced email service with async queuing, templates, and retry mechanism
 * Uses Bull queue for reliable async processing
 */

const { emailQueue } = require('./queue.service');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const logger = require('../config/logger');

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD
  }
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    logger.warn('⚠️  Email transporter not configured properly:', error.message);
  } else {
    logger.info('✅ Email transporter ready');
  }
});

/**
 * Queue email untuk dikirim asynchronously
 */
async function queueEmail(to, subject, template, data) {
  try {
    if (!to || !subject || !template) {
      throw new Error('Email, subject, dan template harus diisi');
    }

    const job = await emailQueue.add(
      {
        to,
        subject,
        template,
        data,
        timestamp: new Date()
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: true
      }
    );

    logger.info(`📧 Email queued: ${job.id} to ${to}`);
    return job.id;
  } catch (error) {
    logger.error('Failed to queue email:', error);
    throw error;
  }
}

/**
 * Process email queue
 */
emailQueue.process(async (job) => {
  const { to, subject, template, data } = job.data;

  try {
    const htmlContent = renderEmailTemplate(template, data);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@sewa-in.com',
      to,
      subject,
      html: htmlContent
    });

    logger.info(`✅ Email sent to ${to}, messageId: ${info.messageId}`);
    return { success: true, to, messageId: info.messageId };
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}:`, error);
    throw error; // Bull will retry
  }
});

/**
 * Email templates dengan Handlebars support
 */
function renderEmailTemplate(template, data = {}) {
  const templates = {
    payment_confirmation: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h2 { margin: 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .detail-item:last-child { border-bottom: none; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>💳 Pembayaran Berhasil!</h2>
          </div>
          <div class="content">
            <p>Terima kasih <strong>{{userName}}</strong>,</p>
            <p>Pembayaran Anda telah diterima dan dikonfirmasi.</p>
            
            <div class="details">
              <div class="detail-item">
                <span><strong>Order ID:</strong></span>
                <span>{{orderId}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Tanggal Pembayaran:</strong></span>
                <span>{{paymentDate}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Total Pembayaran:</strong></span>
                <span>Rp {{amount}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Metode Pembayaran:</strong></span>
                <span>{{paymentMethod}}</span>
              </div>
            </div>
            
            <p>Terima kasih telah menggunakan layanan kami. Rental Anda sudah siap diambil!</p>
          </div>
          <div class="footer">
            <p>© 2025 Sewa-In. Semua hak dilindungi.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    booking_confirmation: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h2 { margin: 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .detail-item:last-child { border-bottom: none; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
          .status-badge { background: #ffc107; color: #000; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✅ Pemesanan Berhasil!</h2>
          </div>
          <div class="content">
            <p>Halo <strong>{{userName}}</strong>,</p>
            <p>Pemesanan Anda telah berhasil dibuat dan kami tunggu pembayaran Anda.</p>
            
            <div class="details">
              <div class="detail-item">
                <span><strong>ID Pemesanan:</strong></span>
                <span>{{bookingId}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Nama Barang:</strong></span>
                <span>{{itemName}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Tanggal Mulai:</strong></span>
                <span>{{startDate}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Tanggal Berakhir:</strong></span>
                <span>{{endDate}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Durasi:</strong></span>
                <span>{{duration}} hari</span>
              </div>
              <div class="detail-item">
                <span><strong>Total Harga:</strong></span>
                <span>Rp {{totalPrice}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Status:</strong></span>
                <span class="status-badge">{{status}}</span>
              </div>
            </div>
            
            <p><strong>⏱️ Penting:</strong> Silakan lakukan pembayaran dalam waktu 24 jam untuk mengkonfirmasi pemesanan Anda.</p>
          </div>
          <div class="footer">
            <p>© 2025 Sewa-In. Semua hak dilindungi.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    rental_reminder: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #fd7e14; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h2 { margin: 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .detail-item:last-child { border-bottom: none; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⏰ Pengingat Pengambilan Barang</h2>
          </div>
          <div class="content">
            <p>Halo <strong>{{userName}}</strong>,</p>
            <p>Ini adalah pengingat bahwa rental Anda akan dimulai dalam <strong>{{daysUntil}} hari</strong>.</p>
            
            <div class="details">
              <div class="detail-item">
                <span><strong>Barang:</strong></span>
                <span>{{itemName}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Tanggal Pengambilan:</strong></span>
                <span>{{pickupDate}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Waktu Pengambilan:</strong></span>
                <span>{{pickupTime}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Lokasi Pengambilan:</strong></span>
                <span>{{location}}</span>
              </div>
            </div>
            
            <p>Pastikan Anda siap untuk mengambil barang tepat pada waktu yang ditentukan.</p>
          </div>
          <div class="footer">
            <p>© 2025 Sewa-In. Semua hak dilindungi.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    return_reminder: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h2 { margin: 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .detail-item:last-child { border-bottom: none; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📦 Pengingat Pengembalian Barang</h2>
          </div>
          <div class="content">
            <p>Halo <strong>{{userName}}</strong>,</p>
            <p>Pengingat bahwa Anda harus mengembalikan barang dalam <strong>{{daysUntil}} hari</strong>.</p>
            
            <div class="details">
              <div class="detail-item">
                <span><strong>Barang:</strong></span>
                <span>{{itemName}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Tanggal Kembali:</strong></span>
                <span>{{returnDate}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Waktu Kembali:</strong></span>
                <span>{{returnTime}}</span>
              </div>
              <div class="detail-item">
                <span><strong>Lokasi Pengembalian:</strong></span>
                <span>{{location}}</span>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Perhatian:</strong> Keterlambatan pengembalian akan dikenakan biaya denda sesuai dengan kebijakan kami.
            </div>
            
            <p>Pastikan barang dalam kondisi baik saat dikembalikan.</p>
          </div>
          <div class="footer">
            <p>© 2025 Sewa-In. Semua hak dilindungi.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    review_invitation: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6f42c1; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h2 { margin: 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .cta-button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⭐ Berikan Review Anda</h2>
          </div>
          <div class="content">
            <p>Halo <strong>{{userName}}</strong>,</p>
            <p>Terima kasih telah menyewa <strong>{{itemName}}</strong>!</p>
            <p>Kami ingin mendengar pengalaman Anda. Berikan review dan rating untuk barang ini sehingga penyewa lain dapat membuat keputusan yang tepat.</p>
            
            <a href="{{reviewLink}}" class="cta-button">Berikan Review Sekarang</a>
            
            <p>Review Anda membantu kami terus meningkatkan kualitas layanan.</p>
          </div>
          <div class="footer">
            <p>© 2025 Sewa-In. Semua hak dilindungi.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  const templateContent = templates[template];
  if (!templateContent) {
    throw new Error(`Template '${template}' tidak ditemukan`);
  }

  // Compile handlebars template
  const compiled = Handlebars.compile(templateContent);
  return compiled(data);
}

/**
 * Direct send email (legacy support)
 */
async function sendEmail({ to, subject, html, text = '', replyTo = null }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || process.env.EMAIL_FROM
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`✉️  Email sent successfully`, {
      to,
      subject,
      messageId: info.messageId
    });

    return info;
  } catch (err) {
    logger.error(`❌ Failed to send email`, {
      to,
      subject,
      error: err.message
    });
    throw err;
  }
}

module.exports = {
  queueEmail,
  renderEmailTemplate,
  sendEmail,
  emailQueue
};
