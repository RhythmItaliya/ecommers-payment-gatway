const express = require('express');
const router = express.Router();
const { protectedRoute } = require('../middlewares/protectedRoute');
const Order = require('../models/order.model');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order.controller');

// Get all orders (public - for admin dashboard display)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.productId', 'name price')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Create a new order (protected)
router.post('/create', protectedRoute, createOrder);

// Get user's orders with optional filtering (protected)
router.get('/my-orders', protectedRoute, getUserOrders);

// Get specific order by ID (protected)
router.get('/:orderId', protectedRoute, getOrderById);

// Cancel order (protected)
router.patch('/:orderId/cancel', protectedRoute, cancelOrder);

// Update order status (public - no authentication required for admin dashboard)
router.post('/:orderId/status', updateOrderStatus);

module.exports = router;
