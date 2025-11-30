const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const reviewController = require('./review.controller');

/**
 * POST /api/v1/review/:sewaId - Create review for completed sewa
 */
router.post('/:sewaId', auth, reviewController.createReviewController);

/**
 * GET /api/v1/review/barang/:barangId - Get all reviews for a barang
 */
router.get('/barang/:barangId', reviewController.getBarangReviewsController);

/**
 * GET /api/v1/review/me - Get my reviews
 */
router.get('/me', auth, reviewController.getUserReviewsController);

/**
 * PATCH /api/v1/review/:reviewId - Update my review
 */
router.patch('/:reviewId', auth, reviewController.updateReviewController);

/**
 * DELETE /api/v1/review/:reviewId - Delete my review
 */
router.delete('/:reviewId', auth, reviewController.deleteReviewController);

module.exports = router;
