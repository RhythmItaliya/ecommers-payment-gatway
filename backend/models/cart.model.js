const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalQuantity: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

cartSchema.pre('save', function(next) {
  if (this.items && Array.isArray(this.items) && this.items.length > 0) {
    this.totalQuantity = this.items.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);
    
    this.totalAmount = this.items.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return Math.round((total + itemTotal) * 100) / 100;
    }, 0);
  } else {
    this.totalQuantity = 0;
    this.totalAmount = 0;
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
