/**
 * Jest Configuration
 * 
 * Jest adalah industry standard testing framework dipakai oleh:
 * - Facebook/Meta
 * - Airbnb
 * - Shopify
 * - dan ribuan developer profesional lainnya
 * 
 * Dokumentasi: https://jestjs.io/
 */

module.exports = {
  // Environment untuk testing
  testEnvironment: 'node',

  // Kumpulan file test
  testMatch: ['**/__tests__/**/*.test.js'],

  // Coverage threshold - minimal 80% untuk passing
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Skip entry point
    '!src/config/**', // Skip config files
  ],

  // Timeout default untuk test
  testTimeout: 10000,

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],

  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
  },

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Verbose output
  verbose: true,
};
