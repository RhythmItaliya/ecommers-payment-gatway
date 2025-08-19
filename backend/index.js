const express = require('express');
const { products } = require('./products')
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product.model');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snapshop')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/admin/auth', require('./routes/adminAuth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/razorpay', require('./routes/razorpay.routes'));
app.use('/api/direct-pay', require('./routes/directPay.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));

// Products route - serve from database instead of static file
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ id: 1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to static products if database fails
    res.json(products);
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SnapShop Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`User API: http://localhost:${PORT}/api/user`);
  console.log(`Cart API: http://localhost:${PORT}/api/cart`);
  console.log(`Wishlist API: http://localhost:${PORT}/api/wishlist`);
});