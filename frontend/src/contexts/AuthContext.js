import React, { createContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authAction';

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { isLoggedIn, loading, user } = useSelector(state => state.auth);

    const handleLogout = () => {
        // Dispatch logout action which handles both localStorage and cookies
        dispatch(logoutUser());
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            loading, 
            user,
            logout: handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
