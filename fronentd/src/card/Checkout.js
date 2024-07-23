import React, { useContext, useState } from 'react';
import { AddCard } from './AddCard';
import ExitCard from './ExitCard';
import CheckOutItem from './CheckOutItem';
import { CartContext } from '../contexts/CartContext';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

const Checkout = () => {
    const { cart, total, clearCart, removeFromCart } = useContext(CartContext);
    const [paymentMethod, setPaymentMethod] = useState('new');
    const [selectedCard, setSelectedCard] = useState(null);
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const token = useSelector(state => state.auth.token);

    const handlePayment = async () => {
        if (!stripe || !elements || !selectedCard) {
            alert('Please complete the payment information.');
            return;
        }
        console.log(`Total amount for checkout: $${total}`);
        const payload = {
            payment_method_id: selectedCard.id,
        };
        setLoading(true);
        try {
            await checkOut(payload);
            console.log('Payment successful!');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error('Error while checking out:', error);
            alert('An error occurred while processing your payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const checkOut = async (payload) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/stripe/checkout`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data);
        } catch (error) {
            console.error('Error while checking out:', error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Product Details Section */}
                <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-700">Your cart is empty.</p>
                    ) : (
                        <ul className="h-[360px] md:h-[480px] lg:h-[420px] overflow-y-auto overflow-x-hidden border-b">
                            {cart.map((item) => (
                                <div className="relative flex items-center" key={item.id}>
                                    <CheckOutItem item={item} />
                                    <div
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute top-0 right-0 p-2 text-xl cursor-pointer"
                                    >
                                        <IoMdClose className="text-gray-500 hover:text-red-500 transition" />
                                    </div>
                                </div>
                            ))}
                        </ul>

                    )}
                    <div className="mt-4 font-semibold">Total: ${parseFloat(total).toFixed(2)}</div>
                </div>

                {/* Payment Info Section */}
                <div className="w-full lg:w-1/2 p-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                    {/* Payment Method Selection */}
                    <div className="mb-6">
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

                    {/* Payment Information Form */}
                    {paymentMethod === 'new' && (
                        <AddCard />
                    )}

                    {paymentMethod === 'existing' && (
                        <ExitCard onCardSelect={setSelectedCard} />
                    )}

                    {/* Payment Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handlePayment}
                            className={`bg-primary flex p-3 justify-center items-center text-white w-full font-medium mt-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                                        </path>
                                    </svg>
                                    Paying...
                                </>
                            ) : (
                                'Pay'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
