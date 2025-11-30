const redisClient = require('../config/redis');
const logger = require('../config/logger');

/**
 * Get dari cache atau fetch dari database
 */
async function getCachedOrFetch(key, fetchFn, expirySeconds = 3600) {
    try {
        // Try cache first
        const cached = await redisClient.get(key);
        if (cached) {
            logger.info(`✅ Cache HIT: ${key}`);
            return JSON.parse(cached);
        }

        logger.info(`⚠️ Cache MISS: ${key}`);

        // Fetch dari database
        const data = await fetchFn();

        // Save ke cache
        await redisClient.setEx(key, expirySeconds, JSON.stringify(data));

        return data;
    } catch (error) {
        logger.error(`Cache error for ${key}:`, error);
        // Fallback ke database jika cache error
        return await fetchFn();
    }
}

/**
 * Set cache value
 */
async function setCache(key, value, expirySeconds = 3600) {
    try {
        await redisClient.setEx(key, expirySeconds, JSON.stringify(value));
        logger.info(`✅ Cache set: ${key}`);
    } catch (error) {
        logger.error(`Failed to set cache ${key}:`, error);
    }
}

/**
 * Invalidate single cache key
 */
async function invalidateCache(key) {
    try {
        await redisClient.del(key);
        logger.info(`🗑️ Cache invalidated: ${key}`);
    } catch (error) {
        logger.error(`Failed to invalidate cache ${key}:`, error);
    }
}

/**
 * Invalidate cache by pattern (e.g., "barang:*")
 */
async function invalidateCachePattern(pattern) {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            logger.info(`🗑️ Cache invalidated pattern: ${pattern} (${keys.length} keys)`);
        }
    } catch (error) {
        logger.error(`Failed to invalidate cache pattern ${pattern}:`, error);
    }
}

/**
 * Clear all cache
 */
async function clearAllCache() {
    try {
        await redisClient.flushDb();
        logger.info('🗑️ All cache cleared');
    } catch (error) {
        logger.error('Failed to clear all cache:', error);
    }
}

/**
 * Get cache stats
 */
async function getCacheStats() {
    try {
        const info = await redisClient.info('stats');
        return info;
    } catch (error) {
        logger.error('Failed to get cache stats:', error);
        return null;
    }
}

module.exports = {
    getCachedOrFetch,
    setCache,
    invalidateCache,
    invalidateCachePattern,
    clearAllCache,
    getCacheStats
};
