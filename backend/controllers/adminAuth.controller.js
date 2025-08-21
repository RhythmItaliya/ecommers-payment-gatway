const Admin = require('../models/admin.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find admin by username
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (admin.isLocked()) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to too many failed attempts'
            });
        }

        // Check if account is active
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        
        if (!isPasswordValid) {
            // Increment login attempts
            await admin.incLoginAttempts();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Reset login attempts on successful login
        await admin.resetLoginAttempts();
        
        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const secret = config.jwtSecret;
        
        const token = jwt.sign(
            { 
                adminId: admin._id, 
                username: admin.username, 
                role: admin.role,
                permissions: admin.permissions
            },
            secret,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create default admin (for first time setup)
const createDefaultAdmin = async () => {
    try {
        const adminCount = await Admin.countDocuments();
        
        if (adminCount === 0) {
            const defaultAdmin = new Admin({
                        username: config.admin.username,
        email: config.admin.email,
        password: config.admin.password,
        role: config.admin.role,
        permissions: config.admin.permissions
            });

            await defaultAdmin.save();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
        return false;
    }
};

// Verify admin token middleware
const verifyAdminToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const secret = config.jwtSecret;
        const decoded = jwt.verify(token, secret);
        
        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Admin token verification failed:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Check admin permissions middleware
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.admin.role === 'super_admin') {
            return next(); // Super admin has all permissions
        }

        if (req.admin.permissions[permission]) {
            return next();
        }

        res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
        });
    };
};

// Get admin configuration status
const getAdminConfig = () => {
    return {
        username: config.admin.username,
        email: config.admin.email,
        password: config.admin.password ? '✅ Set' : '❌ Not set (using default: admin123)',
        role: config.admin.role,
        permissions: config.admin.permissions
    };
};

module.exports = {
    adminLogin,
    createDefaultAdmin,
    verifyAdminToken,
    checkPermission,
    getAdminConfig
};
