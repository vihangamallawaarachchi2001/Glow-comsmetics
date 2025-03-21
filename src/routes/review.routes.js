const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// Routes
router.post('/create', reviewController.createReview); // Create a review
router.get('/all', reviewController.getAllReviews); // View all reviews
router.get('/:reviewId', reviewController.getReviewById); // View a single review by ID
router.put('/update/:reviewId', reviewController.updateReview); // Update a review
router.delete('/delete/:reviewId', reviewController.deleteReview); // Delete a review
router.get('/download-summary', reviewController.downloadSummaryReport); // Download CSV summary

module.exports = router;
