const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const logger = require("./utils/logger");
const dbConnection = require("./config/dbConfig");
const userRoutes = require('./routes/user.routes');
const productsRoute = require('./routes/products.routes');
const ordersRoute = require('./routes/orders.routes');

const reviewRoutes = require('./routes/review.routes');
const faqRoutes = require('./routes/faq.routes');

const cron = require("node-cron");
const { adjustProductPricing, handleStockReplenishment, predictNextMonthSales } = require('./services/products.service');

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


// Logging configuration
const morganMiddleware = require("./utils/morganMiddleware");
const Product = require('./models/Product');
const Order = require('./models/Order');
const webPush  = require('web-push');
const User = require('./models/User');
app.use(morganMiddleware);
  

//getting database connected

(async () => {
  await dbConnection();  
})();

// Routes setup
app.use('/api', userRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/api/faqs', faqRoutes);

app.use('/api/product', productsRoute);
app.use('/api/order', ordersRoute);
// Save Subscription to Database
app.post("/subscribe", async (req, res) => {
  const { userId, subscription } = req.body;

  if (!userId || !subscription) {
    return res.status(400).json({ error: "User ID and subscription data are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.subscription = subscription;
    await user.save();

    res.status(201).json({ message: "Subscription saved!" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


cron.schedule("* * * * *", () => { // Runs every 6 hours
  console.log("🔄 Adjusting product pricing...");
  adjustProductPricing();
});

webPush.setVapidDetails(
  "mailto:imaiwijekoon88@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});