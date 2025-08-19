const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuth.controller');

// Admin Login API
router.post('/login', adminAuthController.adminLogin);

// Admin Logout API
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// Admin Configuration Status (public - no auth required)
router.get('/config', (req, res) => {
    const { getAdminConfig } = require('../controllers/adminAuth.controller');
    const config = getAdminConfig();
    res.json({
        success: true,
        message: 'Admin configuration status',
        config,
        loginUrl: '/admin/auth/login',
        dashboardUrl: '/admin/dashboard'
    });
});

module.exports = router;
