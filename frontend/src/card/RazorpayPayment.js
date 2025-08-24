import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartAction';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatINRPrice, roundAmount } from '../utils/currency';

// Environment variables for Razorpay
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_t8qeVD7fsffjfV";
const CURRENCY = process.env.REACT_APP_CURRENCY || 'INR';
const NAME = process.env.REACT_APP_NAME || 'SnapShop';
const DESCRIPTION = process.env.REACT_APP_DESCRIPTION || 'Payment for your order';

export const RazorpayPayment = () => {
    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [configError, setConfigError] = useState('');
    const { items: cart, totalAmount: total } = useSelector(state => state.cart);
    const token = useSelector(state => state.auth.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Round the amount to avoid floating-point precision issues
    const roundedTotal = roundAmount(total);

    // Validate configuration
    useEffect(() => {
        if (!RAZORPAY_KEY) {
            setConfigError('Razorpay configuration is missing. Please check your environment variables.');
        } else if (!process.env.REACT_APP_API_URL) {
            setConfigError('API URL is not configured. Please check your environment variables.');
        }
    }, []);

    // Check if Razorpay is loaded
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        const checkRazorpayLoaded = () => {
            if (typeof window.Razorpay !== 'undefined') {
                setRazorpayLoaded(true);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkRazorpayLoaded, 100);
            } else {
                console.error('Razorpay failed to load after multiple attempts');
            }
        };
        
        // Initial check
        checkRazorpayLoaded();
        
        // Also try to load Razorpay dynamically if it's not available
        if (typeof window.Razorpay === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                setRazorpayLoaded(true);
            };
            script.onerror = () => {
                console.error('Failed to load Razorpay script');
            };
            document.head.appendChild(script);
        }
    }, []);

    const handleRazorpayPayment = async () => {
        if (cart.length === 0) return;
        
        // Validate Razorpay configuration
        if (!RAZORPAY_KEY) {
            alert('Razorpay is not configured. Please contact support.');
            return;
        }
        
        setLoading(true);
        try {
            // Round the amount to avoid floating-point precision issues
            const roundedAmount = roundAmount(total);
            console.log('Amount before rounding:', total, 'After rounding:', roundedAmount);
            
            // Create order
            const orderResponse = await axios.post(`${process.env.REACT_APP_API_URL}/razorpay/create-order`, {
                amount: roundedAmount,
                currency: CURRENCY,
                receipt: `receipt_${Date.now()}`
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }

            const { order } = orderResponse.data;

            // Razorpay options
            const options = {
                key: RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: NAME,
                description: DESCRIPTION,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyResponse = await axios.post(`${process.env.REACT_APP_API_URL}/razorpay/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (verifyResponse.data.success) {
                            // Don't clear cart here - let the backend handle it after order creation
                            // The backend will clear the cart after successfully creating the order
                            navigate('/success', { 
                                state: { 
                                    paymentIntentId: response.razorpay_payment_id,
                                    paymentMethod: 'Razorpay'
                                } 
                            });
                        } else {
                            console.error('Verification failed:', verifyResponse.data);
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                    }
                },
                prefill: { name: 'Customer Name', email: 'customer@example.com', contact: '9999999999' },
                theme: { color: '#3B82F6' }
            };

            // Check if Razorpay is loaded
            if (typeof window.Razorpay === 'undefined') {
                throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
            }

            // Open Razorpay
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Razorpay payment error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Payment failed. Please try again.';
            
            if (error.message.includes('Razorpay SDK not loaded')) {
                errorMessage = 'Payment gateway not ready. Please refresh the page and try again.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // You can add a toast notification here if you have one
            alert(errorMessage); // Replace with proper toast notification if available
        } finally {
            setLoading(false);
        }
    };

    // Show configuration error if any
    if (configError) {
        return (
            <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-2">Configuration Error</h5>
                    <p className="text-sm text-red-700">{configError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Payment Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Payment Summary</h5>
                <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                        <span>Items in cart:</span>
                        <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total amount:</span>
                        <span className="font-semibold">{formatINRPrice(roundedTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Currency:</span>
                        <span className="font-semibold">{CURRENCY} (₹)</span>
                    </div>
                </div>
            </div>

            {/* Pay Button */}
            <button
                onClick={handleRazorpayPayment}
                disabled={loading || cart.length === 0 || !razorpayLoaded}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    loading || cart.length === 0 || !razorpayLoaded
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {loading ? 'Processing...' : 
                 !razorpayLoaded ? 'Loading Razorpay...' : 
                 `Pay ${formatINRPrice(roundedTotal)} with Razorpay`}
            </button>

            <div className="text-xs text-gray-500 text-center">
                You will be redirected to Razorpay's secure payment gateway
            </div>
            
            {!razorpayLoaded && (
                <div className="text-xs text-orange-600 text-center bg-orange-50 p-2 rounded">
                    ⚠️ Razorpay is loading... Please wait a moment before proceeding.
                </div>
            )}
        </div>
    );
};

export default RazorpayPayment;
