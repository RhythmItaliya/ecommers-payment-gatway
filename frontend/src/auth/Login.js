import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkAuthStatus } from '../redux/authAction';
import { showSuccessToast, showErrorToast } from '../redux/toastAction';
import { FaTimes } from 'react-icons/fa';

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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {/* Error messages handled by toast notifications */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                disabled={loading}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`py-2 px-4 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg max-w-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                                        </path>
                                    </svg>
                                    Loading
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                    <div className="text-sm font-medium text-gray-500 text-center">
                        Not registered? <button type="button" onClick={() => { onClose(); onRegisterClick(); }} className="text-blue-700 hover:underline">Create account</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
