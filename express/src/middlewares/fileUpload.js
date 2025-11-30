const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

// Memory storage untuk processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Format file tidak didukung. Gunakan JPEG, PNG, atau WebP'));
    }

    cb(null, true);
  }
});

/**
 * Process image upload - resize dan optimize
 */
async function processImageUpload(file, folder) {
  if (!file) {
    throw new Error('File tidak ditemukan');
  }

  const uuid = uuidv4();
  const sizes = {
    thumbnail: { width: 200, height: 200, quality: 80 },
    medium: { width: 500, height: 500, quality: 85 },
    large: { width: 1000, height: 1000, quality: 90 }
  };

  const processedImages = {};

  try {
    // Ensure upload directory exists
    const uploadDir = path.join(__dirname, '../../uploads', folder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Process each size
    for (const [size, config] of Object.entries(sizes)) {
      const buffer = await sharp(file.buffer)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: config.quality })
        .toBuffer();

      const filename = `${uuid}-${size}.webp`;
      const filepath = path.join(uploadDir, filename);

      // Save to local storage
      await fs.writeFile(filepath, buffer);

      // Store URL (relative path for serving)
      processedImages[size] = `/uploads/${folder}/${filename}`;
    }

    logger.info(`✅ Image processed: ${uuid}`);
    return {
      id: uuid,
      images: processedImages,
      originalMime: file.mimetype,
      originalSize: file.size
    };
  } catch (error) {
    logger.error('Image processing error:', error);
    throw error;
  }
}

/**
 * Delete image files
 */
async function deleteImages(folder, imageId) {
  try {
    const uploadDir = path.join(__dirname, '../../uploads', folder);
    const sizes = ['thumbnail', 'medium', 'large'];

    for (const size of sizes) {
      const filepath = path.join(uploadDir, `${imageId}-${size}.webp`);
      try {
        await fs.unlink(filepath);
      } catch (error) {
        // File might not exist, continue
        logger.warn(`Image file not found: ${filepath}`);
      }
    }

    logger.info(`✅ Images deleted: ${imageId}`);
  } catch (error) {
    logger.error('Image deletion error:', error);
  }
}

module.exports = {
  upload,
  processImageUpload,
  deleteImages
};
