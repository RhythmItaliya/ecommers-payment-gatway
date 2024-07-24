import React, { useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successAnimation from '../img/success.json';

const SuccessPage = () => {
    useEffect(() => {
        // Check for any necessary payment status or information
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.get('/api/payment-status', {
                    // Optionally include any relevant data like payment ID
                });
                // Handle response
                console.log('Payment Status:', response.data);
            } catch (error) {
                console.error('Error fetching payment status:', error);
            }
        };

        fetchPaymentStatus();
    }, []);

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="bg-white p-6 md:mx-auto max-w-md mx-4">
                <div className="w-40 h-40 mx-auto">
                    <Lottie animationData={successAnimation} loop={true} />
                </div>
                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold">Payment Done!</h3>
                    <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                    <p>Have a great day!</p>
                    <div className="py-10 text-center">
                        <a href="/" className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded">
                            GO BACK
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
