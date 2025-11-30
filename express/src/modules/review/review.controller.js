const reviewService = require('./review.service');
const { success } = require('../../utils/response');
const logger = require('../../config/logger');

module.exports.createReviewController = async (req, res, next) => {
  try {
    const { sewaId } = req.params;
    const review = await reviewService.createReview(sewaId, req.body, req.user.id);
    return success(res, review, 'Review berhasil dibuat', null, 201);
  } catch (err) {
    logger.error('Error creating review:', err);
    next(err);
  }
};

module.exports.getBarangReviewsController = async (req, res, next) => {
  try {
    const { barangId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await reviewService.getBarangReviews(barangId, page, limit);
    return success(res, result, 'Reviews berhasil diambil');
  } catch (err) {
    logger.error('Error getting barang reviews:', err);
    next(err);
  }
};

module.exports.getUserReviewsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await reviewService.getUserReviews(req.user.id, page, limit);
    return success(res, result, 'Reviews Anda berhasil diambil');
  } catch (err) {
    logger.error('Error getting user reviews:', err);
    next(err);
  }
};

module.exports.updateReviewController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewService.updateReview(reviewId, req.body, req.user.id);
    return success(res, review, 'Review berhasil diupdate');
  } catch (err) {
    logger.error('Error updating review:', err);
    next(err);
  }
};

module.exports.deleteReviewController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewService.deleteReview(reviewId, req.user.id);
    return success(res, review, 'Review berhasil dihapus');
  } catch (err) {
    logger.error('Error deleting review:', err);
    next(err);
  }
};
