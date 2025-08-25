import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authAction';
import { showSuccessToast, showErrorToast } from '../redux/toastAction';
import { FaTimes } from 'react-icons/fa';
import { Input, Button } from '../components/ui';

const Register = ({ isOpen, onClose, onLoginClick }) => {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            dispatch(showErrorToast('Username is required'));
            return;
        }

        if (!formData.firstName.trim()) {
            dispatch(showErrorToast('First name is required'));
            return;
        }

        if (!formData.lastName.trim()) {
            dispatch(showErrorToast('Last name is required'));
            return;
        }

        if (!formData.email.trim()) {
            dispatch(showErrorToast('Email is required'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            dispatch(showErrorToast('Please enter a valid email address'));
            return;
        }

        if (!formData.password.trim()) {
            dispatch(showErrorToast('Password is required'));
            return;
        }

        if (formData.password.length < 5) {
            dispatch(showErrorToast('Password must be at least 5 characters long'));
            return;
        }

        try {
            const cleanFormData = {
                username: formData.username.trim(),
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            };

            const result = await dispatch(registerUser(cleanFormData));

            if (registerUser.fulfilled.match(result)) {
                dispatch(showSuccessToast('Registration successful! You can now login.'));
                onClose();
            } else if (registerUser.rejected.match(result)) {
                let errorMessage = 'Registration failed. Please try again.';

                if (result.payload) {
                    if (result.payload.errors && Array.isArray(result.payload.errors)) {
                        errorMessage = result.payload.errors.join(', ');
                    } else if (result.payload.message) {
                        errorMessage = result.payload.message;
                    }
                }

                dispatch(showErrorToast(errorMessage));
            }
        } catch (error) {
            dispatch(showErrorToast('An error occurred during registration'));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                className={`bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative ${loading ? 'cursor-not-allowed' : ''}`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-neutral hover:text-primary transition-colors"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-2xl font-bold text-primary mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <Input
                            label="First Name"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="given-name"
                        />
                    </div>
                    <div>
                        <Input
                            label="Last Name"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="family-name"
                        />
                    </div>
                    <div>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={loading}
                            loading={loading}
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </Button>
                    </div>
                    <div className="text-sm font-medium text-neutral text-center">
                        Already registered?{' '}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onLoginClick();
                            }}
                            className="text-accent hover:text-accent/80 transition-colors"
                        >
                            Login to your account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
