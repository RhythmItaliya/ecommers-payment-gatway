const mongoose = require('mongoose');

// const paymentMethodSchema = new mongoose.Schema({
//     customerId: { type: String, required: true }, // ID of the customer associated with the payment method
//     paymentMethodId: { type: String, required: true }, // ID of the saved payment method
//     cardBrand: String,
//     last4: String,
//     exp_month: Number,
//     exp_year: Number,
//     // Add more fields as needed
// });

const paymentMethodSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    paymentMethodId: { type: String, required: true },
    cardBrand: { type: String, enum: ['Visa', 'MasterCard', 'American Express', 'Discover'], default: 'Visa' },
    last4: { type: String, validate: [last4Validator, 'Invalid last 4 digits'], length: 4 },
    exp_month: { type: Number, min: 1, max: 12 },
    exp_year: { type: Number, min: new Date().getFullYear() },
}, { timestamps: true });

function last4Validator(value) {
    return /^\d{4}$/.test(value);
}

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;