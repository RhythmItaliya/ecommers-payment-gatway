const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  higePrice: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  colors: [{
    type: String,
    required: true
  }],
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    required: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
