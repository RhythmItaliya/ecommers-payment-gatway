// Configuration file for the backend
require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/snapshop',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'ds9ufpxom',
    apiKey: process.env.CLOUDINARY_API_KEY || '819183193299387',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'OIldsEhVgMuBOJc0lq45HHR7kRU',
    folder: process.env.CLOUDINARY_FOLDER || 'snakshop'
  },
  
  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Payment Gateway Keys
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id_here',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret_here'
  },
  
  // Admin Configuration
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@snapshop.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: process.env.ADMIN_ROLE || 'super_admin',
    permissions: {
      users: process.env.ADMIN_PERMISSION_USERS !== 'false',
      orders: process.env.ADMIN_PERMISSION_ORDERS !== 'false',
      products: process.env.ADMIN_PERMISSION_PRODUCTS !== 'false',
      payments: process.env.ADMIN_PERMISSION_PAYMENTS !== 'false',
      settings: process.env.ADMIN_PERMISSION_SETTINGS !== 'false',
      contacts: process.env.ADMIN_PERMISSION_CONTACTS !== 'false'
    }
  }
};

module.exports = config;
