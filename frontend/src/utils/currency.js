export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

export const convertUSDToINR = async (usdAmount) => {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const inrRate = data.rates.INR;
        return (usdAmount * inrRate).toFixed(2);
    } catch (error) {
        return (usdAmount * 75).toFixed(2);
    }
};

export const convertINRToUSD = async (inrAmount) => {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const inrRate = data.rates.INR;
        return (inrAmount / inrRate).toFixed(2);
    } catch (error) {
        return (inrAmount / 75).toFixed(2);
    }
};

export const formatINRPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '₹0';
    return `₹${parseFloat(price).toFixed(2)}`;
};

export const formatPrice = (price, currency = 'INR') => {
    if (typeof price !== 'number' || isNaN(price)) return '₹0';

    switch (currency.toUpperCase()) {
        case 'USD':
            return `$${parseFloat(price).toFixed(2)}`;
        case 'INR':
        default:
            return `₹${parseFloat(price).toFixed(2)}`;
    }
};

export const getCurrencySymbol = (currency = 'INR') => {
    switch (currency.toUpperCase()) {
        case 'USD':
            return '$';
        case 'INR':
        default:
            return '₹';
    }
};

export const roundAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 0;
    return Math.round(amount * 100) / 100;
};

export const convertToPaise = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 0;
    return Math.round(amount * 100);
};
