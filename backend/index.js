const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createDefaultAdmin } = require('./controllers/adminAuth.controller');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Create default admin after successful connection
    await createDefaultAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/admin/auth', require('./routes/adminAuth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/cart', require('./routes/cart.routes'));

app.use('/api/razorpay', require('./routes/razorpay.routes'));

app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/contact', require('./routes/contact.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SnapShop Backend is running' });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
  console.log(`Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`User API: http://localhost:${PORT}/api/user`);
  console.log(`Cart API: http://localhost:${PORT}/api/cart`);
  console.log(`Razorpay API: http://localhost:${PORT}/api/razorpay`);
  console.log(`Wishlist API: http://localhost:${PORT}/api/wishlist`);
  console.log(`Upload API: http://localhost:${PORT}/api/upload`);
  console.log(`Cloudinary: ${config.cloudinary.cloudName} (${config.cloudinary.folder})`);
});