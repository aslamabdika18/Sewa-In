/**
 * Log Analysis Utilities
 * 
 * Helper functions to parse and analyze logs for:
 * - Slow query detection
 * - User activity tracking
 * - Error analysis
 * - Performance monitoring
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Parse a single log line (JSON format from Pino)
 * 
 * @param {string} line - A single log line
 * @returns {Object|null} Parsed log object or null if invalid
 */
const parseLogLine = (line) => {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
};

/**
 * Find all logs for a specific correlation ID
 * Useful for tracing a single request through the system
 * 
 * @param {string} correlationId - The correlation ID to search for
 * @param {string} logFile - Path to log file
 * @returns {Promise<Array>} Array of log entries
 * 
 * Usage:
 * const logs = await findLogsForCorrelation('550e8400-e29b-41d4-a716-446655440000');
 * logs.forEach(log => console.log(log.message));
 */
const findLogsForCorrelation = async (correlationId, logFile = 'logs/app.log') => {
  const results = [];
  
  if (!fs.existsSync(logFile)) {
    console.warn(`Log file not found: ${logFile}`);
    return results;
  }

  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const log = parseLogLine(line);
    if (log && log.correlationId === correlationId) {
      results.push(log);
    }
  }

  return results;
};

/**
 * Find all slow queries (> 1000ms)
 * 
 * @param {string} logFile - Path to log file
 * @param {number} threshold - Duration threshold in ms (default 1000)
 * @returns {Promise<Array>} Array of slow query logs
 * 
 * Usage:
 * const slow = await findSlowQueries('logs/app.log', 500);
 * slow.forEach(q => console.log(`${q.path} took ${q.duration}ms`));
 */
const findSlowQueries = async (logFile = 'logs/app.log', threshold = 1000) => {
  const results = [];
  
  if (!fs.existsSync(logFile)) {
    console.warn(`Log file not found: ${logFile}`);
    return results;
  }

  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const log = parseLogLine(line);
    if (log && log.type === 'RESPONSE' && log.duration > threshold) {
      results.push(log);
    }
  }

  return results;
};

/**
 * Get statistics for all API endpoints
 * Returns: call count, avg response time, error rate
 * 
 * @param {string} logFile - Path to log file
 * @returns {Promise<Object>} Statistics by endpoint
 * 
 * Usage:
 * const stats = await getEndpointStats('logs/app.log');
 * Object.entries(stats).forEach(([endpoint, data]) => {
 *   console.log(`${endpoint}: ${data.count} calls, ${data.avgDuration}ms avg`);
 * });
 */
const getEndpointStats = async (logFile = 'logs/app.log') => {
  const stats = {};
  
  if (!fs.existsSync(logFile)) {
    console.warn(`Log file not found: ${logFile}`);
    return stats;
  }

  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const log = parseLogLine(line);
    
    if (log && log.type === 'RESPONSE') {
      const key = `${log.method} ${log.path}`;
      
      if (!stats[key]) {
        stats[key] = {
          count: 0,
          totalDuration: 0,
          errors: 0,
          minDuration: Infinity,
          maxDuration: 0,
        };
      }
      
      stats[key].count++;
      stats[key].totalDuration += log.duration;
      if (log.statusCode >= 400) stats[key].errors++;
      stats[key].minDuration = Math.min(stats[key].minDuration, log.duration);
      stats[key].maxDuration = Math.max(stats[key].maxDuration, log.duration);
    }
  }

  // Calculate averages
  Object.entries(stats).forEach(([key, data]) => {
    stats[key].avgDuration = Math.round(data.totalDuration / data.count);
    stats[key].errorRate = ((data.errors / data.count) * 100).toFixed(2) + '%';
  });

  return stats;
};

/**
 * Find all errors in log file
 * 
 * @param {string} logFile - Path to log file
 * @param {number} limit - Maximum number of errors to return
 * @returns {Promise<Array>} Array of error logs
 * 
 * Usage:
 * const errors = await findErrors('logs/error.log', 50);
 * errors.forEach(err => console.log(`${err.timestamp}: ${err.message}`));
 */
const findErrors = async (logFile = 'logs/error.log', limit = 100) => {
  const results = [];
  
  if (!fs.existsSync(logFile)) {
    console.warn(`Log file not found: ${logFile}`);
    return results;
  }

  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const log = parseLogLine(line);
    if (log && log.type === 'ERROR') {
      results.push(log);
      if (results.length >= limit) break;
    }
  }

  return results;
};

/**
 * Find all API calls by a specific user
 * 
 * @param {string|number} userId - User ID to search for
 * @param {string} logFile - Path to log file
 * @returns {Promise<Array>} Array of user's API calls
 * 
 * Usage:
 * const userLogs = await findUserActivity(5, 'logs/app.log');
 * userLogs.forEach(log => console.log(`${log.timestamp}: ${log.method} ${log.path}`));
 */
const findUserActivity = async (userId, logFile = 'logs/app.log') => {
  const results = [];
  
  if (!fs.existsSync(logFile)) {
    console.warn(`Log file not found: ${logFile}`);
    return results;
  }

  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const log = parseLogLine(line);
    if (log && (log.userId === userId || log.userId === String(userId))) {
      results.push(log);
    }
  }

  return results;
};

module.exports = {
  parseLogLine,
  findLogsForCorrelation,
  findSlowQueries,
  getEndpointStats,
  findErrors,
  findUserActivity,
};
