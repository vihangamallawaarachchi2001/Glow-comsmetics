const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,  // Name of the user or author
    },
    question: {
        type: String,
        required: true,  // The question being asked
    },
    answer: {
        type: String, 
        required: false,  // The answer to the question - optional as becasue adding information from dashboard
    },
    answered_by: {
        type: String,
        required: false,  // The name or ID of the person who answered - optional as becasue adding information from dashboard
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Solved'],
        required: true,
    },
    category: {
        type: String,
        enum: ['Skin-Care', 'System', 'Payment', 'Account', 'Returns & Exchanges', 'Orders', 'Promotions & Discounts', 'Product Care', 'General Information'],
        required: true,
    }
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', FAQSchema);

module.exports = FAQ;
