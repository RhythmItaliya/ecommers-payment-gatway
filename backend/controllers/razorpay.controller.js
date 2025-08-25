const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

// Initialize Razorpay lazily
let razorpay = null;

// Helper function to create order from successful payment
const createOrderFromPayment = async (userId, paymentId, paymentMethod) => {
    try {
        console.log(`Starting createOrderFromPayment for user ${userId} with payment ${paymentId}`);
        
        // Get user's cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        console.log('Cart data retrieved:', {
            cartExists: !!cart,
            cartItemsLength: cart ? cart.items.length : 'N/A',
            cartItems: cart ? cart.items.map(item => ({
                hasProductId: !!item.productId,
                productIdType: item.productId ? typeof item.productId : 'N/A',
                productIdValue: item.productId ? item.productId._id : 'N/A',
                quantity: item.quantity,
                price: item.price
            })) : 'N/A'
        });
        
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error('Cart is empty or invalid');
        }

        // Prepare order items with minimal required fields
        const orderItems = cart.items.map((item, index) => {
            console.log(`Processing cart item ${index}:`, {
                item: item,
                hasProductId: !!item.productId,
                productId: item.productId ? item.productId._id : 'N/A'
            });
            
            if (!item || !item.productId) {
                throw new Error(`Invalid cart item or product data at index ${index}`);
            }
            
            return {
                productId: item.productId._id,
                quantity: item.quantity || 1,
                price: item.price || 0
            };
        });

        console.log('Order items prepared:', orderItems);

        // Create order
        const order = new Order({
            userId,
            items: orderItems,
            totalAmount: cart.totalAmount || 0,
            paymentMethod,
            paymentId,
            status: 'placed',
            paymentStatus: 'completed'
        });

        await order.save();

        console.log(`Order saved successfully with ID: ${order._id}`);

        // Clear the cart after successful order creation
        // Use updateOne to avoid triggering pre-save hooks
        await Cart.updateOne(
            { userId },
            { 
                $set: { 
                    items: [], 
                    totalQuantity: 0, 
                    totalAmount: 0 
                } 
            }
        );

        console.log(`Cart cleared for user ${userId}`);

        console.log(`Order created successfully for user ${userId} with payment ${paymentId}`);
        return order;
    } catch (error) {
        console.error('Error creating order from payment:', error);
        throw error;
    }
};

const initializeRazorpay = () => {
    if (!razorpay) {
        console.log('Environment variables check:', {
            RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not Set',
            RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not Set',
            KEY_ID_LENGTH: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.length : 0,
            KEY_SECRET_LENGTH: process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 0
        });
        
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required');
        }
        
        // Trim any whitespace from the keys
        const keyId = process.env.RAZORPAY_KEY_ID.trim();
        const keySecret = process.env.RAZORPAY_KEY_SECRET.trim();
        
        console.log('Initializing Razorpay with keys:', {
            keyId: keyId.substring(0, 10) + '...',
            keySecret: keySecret.substring(0, 10) + '...'
        });
        
        razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });
    }
    return razorpay;
};

// Create Razorpay order
const createOrder = async (req, res) => {
    try {
        console.log('Starting createOrder function...');
        const razorpayInstance = initializeRazorpay();
        console.log('Razorpay instance initialized successfully');
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount || !receipt) {
            return res.status(400).json({
                success: false,
                message: 'Amount and receipt are required'
            });
        }

        // Validate amount is a positive number
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }

        console.log('Creating Razorpay order with amount:', amount, 'currency:', currency);

        // Round amount to 2 decimal places and convert to paise (integer)
        const roundedAmount = Math.round(amount * 100);
        
        console.log('Amount conversion - Original:', amount, 'Rounded to paise:', roundedAmount);
        
        const options = {
            amount: roundedAmount, // Razorpay expects amount in paise (integer)
            currency: currency,
            receipt: receipt,
            payment_capture: 1
        };

        console.log('Razorpay order options:', options);
        console.log('About to call Razorpay API...');
        
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
            console.log('Payment signature verified successfully');
            
            // Create order after successful payment verification
            try {
                console.log('Attempting to create order from payment...');
                const order = await createOrderFromPayment(req.user.id, razorpay_payment_id, 'razorpay');
                console.log('Order created successfully:', order._id);
            } catch (orderError) {
                console.error('Error creating order after payment:', orderError);
                // Don't fail the payment verification if order creation fails
            }
            
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

        // Validate amount is a positive number
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }

        console.log('Creating Razorpay payment intent with amount:', amount, 'currency:', currency);

        // Round amount to 2 decimal places and convert to paise (integer)
        const roundedAmount = Math.round(amount * 100);
        
        console.log('Payment intent amount conversion - Original:', amount, 'Rounded to paise:', roundedAmount);
        
        const options = {
            amount: roundedAmount, // Razorpay expects amount in paise (integer)
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
