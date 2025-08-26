import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/cartAction';
import { Button, LoadingSpinner, ErrorState } from '../ui';
import axios from 'axios';

const RazorpayPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { formData, cart, total } = location.state || {};

    useEffect(() => {
        if (!formData || !cart || !total) {
            navigate('/checkout');
            return;
        }

        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                // Script loaded successfully
            };
            script.onerror = () => {
                setError('Failed to load payment gateway. Please refresh the page.');
            };
            document.body.appendChild(script);

            return () => {
                if (script.parentNode) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [formData, cart, total, navigate]);

    const handlePayment = async () => {
        if (!window.Razorpay) {
            setError('Payment gateway not loaded. Please refresh the page.');
            return;
        }

        if (!process.env.REACT_APP_RAZORPAY_KEY) {
            setError('Payment gateway configuration error. Please contact support.');
            return;
        }

        if (!process.env.REACT_APP_API_URL) {
            setError('API configuration error. Please contact support.');
            return;
        }

        if (!cart || cart.length === 0) {
            setError('Cart is empty. Please add items to your cart.');
            return;
        }

        if (!formData || !formData.firstName || !formData.email) {
            setError('Shipping information is incomplete. Please go back to checkout.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/razorpay/create-order`,
                {
                    amount: total,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const orderData = orderResponse.data;

            if (!orderData.success) {
                throw new Error(orderData.message || 'Failed to create Razorpay order');
            }

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY,
                amount: Math.round(total * 100),
                currency: 'INR',
                name: 'SnapShop',
                description: `Order #${orderData.order.id}`,
                order_id: orderData.order.id,
                handler: function (response) {
                    handlePaymentSuccess(response, orderData.order.id);
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#1f2937',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
            };

            try {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch (rzpError) {
                throw new Error('Failed to initialize payment gateway');
            }
        } catch (err) {
            setError(err.message || 'Payment initialization failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (response, orderId) => {
        try {
            setLoading(true);

            const verifyResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/razorpay/verify-payment`,
                {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const verifyData = verifyResponse.data;

            if (verifyData.success) {
                dispatch(clearCart());
                setLoading(false);
                navigate('/success', {
                    state: {
                        orderId: orderId,
                        paymentIntentId: response.razorpay_payment_id,
                        paymentMethod: 'Razorpay',
                        orderDetails: {
                            orderId: orderId,
                            paymentId: response.razorpay_payment_id,
                            amount: total,
                            currency: 'INR',
                        },
                    },
                });
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (err) {
            setLoading(false);
            setError('Payment verification failed. Please contact support.');
        }
    };

    if (loading) return <LoadingSpinner size="lg" variant="primary" text="Initializing payment..." />;
    if (error) return <ErrorState error={error} onRetry={() => setError(null)} />;

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto mt-16">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-primary mb-6">Complete Your Payment</h1>

                    <div className="bg-light rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-primary mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-neutral">
                                <span>Items ({cart.length}):</span>
                                <span>₹{(total * 0.82).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-neutral">
                                <span>Tax (18%):</span>
                                <span>₹{(total * 0.18).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-light pt-3">
                                <div className="flex justify-between text-lg font-bold text-primary">
                                    <span>Total:</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            variant="primary"
                            size="xl"
                            onClick={handlePayment}
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <LoadingSpinner size="sm" variant="white" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                `Pay ₹${total.toFixed(2)} with Razorpay`
                            )}
                        </Button>

                        <p className="text-sm text-neutral mt-4">Secure payment powered by Razorpay</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RazorpayPayment;
