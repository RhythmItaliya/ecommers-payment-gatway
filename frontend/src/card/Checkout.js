import React, { useState, useEffect } from "react";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart } from '../redux/cartAction';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckOutItem from './CheckOutItem';
import ExitCard from './ExitCard';
import { AddCard } from './AddCard';
import RazorpayPayment from './RazorpayPayment';
import { formatINRPrice, convertUSDToINR } from '../utils/currency';

export const Checkout = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Default to Razorpay
    const [paymentGateway, setPaymentGateway] = useState('razorpay'); // Default to Razorpay
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux cart state
    const { items: cart, totalAmount: total } = useSelector(state => state.cart);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePayment = async () => {
        if (!stripe || !elements || !selectedCard) {
            console.log('Error: Stripe, elements, or selected card is not initialized.');
            return;
        }
        
        // Convert INR to USD for Stripe (Stripe expects amounts in cents)
        const usdAmount = await convertUSDToINR(total);
        const amountInCents = Math.round(parseFloat(usdAmount) * 100);
        
        const payload = {
            payment_method_id: selectedCard.id,
            amount: amountInCents
        };
        console.log('Payment payload:', payload);
        setLoading(true);
        try {
            const response = await checkOut(payload);
            console.log('Payment successful!');
            console.log('Checkout response:', response);
            dispatch(clearCart());
            navigate('/success', { state: { paymentIntentId: response.paymentIntentId } });
        } catch (error) {
            console.log('Error during payment process:');
            if (error.response && error.response.data) {
                console.log(`Error message: ${error.response.data.message}`);
                console.log('Full error details:', error.response.data);
            } else {
                console.log('An unexpected error occurred:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const checkOut = async (payload, setError) => {
        console.log('Checkout request payload:', payload);
        try {
            const res = await axios.post('http://localhost:8000/api/stripe/checkout', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Checkout response data:', res.data);
            return res.data;
        } catch (error) {
            console.log('Stripe checkout error details:');
            if (error.response && error.response.data) {
                console.log('Error message:', error.response.data.message);
                console.log('Error details:', error.response.data);
            } else {
                console.log('Error message:', error.message);
            }
            throw error;
        }
    };

    const handleRemoveFromCart = (item) => {
        // Handle both data structures: item.productId and item.product
        const product = item.productId || item.product;
        if (product) {
            const productId = product.id || product._id;
            dispatch(removeFromCart(productId));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen shadow-md rounded-lg bg-gray-100 p-6">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Product Details Section */}
                <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-700">Your cart is empty.</p>
                    ) : (
                        <ul className="h-[360px] md:h-[480px] lg:h-[420px] overflow-y-auto overflow-x-hidden border-b">
                            {cart.map((item) => (
                                <div className="relative flex items-center" key={item._id || item.id}>
                                    <CheckOutItem item={item} />
                                    <div
                                        onClick={() => handleRemoveFromCart(item)}
                                        className="absolute top-0 right-0 p-2 text-xl cursor-pointer"
                                    >
                                        <IoMdClose className="text-gray-500 hover:text-red-500 transition" />
                                    </div>
                                </div>
                            ))}
                        </ul>

                    )}
                    <div className="mt-4 font-semibold">Total: {formatINRPrice(total)}</div>
                </div>

                {/* Payment Info Section */}
                <div className="w-full lg:w-1/2 p-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-gray-800">Choose Payment Gateway</h4>
                        
                        {/* Payment Gateway Selection */}
                        <div className="mb-4">
                            <label className="inline-flex items-center mr-6">
                                <input
                                    type="radio"
                                    name="payment-gateway"
                                    value="razorpay"
                                    checked={paymentGateway === 'razorpay'}
                                    onChange={() => setPaymentGateway('razorpay')}
                                    className="form-radio text-blue-500"
                                />
                                <span className="ml-2">Razorpay (INR)</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="payment-gateway"
                                    value="stripe"
                                    checked={paymentGateway === 'stripe'}
                                    onChange={() => setPaymentGateway('stripe')}
                                    className="form-radio text-blue-500"
                                />
                                <span className="ml-2">Stripe (USD)</span>
                            </label>
                        </div>

                        {/* Payment Method Selection (for Stripe) */}
                        {paymentGateway === 'stripe' && (
                            <div>
                                <h5 className="font-medium mb-2 text-gray-700">Payment Method</h5>
                                <label className="inline-flex items-center mr-6">
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        value="new"
                                        checked={paymentMethod === 'new'}
                                        onChange={() => setPaymentMethod('new')}
                                        className="form-radio text-blue-500"
                                    />
                                    <span className="ml-2">Add New Card</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        value="existing"
                                        checked={paymentMethod === 'existing'}
                                        onChange={() => setPaymentMethod('existing')}
                                        className="form-radio text-blue-500"
                                    />
                                    <span className="ml-2">Existing Card</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Payment Information Form */}
                    {paymentGateway === 'razorpay' && (
                        <RazorpayPayment />
                    )}

                    {paymentGateway === 'stripe' && (
                        <>
                            {paymentMethod === 'new' && <AddCard />}
                            
                            {paymentMethod === 'existing' && (
                                <>
                                    <ExitCard onCardSelect={setSelectedCard} />
                                    {/* Payment Button */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={handlePayment}
                                            className={`bg-primary flex p-3 justify-center items-center text-white w-full font-medium mt-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : 'Pay Now'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
