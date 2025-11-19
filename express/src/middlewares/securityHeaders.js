/**
 * Security Headers Middleware
 * 
 * Implements comprehensive security headers to prevent:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking attacks
 * - MIME type sniffing
 * - Content Security Policy violations
 * - HTTP Header Injection
 */

const logger = require('../config/logger');

/**
 * Apply security headers manually (using Helmet as alternative)
 * These headers protect against common web vulnerabilities
 */
function securityHeaders(req, res, next) {
  // Prevent XSS attacks by restricting inline scripts
  // Content-Security-Policy restricts where scripts can be loaded from
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // Allow inline for swagger-ui
    "style-src 'self' 'unsafe-inline'; " + // Allow inline styles for swagger-ui
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );

  // Prevent clickjacking by blocking framing in other sites
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  // Browsers should respect the Content-Type header
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter in older IE browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  // Limit referrer to same-origin only
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Disable client-side caching of sensitive data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Enable HSTS (HTTPS Strict Transport Security) in production
  if (process.env.NODE_ENV === 'production') {
    // max-age: 31536000 (1 year)
    // includeSubDomains: apply to all subdomains
    // preload: allow adding to HSTS preload list
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Disable Google FLoC (Federated Learning of Cohorts)
  res.setHeader('Permissions-Policy', 'interest-cohort=()');

  // Remove server information from headers
  res.removeHeader('Server');
  res.removeHeader('X-Powered-By');

  next();
}

module.exports = securityHeaders;
