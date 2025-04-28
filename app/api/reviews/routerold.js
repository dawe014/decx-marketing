const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { validateReview } = require('../validators/reviewValidator');

// Get reviews for user
router.get('/user/:userId', reviewController.getUserReviews);

// Create review
router.post('/', authenticate, validateReview, reviewController.createReview);

// Update review
router.put('/:id', authenticate, reviewController.updateReview);

// Delete review
router.delete('/:id', authenticate, reviewController.deleteReview);

// Report review
router.post('/:id/report', authenticate, reviewController.reportReview);

module.exports = router;