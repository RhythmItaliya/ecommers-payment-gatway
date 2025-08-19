import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartAction';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from '../redux/toastAction';
import axios from 'axios';

const RazorpayPayment = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Redux cart state
    const { items: cart, totalAmount: total } = useSelector(state => state.cart);
    const token = useSelector(state => state.auth.token);

    // Razorpay Configuration
    const RAZORPAY_KEY = "rzp_test_t8qeVD7fsffjfV";
    const RAZORPAY_CURRENCY = "INR";
    const RAZORPAY_NAME = "Snapshop";
    const RAZORPAY_DESCRIPTION = "Snapshop Transaction";

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
                        if (error.response?.data) {
                            console.error('Error response:', error.response.data);
                            dispatch(showErrorToast(error.response.data.message || 'Payment verification failed'));
                        } else {
                            dispatch(showErrorToast('Payment verification failed'));
                        }
                    }
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999'
                },
                notes: {
                    address: 'Snapshop Address'
                },
                theme: {
                    color: '#3B82F6'
                }
            };

            // Initialize Razorpay
            const rzp = new window.Razorpay(options);
            
            // Handle modal events
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                dispatch(showErrorToast('Payment failed: ' + (response.error.description || response.error.message)));
            });
            
            rzp.on('payment.cancelled', function () {
                console.log('Payment cancelled by user');
                dispatch(showErrorToast('Payment was cancelled'));
            });
            
            rzp.open();

        } catch (error) {
            console.error('Razorpay payment error:', error);
            dispatch(showErrorToast(error.response?.data?.message || error.message || 'Payment failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Pay with Razorpay
                </h3>
                
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Total Amount: <span className="font-semibold text-lg text-primary">₹{total.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                        Secure payment powered by Razorpay
                    </p>
                </div>

                {/* Error messages handled by toast notifications */}

                <button
                    onClick={handleRazorpayPayment}
                    disabled={loading || cart.length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                        loading || cart.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </div>
                    ) : (
                        `Pay ₹${total.toFixed(2)}`
                    )}
                </button>

                <div className="mt-4 text-center">
                    <img 
                        src="https://razorpay.com/favicon.png" 
                        alt="Razorpay" 
                        className="inline-block w-6 h-6 mr-2"
                    />
                    <span className="text-xs text-gray-500">
                        Powered by Razorpay
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RazorpayPayment;
