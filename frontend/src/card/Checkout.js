import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { removeFromCart, updateCartItemQuantity } from '../redux/cartAction';
import CheckOutItem from './CheckOutItem';
import { RazorpayPayment } from './RazorpayPayment';
import { formatINRPrice, roundAmount } from '../utils/currency';
import axios from 'axios';

const Checkout = () => {
    const { items: cart, totalAmount: total, loading: cartLoading } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [paymentGateway] = useState('razorpay'); // Only Razorpay for now

    // Round the amount to avoid floating-point precision issues
    const roundedTotal = roundAmount(total);

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
                    
                    {/* Complete Payment Summary */}
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center py-2 border-t border-gray-200">
                            <span className="font-medium text-gray-700">Subtotal:</span>
                            <span className="font-semibold">{formatINRPrice(roundedTotal)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-t border-gray-200">
                            <span className="font-bold text-lg text-gray-800">Total:</span>
                            <div className="text-right">
                                <span className="font-bold text-lg text-gray-800">{formatINRPrice(roundedTotal)}</span>
                                <p className="text-sm text-gray-500">Including all taxes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="w-full lg:w-1/2 p-6 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4">Payment</h2>
                    
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
