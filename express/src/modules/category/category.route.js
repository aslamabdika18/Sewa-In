const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const auth = require("../../middlewares/auth");
const { checkRole } = require("../../middlewares/checkRole");
const { validateBody } = require("../../middlewares/validation");
const { categoryCreateSchema, categoryUpdateSchema } = require("../../validations/schemas");

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get semua kategori
 *     description: Menampilkan daftar semua kategori barang
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: List kategori berhasil diambil
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get("/", categoryController.getAll);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get kategori by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategori berhasil diambil
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.get("/:id", categoryController.getById);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create kategori baru (Admin only)
 *     tags:
 *       - Category
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Kategori untuk elektronik
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *       403:
 *         description: Admin access required
 */
router.post("/", auth, checkRole('ADMIN'), validateBody(categoryCreateSchema), categoryController.create);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update kategori (Admin only)
 *     tags:
 *       - Category
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.put("/:id", auth, checkRole('ADMIN'), validateBody(categoryUpdateSchema), categoryController.update);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete kategori (Admin only)
 *     tags:
 *       - Category
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
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.delete("/:id", auth, checkRole('ADMIN'), categoryController.delete);

module.exports = router;