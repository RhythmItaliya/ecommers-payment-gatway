const Wishlist = require('../models/wishlist.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// Get user's wishlist
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let wishlist = await Wishlist.findOne({ userId }).populate('products.productId');
    
    if (!wishlist) {
      // Create empty wishlist if none exists
      wishlist = new Wishlist({ userId, products: [] });
      await wishlist.save();
    }
    
    // Transform the data to match frontend expectations
    const transformedProducts = wishlist.products.map(item => ({
      ...item.productId.toObject(),
      wishlistItemId: item._id,
      addedAt: item.addedAt
    }));
    
    res.json({
      success: true,
      data: transformedProducts,
      totalItems: wishlist.products.length
    });
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist',
      error: error.message
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    
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
    
    let wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      // Create new wishlist if none exists
      wishlist = new Wishlist({ userId, products: [] });
    }
    
    // Check if product already exists in wishlist
    const existingProduct = wishlist.products.find(
      item => item.productId.toString() === product._id.toString()
    );
    
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }
    
    // Add product to wishlist
    wishlist.products.push({ productId: product._id });
    await wishlist.save();
    
    // Populate product details
    await wishlist.populate('products.productId');
    
    // Transform the data to match frontend expectations
    const transformedProducts = wishlist.products.map(item => ({
      ...item.productId.toObject(),
      wishlistItemId: item._id,
      addedAt: item.addedAt
    }));
    
    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: transformedProducts,
      totalItems: wishlist.products.length
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist',
      error: error.message
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
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
    
    // Remove product from wishlist using the product's _id
    wishlist.products = wishlist.products.filter(
      item => item.productId.toString() !== product._id.toString()
    );
    
    await wishlist.save();
    
    // Populate product details
    await wishlist.populate('products.productId');
    
    // Transform the data to match frontend expectations
    const transformedProducts = wishlist.products.map(item => ({
      ...item.productId.toObject(),
      wishlistItemId: item._id,
      addedAt: item.addedAt
    }));
    
    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: transformedProducts,
      totalItems: wishlist.products.length
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist',
      error: error.message
    });
  }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }
    
    wishlist.products = [];
    await wishlist.save();
    
    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: [],
      totalItems: 0
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message
    });
  }
};

// Check if product is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      return res.json({
        success: true,
        isInWishlist: false
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
      return res.json({
        success: true,
        isInWishlist: false
      });
    }
    
    const isInWishlist = wishlist.products.some(
      item => item.productId.toString() === product._id.toString()
    );
    
    res.json({
      success: true,
      isInWishlist
    });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status',
      error: error.message
    });
  }
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus
};
