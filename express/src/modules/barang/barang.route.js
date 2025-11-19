const express = require('express')
const router = express.Router()
const barangController = require('./barang.controller')
const auth = require('../../middlewares/auth')
const checkRole = require('../../middlewares/checkRole')
const { validateBody } = require('../../middlewares/validation')
const { auditMiddleware } = require('../../middlewares/auditMiddleware')
const { barangCreateSchema, barangUpdateSchema } = require('../../validations/schemas')

/**
 * @swagger
 * /barang:
 *   get:
 *     summary: Get semua barang (items)
 *     description: Menampilkan daftar semua barang yang tersedia dengan pagination dan filter
 *     tags:
 *       - Barang (Items)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Nomor halaman (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Jumlah item per halaman (default 10)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *     responses:
 *       200:
 *         description: List barang berhasil diambil
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
 *                   example: Barang retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Barang'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 */
router.get('/', barangController.getAllBarang)

/**
 * @swagger
 * /barang/{id}:
 *   get:
 *     summary: Get barang by ID
 *     description: Menampilkan detail barang berdasarkan ID
 *     tags:
 *       - Barang (Items)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID barang
 *     responses:
 *       200:
 *         description: Detail barang berhasil diambil
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
 *                   $ref: '#/components/schemas/Barang'
 *       404:
 *         description: Barang tidak ditemukan
 */
router.get('/:id', barangController.getBarangById)

/**
 * @swagger
 * /barang:
 *   post:
 *     summary: Create barang baru (Admin only)
 *     description: Membuat item barang baru. Hanya admin yang dapat mengakses.
 *     tags:
 *       - Barang (Items)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop Dell XPS 13
 *                 description: Nama barang
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *                 description: ID kategori
 *               description:
 *                 type: string
 *                 example: Laptop gaming dengan spesifikasi tinggi
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 150000
 *                 description: Harga per hari (dalam Rupiah)
 *               stock:
 *                 type: integer
 *                 example: 10
 *                 description: Jumlah barang yang tersedia
 *               image:
 *                 type: string
 *                 format: url
 *                 description: URL gambar barang (opsional)
 *     responses:
 *       201:
 *         description: Barang berhasil dibuat
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
 *                   example: Barang created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Barang'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       400:
 *         description: Validation error
 */
router.post('/', auth, checkRole('ADMIN'), validateBody(barangCreateSchema), auditMiddleware('Barang', 'CREATE'), barangController.createBarang)

/**
 * @swagger
 * /barang/{id}:
 *   put:
 *     summary: Update barang (Admin only)
 *     description: Update informasi barang. Hanya admin yang dapat mengakses.
 *     tags:
 *       - Barang (Items)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID barang
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Barang berhasil diupdate
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
 *                   $ref: '#/components/schemas/Barang'
 *       404:
 *         description: Barang tidak ditemukan
 *       403:
 *         description: Admin access required
 */
router.put('/:id', auth, checkRole('ADMIN'), validateBody(barangUpdateSchema), auditMiddleware('Barang', 'UPDATE'), barangController.updateBarang)

/**
 * @swagger
 * /barang/{id}:
 *   delete:
 *     summary: Delete barang (Admin only)
 *     description: Menghapus barang (soft delete). Hanya admin yang dapat mengakses.
 *     tags:
 *       - Barang (Items)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID barang
 *     responses:
 *       204:
 *         description: Barang berhasil dihapus
 *       404:
 *         description: Barang tidak ditemukan
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', auth, checkRole('ADMIN'), auditMiddleware('Barang', 'DELETE'), barangController.deleteBarang)

module.exports = router