/**
 * Reminder Scheduler
 * 
 * Scheduled job to send booking reminders
 * Should be run as a cron job or scheduled task
 * 
 * Usage: node scripts/scheduleReminders.js
 */

require("dotenv").config();
const prisma = require("../src/config/database");
const NotificationService = require("../src/services/notification.service");
const logger = require("../src/config/logger");

/**
 * Send reminders for bookings starting tomorrow
 * Should be run once daily (e.g., at 8 AM)
 */
async function sendBookingReminders() {
  const startTime = Date.now();
  
  try {
    logger.logRequest("⏰ Starting booking reminder job");

    // Get bookings that start tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookings = await prisma.sewa.findMany({
      where: {
        startDate: {
          gte: tomorrow,
          lt: nextDay
        },
        status: {
          in: ['PAID', 'ONGOING']
        },
        deletedAt: null
      },
      include: {
        user: true,
        items: { include: { barang: true } }
      }
    });

    logger.logRequest(`Found ${bookings.length} bookings starting tomorrow`);

    let successCount = 0;
    let failureCount = 0;

    // Send reminders
    for (const booking of bookings) {
      try {
        await NotificationService.sendBookingReminder(booking.id);
        successCount++;
      } catch (err) {
        logger.logError(`Failed to send reminder for booking ${booking.id}`, {
          error: err.message
        });
        failureCount++;
      }
    }

    const duration = Date.now() - startTime;
    logger.logRequest("✅ Booking reminder job completed", {
      total: bookings.length,
      success: successCount,
      failure: failureCount,
      durationMs: duration
    });

    return {
      total: bookings.length,
      success: successCount,
      failure: failureCount,
      durationMs: duration
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    logger.logError("❌ Booking reminder job failed", {
      error: err.message,
      durationMs: duration
    });
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  sendBookingReminders()
    .then(result => {
      console.log("Result:", result);
      process.exit(0);
    })
    .catch(err => {
      console.error("Error:", err);
      process.exit(1);
    });
}

module.exports = { sendBookingReminders };
