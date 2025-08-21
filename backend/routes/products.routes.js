const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

// Get all products with filtering, sorting, and pagination
router.get('/', productsController.getAllProducts);

// Get single product by ID
router.get('/:id', productsController.getProductById);

// Get products by category
router.get('/category/:category', productsController.getProductsByCategory);

// Search products
router.get('/search', productsController.searchProducts);

module.exports = router;
