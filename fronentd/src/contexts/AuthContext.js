import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setToken, logout } from '../redux/authAction';

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const checkAuth = async () => {
        const token = Cookies.get('token');

        if (token) {
            try {
                const response = await axios.get('http://localhost:8000/api/protect', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    dispatch(setToken(token));
                } else {
                    setIsLoggedIn(false);
                    dispatch(logout());
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
