const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders.controller');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get all top sellings
router.get('/top', orderController.topSelling);

// Get all top trending
router.get('/trending', orderController.topTrending);

// Get an order by ID
router.get('/:id', orderController.getOrderById);

// Get recomendation  by ID
router.get('/recommendations/:id', orderController.getRecomendations);

// Update an order by ID
router.put('/:id', orderController.updateOrderById);

// Delete an order by ID
router.delete('/:id', orderController.deleteOrderById);

module.exports = router;
