const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    salesCount: { type: Number, default: 0 }, // Count how many times this product has been sold
    views: { type: Number, default: 0 },
    cartAdditions: { type: Number, default: 0 },
    replenishmentThreshold: Number,
    autoReplenish: Boolean,
    criticalStock: { type: Number, default: 10 }, // Critical stock limit for dynamic pricing
    createdAt: { type: Date, default: Date.now },
    salesLastMonth: [Number],
    image: String,
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
