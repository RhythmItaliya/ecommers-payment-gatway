const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const PaymentMethod = require('../models/paymentMethod.model');
const Product = require('../models/product.model');
const Contact = require('../models/contact.model');
const config = require('../config/config');

// Admin Dashboard API
const getDashboard = async (req, res) => {
    try {
        // Get basic statistics
        const totalUsers = await User.countDocuments();
        const totalCarts = await Cart.countDocuments();
        const totalPaymentMethods = await PaymentMethod.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalContacts = await Contact.countDocuments();
        const pendingContacts = await Contact.countDocuments({ status: 'pending' });

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

        // Get recent products
        const recentProducts = await Product.find()
            .select('title price category createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent contacts
        const recentContacts = await Contact.find()
            .select('name email status createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalCarts,
                    totalPaymentMethods,
                    totalProducts,
                    totalContacts,
                    pendingContacts
                },
                recentUsers,
                recentCarts,
                recentProducts,
                recentContacts
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

// Product Management API
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .select('id title name price category stock createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load products'
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        
        // Generate unique ID
        const lastProduct = await Product.findOne().sort({ id: -1 });
        productData.id = lastProduct ? lastProduct.id + 1 : 1;
        
        // Ensure required fields
        if (!productData.title || !productData.price || !productData.category) {
            return res.status(400).json({
                success: false,
                message: 'Title, price, and category are required'
            });
        }

        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;

        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findByIdAndDelete(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
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
                    NODE_ENV: config.nodeEnv,
                    PORT: config.port,
                    MONGODB_URI: config.mongoUri ? 'Configured' : 'Not Configured',
                    RAZORPAY_KEY_ID: config.razorpay.keyId ? 'Configured' : 'Not Configured',
            
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

// Contact Management API
const getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const query = {};
        if (status && ['pending', 'read', 'replied'].includes(status)) {
            query.status = status;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await Contact.countDocuments(query);

        res.json({
            success: true,
            data: contacts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalContacts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
};

const getContactDetails = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId).select('-__v');
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact'
        });
    }
};

const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, read, or replied'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.contactId,
            { status },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });

    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status'
        });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.contactId);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });

    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact'
        });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    getUserDetails,
    getOrders,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSettings,
    deleteUser,
    updateUserStatus,
    getContacts,
    getContactDetails,
    updateContactStatus,
    deleteContact
};
