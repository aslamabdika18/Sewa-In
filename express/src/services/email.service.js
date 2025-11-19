/**
 * Email Service
 * 
 * Core email sending service using Nodemailer
 * Supports multiple transports (SMTP, testing)
 */

const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const logger = require('../config/logger');

let transporter = null;

/**
 * Initialize email transporter
 * Uses SMTP or test account based on configuration
 */
async function initializeTransporter() {
  if (transporter) return transporter;

  try {
    if (emailConfig.service === 'test') {
      // Use Ethereal test account for development
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        }
      });
      logger.logRequest(`📧 Email service initialized with test account`, { email: testAccount.user });
    } else {
      // Use SMTP configuration
      transporter = nodemailer.createTransport(emailConfig.smtp);
      
      // Verify connection
      await transporter.verify();
      logger.logRequest(`📧 Email service initialized with SMTP`, { 
        host: emailConfig.smtp.host,
        from: emailConfig.from.email 
      });
    }
  } catch (err) {
    logger.logError(`❌ Failed to initialize email service`, { error: err.message });
    // Return mock transporter that logs instead of sending
    transporter = createMockTransporter();
  }

  return transporter;
}

/**
 * Mock transporter for testing/development
 * Logs emails instead of sending them
 */
function createMockTransporter() {
  return {
    sendMail: async (mailOptions) => {
      logger.logRequest(`📧 [MOCK EMAIL] Would send email`, {
        to: mailOptions.to,
        subject: mailOptions.subject,
      });
      return { messageId: `mock-${Date.now()}` };
    }
  };
}

/**
 * Send email
 * 
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} [options.text] - Email plain text content
 * @param {string} [options.replyTo] - Reply-to address
 * @returns {Promise<Object>} Nodemailer response with messageId
 */
async function sendEmail({ to, subject, html, text = '', replyTo = null }) {
  try {
    const transport = await initializeTransporter();

    const mailOptions = {
      from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || emailConfig.from.email
    };

    const info = await transport.sendMail(mailOptions);
    
    logger.logRequest(`✉️  Email sent successfully`, {
      to,
      subject,
      messageId: info.messageId
    });

    return info;
  } catch (err) {
    logger.logError(`❌ Failed to send email`, {
      to,
      subject,
      error: err.message
    });
    throw err;
  }
}

/**
 * Send batch emails
 * 
 * @param {Array<Object>} emails - Array of email options
 * @returns {Promise<Array>} Array of results for each email
 */
async function sendBatch(emails) {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ success: true, ...result });
    } catch (err) {
      results.push({ success: false, error: err.message });
    }
  }

  return results;
}

module.exports = {
  sendEmail,
  sendBatch,
  initializeTransporter
};
