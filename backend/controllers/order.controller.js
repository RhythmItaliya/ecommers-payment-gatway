const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Create a new order from cart
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, paymentId, shippingAddress } = req.body;

    if (!paymentMethod || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Payment method and shipping address are required'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity || 1,
      price: item.price || 0
    }));

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      paymentMethod,
      paymentId,
      status: 'placed'
    });

    await order.save();

    // Clear the cart after successful order creation
    // Use updateOne to avoid triggering pre-save hooks
    await Cart.updateOne(
      { userId },
      { 
        $set: { 
          items: [], 
          totalQuantity: 0, 
          totalAmount: 0 
        } 
      }
    );

    // Populate product details for response
    await order.populate('items.productId');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(query);

    res.json({
      success: true,
      orders: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get specific order by ID
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, userId }).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, estimatedDelivery, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
    if (notes) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        notes: order.notes,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow cancellation of orders that haven't been shipped
    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has already been shipped or delivered'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
