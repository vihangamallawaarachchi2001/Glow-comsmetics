const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//Create a new review
exports.createReview = async (req, res) => {
    try {
        const { user_id, product_name, product_type, title, description, rating, status, images_path } = req.body;
        
        const newReview = new Review({
            user_id,
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
        const reviews = await Review.find().populate('user_id', 'name email');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// View a single review by ID
exports.getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId).populate('user_id', 'name email');

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
        const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
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

//Download Summary Report (CSV)
exports.downloadSummaryReport = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user_id', 'name email');

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found' });
        }

        // Define CSV file path
        const filePath = path.join(__dirname, '../reports/reviews_summary.csv');

        // Create CSV Writer
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                { id: 'user', title: 'User' },
                { id: 'title', title: 'Title' },
                { id: 'description', title: 'Description' },
                { id: 'rating', title: 'Rating' },
                { id: 'status', title: 'Status' },
                { id: 'date', title: 'Date' },
            ],
        });

        // Format Data for CSV
        const csvData = reviews.map(review => ({
            user: review.user_id ? `${review.user_id.name} (${review.user_id.email})` : 'Anonymous',
            title: review.title,
            description: review.description,
            rating: review.rating,
            status: review.status,
            date: review.date.toISOString(),
        }));

        // Write data to CSV
        await csvWriter.writeRecords(csvData);

        // Send the file as response
        res.download(filePath, 'reviews_summary.csv', err => {
            if (err) {
                res.status(500).json({ message: 'Error downloading report', error: err.message });
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error generating summary report', error: error.message });
    }
};
