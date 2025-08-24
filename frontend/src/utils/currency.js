// Currency utility functions
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

// Convert USD to INR using exchange rate API
export const convertUSDToINR = async (usdAmount) => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const inrRate = data.rates.INR;
    return (usdAmount * inrRate).toFixed(2);
  } catch (error) {
    console.error('Error converting currency:', error);
    // Fallback to approximate rate (1 USD = 75 INR)
    return (usdAmount * 75).toFixed(2);
  }
};

// Convert INR to USD using exchange rate API
export const convertINRToUSD = async (inrAmount) => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const inrRate = data.rates.INR;
    // Convert INR to USD by dividing by the INR rate
    return (inrAmount / inrRate).toFixed(2);
  } catch (error) {
    console.error('Error converting currency:', error);
    // Fallback to approximate rate (1 USD = 75 INR)
    return (inrAmount / 75).toFixed(2);
  }
};

// Format price in INR with rupee symbol
export const formatINRPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '₹0';
  return `₹${parseFloat(price).toFixed(2)}`;
};

// Format price with currency symbol (defaults to INR)
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

// Get currency symbol
export const getCurrencySymbol = (currency = 'INR') => {
  switch (currency.toUpperCase()) {
    case 'USD':
      return '$';
    case 'INR':
    default:
      return '₹';
  }
};

// Round amount to 2 decimal places to avoid floating-point precision issues
export const roundAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return 0;
  return Math.round(amount * 100) / 100;
};

// Convert amount to paise (integer) for payment gateways
export const convertToPaise = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return 0;
  return Math.round(amount * 100);
};
