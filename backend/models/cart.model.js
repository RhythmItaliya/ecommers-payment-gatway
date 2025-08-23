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

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  console.log('Cart pre-save hook - items:', this.items);
  
  this.totalQuantity = this.items.reduce((total, item) => {
    console.log('Item in pre-save:', item);
    return total + item.quantity;
  }, 0);
  
  this.totalAmount = this.items.reduce((total, item) => {
    console.log('Calculating total for item:', item, 'price:', item.price, 'quantity:', item.quantity);
    return total + (item.price * item.quantity);
  }, 0);
  
  console.log('Calculated totals - quantity:', this.totalQuantity, 'amount:', this.totalAmount);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
