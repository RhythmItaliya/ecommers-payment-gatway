const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/directPay.controller');

router.post('/api/payment-intent', paymentController.createPaymentIntent);
router.get('/api/payment-status/:paymentIntentId', paymentController.checkPaymentStatus);

module.exports = router;
