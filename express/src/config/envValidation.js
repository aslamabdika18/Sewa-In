/**
 * Environment Variable Validation
 * 
 * CRITICAL: Ini harus jalan SEBELUM application starts
 * Mencegah production dengan misconfigured environment
 * 
 * Validations:
 * 1. Required variables ada semua
 * 2. JWT_SECRET tidak menggunakan default value (security)
 * 3. NODE_ENV valid (development, production, test)
 * 4. DATABASE_URL valid format
 * 5. PORT adalah number valid
 * 6. Production harus memiliki secure values
 */

const fs = require('fs');
const path = require('path');

// Definisikan required variables dengan validasi rules
const REQUIRED_VARS = {
  PORT: {
    required: true,
    type: 'number',
    min: 1,
    max: 65535,
    default: null, // Tidak boleh pakai default
    description: 'Server port number'
  },
  CLIENT_URL: {
    required: true,
    type: 'url',
    default: null,
    description: 'Frontend URL untuk CORS'
  },
  JWT_SECRET: {
    required: true,
    type: 'string',
    minLength: 32, // Minimum 32 chars untuk security
    restrictedValues: ['super-secret-change-this', 'secret', 'default', '123456'],
    description: 'Secret key untuk JWT signing - HARUS di-change di production!'
  },
  AUTH_COOKIE_NAME: {
    required: true,
    type: 'string',
    default: 'sewa_token',
    description: 'Cookie name untuk auth token'
  },
  NODE_ENV: {
    required: true,
    type: 'enum',
    enum: ['development', 'production', 'test'],
    default: 'development',
    description: 'Environment: development | production | test'
  },
  DATABASE_URL: {
    required: true,
    type: 'string',
    pattern: /^mysql:\/\//, // Harus MySQL format
    description: 'Database connection URL'
  },
  MIDTRANS_SERVER_KEY: {
    required: false, // Optional, tapi REQUIRED di production
    type: 'string',
    description: 'Midtrans payment gateway server key'
  },
  MIDTRANS_CLIENT_KEY: {
    required: false, // Optional, tapi REQUIRED di production
    type: 'string',
    description: 'Midtrans payment gateway client key'
  },
  LOG_LEVEL: {
    required: false,
    type: 'enum',
    enum: ['error', 'warn', 'info', 'debug'],
    default: 'info',
    description: 'Logging level'
  }
};

// Default values untuk development
const DEVELOPMENT_DEFAULTS = {
  PORT: '5000',
  CLIENT_URL: 'http://localhost:5173',
  AUTH_COOKIE_NAME: 'sewa_token',
  NODE_ENV: 'development',
  LOG_LEVEL: 'debug'
};

/**
 * Validate environment variables
 * Throw error jika ada yang salah, app tidak akan start
 */
function validateEnv() {
  console.log('🔐 Validating environment variables...\n');

  const errors = [];
  const warnings = [];
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Check setiap required variable
  for (const [varName, config] of Object.entries(REQUIRED_VARS)) {
    const value = process.env[varName];

    // 1. Check if required variable exists
    if (!value) {
      if (config.required) {
        errors.push(`❌ ${varName} is REQUIRED but not set`);
      } else if (nodeEnv === 'production' && config.restrictedValues) {
        // Midtrans keys required di production
        if (['MIDTRANS_SERVER_KEY', 'MIDTRANS_CLIENT_KEY'].includes(varName)) {
          errors.push(`❌ ${varName} is REQUIRED in production but not set`);
        }
      }
      continue;
    }

    // 2. Type validation
    if (config.type === 'number') {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        errors.push(`❌ ${varName} must be a number, got: ${value}`);
      } else if (config.min && num < config.min) {
        errors.push(`❌ ${varName} must be >= ${config.min}, got: ${num}`);
      } else if (config.max && num > config.max) {
        errors.push(`❌ ${varName} must be <= ${config.max}, got: ${num}`);
      }
    }

    // 3. URL validation
    if (config.type === 'url') {
      try {
        new URL(value);
      } catch (err) {
        errors.push(`❌ ${varName} must be valid URL, got: ${value}`);
      }
    }

    // 4. Enum validation
    if (config.type === 'enum') {
      if (!config.enum.includes(value)) {
        errors.push(
          `❌ ${varName} must be one of: ${config.enum.join(', ')}, got: ${value}`
        );
      }
    }

    // 5. Pattern validation (regex)
    if (config.pattern && !config.pattern.test(value)) {
      errors.push(
        `❌ ${varName} must match pattern, got: ${value}`
      );
    }

    // 6. Length validation
    if (config.minLength && value.length < config.minLength) {
      errors.push(
        `❌ ${varName} must be at least ${config.minLength} characters, got: ${value.length}`
      );
    }

    // 7. Restricted values (untuk production security)
    if (config.restrictedValues && config.restrictedValues.includes(value)) {
      errors.push(
        `🚨 ${varName} has restricted/default value: "${value}" - SECURITY RISK in production!`
      );
    }
  }

  // Production-specific checks
  if (nodeEnv === 'production') {
    console.log('\n🚨 PRODUCTION MODE - Extra validations:\n');

    // JWT_SECRET harus aman (bukan default)
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret === 'super-secret-change-this' || jwtSecret === 'secret') {
      errors.push('🚨 CRITICAL: JWT_SECRET tidak boleh default di production!');
    }

    // Pastikan ada MIN length untuk JWT_SECRET
    if (jwtSecret && jwtSecret.length < 32) {
      errors.push('🚨 CRITICAL: JWT_SECRET harus >= 32 characters untuk security!');
    }

    // DATABASE_URL harus encrypted/secured
    if (process.env.DATABASE_URL.includes('root:root')) {
      warnings.push('⚠️ DATABASE_URL menggunakan default credentials (root:root)');
    }

    // CLIENT_URL tidak boleh localhost
    if (process.env.CLIENT_URL.includes('localhost')) {
      warnings.push('⚠️ CLIENT_URL masih pointing ke localhost');
    }

    // Payment gateway keys harus ada
    if (!process.env.MIDTRANS_SERVER_KEY) {
      errors.push('🚨 MIDTRANS_SERVER_KEY required in production');
    }
    if (!process.env.MIDTRANS_CLIENT_KEY) {
      errors.push('🚨 MIDTRANS_CLIENT_KEY required in production');
    }
  }

  // Print errors
  if (errors.length > 0) {
    console.error('❌ ENVIRONMENT VALIDATION FAILED:\n');
    errors.forEach((err) => console.error(err));
    console.error(
      '\n📋 Please check your .env file and set correct values.'
    );
    process.exit(1); // Stop application jika ada error
  }

  // Print warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️ ENVIRONMENT WARNINGS:\n');
    warnings.forEach((warn) => console.warn(warn));
  }

  // Success
  console.log('✅ Environment variables validated successfully!\n');
  console.log(`📍 Running in: ${nodeEnv} mode`);
  console.log(`🔌 Database: ${maskDatabaseUrl(process.env.DATABASE_URL)}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`🔑 JWT Secret: ${maskSecret(process.env.JWT_SECRET)}`);
  console.log(`🛡️ Auth Cookie: ${process.env.AUTH_COOKIE_NAME}\n`);
}

/**
 * Mask sensitive info untuk logging (security)
 */
function maskDatabaseUrl(url) {
  // mysql://user:pass@host:port/db → mysql://***:***@host:port/db
  return url.replace(/mysql:\/\/[^@]+@/, 'mysql://***:***@');
}

function maskSecret(secret) {
  if (!secret) return '❌ NOT SET';
  if (secret.length <= 8) return '*'.repeat(secret.length);
  return secret.substring(0, 3) + '*'.repeat(secret.length - 6) + secret.substring(secret.length - 3);
}

/**
 * Generate .env.example untuk dokumentasi
 */
function generateEnvExample() {
  const envExamplePath = path.join(__dirname, '../../.env.example');
  
  let content = '# Environment Configuration Example\n';
  content += '# Copy this to .env and fill with your actual values\n\n';

  for (const [varName, config] of Object.entries(REQUIRED_VARS)) {
    const required = config.required || (process.env.NODE_ENV === 'production' && varName.includes('MIDTRANS'));
    const mark = required ? '(REQUIRED)' : '(Optional)';
    const defaultVal = config.default || DEVELOPMENT_DEFAULTS[varName] || '';
    
    content += `# ${config.description} ${mark}\n`;
    content += `${varName}=${defaultVal}\n\n`;
  }

  // Generate notes
  content += '\n# Security Notes:\n';
  content += '# - JWT_SECRET: Minimum 32 characters, must be random\n';
  content += '# - DATABASE_URL: Never commit dengan password real\n';
  content += '# - MIDTRANS_*: Get dari https://dashboard.midtrans.com\n';
  content += '# - Production: Semua sensitive values harus aman!\n';

  try {
    fs.writeFileSync(envExamplePath, content);
    console.log(`✅ Generated ${envExamplePath}`);
  } catch (err) {
    console.warn(`⚠️ Could not generate .env.example: ${err.message}`);
  }
}

module.exports = {
  validateEnv,
  maskDatabaseUrl,
  maskSecret,
  generateEnvExample,
  REQUIRED_VARS
};
