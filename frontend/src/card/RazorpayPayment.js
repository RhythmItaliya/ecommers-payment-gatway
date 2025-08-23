import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartAction';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from '../redux/toastAction';
import { formatINRPrice } from '../utils/currency';
import axios from 'axios';

const RazorpayPayment = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Redux cart state
    const { items: cart, totalAmount: total } = useSelector(state => state.cart);
    const token = useSelector(state => state.auth.token);

    // Razorpay Configuration
    const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
    const RAZORPAY_CURRENCY = 'INR';
    const RAZORPAY_NAME = process.env.REACT_APP_NAME || 'SnapShop';
    const RAZORPAY_DESCRIPTION = process.env.REACT_APP_DESCRIPTION || 'Payment for your order';

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleRazorpayPayment = async () => {
        if (cart.length === 0) {
            dispatch(showErrorToast('Your cart is empty'));
            return;
        }

        setLoading(true);

        try {
            // Create order on backend
            const orderResponse = await axios.post('http://localhost:8000/api/razorpay/create-order', {
                amount: total,
                currency: RAZORPAY_CURRENCY,
                receipt: `receipt_${Date.now()}`
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }

            const { order } = orderResponse.data;

            // Configure Razorpay options
            const options = {
                key: RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: RAZORPAY_NAME,
                description: RAZORPAY_DESCRIPTION,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        console.log('Razorpay response:', response);
                        
                        // Verify payment on backend
                        const verifyResponse = await axios.post('http://localhost:8000/api/razorpay/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (verifyResponse.data.success) {
                            // Payment successful
                            dispatch(clearCart());
                            navigate('/success', { 
                                state: { 
                                    paymentIntentId: response.razorpay_payment_id,
                                    paymentMethod: 'Razorpay'
                                } 
                            });
                        } else {
                            console.error('Verification failed:', verifyResponse.data);
                            dispatch(showErrorToast(verifyResponse.data.message || 'Payment verification failed'));
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        dispatch(showErrorToast('Payment verification failed'));
                    }
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#3B82F6'
                }
            };

            // Initialize Razorpay
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Razorpay payment error:', error);
            dispatch(showErrorToast(error.message || 'Failed to initiate payment'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Payment Summary</h5>
                <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                        <span>Items in cart:</span>
                        <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total amount:</span>
                        <span className="font-semibold">{formatINRPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Currency:</span>
                        <span className="font-semibold">INR (₹)</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleRazorpayPayment}
                disabled={loading || cart.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    loading || cart.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {loading ? 'Processing...' : `Pay ${formatINRPrice(total)} with Razorpay`}
            </button>

            <div className="text-xs text-gray-500 text-center">
                You will be redirected to Razorpay's secure payment gateway
            </div>
        </div>
    );
};

export default RazorpayPayment;
