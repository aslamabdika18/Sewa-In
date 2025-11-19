/**
 * Email Notification Middleware
 * 
 * Triggers email notifications on booking/payment events
 * Non-blocking: sends emails asynchronously
 */

const NotificationService = require('../services/notification.service');
const logger = require('../config/logger');

/**
 * Automatically send booking confirmation email
 * Attach to sewa creation endpoints
 * 
 * Usage: app.post('/sewa', auth, validateBody, emailNotification('booking'), controller)
 */
function emailNotification(eventType) {
  return async (req, res, next) => {
    // Store original res.json for wrapper
    const originalJson = res.json;

    // Wrap res.json to intercept response
    res.json = function(data) {
      // Send email asynchronously without blocking response
      setImmediate(async () => {
        try {
          if (eventType === 'booking' && data.success && data.data?.id) {
            // Send booking confirmation email
            await NotificationService.sendBookingConfirmation(data.data);
          } else if (eventType === 'paymentSuccess' && data.success && req.body?.sewaId) {
            // Send payment success email
            const amount = data.data?.amount || req.body?.amount;
            await NotificationService.sendPaymentSuccess(req.body.sewaId, amount);
          } else if (eventType === 'cancellation' && data.success && req.params?.id) {
            // Send cancellation email
            await NotificationService.sendBookingCancellation(
              parseInt(req.params.id),
              data.data?.reason || 'Pemesanan dibatalkan'
            );
          }
        } catch (err) {
          // Log error but don't block response
          logger.logError(`Email notification failed for ${eventType}`, {
            error: err.message,
            eventType
          });
        }
      });

      // Send response immediately (don't wait for email)
      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * Manual email helper for complex scenarios
 * Use when you need finer control over when emails are sent
 * 
 * Usage: await sendEmailManually(req, 'booking', sewaId)
 */
async function sendEmailManually(req, eventType, sewaId, additionalData = {}) {
  try {
    switch (eventType) {
      case 'booking':
        await NotificationService.sendBookingConfirmation({ id: sewaId });
        break;
      case 'paymentSuccess':
        await NotificationService.sendPaymentSuccess(sewaId, additionalData.amount);
        break;
      case 'cancellation':
        await NotificationService.sendBookingCancellation(sewaId, additionalData.reason);
        break;
      case 'reminder':
        await NotificationService.sendBookingReminder(sewaId);
        break;
      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }
    
    logger.logRequest(`✉️  Manual email sent for ${eventType}`, { sewaId });
  } catch (err) {
    logger.logError(`Failed to send manual email`, {
      eventType,
      sewaId,
      error: err.message
    });
    throw err;
  }
}

module.exports = {
  emailNotification,
  sendEmailManually
};
