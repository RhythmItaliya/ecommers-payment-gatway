const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay lazily
let razorpay = null;

const initializeRazorpay = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required');
        }
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpay;
};

// Create Razorpay order
const createOrder = async (req, res) => {
    try {
        const razorpayInstance = initializeRazorpay();
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount || !receipt) {
            return res.status(400).json({
                success: false,
                message: 'Amount and receipt are required'
            });
        }

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: currency,
            receipt: receipt,
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            }
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Verify Razorpay payment
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification parameters'
            });
        }

        // Create signature for verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        // Verify signature
        console.log('Signature verification details:', {
            received_signature: razorpay_signature,
            expected_signature: expectedSignature,
            body: body,
            key_secret_length: process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 'undefined'
        });
        
        if (expectedSignature === razorpay_signature) {
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature',
                debug: {
                    received: razorpay_signature,
                    expected: expectedSignature
                }
            });
        }
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
};

// Get Razorpay payment details
const getPaymentDetails = async (req, res) => {
    try {
        const razorpayInstance = initializeRazorpay();
        const { payment_id } = req.params;

        if (!payment_id) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required'
            });
        }

        const payment = await razorpayInstance.payments.fetch(payment_id);

        res.status(200).json({
            success: true,
            payment: {
                id: payment.id,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                created_at: payment.created_at
            }
        });
    } catch (error) {
        console.error('Error fetching Razorpay payment details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment details',
            error: error.message
        });
    }
};

// Create payment intent (for compatibility with existing frontend)
const createPaymentIntent = async (req, res) => {
    try {
        const razorpayInstance = initializeRazorpay();
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            client_secret: order.id, // Using order ID as client secret for compatibility
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Error creating Razorpay payment intent:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment intent',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getPaymentDetails,
    createPaymentIntent
};
