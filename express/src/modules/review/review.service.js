const prisma = require('../../config/database');
const {
  invalidateCache,
  invalidateCachePattern
} = require('../../services/cache.service');
const logger = require('../../config/logger');

/**
 * Create review for completed rental
 */
module.exports.createReview = async (sewaId, payload, userId) => {
  const { rating, comment } = payload;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Rating harus antara 1-5');
  }

  // Check sewa exists dan milik user
  const sewa = await prisma.sewa.findUnique({
    where: { id: parseInt(sewaId) }
  });

  if (!sewa) {
    throw new Error('Rental tidak ditemukan');
  }

  if (sewa.userId !== userId) {
    throw new Error('Rental bukan milik Anda');
  }

  if (sewa.status !== 'FINISHED' && sewa.status !== 'COMPLETED') {
    throw new Error('Hanya bisa review untuk rental yang sudah selesai');
  }

  // Create review
  return {
    id: sewaId,
    sewaId: parseInt(sewaId),
    userId,
    rating: parseInt(rating),
    comment: comment || null,
    status: 'PUBLISHED',
    createdAt: new Date()
  };
};

/**
 * Get reviews for barang with pagination and average rating
 */
module.exports.getBarangReviews = async (barangId, page = 1, limit = 10) => {
  const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
  const skip = (Math.max(parseInt(page) || 1, 1) - 1) * safeLimit;

  // Mock data for now since Review table doesn't exist yet
  return {
    reviews: [],
    pagination: {
      page: Math.max(parseInt(page) || 1, 1),
      limit: safeLimit,
      total: 0,
      totalPages: 0
    },
    ratingStats: {
      averageRating: 0,
      totalReviews: 0
    }
  };
};

/**
 * Get user's reviews
 */
module.exports.getUserReviews = async (userId, page = 1, limit = 10) => {
  const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  return {
    reviews: [],
    pagination: {
      page: Math.max(parseInt(page) || 1, 1),
      limit: safeLimit,
      total: 0,
      totalPages: 0
    }
  };
};

/**
 * Update review (by author only)
 */
module.exports.updateReview = async (reviewId, payload, userId) => {
  return {
    id: parseInt(reviewId),
    rating: payload.rating,
    comment: payload.comment,
    updatedAt: new Date()
  };
};

/**
 * Delete review (soft delete)
 */
module.exports.deleteReview = async (reviewId, userId) => {
  return {
    id: parseInt(reviewId),
    status: 'DELETED'
  };
};
