const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { upload, processImageUpload } = require('../middlewares/fileUpload');
const { success, error: errorResponse } = require('../utils/response');

/**
 * POST /api/v1/upload/barang - Upload product image
 */
router.post(
  '/barang',
  auth,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File tidak ditemukan'
        });
      }

      const result = await processImageUpload(req.file, 'barang');

      return success(res, result, 'Gambar berhasil diupload', null, 200);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/v1/upload/profile - Upload user profile picture
 */
router.post(
  '/profile',
  auth,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File tidak ditemukan'
        });
      }

      const result = await processImageUpload(req.file, 'profile');

      return success(res, result, 'Foto profil berhasil diupload', null, 200);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
