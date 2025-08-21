const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/directPay.controller');

router.post('/payment-intent', paymentController.createPaymentIntent);
router.get('/payment-status/:paymentIntentId', paymentController.checkPaymentStatus);

module.exports = router;
