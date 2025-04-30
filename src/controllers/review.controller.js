const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { product_name, product_type, title, description, rating, status, images_path } = req.body;

    const newReview = new Review({
      product_name,
      product_type,
      title,
      description,
      rating,
      status,
      images_path
    });

    await newReview.save();
    res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// View all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find(); // No populate needed
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// View a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Download Summary Report (CSV)
exports.downloadSummaryReport = async (req, res) => {
  try {
    const reviews = await Review.find();

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    const filePath = path.join(__dirname, '../reports/reviews_summary.csv');

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'product_name', title: 'Product Name' },
        { id: 'product_type', title: 'Category' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'rating', title: 'Rating' },
        { id: 'status', title: 'Status' },
        { id: 'date', title: 'Date' },
      ],
    });

    const csvData = reviews.map((review) => ({
      product_name: review.product_name,
      product_type: review.product_type,
      title: review.title,
      description: review.description,
      rating: review.rating,
      status: review.status,
      date: new Date(review.date).toISOString(),
    }));

    await csvWriter.writeRecords(csvData);

    res.download(filePath, 'reviews_summary.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading report', error: err.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating summary report', error: error.message });
  }
};
