import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

export const AddCard = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [customer, setCustomer] = useState();
    const [loading, setLoading] = useState(false);

    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setCustomer(decodedToken);
            } catch (e) {
                console.error('Failed to decode token:', e);
            }
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setLoading(true);
        const cardElement = elements.getElement(CardNumberElement);
        // Use Stripe.js to create a token or payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name,
                address: {
                    postal_code: postalCode
                }
            }
        });
        const { error: stripeError, token } = await stripe.createToken(cardElement);
        if (error) {
            console.error('Error creating token:', stripeError);
            setLoading(false);
            return;
            // Handle error
        } else {
            console.log(paymentMethod);
            console.log("🚀 ~ handleSubmit ~ token:", token)
            await addCardToCustomer(customer.user.customer_id, token.id)
            setLoading(false);
            // await attachPaymentMethod(paymentMethod.id)
            // Send the payment method ID to your server to save it to the customer
            // savePaymentMethod(paymentMethod.id);
        }
    };

    const attachPaymentMethod = async (paymentMethodId) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/stripe/attach-payment-method`, {
                customer_id: customer.user.customer_id,
                payment_method_id: paymentMethodId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            // Handle success response from the server
        } catch (error) {
            console.error('Error saving payment method:', error);
            // Handle error
        }
    };

    const addCardToCustomer = async (customer_id, card_token) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/stripe/add-card`, {
                customer_id: customer_id,
                card_token: card_token, // This should be a valid card token obtained from Stripe Elements or Stripe.js
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            // Handle success response
        } catch (error) {
            console.error('Error adding card:', error);
            // Handle error
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label htmlFor="card-number" className='block font-medium text-gray-700'>Card Number:</label>
                    <CardNumberElement className='p-2 border rounded' id='card-number' options={{ showIcon: true }} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="card-expiry" className='block font-medium text-gray-700'>Expiry Date:</label>
                    <CardExpiryElement className='p-2 border rounded' id='card-expiry' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="card-cvc" className='block font-medium text-gray-700'>CVC:</label>
                    <CardCvcElement className='p-2 border rounded' id='card-cvc' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="name" className='block font-medium text-gray-700'>Name on Card:</label>
                    <input id='name' className='p-2 border rounded w-full' placeholder='Name on your card' onChange={(e) => setName(e.target.value)} autoComplete='off' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="postal" className='block font-medium text-gray-700'>Postal Code:</label>
                    <input id='postal' className='p-2 border rounded w-full' placeholder='Postal code' onChange={(e) => setPostalCode(e.target.value)} autoComplete='off' />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        <div className="flex items-center justify-center">
                            {loading ? (
                                <>
                                    <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                                    </svg>
                                    <span>Saving your card...</span>
                                </>
                            ) : (
                                'Save Payment Method'
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddCard;
