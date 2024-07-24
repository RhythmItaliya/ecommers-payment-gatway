require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const currency = require('currency.js');

exports.createPaymentIntent = async (req, res) => {
    const { payment_method_id, amount } = req.body;

    if (!payment_method_id || !amount) {
        return res.status(400).json({ message: 'Payment method ID and amount are required' });
    }

    try {
        const amountInCents = currency(amount, { fromCents: false }).intValue;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            payment_method: payment_method_id,
            confirm: true,
            return_url: 'http://localhost:3000/success',
            description: 'Description of the transaction'
        });

        console.log("🚀 ~ checkOutCard ~ paymentIntent:", paymentIntent);

        res.json({
            success: true,
            paymentIntentId: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            status: paymentIntent.status,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
    }
};
