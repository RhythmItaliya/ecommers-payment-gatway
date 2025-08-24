import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, checkAuthStatus, updateUserProfile, logoutUser } from './authAction';

const initialState = { 
    token: null, 
    isLoggedIn: false, 
    user: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            state.isLoggedIn = true;
            state.error = null;
        },
        logout: (state) => {
            state.token = null;
            state.isLoggedIn = false;
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        setAuthLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.error = null;
        },
        initializeAuth: (state, action) => {
            state.token = action.payload;
            state.isLoggedIn = !!action.payload;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login fulfilled - payload:', action.payload);
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.user = action.payload.data || null;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Check auth status cases
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                console.log('CheckAuth fulfilled - payload:', action.payload);
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.user = action.payload.user || null;
                state.loading = false;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            
            // Update profile cases
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                console.log('Update profile fulfilled - payload:', action.payload);
                state.user = action.payload.data || action.payload.user || state.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                // Clear auth state
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.loading = false;
                state.error = null;
                
                // Dispatch clearAllStores to clear other reducers
                // This will be handled by the component calling logoutUser
            })
            .addCase(logoutUser.rejected, (state) => {
                // Even if logout fails, clear the state
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            
            // Clear all stores case
            .addCase('CLEAR_ALL_STORES', (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            });
    }
});

export const { setToken, logout, setAuthLoading, setUser, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
