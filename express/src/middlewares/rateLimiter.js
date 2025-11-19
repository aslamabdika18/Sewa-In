/**
 * Rate Limiter Middleware
 * 
 * CRITICAL: Proteksi API dari abuse dan DDoS attacks
 * Menggunakan express-rate-limit - package paling populer untuk rate limiting di Express
 * 
 * Rate Limiting Strategy:
 * 1. Global rate limit: 100 requests per 15 minutes per IP
 * 2. Auth rate limit: 5 failed attempts per 15 minutes per IP
 * 3. Payment rate limit: 10 requests per minute per user
 * 4. Sewa rate limit: 20 requests per minute per user (booking burst)
 * 5. Webhook rate limit: 100 requests per minute (trusted source)
 * 
 * Benefits:
 * - Prevents brute force attacks
 * - Prevents DoS/DDoS attacks
 * - Prevents spam
 * - Protects database from overload
 * - Fair resource allocation
 */

const rateLimit = require('express-rate-limit');

/**
 * GLOBAL RATE LIMITER
 * Limit all requests untuk mencegah abuse
 * 100 requests per 15 minutes per IP
 * 
 * Purpose: General protection against abuse
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    message: 'Terlalu banyak request dari IP ini, silakan coba lagi nanti',
    retryAfter: 15
  },
  statusCode: 429,
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,
  skip: (req) => {
    // Skip health check & development localhost
    if (req.path === '/health') return true;
    if (req.ip === '::1' || req.ip === '127.0.0.1') return true;
    return false;
  },
  keyGenerator: (req, res) => {
    // Use X-Forwarded-For if behind proxy, otherwise use direct IP
    return req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak request. Silakan tunggu beberapa saat.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

/**
 * AUTH RATE LIMITER
 * Prevent brute force attacks
 * 5 failed attempts per 15 minutes per IP (stricter)
 * 
 * Security: Track by email + IP untuk prevent credential stuffing
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Akun Anda mungkin dikunci.',
    lockoutDuration: 15
  },
  statusCode: 429,
  skipSuccessfulRequests: true, // Only count failed attempts (status >= 400)
  skipFailedRequests: false,
  keyGenerator: (req, res) => {
    // Combine email + IP untuk detect coordinated attacks
    const email = (req.body?.email || req.ip).toLowerCase();
    return `auth-${email}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak percobaan login. Silakan coba dalam 15 menit.',
      errorCode: 'TOO_MANY_LOGIN_ATTEMPTS',
      retryAfter: 15
    });
  }
});

/**
 * REGISTER RATE LIMITER
 * Prevent account creation spam
 * 3 registrations per hour per IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: {
    success: false,
    message: 'Terlalu banyak registrasi dari IP ini'
  },
  statusCode: 429,
  skipSuccessfulRequests: false, // Count all requests
  keyGenerator: (req, res) => {
    return `register-${req.ip}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak registrasi dari IP ini. Coba lagi nanti.',
      errorCode: 'TOO_MANY_REGISTRATIONS',
      retryAfter: 60
    });
  }
});

/**
 * SEWA (BOOKING) RATE LIMITER
 * Prevent booking spam
 * 20 requests per 5 minutes per user (allow bursts for multiple items)
 */
const sewaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 booking attempts per 5 minutes
  message: {
    success: false,
    message: 'Terlalu banyak percobaan booking'
  },
  statusCode: 429,
  keyGenerator: (req, res) => {
    // Per user for authenticated, per IP for unauthenticated
    return `sewa-${req.user?.id || req.ip}`;
  },
  skip: (req) => {
    // Skip if user not authenticated (will use IP)
    return false;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak percobaan booking. Silakan tunggu beberapa saat.',
      errorCode: 'BOOKING_RATE_LIMIT',
      retryAfter: 5
    });
  }
});

/**
 * PAYMENT RATE LIMITER
 * Prevent payment spam/abuse
 * 10 payment requests per minute per user
 */
const paymentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    message: 'Terlalu banyak request pembayaran'
  },
  statusCode: 429,
  keyGenerator: (req, res) => {
    // Per user (must be authenticated)
    return `payment-${req.user?.id || req.ip}`;
  },
  skip: (req) => {
    // Only apply to authenticated users
    return !req.user;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak request pembayaran. Coba lagi nanti.',
      errorCode: 'PAYMENT_RATE_LIMIT',
      retryAfter: 1
    });
  }
});

/**
 * WEBHOOK RATE LIMITER
 * Webhooks usually from trusted sources, but still protect
 * 100 requests per minute per source IP
 */
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Terlalu banyak webhook requests',
  statusCode: 429,
  keyGenerator: (req, res) => {
    return `webhook-${req.ip}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Webhook rate limit exceeded',
      errorCode: 'WEBHOOK_RATE_LIMIT'
    });
  }
});

/**
 * API KEY RATE LIMITER
 * For future API key usage
 * Different limits based on API plan
 */
const apiKeyLimiter = (plan = 'free') => {
  const limits = {
    free: { windowMs: 60 * 60 * 1000, max: 1000 }, // 1000/hour
    basic: { windowMs: 60 * 60 * 1000, max: 10000 }, // 10000/hour
    pro: { windowMs: 60 * 60 * 1000, max: 100000 } // 100000/hour
  };

  const config = limits[plan] || limits.free;

  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: 'API rate limit exceeded',
    statusCode: 429,
    keyGenerator: (req, res) => {
      return `apikey-${req.headers['x-api-key']}`;
    }
  });
};

module.exports = {
  globalLimiter,
  authLimiter,
  registerLimiter,
  sewaLimiter,
  paymentLimiter,
  webhookLimiter,
  apiKeyLimiter
};
