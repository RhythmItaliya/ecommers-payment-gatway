import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import wishlistReducer from './wishlistReducer';
import toastReducer from './toastReducer';

const store = configureStore({
  reducer: { 
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    toast: toastReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
