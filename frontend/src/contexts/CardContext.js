import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/cartAction';

const CardContext = createContext();

export const useCard = () => {
    const context = useContext(CardContext);
    if (!context) {
        throw new Error('useCard must be used within a CardProvider');
    }
    return context;
};

export const CardProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { items: cartItems, totalQuantity, totalAmount } = useSelector((state) => state.cart);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchCart());
        }
    }, [isLoggedIn, dispatch]);

    const value = {
        cartItems,
        totalQuantity: totalQuantity || 0,
        totalAmount: totalAmount || 0,
    };

    return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export default CardProvider;
