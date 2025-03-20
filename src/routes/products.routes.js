const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller.js');

// Create a new product
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:id', productController.getProductById);

// Update a product by ID
router.put('/:id', productController.updateProductById);

// Delete a product by ID
router.delete('/:id', productController.deleteProductById);

module.exports = router;
