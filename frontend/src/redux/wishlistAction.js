import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await axios.get(`${API_URL}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await axios.post(`${API_URL}/wishlist/add`, 
                { productId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await axios.delete(`${API_URL}/wishlist/remove/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    }
);

export const clearWishlist = createAsyncThunk(
    'wishlist/clearWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await axios.delete(`${API_URL}/wishlist/clear`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
        }
    }
);

export const checkWishlistStatus = createAsyncThunk(
    'wishlist/checkWishlistStatus',
    async (productId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await axios.get(`${API_URL}/wishlist/check/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to check wishlist status');
        }
    }
);

// Legacy actions for backward compatibility
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
export const CLEAR_WISHLIST = 'CLEAR_WISHLIST';
export const SET_WISHLIST = 'SET_WISHLIST';
export const SET_WISHLIST_LOADING = 'SET_WISHLIST_LOADING';

export const addToWishlistLegacy = (product) => ({ type: ADD_TO_WISHLIST, payload: product });
export const removeFromWishlistLegacy = (id) => ({ type: REMOVE_FROM_WISHLIST, payload: id });
export const clearWishlistLegacy = () => ({ type: CLEAR_WISHLIST });
export const setWishlist = (wishlist) => ({ type: SET_WISHLIST, payload: wishlist });
export const setWishlistLoading = (loading) => ({ type: SET_WISHLIST_LOADING, payload: loading });
