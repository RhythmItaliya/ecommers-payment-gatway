import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkAuthStatus } from '../redux/authAction';
import { showSuccessToast, showErrorToast } from '../redux/toastAction';
import { FaTimes } from 'react-icons/fa';
import { Input, Button, LoadingSpinner } from '../components/ui';

const Login = ({ isOpen, onClose, onRegisterClick }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic frontend validation
        if (!formData.username.trim()) {
            dispatch(showErrorToast('Username is required'));
            return;
        }
        
        if (!formData.password.trim()) {
            dispatch(showErrorToast('Password is required'));
            return;
        }
        
        try {
            // Regular user login using Redux
            const cleanFormData = {
                username: formData.username.trim(),
                password: formData.password
            };
            
            const result = await dispatch(loginUser(cleanFormData));
            
            if (loginUser.fulfilled.match(result)) {
                console.log('Login successful, result:', result.payload);
                console.log('Redux state after login:', result);
                // Store token in localStorage
                localStorage.setItem('token', result.payload.token);
                
                // Now check auth status to ensure Redux state is properly updated
                await dispatch(checkAuthStatus());
                
                // Show success toast
                dispatch(showSuccessToast('Login successful! Welcome back!'));
                
                onClose();
                navigate('/');
                // Don't reload the page, let Redux handle the state
            } else if (loginUser.rejected.match(result)) {
                console.log('Login failed:', result.payload);
                let errorMessage = 'Login failed. Please try again.';
                
                if (result.payload) {
                    // Handle different types of errors
                    if (result.payload.errors && Array.isArray(result.payload.errors)) {
                        // Multiple validation errors
                        errorMessage = result.payload.errors.join(', ');
                    } else if (result.payload.message) {
                        // Single error message
                        errorMessage = result.payload.message;
                    }
                }
                
                dispatch(showErrorToast(errorMessage));
            }
            
        } catch (error) {
            // Error is handled by Redux reducer
            console.error('Login error:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-neutral hover:text-primary transition-colors"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-2xl font-bold text-primary mb-6">Login</h2>
                {/* Error messages handled by toast notifications */}
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
                        Not registered? <button type="button" onClick={() => { onClose(); onRegisterClick(); }} className="text-accent hover:text-accent/80 transition-colors">Create account</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
