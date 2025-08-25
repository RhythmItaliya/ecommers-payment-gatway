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

// Product Management API (protected)
router.get('/products', verifyAdminToken, checkPermission('products'), adminController.getProducts);
router.post('/products', verifyAdminToken, checkPermission('products'), adminController.createProduct);
router.put('/products/:productId', verifyAdminToken, checkPermission('products'), adminController.updateProduct);
router.delete('/products/:productId', verifyAdminToken, checkPermission('products'), adminController.deleteProduct);

// System Settings API (protected)
router.get('/settings', verifyAdminToken, checkPermission('settings'), adminController.getSettings);

// Contact Management API (protected)
router.get('/contacts', verifyAdminToken, checkPermission('contacts'), adminController.getContacts);
router.get('/contacts/:contactId', verifyAdminToken, checkPermission('contacts'), adminController.getContactDetails);
router.put('/contacts/:contactId/status', verifyAdminToken, checkPermission('contacts'), adminController.updateContactStatus);
router.delete('/contacts/:contactId', verifyAdminToken, checkPermission('contacts'), adminController.deleteContact);

module.exports = router;
