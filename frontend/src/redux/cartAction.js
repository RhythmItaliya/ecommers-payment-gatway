import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.get(`${API_URL}/cart`, { headers });
            console.log('fetchCart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.post(`${API_URL}/cart/add`, 
                { productId, quantity },
                { headers }
            );
            console.log('addToCart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateCartItemQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.put(`${API_URL}/cart/update/${productId}`, 
                { quantity },
                { headers }
            );
            console.log('updateCartItemQuantity response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, { headers });
            console.log('removeFromCart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.delete(`${API_URL}/cart/clear`, { headers });
            console.log('clearCart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

// Legacy actions for backward compatibility
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_CART = 'SET_CART';
export const SET_CART_LOADING = 'SET_CART_LOADING';

export const addToCartLegacy = (product) => ({ type: ADD_TO_CART, payload: product });
export const removeFromCartLegacy = (id) => ({ type: REMOVE_FROM_CART, payload: id });
export const updateQuantity = (id, quantity) => ({ type: UPDATE_QUANTITY, payload: { id, quantity } });
export const clearCartLegacy = () => ({ type: CLEAR_CART });
export const setCart = (cart) => ({ type: SET_CART, payload: cart });
export const setCartLoading = (loading) => ({ type: SET_CART_LOADING, payload: loading });
