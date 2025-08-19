import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to include credentials (cookies)
axios.defaults.withCredentials = true;

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/login`, credentials);
            // Store token in localStorage for frontend use
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user`, userData);
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Registration failed');
        }
    }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            console.log('checkAuthStatus - Token from localStorage:', token);
            
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await axios.get(`${API_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = { user: response.data.data, token };
            console.log('checkAuthStatus - API response:', response.data);
            console.log('checkAuthStatus - Returning:', result);
            
            return result;
        } catch (error) {
            console.error('checkAuthStatus - Error:', error);
            return rejectWithValue('Authentication failed');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await axios.put(`${API_URL}/user/profile`, profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Profile update failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            // Clear localStorage
            localStorage.removeItem('token');
            
            // Make request to backend to clear cookies
            await axios.post(`${API_URL}/user/logout`);
            
            return { message: 'Logout successful' };
        } catch (error) {
            // Even if backend request fails, clear localStorage
            localStorage.removeItem('token');
            return { message: 'Logout successful' };
        }
    }
);
