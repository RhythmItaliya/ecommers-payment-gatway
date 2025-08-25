const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { verifyAdminToken, checkPermission } = require('../controllers/adminAuth.controller');

// Public route - Submit contact form
router.post('/submit', contactController.submitContact);

// Admin routes - Protected
router.get('/all', verifyAdminToken, checkPermission('contacts'), contactController.getAllContacts);
router.get('/:id', verifyAdminToken, checkPermission('contacts'), contactController.getContactById);
router.put('/:id/status', verifyAdminToken, checkPermission('contacts'), contactController.updateContactStatus);
router.delete('/:id', verifyAdminToken, checkPermission('contacts'), contactController.deleteContact);

module.exports = router;
