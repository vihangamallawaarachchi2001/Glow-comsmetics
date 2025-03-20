const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');
const webPush  = require('web-push');

// Create a new product
const createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    return product;
  } catch (error) {
    throw new Error('Error creating product: ' + error.message);
  }
};

// Get all products
const getAllProducts = async () => {
  try {
    return await Product.find();
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
};

// Get a product by ID
const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    throw new Error('Error fetching product: ' + error.message);
  }
};

// Update a product by ID
const updateProductById = async (id, updatedData) => {
  try {
    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    throw new Error('Error updating product: ' + error.message);
  }
};

// Delete a product by ID
const deleteProductById = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    throw new Error('Error deleting product: ' + error.message);
  }
};

const adjustProductPricing = async () => {
    const alpha = 0.2; // Change rate
    const lowSalesThreshold = 5; // If sold less than 5 in two weeks, decrease price

    const products = await Product.find(); // Get all products

    for (const product of products) {
        const criticalLimit = product.criticalStock || 10; // Default critical stock level
        const currentStock = product.stock;
        const originalPrice = product.price;
        let newPrice = originalPrice;

        // Check if stock is critically low
        if (currentStock <= criticalLimit) {
            newPrice = originalPrice * (1 + alpha * ((criticalLimit - currentStock) / criticalLimit));
            await notifyAdmin(product._id, currentStock); // Alert Admin
        }

        // Check sales in the past 2 weeks
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const salesCount = await Order.aggregate([
            { $match: { createdAt: { $gte: twoWeeksAgo } } },
            { $unwind: "$items" },
            { $match: { "items.productId": product._id } },
            { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } }
        ]);

        const totalSold = salesCount.length > 0 ? salesCount[0].totalSold : 0;

        if (totalSold < lowSalesThreshold) {
            newPrice = originalPrice * (1 - alpha * (lowSalesThreshold - totalSold) / lowSalesThreshold);
        }

        // Update price if changed
        if (newPrice !== originalPrice) {
            await Product.findByIdAndUpdate(product._id, { price: newPrice });
            console.log(product._id, newPrice, originalPrice);
            
        }
    }
};

const notifyAdmin = async (productId, stock) => {
  try {
      const admin = await User.findOne({ role: "admin", subscription: { $exists: true, $ne: null } });

      if (!admin || !admin.subscription) {
          console.log("No admin subscribed for notifications.");
          return;
      }

      const payload = JSON.stringify({
          title: "⚠️ Low Stock Alert",
          message: `Product ID ${productId} has only ${stock} units left! Replenish soon.`,
      });

      await webPush.sendNotification(admin.subscription, payload);
      console.log(`📢 Sent stock alert to admin for Product ID: ${productId}`);
      
  } catch (error) {
      console.error("Error sending admin notification:", error);
  }
};


function handleStockReplenishment(productId) {
    Product.findById(productId).then(product => {
      if (product.stock <= product.criticalStock && product.autoReplenish) {
        const replenishmentAmount = product.salesLastMonth * product.replenishmentThreshold;
        sendPurchaseRequestToSeller(productId, replenishmentAmount);
      }
    });
  }
  
  function sendPurchaseRequestToSeller(productId, amount) {
    // Send a purchase request to the seller (can be via email, API, etc.)
    console.log(`Purchase request for Product ID: ${productId} for ${amount} units.`);
  }

  function predictNextMonthSales(productId) {
    Product.findById(productId).then(product => {
      if (product.salesData.length > 0) {
        // Calculate the average sales from the last 3 months (or more)
        const last3MonthsSales = product.salesData.slice(-3);
        const averageSales = last3MonthsSales.reduce((sum, sales) => sum + sales, 0) / last3MonthsSales.length;
        
        console.log(`Predicted sales for next month: ${averageSales}`);
        return averageSales; // Return the predicted sales for the next month
      }
    });
  }
  

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  adjustProductPricing,
  handleStockReplenishment,
  predictNextMonthSales
};
