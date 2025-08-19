const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verify');
const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus
} = require('../controllers/wishlist.controller');

// All routes require authentication
router.use(verifyToken);

// Get user's wishlist
router.get('/', getUserWishlist);

// Add product to wishlist
router.post('/add', addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', removeFromWishlist);

// Clear entire wishlist
router.delete('/clear', clearWishlist);

// Check if product is in wishlist
router.get('/check/:productId', checkWishlistStatus);

module.exports = router;
