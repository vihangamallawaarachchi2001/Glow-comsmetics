const mongoose = require('mongoose');

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    product_name: { 
        type: String, 
        required: true 
    },
    product_type: { 
        type: String, 
        required: true
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true
     },
    date: { 
        type: Date, 
        default: Date.now,
        required: false
    },
    rating: { 
        type: Number, 
        enum: [1, 2, 3, 4, 5], 
        required: true 
    },
    status: { 
        type: String, 
        default: 'pending', 
        enum: ['pending', 'solved', 'onprogress'] 
    },
    images_path: { 
        type: [String], 
        required: false 
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
