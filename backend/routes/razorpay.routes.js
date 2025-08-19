const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/razorpay.controller');
const { protectedRoute } = require('../middlewares/protectedRoute');

// Create Razorpay order
router.post('/create-order', protectedRoute, razorpayController.createOrder);

// Verify Razorpay payment
router.post('/verify-payment', protectedRoute, razorpayController.verifyPayment);

// Get payment details
router.get('/payment/:payment_id', protectedRoute, razorpayController.getPaymentDetails);

// Create payment intent (for compatibility)
router.post('/payment-intent', protectedRoute, razorpayController.createPaymentIntent);

module.exports = router;
