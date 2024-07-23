const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/get', cartController.getCart);
router.post('/add', cartController.addOrUpdateCart);
router.delete('/remove/:id', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
