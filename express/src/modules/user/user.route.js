const express = require("express");
const controller = require("./user.controller");
const auth = require("../../middlewares/auth");
const checkRole = require("../../middlewares/checkRole");
const { validateBody } = require("../../middlewares/validation");
const { userUpdateSchema, changePasswordSchema } = require("../../validations/schemas");

const router = express.Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user profile
 *     description: Mendapatkan profil user yang sedang login
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Authentication required
 */
router.get("/me", auth, controller.getMe);

/**
 * @swagger
 * /user/me:
 *   put:
 *     summary: Update user profile
 *     description: Update profil user (email, nama, nomor telepon, alamat)
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               address:
 *                 type: string
 *                 example: Jl. Raya No. 123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.put("/me", auth, validateBody(userUpdateSchema), controller.updateProfile);

/**
 * @swagger
 * /user/me/change-password:
 *   post:
 *     summary: Change user password
 *     description: Mengubah password user (memerlukan password lama untuk verifikasi)
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPass123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPass456!
 *                 description: Min 8 chars, uppercase, digit, special character
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password incorrect atau validation error
 */
router.post("/me/change-password", auth, validateBody(changePasswordSchema), controller.changePassword);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Menampilkan daftar semua user. Hanya admin yang bisa mengakses.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: List user retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get("/", auth, checkRole('ADMIN'), controller.getAll);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User detail retrieved
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.get("/:id", auth, checkRole('ADMIN'), controller.getById);

module.exports = router;