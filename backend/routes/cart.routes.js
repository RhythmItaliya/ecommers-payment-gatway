const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verify');
const {
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');

// All routes require authentication
router.use(verifyToken);

// Get user's cart
router.get('/', getUserCart);

// Add product to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/update/:productId', updateCartItemQuantity);

// Remove product from cart
router.delete('/remove/:productId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

module.exports = router;
