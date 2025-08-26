const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

// Initialize Razorpay lazily
let razorpay = null;

// Helper function to create order from successful payment
const createOrderFromPayment = async (userId, paymentId, paymentMethod) => {
    try {
        
        // Get user's cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error('Cart is empty or invalid');
        }

        // Prepare order items with minimal required fields
        const orderItems = cart.items.map((item, index) => {
            
            if (!item || !item.productId) {
                throw new Error(`Invalid cart item or product data at index ${index}`);
            }
            
            return {
                productId: item.productId._id,
                quantity: item.quantity || 1,
                price: item.price || 0
            };
        });

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
        return order;
    } catch (error) {
        console.error('Error creating order from payment:', error);
        throw error;
    }
};

const initializeRazorpay = () => {
    if (!razorpay) {
        
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required');
        }
        
        // Trim any whitespace from the keys
        const keyId = process.env.RAZORPAY_KEY_ID.trim();
        const keySecret = process.env.RAZORPAY_KEY_SECRET.trim();
        
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
        const razorpayInstance = initializeRazorpay();
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

        // Round amount to 2 decimal places and convert to paise (integer)
        const roundedAmount = Math.round(amount * 100);
        
        const options = {
            amount: roundedAmount, // Razorpay expects amount in paise (integer)
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
        
        if (expectedSignature === razorpay_signature) {
            
            // Create order after successful payment verification
            try {
                const order = await createOrderFromPayment(req.user.id, razorpay_payment_id, 'razorpay');
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
                message: 'Invalid signature'
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

        // Round amount to 2 decimal places and convert to paise (integer)
        const roundedAmount = Math.round(amount * 100);
        
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
