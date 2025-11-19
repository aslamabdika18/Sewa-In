/**
 * Test Setup File
 * 
 * Dijalankan sebelum semua test untuk setup environment
 * Useful untuk mock global functions, setup database, dll
 */

// Set environment ke test
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-secret-key';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Mock console untuk mengurangi output spam di test
if (process.env.SUPPRESS_LOGS === 'true') {
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
}
