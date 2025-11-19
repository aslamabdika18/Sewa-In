/**
 * Auth Routes Integration Tests
 * 
 * Test actual HTTP endpoints:
 * - POST /api/v1/auth/register
 * - POST /api/v1/auth/login
 * - GET /api/v1/auth/me
 * - POST /api/v1/auth/logout
 */

const request = require('supertest');
const app = require('../../../src/app');
const prisma = require('../../../src/config/database');

// Mock Prisma
jest.mock('../../../src/config/database');

// Mock auth middleware
jest.mock('../../../src/middlewares/auth', () => {
  return (req, res, next) => {
    // Inject user ke request jika ada token
    if (req.headers.authorization) {
      req.user = { id: 1, email: 'test@example.com' };
    }
    next();
  };
});

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register user dengan data valid', async () => {
      // Setup
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      // Mock Prisma responses
      prisma.user.findUnique.mockResolvedValueOnce(null); // Email belum ada
      prisma.user.create.mockResolvedValueOnce({
        id: 1,
        email: userData.email,
        name: userData.name,
      });

      // Execute
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(userData.email);
    });

    it('should return 400 jika email invalid', async () => {
      // Setup
      const userData = {
        email: 'invalid-email', // Invalid format
        name: 'Test User',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      // Execute
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validasi gagal');
    });

    it('should return 400 jika password terlalu pendek', async () => {
      // Setup
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'short', // Less than 6 characters
        confirmPassword: 'short',
      };

      // Execute
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 jika password tidak match', async () => {
      // Setup
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123',
        confirmPassword: 'DifferentPassword', // Tidak match
      };

      // Execute
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login user dengan credentials valid', async () => {
      // Setup
      const loginData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      // Mock Prisma response
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: loginData.email,
        name: 'Test User',
        password: '$2b$10$...' // Hashed password
      });

      // Mock bcrypt.compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      // Execute
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(loginData.email);
    });

    it('should return 400 jika email tidak ditemukan', async () => {
      // Setup
      const loginData = {
        email: 'notfound@example.com',
        password: 'Password123',
      };

      // Mock Prisma response - user tidak ada
      prisma.user.findUnique.mockResolvedValueOnce(null);

      // Execute
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 429 setelah 5 failed login attempts', async () => {
      // Setup
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      // Mock Prisma response
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: loginData.email,
        password: '$2b$10$...',
      });

      // Mock bcrypt.compare - always fail
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      // Execute 5 login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send(loginData);
      }

      // 6th attempt should be rate limited
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(429);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user jika authenticated', async () => {
      // Setup - mock auth middleware akan inject user
      // Execute
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 401 jika tidak authenticated', async () => {
      // Execute - tanpa Authorization header
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout user', async () => {
      // Execute
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', 'Bearer valid-token')
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // Cookie sewa_token harus dihapus
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });
});
