import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, fetchCart } from '../../redux/cartAction';
import CheckOutItem from './CheckOutItem';
import { Button, Input, LoadingSpinner } from '../ui';

const Checkout = () => {
    const { items: cart, loading } = useSelector((state) => state.cart);
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        if (isLoggedIn && !cart) {
            dispatch(fetchCart());
        }

        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address?.streetAddress || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zipCode: user.address?.zipCode || '',
                country: user.address?.country || '',
            });
        }
    }, [isLoggedIn, cart?.length, navigate, user, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateSubtotal = () => {
        if (!cart || cart.length === 0) return 0;
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.18;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        if (paymentMethod === 'razorpay') {
            navigate('/razorpay-payment', {
                state: {
                    formData,
                    cart,
                    total: calculateTotal(),
                },
            });
        }
    };

    if (loading || !cart) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <LoadingSpinner size="lg" variant="primary" text="Loading checkout..." />
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-primary mb-2">Please Login</h3>
                    <p className="text-neutral mb-4">You need to be logged in to checkout.</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <div className="text-neutral text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Your Cart is Empty</h3>
                    <p className="text-neutral mb-4">Add some products to your cart before checkout.</p>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-primary mb-6">Shipping Information</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                        />

                        <Input
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="ZIP Code"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <Input
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-primary mb-3">Payment Method</label>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="razorpay"
                                        checked={paymentMethod === 'razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-accent focus:ring-accent focus:ring-2 focus:ring-accent/50"
                                    />
                                    <span className="text-neutral">
                                        Razorpay (Credit/Debit Cards, UPI, Net Banking)
                                    </span>
                                </label>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" size="lg" className="w-full">
                            Proceed to Payment
                        </Button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-primary mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                        {cart &&
                            cart.map((item) => (
                                <CheckOutItem
                                    key={item.productId?._id || item.product?._id || item.id || Math.random()}
                                    item={item}
                                />
                            ))}
                    </div>

                    <div className="border-t border-light pt-4 space-y-3">
                        <div className="flex justify-between text-neutral">
                            <span>Subtotal:</span>
                            <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-neutral">
                            <span>Tax (18%):</span>
                            <span>₹{calculateTax().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-primary">
                            <span>Total:</span>
                            <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
