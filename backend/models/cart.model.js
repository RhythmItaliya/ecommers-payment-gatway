const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the CartItem schema
const CartItemSchema = new Schema({
    productId: {
        type: Number,
        ref: 'Product',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    }
}, { _id: false });

// Define the Cart schema
const CartSchema = new Schema({
    customer_id: {
        type: String,
        required: true
    },
    items: [CartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
