const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
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

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(async () => {
    await createDefaultAdmin();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/razorpay', require('./routes/razorpay.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/contact', require('./routes/contact.routes'));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.use('/', require('./routes/admin.routes'));

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Admin dashboard: http://localhost:${PORT}`);
});