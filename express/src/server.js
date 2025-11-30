const app = require("./app");
const env = require("./config/env");
const { validateEnv } = require("./config/envValidation");
const logger = require("./config/logger");

// VALIDATE ENVIRONMENT VARIABLES FIRST (sebelum app starts)
// Ini memastikan semua required vars ada dan valid
validateEnv();

const server = app.listen(env.app.port, () => {
  console.log(`🚀 Server started successfully on port ${env.app.port}`);
});

/**
 * GRACEFUL SHUTDOWN
 * Handle clean shutdown ketika server receive termination signals
 */

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('📥 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('🛑 HTTP server closed');
    process.exit(0);
  });

  // Force exit setelah 10 seconds
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  console.log('📥 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('🛑 HTTP server closed');
    process.exit(0);
  });

  // Force exit setelah 10 seconds
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
