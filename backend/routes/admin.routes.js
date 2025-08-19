const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyAdminToken, checkPermission } = require('../controllers/adminAuth.controller');

// Admin Dashboard API (protected)
router.get('/dashboard', verifyAdminToken, adminController.getDashboard);

// Users Management API (protected)
router.get('/users', verifyAdminToken, checkPermission('users'), adminController.getUsers);
router.get('/users/:userId', verifyAdminToken, checkPermission('users'), adminController.getUserDetails);
router.delete('/users/:userId', verifyAdminToken, checkPermission('users'), adminController.deleteUser);
router.put('/users/:userId/status', verifyAdminToken, checkPermission('users'), adminController.updateUserStatus);

// Orders Management API (protected)
router.get('/orders', verifyAdminToken, checkPermission('orders'), adminController.getOrders);

// System Settings API (protected)
router.get('/settings', verifyAdminToken, checkPermission('settings'), adminController.getSettings);

module.exports = router;
