const Cart = require('../models/cart.model');

// Add or update cart items
const addOrUpdateCart = async (req, res) => {
    const { customer_id, items } = req.body;
    if (!customer_id) {
        return res.status(400).json({ message: 'customer_id is required' });
    }
    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'items must be an array' });
    }
    try {
        let cart = await Cart.findOne({ customer_id });
        if (cart) {
            // Update existing cart
            cart.items = items;
        } else {
            // Create new cart
            cart = new Cart({ customer_id, items });
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
    const { id } = req.params;
    const { customer_id } = req.body;

    if (!customer_id || !id) {
        return res.status(400).json({ message: 'customer_id and id are required' });
    }

    try {
        const cart = await Cart.findOne({ customer_id });

        if (cart) {
            cart.items = cart.items.filter(item => item.productId.toString() !== id);
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Clear the cart
const clearCart = async (req, res) => {
    const { customer_id } = req.query;
    if (!customer_id) {
        return res.status(400).json({ message: 'customer_id is required' });
    }
    try {
        const cart = await Cart.findOne({ customer_id });

        if (cart) {
            cart.items = [];
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getCart = async (req, res) => {
    const { customer_id } = req.query;
    if (!customer_id) {
        return res.status(400).json({ message: 'customer_id is required' });
    }
    try {
        const cart = await Cart.findOne({ customer_id });

        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    addOrUpdateCart,
    removeFromCart,
    clearCart,
    getCart,
};
