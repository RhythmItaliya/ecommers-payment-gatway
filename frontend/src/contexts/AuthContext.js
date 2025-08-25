import React, { createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authAction';
import { clearAllData } from '../utils/storeUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { isLoggedIn, loading, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        clearAllData(dispatch);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                loading,
                user,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
