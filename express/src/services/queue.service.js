const Queue = require('bull');
const logger = require('../config/logger');

let emailQueue, webhookQueue;

try {
  // Email queue
  emailQueue = new Queue('email', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      enableOfflineQueue: false
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: true
    },
    settings: {
      retryProcessDelay: 5000
    }
  });

  // Payment webhook queue
  webhookQueue = new Queue('webhook', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      enableOfflineQueue: false
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000
      },
      removeOnComplete: true
    },
    settings: {
      retryProcessDelay: 5000
    }
  });

  logger.info('✅ Bull queues initialized successfully');
} catch (error) {
  logger.error('❌ Failed to initialize Bull queues:', error.message);
  logger.warn('⚠️ Running without queue support. Make sure Redis is available.');
}

// Event listeners for email queue
if (emailQueue) {
  emailQueue.on('failed', (job, err) => {
    logger.error(`❌ Email job ${job.id} failed:`, err.message);
  });

  emailQueue.on('completed', (job) => {
    logger.info(`✅ Email job ${job.id} completed`);
  });

  emailQueue.on('error', (error) => {
    if (error && error.message) {
      logger.error('Email queue error:', error.message);
    }
  });
}

// Event listeners for webhook queue
if (webhookQueue) {
  webhookQueue.on('failed', (job, err) => {
    logger.error(`❌ Webhook job ${job.id} failed:`, err.message);
  });

  webhookQueue.on('completed', (job) => {
    logger.info(`✅ Webhook job ${job.id} completed`);
  });

  webhookQueue.on('error', (error) => {
    if (error && error.message) {
      logger.error('Webhook queue error:', error.message);
    }
  });
}

/**
 * Process webhook queue
 * 
 * Although webhook handling is synchronous in the controller,
 * this processor ensures the queue is properly initialized
 * and ready if webhook processing needs to be deferred in the future
 */
if (webhookQueue) {
  webhookQueue.process(async (job) => {
    try {
      if (!job || !job.data) {
        throw new Error('Invalid job data');
      }

      const { notification, signature } = job.data;

      if (!notification || !notification.order_id) {
        throw new Error('Invalid notification format');
      }

      // This is a placeholder processor
      // Actual webhook handling happens in the controller
      logger.info(`Processing webhook job ${job.id} for order: ${notification.order_id}`);
      
      return { 
        success: true, 
        orderId: notification.order_id,
        transactionId: notification.transaction_id 
      };
    } catch (error) {
      logger.error(`❌ Failed to process webhook job:`, error.message);
      throw error; // Bull will retry
    }
  });
}

module.exports = { emailQueue, webhookQueue };
