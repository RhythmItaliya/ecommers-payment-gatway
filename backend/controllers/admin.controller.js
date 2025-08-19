const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const PaymentMethod = require('../models/paymentMethod.model');

// Admin Dashboard API
const getDashboard = async (req, res) => {
    try {
        // Get basic statistics
        const totalUsers = await User.countDocuments();
        const totalCarts = await Cart.countDocuments();
        const totalPaymentMethods = await PaymentMethod.countDocuments();

        // Get recent users
        const recentUsers = await User.find()
            .select('username email createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent carts
        const recentCarts = await Cart.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalCarts,
                    totalPaymentMethods
                },
                recentUsers,
                recentCarts
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard'
        });
    }
};

// Users Management API
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('username email createdAt lastLogin')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    limit,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load users'
        });
    }
};

// User Details API
const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist'
            });
        }

        // Get user's cart
        const userCart = await Cart.findOne({ userId }).populate('items.productId');

        res.json({
            success: true,
            data: {
                user,
                cart: userCart
            }
        });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load user details'
        });
    }
};

// Orders Management API
const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const carts = await Cart.find()
            .populate('userId', 'username email')
            .populate('items.productId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Cart.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        res.json({
            success: true,
            data: {
                orders: carts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders,
                    limit,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load orders'
        });
    }
};

// System Settings API
const getSettings = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                env: {
                    NODE_ENV: process.env.NODE_ENV || 'development',
                    PORT: process.env.PORT || 8000,
                    MONGODB_URI: process.env.MONGODB_URI ? 'Configured' : 'Not Configured',
                    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not Configured',
                    STRIPE_KEY: process.env.STRIPE_KEY ? 'Configured' : 'Not Configured'
                }
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load settings'
        });
    }
};

// Delete User API
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        await Cart.findOneAndDelete({ userId });
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
};

// Update User Status API
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        
        await User.findByIdAndUpdate(userId, { status });
        res.json({ success: true, message: 'User status updated' });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ success: false, message: 'Failed to update user status' });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    getUserDetails,
    getOrders,
    getSettings,
    deleteUser,
    updateUserStatus
};
