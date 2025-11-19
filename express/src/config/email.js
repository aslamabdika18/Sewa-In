/**
 * Email Configuration
 * Supports SMTP for production and testing
 */

require("dotenv").config();

// Parse email configuration from environment
const emailConfig = {
  // Email service to use: 'smtp' or 'test'
  service: process.env.EMAIL_SERVICE || 'smtp',
  
  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    }
  },

  // From email address
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Sewa-In',
    email: process.env.EMAIL_FROM || 'noreply@sewa-in.com'
  },

  // Email templates settings
  templates: {
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    appName: 'Sewa-In',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@sewa-in.com'
  }
};

// Validate required SMTP config in production
if (process.env.NODE_ENV === 'production' && emailConfig.service === 'smtp') {
  const requiredVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Warning: Missing email config: ${missing.join(', ')}`);
  }
}

module.exports = emailConfig;
