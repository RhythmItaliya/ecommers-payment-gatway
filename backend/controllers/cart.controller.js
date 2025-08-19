const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// Get user's cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      // Create empty cart if none exists
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    res.json({
      success: true,
      data: cart.items,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Validate product exists - first try to find by id field, then by _id
    let product = await Product.findOne({ id: parseInt(productId) });
    if (!product) {
      // Try to find by _id if the productId is an ObjectId
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      }
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create new cart if none exists
      cart = new Cart({ userId, items: [] });
    }
    
    // Check if product already exists in cart
    const existingItem = cart.items.find(
      item => item.productId.toString() === product._id.toString()
    );
    
    if (existingItem) {
      // Update quantity if product already exists
      existingItem.quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({
        productId: product._id,
        quantity,
        price: product.price
      });
    }
    
    await cart.save();
    
    // Populate product details
    await cart.populate('items.productId');
    
    res.json({
      success: true,
      message: 'Product added to cart',
      data: cart.items,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // First try to find product by id field, then by _id
    let product = await Product.findOne({ id: parseInt(productId) });
    if (!product) {
      // Try to find by _id if the productId is an ObjectId
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      }
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Find and update the item
    const item = cart.items.find(
      item => item.productId.toString() === product._id.toString()
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    // Populate product details
    await cart.populate('items.productId');
    
    res.json({
      success: true,
      message: 'Cart item quantity updated',
      data: cart.items,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item quantity',
      error: error.message
    });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // First try to find product by id field, then by _id
    let product = await Product.findOne({ id: parseInt(productId) });
    if (!product) {
      // Try to find by _id if the productId is an ObjectId
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      }
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Remove product from cart
    cart.items = cart.items.filter(
      item => item.productId.toString() !== product._id.toString()
    );
    
    await cart.save();
    
    // Populate product details
    await cart.populate('items.productId');
    
    res.json({
      success: true,
      message: 'Product removed from cart',
      data: cart.items,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from cart',
      error: error.message
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      data: [],
      totalQuantity: 0,
      totalAmount: 0
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};
