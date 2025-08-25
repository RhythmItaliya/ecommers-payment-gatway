import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkAuthStatus } from '../redux/authAction';
import { showSuccessToast, showErrorToast } from '../redux/toastAction';
import { FaTimes } from 'react-icons/fa';
import { Input, Button } from '../components/ui';

const Login = ({ isOpen, onClose, onRegisterClick }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
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

        if (!formData.password.trim()) {
            dispatch(showErrorToast('Password is required'));
            return;
        }

        try {
            const cleanFormData = {
                username: formData.username.trim(),
                password: formData.password,
            };

            const result = await dispatch(loginUser(cleanFormData));

            if (loginUser.fulfilled.match(result)) {
                localStorage.setItem('token', result.payload.token);
                await dispatch(checkAuthStatus());
                dispatch(showSuccessToast('Login successful! Welcome back!'));
                onClose();
                navigate('/');
            } else if (loginUser.rejected.match(result)) {
                let errorMessage = 'Login failed. Please try again.';

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
            dispatch(showErrorToast('An error occurred during login'));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                <h2 className="text-2xl font-bold text-primary mb-6">Login</h2>
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
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            autoComplete="current-password"
                            iconRight={
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="text-neutral hover:text-primary transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            }
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
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                    <div className="text-sm font-medium text-neutral text-center">
                        Not registered?{' '}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onRegisterClick();
                            }}
                            className="text-accent hover:text-accent/80 transition-colors"
                        >
                            Create account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
