import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { removeFromCart, updateCartItemQuantity } from '../redux/cartAction';
import CheckOutItem from './CheckOutItem';
import { RazorpayPayment } from './RazorpayPayment';
import { formatINRPrice, roundAmount } from '../utils/currency';

const Checkout = () => {
    const { items: cart, totalAmount: total, loading: cartLoading } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [paymentGateway] = useState('razorpay'); // Only Razorpay for now
    
    const token = useSelector(state => state.auth.token);

    // Round the amount to avoid floating-point precision issues
    const roundedTotal = roundAmount(total);

    // Check authentication on component mount
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    // Redirect to home if token is removed while on checkout page
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleRemoveFromCart = (item) => {
        // Handle both data structures: item.productId and item.product
        const product = item.productId || item.product;
        if (product) {
            const productId = product.id || product._id;
            dispatch(removeFromCart(productId));
        }
    };

    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity > 0) {
            const product = item.productId || item.product;
            if (product) {
                const productId = product.id || product._id;
                dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
            }
        }
    };

    // Check if user is authenticated
    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-8">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
                    <p className="text-gray-500 mb-6">Please login to access the checkout page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    if (cartLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading cart...</p>
                </div>
            </div>
        );
    }

    // Check if user has items in cart
    if (cart.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-8">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some products to your cart to proceed with checkout.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen shadow-md rounded-lg bg-gray-100 p-6">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Product Details Section */}
                <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Product Details</h2>
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
                </div>

                {/* Payment Section */}
                <div className="w-full lg:w-1/2 p-6 bg-gray-50">
                    {/* Order Summary */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Items ({cart.length}):</span>
                                    <span className="font-medium">{formatINRPrice(roundedTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="text-gray-600">Included</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-lg">Total:</span>
                                        <span className="font-bold text-lg text-blue-600">{formatINRPrice(roundedTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Gateway */}
                    {paymentGateway === 'razorpay' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Secure Payment with Razorpay
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>Your payment will be processed securely through Razorpay's payment gateway.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <RazorpayPayment />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
