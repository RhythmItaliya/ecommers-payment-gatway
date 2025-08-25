import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successAnimation from '../img/success.json';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoadingSpinner, ErrorState } from '../components/ui';

const SuccessPage = () => {
    const location = useLocation();
    const { paymentIntentId, paymentMethod = 'Razorpay', orderDetails } = location.state || {};
    const token = useSelector((state) => state.auth.token);

    const [paymentStatus, setPaymentStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            if (!paymentIntentId) {
                setLoading(false);
                return;
            }

            try {
                let response;
                if (paymentMethod === 'Razorpay') {
                    response = await axios.get(`${process.env.REACT_APP_API_URL}/razorpay/payment/${paymentIntentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    setPaymentStatus(response.data.payment);
                } else {
                    response = await axios.get(`${process.env.REACT_APP_API_URL}/razorpay/payment/${paymentIntentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    setPaymentStatus(response.data.payment);
                }
            } catch (error) {
                setError('Failed to fetch payment details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStatus();
    }, [paymentIntentId, paymentMethod, token]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <LoadingSpinner size="lg" variant="primary" text="Processing your payment..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16">
                <ErrorState error={error} onRetry={() => setError(null)} />
            </div>
        );
    }

    const redirectUrl = paymentStatus?.next_action?.redirect_to_url?.url || 'N/A';

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white p-8 border border-gray-200 rounded-lg shadow-md">
                <div className="lg:w-2/5 flex flex-col items-center justify-center mb-6 lg:mb-0">
                    <div className="w-3/5 h-3/5">
                        <Lottie animationData={successAnimation} loop={true} />
                    </div>
                    <div className="text-center">
                        <h3 className="md:text-3xl text-xl text-gray-900 font-semibold">Payment Done!</h3>
                        <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                        <p>Have a great day!</p>
                    </div>
                </div>
                <div className="lg:w-3/5 lg:pl-8">
                    <h4 className="text-2xl font-semibold mb-6">Payment Details</h4>
                    {paymentStatus ? (
                        <div className="space-y-4">
                            {paymentMethod === 'Razorpay'
                                ? [
                                      { label: 'Payment ID', value: paymentStatus.id },
                                      { label: 'Amount', value: `₹${(paymentStatus.amount / 100).toFixed(2)}` },
                                      { label: 'Currency', value: paymentStatus.currency.toUpperCase() },
                                      { label: 'Status', value: paymentStatus.status },
                                      { label: 'Payment Method', value: paymentStatus.method || 'Razorpay' },
                                      {
                                          label: 'Created At',
                                          value: new Date(paymentStatus.created_at * 1000).toLocaleString(),
                                      },
                                  ].map(({ label, value }) => (
                                      <div
                                          key={label}
                                          className="flex items-center space-x-4 border-b border-gray-200 pb-3"
                                      >
                                          <span className="font-semibold w-1/3 text-gray-900">{label}</span>
                                          <div className="w-2/3 overflow-x-auto">
                                              <span>{value}</span>
                                          </div>
                                      </div>
                                  ))
                                : [
                                      { label: 'Payment ID', value: paymentStatus.id },
                                      { label: 'Amount', value: `₹${(paymentStatus.amount / 100).toFixed(2)}` },
                                      { label: 'Currency', value: paymentStatus.currency.toUpperCase() },
                                      { label: 'Status', value: paymentStatus.status },
                                      { label: 'Payment Method', value: 'Razorpay' },
                                  ].map(({ label, value }) => (
                                      <div
                                          key={label}
                                          className="flex items-center space-x-4 border-b border-gray-200 pb-3"
                                      >
                                          <span className="font-semibold w-1/3 text-gray-900">{label}</span>
                                          <div className="w-2/3 overflow-x-auto">
                                              {label === 'Redirect URL' ? (
                                                  <a
                                                      href={value}
                                                      className="text-blue-500 truncate"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                  >
                                                      {value}
                                                  </a>
                                              ) : (
                                                  <span>{value}</span>
                                              )}
                                          </div>
                                      </div>
                                  ))}
                        </div>
                    ) : orderDetails ? (
                        <div className="space-y-4">
                            {[
                                { label: 'Order ID', value: orderDetails.orderId },
                                { label: 'Payment ID', value: orderDetails.paymentId },
                                { label: 'Amount', value: `₹${orderDetails.amount.toFixed(2)}` },
                                { label: 'Currency', value: orderDetails.currency },
                                { label: 'Status', value: 'Completed' },
                                { label: 'Payment Method', value: 'Razorpay' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center space-x-4 border-b border-gray-200 pb-3">
                                    <span className="font-semibold w-1/3 text-gray-900">{label}</span>
                                    <div className="w-2/3 overflow-x-auto">
                                        <span>{value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <p>Payment completed successfully!</p>
                            <p className="text-sm mt-2">Thank you for your purchase.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="py-6">
                <a href="/" className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded">
                    GO BACK
                </a>
            </div>
        </div>
    );
};

export default SuccessPage;
