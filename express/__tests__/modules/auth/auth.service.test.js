/**
 * Auth Service Tests
 * 
 * Test authentication service functions:
 * - register: Create user baru
 * - login: Verify credentials
 * - verifyToken: Check JWT validity
 */

const authService = require('../../../src/modules/auth/auth.service');
const prisma = require('../../../src/config/database');
const bcrypt = require('bcrypt');

// Mock Prisma
jest.mock('../../../src/config/database');

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear semua mock sebelum setiap test
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user dengan email unik', async () => {
      // Setup
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123',
      };

      // Mock Prisma response
      prisma.user.findUnique.mockResolvedValueOnce(null); // Email belum ada
      prisma.user.create.mockResolvedValueOnce({
        id: 1,
        email: userData.email,
        name: userData.name,
        // Password tidak dikembalikan
      });

      // Execute
      const result = await authService.register(userData);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw error jika email sudah terdaftar', async () => {
      // Setup
      const userData = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'Password123',
      };

      // Mock Prisma response - user sudah ada
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: userData.email,
      });

      // Execute & Assert
      await expect(authService.register(userData)).rejects.toThrow(
        'Email sudah terdaftar'
      );
    });

    it('should hash password sebelum disimpan', async () => {
      // Setup
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123',
      };

      // Mock Prisma response
      prisma.user.findUnique.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValueOnce({
        id: 1,
        email: userData.email,
        name: userData.name,
      });

      // Mock bcrypt.hash
      const hashedPassword = 'hashed_password_here';
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword);

      // Execute
      await authService.register(userData);

      // Assert - verify bcrypt.hash dipanggil
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    });
  });

  describe('login', () => {
    it('should return user jika credentials valid', async () => {
      // Setup
      const email = 'test@example.com';
      const password = 'Password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        id: 1,
        email,
        name: 'Test User',
        password: hashedPassword,
      };

      // Mock Prisma response
      prisma.user.findUnique.mockResolvedValueOnce(user);

      // Mock bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      // Execute
      const result = await authService.login(email, password);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should throw error jika email tidak ditemukan', async () => {
      // Setup
      const email = 'notfound@example.com';
      const password = 'Password123';

      // Mock Prisma response - user tidak ada
      prisma.user.findUnique.mockResolvedValueOnce(null);

      // Execute & Assert
      await expect(authService.login(email, password)).rejects.toThrow(
        'Email atau password salah'
      );
    });

    it('should throw error jika password salah', async () => {
      // Setup
      const email = 'test@example.com';
      const password = 'WrongPassword';
      const hashedPassword = await bcrypt.hash('CorrectPassword', 10);

      const user = {
        id: 1,
        email,
        password: hashedPassword,
      };

      // Mock Prisma response
      prisma.user.findUnique.mockResolvedValueOnce(user);

      // Mock bcrypt.compare - password tidak match
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      // Execute & Assert
      await expect(authService.login(email, password)).rejects.toThrow(
        'Email atau password salah'
      );
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token jika valid', () => {
      // Setup - gunakan jwt untuk buat token
      const jwt = require('jsonwebtoken');
      const secret = 'test-secret';
      const payload = { id: 1, email: 'test@example.com' };
      const token = jwt.sign(payload, secret);

      // Execute
      const decoded = authService.verifyToken(token, secret);

      // Assert
      expect(decoded).toHaveProperty('id');
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error jika token invalid', () => {
      // Setup
      const invalidToken = 'invalid.token.here';

      // Execute & Assert
      expect(() =>
        authService.verifyToken(invalidToken, 'test-secret')
      ).toThrow();
    });
  });
});
