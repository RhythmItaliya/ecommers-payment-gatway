import React, { useState, useEffect, useContext } from 'react';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const AddCard = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [customer, setCustomer] = useState();
    const [pLoading, setPLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { total, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);

    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('IN');
    const [name, setName] = useState('');

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
            console.log('Stripe has not yet loaded.');
            setError('Stripe has not yet loaded.');
            return;
        }
        setLoading(true);
        setError(null);
        const cardElement = elements.getElement(CardNumberElement);
        try {
            // Create Payment Method
            const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: name,
                    address: {
                        line1: addressLine1,
                        line2: addressLine2,
                        city: city,
                        state: state,
                        postal_code: postalCode,
                        country: country
                    }
                }
            });
            if (paymentMethodError) {
                console.error('Error creating payment method:', paymentMethodError);
                setError(paymentMethodError.message);
                setLoading(false);
                return;
            }
            // Create Token
            const { error: stripeError, token } = await stripe.createToken(cardElement);
            if (stripeError) {
                console.error('Error creating token:', stripeError);
                setError(stripeError.message);
                setLoading(false);
                return;
            }
            console.log('Payment Method:', paymentMethod);
            console.log("Token:", token);
            // Add card to customer (example function, implement as needed)
            await addCardToCustomer(customer.user.customer_id, token.id);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setLoading(false);
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

    const handlePay = async () => {
        if (!stripe || !elements) {
            console.log('Stripe has not yet loaded.');
            setError('Stripe has not yet loaded.');
            return;
        }
        setPLoading(true);
        setError(null);
        const cardElement = elements.getElement(CardNumberElement);
        try {
            console.log('Creating payment method...');
            // Create Payment Method
            const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: name,
                    address: {
                        line1: addressLine1,
                        line2: addressLine2,
                        city: city,
                        state: state,
                        postal_code: postalCode,
                        country: country
                    }
                }
            });
            if (paymentMethodError) {
                console.log('Payment method creation error:', paymentMethodError);
                setError(paymentMethodError.message);
                return;
            }
            console.log('Payment method created:', paymentMethod);
            console.log('Creating payment intent...');
            // Create Payment Intent
            const response = await axios.post('http://localhost:8000/api/payment-intent', {
                payment_method_id: paymentMethod.id,
                amount: total,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('Payment intent response:', response.data);
            const { client_secret, next_action } = response.data;
            console.log('Confirming payment...');
            // Confirm Payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
                payment_method: paymentMethod.id,
            });
            if (confirmError) {
                console.log('Payment confirmation error:', confirmError);
                setError(confirmError.message);
                return;
            }
            console.log('Payment intent status:', paymentIntent.status);
            if (paymentIntent.status === 'requires_action' && next_action) {
                // Handle additional authentication
                if (next_action.type === 'use_stripe_sdk' && next_action.use_stripe_sdk) {
                    console.log('Handling additional authentication...');
                    const { error: actionError } = await stripe.handleCardAction(next_action.use_stripe_sdk);
                    if (actionError) {
                        console.log('Additional authentication error:', actionError);
                        setError(actionError.message);
                    }
                }
            } else if (paymentIntent.status === 'succeeded') {
                // Handle successful payment
                console.log('Payment succeeded');
                clearCart();
                navigate('/success');
            } else {
                // Handle other payment statuses
                console.log('Unexpected payment status:', paymentIntent.status);
                setError('Unexpected payment status: ' + paymentIntent.status);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('An error occurred while processing your payment.');
        } finally {
            setPLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">

                <h1 className="text-2xl font-bold text-gray-800 mb-4">Checkout</h1>
                <div className="mb-6">
                    <div className="mt-4">
                        <label htmlFor="name" className="block text-gray-700 mb-1">Name on Card</label>
                        <input id='name' className='w-full rounded-lg border py-2 px-3' placeholder='Name on your card' onChange={(e) => setName(e.target.value)} autoComplete='off' />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="address-line1" className="block text-gray-700 mb-1">Address Line 1</label>
                        <input id='address-line1' className='w-full rounded-lg border py-2 px-3' placeholder='Address line 1' onChange={(e) => setAddressLine1(e.target.value)} autoComplete='off' />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="address-line2" className="block text-gray-700 mb-1">Address Line 2</label>
                        <input id='address-line2' className='w-full rounded-lg border py-2 px-3' placeholder='Address line 2 (optional)' onChange={(e) => setAddressLine2(e.target.value)} autoComplete='off' />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="city" className="block text-gray-700 mb-1">City</label>
                        <input id='city' className='w-full rounded-lg border py-2 px-3' placeholder='City' onChange={(e) => setCity(e.target.value)} autoComplete='off' />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="state" className="block text-gray-700 mb-1">State</label>
                            <input id='state' className='w-full rounded-lg border py-2 px-3' placeholder='State/Province/Region' onChange={(e) => setState(e.target.value)} autoComplete='off' />
                        </div>
                        <div>
                            <label htmlFor="postal" className="block text-gray-700 mb-1">Postal Code</label>
                            <input id='postal' className='w-full rounded-lg border py-2 px-3' placeholder='Postal code' onChange={(e) => setPostalCode(e.target.value)} autoComplete='off' />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="country" className="block text-gray-700 mb-1">Country</label>
                        <select id='country' className='w-full rounded-lg border py-2 px-3' value={country} onChange={(e) => setCountry(e.target.value)}>
                            <option value="AU">Australia (AU)</option>
                            <option value="AT">Austria (AT)</option>
                            <option value="BE">Belgium (BE)</option>
                            <option value="BR">Brazil (BR)</option>
                            <option value="BG">Bulgaria (BG)</option>
                            <option value="CA">Canada (CA)</option>
                            <option value="CR">Costa Rica (CR)</option>
                            <option value="HR">Croatia (HR)</option>
                            <option value="CY">Cyprus (CY)</option>
                            <option value="CZ">Czech Republic (CZ)</option>
                            <option value="CI">Côte d’Ivoire (CI)</option>
                            <option value="DK">Denmark (DK)</option>
                            <option value="DO">Dominican Republic (DO)</option>
                            <option value="EE">Estonia (EE)</option>
                            <option value="FI">Finland (FI)</option>
                            <option value="FR">France (FR)</option>
                            <option value="DE">Germany (DE)</option>
                            <option value="GI">Gibraltar (GI)</option>
                            <option value="GR">Greece (GR)</option>
                            <option value="GT">Guatemala (GT)</option>
                            <option value="HK">Hong Kong (HK)</option>
                            <option value="HU">Hungary (HU)</option>
                            <option value="IN">India (IN)</option>
                            <option value="ID">Indonesia (ID)</option>
                            <option value="IE">Ireland (IE)</option>
                            <option value="IT">Italy (IT)</option>
                            <option value="JP">Japan (JP)</option>
                            <option value="LV">Latvia (LV)</option>
                            <option value="LI">Liechtenstein (LI)</option>
                            <option value="LT">Lithuania (LT)</option>
                            <option value="LU">Luxembourg (LU)</option>
                            <option value="MY">Malaysia (MY)</option>
                            <option value="MT">Malta (MT)</option>
                            <option value="MX">Mexico (MX)</option>
                            <option value="NL">Netherlands (NL)</option>
                            <option value="NZ">New Zealand (NZ)</option>
                            <option value="NO">Norway (NO)</option>
                            <option value="PE">Peru (PE)</option>
                            <option value="PH">Philippines (PH)</option>
                            <option value="PL">Poland (PL)</option>
                            <option value="PT">Portugal (PT)</option>
                            <option value="RO">Romania (RO)</option>
                            <option value="SN">Senegal (SN)</option>
                            <option value="SG">Singapore (SG)</option>
                            <option value="SK">Slovakia (SK)</option>
                            <option value="SI">Slovenia (SI)</option>
                            <option value="ES">Spain (ES)</option>
                            <option value="SE">Sweden (SE)</option>
                            <option value="CH">Switzerland (CH)</option>
                            <option value="TH">Thailand (TH)</option>
                            <option value="TT">Trinidad & Tobago (TT)</option>
                            <option value="AE">United Arab Emirates (AE)</option>
                            <option value="GB">United Kingdom (GB)</option>
                            <option value="US">United States (US)</option>
                            <option value="UY">Uruguay (UY)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Payment Information</h2>

                    <div className="mt-4">
                        <label htmlFor="card-number" className="block text-gray-700 mb-1">Card Number</label>
                        <CardNumberElement className='w-full rounded-lg border py-2 px-3' id='card-number' options={{ showIcon: true }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="card-expiry" className="block text-gray-700 mb-1">Expiration Date</label>
                            <CardExpiryElement className='w-full rounded-lg border py-2 px-3' id='card-expiry' />
                        </div>
                        <div>
                            <label htmlFor="card-cvc" className="block text-gray-700 mb-1">CVV</label>
                            <CardCvcElement className='w-full rounded-lg border py-2 px-3' id='card-cvc' />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
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

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={handlePay}
                    className={`bg-primary flex p-3 justify-center items-center text-white w-full font-medium mt-3 ${pLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={pLoading}
                >
                    {pLoading ? (
                        <>
                            <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                                </path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'Pay'
                    )}
                </button>
            </div>
        </>
    );
};

export default AddCard;
