// CardContext.js
import React, { createContext, useContext, useState } from 'react';

const CardContext = createContext();

export const useCard = () => useContext(CardContext);

export const CardProvider = ({ children }) => {
    const [cardDetails, setCardDetails] = useState({});

    return (
        <CardContext.Provider value={{ cardDetails, setCardDetails }}>
            {children}
        </CardContext.Provider>
    );
};
