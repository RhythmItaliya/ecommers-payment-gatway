const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Contact = require('../models/contact.model');
const { uploadSingle, handleUploadError } = require('../middlewares/upload');
const { uploadImage } = require('../services/cloudinary.service');

// ===== AUTH ROUTES =====

// Login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'SnapShop Admin' });
});

// Login form submission
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check database for admin user
        const Admin = require('../models/admin.model');
        const admin = await Admin.findOne({ email: email });
        
        if (admin && await admin.comparePassword(password)) {
            req.session.isAdmin = true;
            req.session.adminId = admin._id;
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// ===== DASHBOARD ROUTES =====

// Dashboard main page
router.get('/dashboard', async (req, res) => {
    try {
        // Get counts with individual error handling
        let productCount = 0, userCount = 0, orderCount = 0, contactCount = 0;
        
        try {
            productCount = await Product.countDocuments();
        } catch (err) {
            console.error('Error counting products:', err);
        }
        
        try {
            userCount = await User.countDocuments();
        } catch (err) {
            console.error('Error counting users:', err);
        }
        
        try {
            orderCount = await Order.countDocuments();
        } catch (err) {
            console.error('Error counting orders:', err);
        }
        
        try {
            contactCount = await Contact.countDocuments();
        } catch (err) {
            console.error('Error counting contacts:', err);
        }
                
        res.render('dashboard/index', { 
            title: 'Admin Dashboard',
            currentPage: 'dashboard',
            productCount,
            userCount,
            orderCount,
            contactCount,
            layout: 'dashboard/layout'
        });
    } catch (error) {
        res.render('dashboard/index', { 
            title: 'Admin Dashboard',
            currentPage: 'dashboard',
            productCount: 0,
            userCount: 0,
            orderCount: 0,
            contactCount: 0,
            layout: 'dashboard/layout'
        });
    }
});

// ===== ORDERS PAGE =====

// Orders page
router.get('/dashboard/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'username firstName lastName email')
            .populate('items.productId', 'name price')
            .sort({ createdAt: -1 });
        
        res.render('dashboard/orders', { 
            title: 'Manage Orders',
            currentPage: 'orders',
            orders: orders || [],
            layout: 'dashboard/layout'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.render('dashboard/orders', { 
            title: 'Manage Orders',
            currentPage: 'orders',
            orders: [],
            layout: 'dashboard/layout'
        });
    }
});

// ===== CONTACT US PAGE =====

// Contact Us page
router.get('/dashboard/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        
        res.render('dashboard/contacts', { 
            title: 'Contact Us',
            currentPage: 'contacts',
            contacts: contacts || [],
            layout: 'dashboard/layout'
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.render('dashboard/contacts', { 
            title: 'Contact Us',
            currentPage: 'contacts',
            contacts: [],
            layout: 'dashboard/layout'
        });
    }
});

// ===== ORDERS API =====
// Note: Order API endpoints are now handled by separate order.routes.js
// GET /api/orders - Get all orders (for dashboard display)
// PATCH /api/orders/:orderId/status - Update order status

// ===== USERS PAGE =====

// Users page
router.get('/dashboard/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        
        // Get order count for each user
        const usersWithOrderCounts = await Promise.all(
            users.map(async (user) => {
                const orderCount = await Order.countDocuments({ userId: user._id });
                return {
                    ...user.toObject(),
                    orderCount
                };
            })
        );
        
        res.render('dashboard/users', { 
            title: 'Manage Users',
            currentPage: 'users',
            users: usersWithOrderCounts || [],
            layout: 'dashboard/layout'
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('dashboard/users', { 
            title: 'Manage Users',
            currentPage: 'users',
            users: [],
            layout: 'dashboard/layout'
        });
    }
});

// ===== USERS API =====

// Update user status
router.put('/api/users/:userId/status', async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;
        
        if (userId === undefined || isActive === undefined) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                userId: userId || 'undefined',
                isActive: isActive || 'undefined'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ 
            error: 'Failed to update user status',
            details: error.message 
        });
    }
});

// ===== PRODUCTS PAGE =====

// Products page
router.get('/dashboard/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('dashboard/products', { 
            title: 'Manage Products',
            currentPage: 'products',
            products: products || [],
            layout: 'dashboard/layout'
        });
    } catch (error) {
        res.render('dashboard/products', { 
            title: 'Manage Products',
            currentPage: 'products',
            products: [],
            layout: 'dashboard/layout'
        });
    }
});

// Add Product page
router.get('/dashboard/add-product', async (req, res) => {
    try {
        res.render('dashboard/add-product', { 
            title: 'Add Product',
            currentPage: 'products',
            layout: 'dashboard/layout'
        });
    } catch (error) {
        res.render('dashboard/add-product', { 
            title: 'Add Product',
            currentPage: 'products',
            layout: 'dashboard/layout'
        });
    }
});

// ===== USERS API =====

// Get all users with complete information (for dashboard display)
router.get('/api/users', async (req, res) => {
	try {
		// Aggregate order statistics by userId
		const orderStats = await Order.aggregate([
			{
				$group: {
					_id: '$userId',
					totalOrders: { $sum: 1 },
					cancelledOrders: {
						$sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
					},
					totalSpent: { $sum: { $ifNull: ['$totalAmount', 0] } },
					lastOrderDate: { $max: '$createdAt' }
				}
			}
		]);

		const statsByUserId = new Map();
		orderStats.forEach(s => {
			statsByUserId.set(String(s._id), {
				totalOrders: s.totalOrders || 0,
				cancelledOrders: s.cancelledOrders || 0,
				totalSpent: s.totalSpent || 0,
				lastOrderDate: s.lastOrderDate || null
			});
		});

		// Fetch users and merge with stats
		const users = await User.find()
			.select('username firstName lastName phone email createdAt')
			.sort({ createdAt: -1 });

		const usersWithStats = users.map(u => {
			const stats = statsByUserId.get(String(u._id)) || {
				totalOrders: 0,
				cancelledOrders: 0,
				totalSpent: 0,
				lastOrderDate: null
			};
			return {
				...u.toObject(),
				...stats
			};
		});

		res.json({ success: true, data: usersWithStats });
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ success: false, message: 'Failed to fetch users' });
	}
});

// ===== PRODUCTS API =====

// Create new product
router.post('/api/products', uploadSingle, handleUploadError, async (req, res) => {
    try {
        // Validate required fields
        const { name, description, category, price, highPrice, stock, sizes, colors, gender, discount } = req.body;
        
        if (!name || !description || !category || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, description, category, and gender are required'
            });
        }
        
        // Check if image file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Product image is required'
            });
        }

        // Parse and validate numeric fields
        const parsedPrice = parseFloat(price);
        const parsedHighPrice = parseFloat(highPrice);
        const parsedStock = parseInt(stock);
        const parsedDiscount = parseFloat(discount);

        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price value'
            });
        }

        if (isNaN(parsedHighPrice) || parsedHighPrice < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid high price value'
            });
        }

        if (isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stock value'
            });
        }

        if (isNaN(parsedDiscount) || parsedDiscount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid discount value'
            });
        }

        // Upload image to Cloudinary
        let imageUrl = '';
        if (req.file) {
            try {
                // Convert buffer to base64 for Cloudinary
                const base64Image = req.file.buffer.toString('base64');
                const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
                
                const uploadResult = await uploadImage(dataURI, 'snapshop/products');
                
                if (uploadResult.success) {
                    imageUrl = uploadResult.url;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Failed to upload image: ' + uploadResult.error
                    });
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'Failed to upload image to Cloudinary'
                });
            }
        }
        
        const productData = {
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            price: parsedPrice,
            highPrice: parsedHighPrice,
            stock: parsedStock,
            image: imageUrl,
            sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes || '[]'),
            colors: Array.isArray(colors) ? colors : JSON.parse(colors || '[]'),
            gender: gender.trim(),
            discount: parsedDiscount
        };
        
        // Create new product
        const product = new Product(productData);
        await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product: ' + error.message
        });
    }
});

// Delete product
router.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Find the product first to get the image URL
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Delete the product from database
        await Product.findByIdAndDelete(productId);
        
        // TODO: If you want to delete from Cloudinary too, uncomment this:
        // if (product.image && product.image.includes('cloudinary.com')) {
        //     const publicId = extractPublicIdFromUrl(product.image);
        //     await deleteImage(publicId);
        // }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product: ' + error.message
        });
    }
});

// ===== USERS API =====

// ===== CONTACTS API =====
// Note: Contact management APIs removed - not needed for simple dashboard display

// Update contact status
router.patch('/api/contacts/:contactId/status', async (req, res) => {
    try {
        const { contactId } = req.params;
        const { status } = req.body;
        
        if (!status || !['pending', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid status. Must be pending, read, or replied'
            });
        }
        
        const contact = await Contact.findByIdAndUpdate(
            contactId,
            { status },
            { new: true }
        );
        
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
        console.error('Error updating contact status:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update contact status',
            details: error.message 
        });
    }
});

module.exports = router;
