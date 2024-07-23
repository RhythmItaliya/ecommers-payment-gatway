const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/directPay.controller');

router.post('/api/payment-intent', paymentController.createPaymentIntent);

module.exports = router;
