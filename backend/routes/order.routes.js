const express = require('express');
const router = express.Router();
const { protectedRoute } = require('../middlewares/protectedRoute');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order.controller');

// Protected routes - require authentication
router.use(protectedRoute);

// Create a new order
router.post('/create', createOrder);

// Get user's orders with optional filtering
router.get('/my-orders', getUserOrders);

// Get specific order by ID
router.get('/:orderId', getOrderById);

// Cancel order
router.patch('/:orderId/cancel', cancelOrder);

// Update order status (admin only - you can add admin middleware here)
router.patch('/:orderId/status', updateOrderStatus);

module.exports = router;
