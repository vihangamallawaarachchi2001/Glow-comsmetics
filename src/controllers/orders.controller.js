const orderService = require('../services/orders.service');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get an order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update an order by ID
const updateOrderById = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrderById(req.params.id, req.body);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await orderService.deleteOrderById(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


const topSelling = async (req, res) => {
  try {
    const topSellingItems = await orderService.getTopSellingItems();
    res.status(200).json({ topSellingItems: topSellingItems });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const topTrending = async (req, res) => {
  try {
    const TrendingItems = await orderService.getTrendingItems();
    res.status(200).json({ TrendingItems: TrendingItems });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getRecomendations = async (req, res) => {
  try {
    const userId = req.params.id;
    const recommendations = await orderService.getUserRecommendations(userId);
    res.status(200).json({ recommendations: recommendations });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  topSelling,
  topTrending,
  getRecomendations
};
