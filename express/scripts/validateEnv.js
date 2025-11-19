/**
 * Standalone Environment Validation Script
 * 
 * Usage: npm run validate:env
 * Atau: node scripts/validateEnv.js
 */

require('dotenv').config();
const { validateEnv } = require('../src/config/envValidation');

try {
  validateEnv();
  console.log('✅ Environment validation passed!');
  process.exit(0);
} catch (err) {
  console.error('❌ Environment validation failed!');
  console.error(err.message);
  process.exit(1);
}
