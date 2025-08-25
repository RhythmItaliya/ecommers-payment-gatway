import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/cartAction';
import { Button, LoadingSpinner, ErrorState } from '../ui';

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

    // Load Razorpay script if not already loaded
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
        // Only remove if we added it
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



    // Check if required environment variables are configured
    if (!process.env.REACT_APP_RAZORPAY_KEY) {
      console.error('Razorpay key not found:', process.env.REACT_APP_RAZORPAY_KEY);
      setError('Payment gateway configuration error. Please contact support.');
      return;
    }

    if (!process.env.REACT_APP_API_URL) {
      setError('API configuration error. Please contact support.');
      return;
    }

    // Validate cart and form data
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
      // Create Razorpay order on your backend
      const orderResponse = await fetch(`${process.env.REACT_APP_API_URL}/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create Razorpay order');
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: Math.round(total * 100), // Convert to paise
        currency: 'INR',
        name: 'SnapShop',
        description: `Order #${orderData.order.id}`,
        order_id: orderData.order.id,
        handler: function (response) {
          // Payment successful
          handlePaymentSuccess(response, orderData.order.id);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#1f2937' // Using primary color
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (rzpError) {
        console.error('Razorpay initialization error:', rzpError);
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
      console.log('Payment success handler called with:', { response, orderId });
      setLoading(true); // Show loading during verification
      
      // Verify payment on backend
      const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/razorpay/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        console.log('Payment verification successful, navigating to success page...');
        // Clear cart and redirect to success page
        dispatch(clearCart());
        setLoading(false); // Clear loading before navigation
        navigate('/success', { 
          state: { 
            orderId: orderId,
            paymentIntentId: response.razorpay_payment_id,
            paymentMethod: 'Razorpay',
            orderDetails: {
              orderId: orderId,
              paymentId: response.razorpay_payment_id,
              amount: total,
              currency: 'INR'
            }
          } 
        });
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (err) {
      setLoading(false); // Clear loading on error
      setError('Payment verification failed. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <LoadingSpinner size="lg" variant="primary" text="Initializing payment..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorState 
          error={error} 
          onRetry={() => setError(null)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-6">Complete Your Payment</h1>
          
          {/* Order Summary */}
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

          {/* Payment Button */}
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
            
            <p className="text-sm text-neutral mt-4">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
