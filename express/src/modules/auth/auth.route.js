const express = require("express");
const {
  registerController,
  loginController,
  meController,
  logoutController
} = require("./auth.controller");
const auth = require("../../middlewares/auth");
const { validateBody } = require("../../middlewares/validation");
const { registerSchema, loginSchema } = require("../../validations/schemas");
const { authLimiter, registerLimiter } = require("../../middlewares/rateLimiter");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user baru
 *     description: Membuat akun baru dengan email dan password. Email harus unik dan password minimal 8 karakter dengan uppercase, digit, dan special character.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Email unik untuk login
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *                 description: Minimum 8 karakter, harus ada uppercase, digit, dan special character
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 description: Nama lengkap pengguna
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *                 description: Nomor telepon (opsional)
 *               address:
 *                 type: string
 *                 example: Jl. Raya No. 123
 *                 description: Alamat lengkap (opsional)
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                       example: USER
 *       400:
 *         description: Input validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *       429:
 *         description: Rate limit exceeded
 */
router.post(
  "/register",
  registerLimiter,
  validateBody(registerSchema),
  registerController
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Login dengan email dan password. Token disimpan dalam HttpOnly cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login berhasil, token disimpan di cookie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: sewa_token=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                       example: USER
 *       401:
 *         description: Email atau password salah
 *       429:
 *         description: Rate limit exceeded - terlalu banyak percobaan login gagal
 */
router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  loginController
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     description: Mendapatkan informasi user yang sedang login. Memerlukan authentication token.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                       example: USER
 *                     phone:
 *                       type: string
 *                       example: "081234567890"
 *                     address:
 *                       type: string
 *                       example: Jl. Raya No. 123
 *       401:
 *         description: Token tidak valid atau expired
 */
router.get("/me", auth, meController);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout dan hapus token dari cookie. Memerlukan authentication.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful, cookie cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Token tidak valid atau belum login
 */
router.post("/logout", auth, logoutController);

module.exports = router;
