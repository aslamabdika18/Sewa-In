const express = require("express");
const controller = require("./sewa.controller");
const auth = require("../../middlewares/auth");
const { validateBody } = require("../../middlewares/validation");
const { sewaCreateSchema, sewaUpdateSchema } = require("../../validations/schemas");
const { sewaLimiter } = require("../../middlewares/rateLimiter");

const router = express.Router();

/**
 * @swagger
 * /sewa:
 *   get:
 *     summary: Get semua booking sewa user
 *     description: Menampilkan daftar semua booking sewa untuk user yang sedang login dengan pagination
 *     tags:
 *       - Booking (Sewa)
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, ONGOING, FINISHED, CANCELLED]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: List booking berhasil diambil
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sewa'
 *       401:
 *         description: Authentication required
 */
router.get("/", auth, controller.getAll);

/**
 * @swagger
 * /sewa/{id}:
 *   get:
 *     summary: Get detail booking by ID
 *     description: Menampilkan detail booking beserta item yang disewa
 *     tags:
 *       - Booking (Sewa)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Detail booking berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/Sewa'
 *       404:
 *         description: Booking tidak ditemukan
 */
router.get("/:id", auth, controller.getById);

/**
 * @swagger
 * /sewa:
 *   post:
 *     summary: Create booking sewa baru
 *     description: Membuat booking sewa baru. Akan mengecek ketersediaan stock dan menciptakan transaksi atomik untuk mencegah race condition.
 *     tags:
 *       - Booking (Sewa)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - items
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-20T10:00:00Z"
 *                 description: Tanggal mulai sewa (tidak boleh di masa lalu)
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-25T10:00:00Z"
 *                 description: Tanggal akhir sewa (harus > startDate)
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - barangId
 *                     - quantity
 *                   properties:
 *                     barangId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat
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
 *                   example: Booking created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Sewa'
 *       400:
 *         description: Validation error atau item tidak tersedia
 *       409:
 *         description: Stock conflict - item sudah dipesan orang lain
 *       429:
 *         description: Rate limit exceeded
 */
router.post("/", auth, sewaLimiter, validateBody(sewaCreateSchema), controller.create);

/**
 * @swagger
 * /sewa/{id}:
 *   put:
 *     summary: Update booking sewa
 *     description: Update detail booking (hanya status PENDING yang bisa diubah)
 *     tags:
 *       - Booking (Sewa)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Booking berhasil diupdate
 *       404:
 *         description: Booking tidak ditemukan
 *       409:
 *         description: Tidak bisa update booking dengan status bukan PENDING
 */
router.put("/:id", auth, validateBody(sewaUpdateSchema), controller.update);

/**
 * @swagger
 * /sewa/{id}:
 *   delete:
 *     summary: Cancel/Delete booking sewa
 *     description: Membatalkan booking. Hanya booking dengan status PENDING yang bisa dibatalkan.
 *     tags:
 *       - Booking (Sewa)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Booking berhasil dibatalkan
 *       404:
 *         description: Booking tidak ditemukan
 *       409:
 *         description: Tidak bisa membatalkan booking dengan status bukan PENDING
 */
router.delete("/:id", auth, controller.remove);

module.exports = router;
