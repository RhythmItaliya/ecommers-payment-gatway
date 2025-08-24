const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
    id: { type: String, required: true },
    brand: String,
    last4: { type: Number, required: true },
    exp_month: { type: Number, required: true },
    fingerprint: { type: String},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exp_year: Number,
    customer: String,
    country: String,
    name: String
})

const Card = mongoose.model('Card', cardSchema);


module.exports = Card;