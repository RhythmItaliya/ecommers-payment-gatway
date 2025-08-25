import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, checkAuthStatus, updateUserProfile, updatePassword, logoutUser } from './authAction';

const initialState = {
    token: null,
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null,
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
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

            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
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

            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload.data || action.payload.user || state.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.user = action.payload.data || state.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            })

            .addCase('CLEAR_ALL_STORES', (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { setToken, logout, setAuthLoading, setUser, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
