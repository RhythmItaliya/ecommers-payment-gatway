const express = require('express');
const { default: mongoose } = require('mongoose');
const products = require('./products')
const cors = require('cors');
const PaymentMethod = require('./models/paymentMethod.model');
const { userRouter } = require('./routes/user.routes');
const cartRoutes = require('./routes/cart.routes');
const stripeRouter = require('./routes/payment.routes');
const paymentRoutes = require('./routes/directPay.routes');
const { verifyUser } = require('./middlewares/verify');
const { protectedRoute } = require('./middlewares/protectedRoute')

const dotenv = require('dotenv').config({ path: "./.env" })
const stripe = require('stripe')(process.env.STRIPE_KEY)

const PORT = 8000;

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true,
}))

const connectionMongodb = async () => {
    // mongodb+srv://webdev826:webdev123@stripe.gsb95ua.mongodb.net/?retryWrites=true&w=majority&appName=Stripe
    await mongoose.connect('mongodb://localhost:27017/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

connectionMongodb().then(() => app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})).catch(() => console.log("Connection is not established!"))

app.use('/api/user', userRouter)
app.use('/api/cart', cartRoutes)
app.use(paymentRoutes);

app.use(verifyUser)
app.use('/api/stripe', stripeRouter)

app.get('/api/protect', protectedRoute, (req, res) => {
    res.send(`This is a protected endpoint. Welcome, ${req.user.username}!`);
});

app.get('/products', (req, res) => {
    res.send(products)
})


