const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
const createOrder = async (orderData) => {
  try {
    const order = new Order(orderData);
    await order.save();
    return order;
  } catch (error) {
    throw new Error('Error creating order: ' + error.message);
  }
};

// Get all orders
const getAllOrders = async () => {
  try {
    return await Order.find().populate('userId').populate('items.productId');
  } catch (error) {
    throw new Error('Error fetching orders: ' + error.message);
  }
};

// Get an order by ID
const getOrderById = async (id) => {
  try {
    const order = await Order.findById(id).populate('userId').populate('items.productId');
    if (!order) throw new Error('Order not found');
    return order;
  } catch (error) {
    throw new Error('Error fetching order: ' + error.message);
  }
};

// Update an order by ID
const updateOrderById = async (id, updatedData) => {
  try {
    const order = await Order.findByIdAndUpdate(id, updatedData, { new: true });
    if (!order) throw new Error('Order not found');
    return order;
  } catch (error) {
    throw new Error('Error updating order: ' + error.message);
  }
};

// Delete an order by ID
const deleteOrderById = async (id) => {
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) throw new Error('Order not found');
    return order;
  } catch (error) {
    throw new Error('Error deleting order: ' + error.message);
  }
};

const getTopSellingItems = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const topSellingItems = await Order.aggregate([
            { $match: { createdAt: { $gte: oneWeekAgo } } }, 
            { $unwind: "$items" },
            { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } }, 
            { $sort: { totalSold: -1 } }, 
            { $limit: 3 }, 
            { 
                $lookup: { 
                    from: "products", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "productDetails" 
                } 
            }, 
            { $unwind: "$productDetails" } 
        ]);

        return topSellingItems;
    } catch (error) {
        throw error
    }
};

const getTrendingItems = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const lastWeekSales = await Order.aggregate([
            { $match: { createdAt: { $gte: oneWeekAgo } } },
            { $unwind: "$items" },
            { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } }
        ]);

        const previousWeekSales = await Order.aggregate([
            { $match: { createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } } },
            { $unwind: "$items" },
            { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } }
        ]);

        // Calculate percentage increase
        const trends = lastWeekSales.map(item => {
            const previous = previousWeekSales.find(prev => prev._id.equals(item._id)) || { totalSold: 0 };
            return {
                productId: item._id,
                growth: (item.totalSold - previous.totalSold) / (previous.totalSold || 1) * 100
            };
        });

        // Get top 10 trending items
        trends.sort((a, b) => b.growth - a.growth);
        const topTrending = trends.slice(0, 8);

        return topTrending
    } catch (error) {
        throw error;
    }
};

const getUserRecommendations = async (userId) => {
  try {
      // Get user’s past purchases with product details populated
      const pastPurchases = await Order.find({ userId: userId })
          .populate("items.productId");

      // Extract purchased product IDs
      const purchasedProductIds = new Set();
      const purchasedCategories = new Set();

      pastPurchases.forEach(order => {
          order.items.forEach(item => {
              if (item.productId) {
                  purchasedProductIds.add(item.productId._id.toString()); 
                  purchasedCategories.add(item.productId.category);
              }
          });
      });

      // Recommend products from the same categories but exclude already purchased ones
      const recommendations = await Product.find({
          category: { $in: Array.from(purchasedCategories) }, // Convert Set to Array
          _id: { $nin: Array.from(purchasedProductIds) } // Convert Set to Array
      }).limit(10);

      return recommendations;
  } catch (error) {
      console.error("Error in getUserRecommendations:", error);
      throw error;
  }
};



module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getTopSellingItems,
  getTrendingItems,
  getUserRecommendations
};
