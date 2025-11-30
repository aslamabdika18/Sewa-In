const redis = require('redis');
const logger = require('./logger');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('error', (err) => {
  logger.error('❌ Redis error:', err);
});

redisClient.on('connect', () => {
  logger.info('✅ Redis connected');
});

redisClient.on('reconnecting', () => {
  logger.warn('⚠️ Redis reconnecting...');
});

module.exports = redisClient;
