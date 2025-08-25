import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

axios.defaults.withCredentials = true;

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, credentials);
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
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/user`, userData);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue('Registration failed');
    }
});

export const checkAuthStatus = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = { user: response.data.data, token };

        return result;
    } catch (error) {
        // If token is invalid, remove it from localStorage
        if (error.response?.status === 401 || error.response?.status === 404) {
            localStorage.removeItem('token');
        }
        return rejectWithValue('Authentication failed');
    }
});

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
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
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

export const updatePassword = createAsyncThunk('auth/updatePassword', async (passwordData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.put(`${API_URL}/user/password`, passwordData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        if (error.response?.data) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue('Password update failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        localStorage.removeItem('token');

        await axios.post(`${API_URL}/user/logout`);

        return { message: 'Logout successful' };
    } catch (error) {
        localStorage.removeItem('token');
        return { message: 'Logout successful' };
    }
});

export const clearAllStores = () => ({
    type: 'CLEAR_ALL_STORES',
});

export const logout = () => (dispatch) => {
    dispatch(clearAllStores());

    localStorage.clear();
    if (typeof document !== 'undefined') {
        document.cookie.split(';').forEach(function (c) {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
    }

    return { type: 'LOGOUT' };
};
