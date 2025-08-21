export const PRICE_RANGES = {
  ALL: [0, 1000],
  LOW: [0, 50],
  MEDIUM: [50, 200],
  HIGH: [200, 500],
  LUXURY: [500, 1000]
};

export const PRICE_RANGE_LABELS = {
  ALL: 'All Prices',
  LOW: 'Under $50',
  MEDIUM: '$50 - $200',
  HIGH: '$200 - $500',
  LUXURY: '$500+'
};

// Filter products by price range
export const filterProductsByPrice = (products, [minPrice, maxPrice]) => {
  return products.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};

// Get price range from products
export const getProductPriceRange = (products) => {
  if (!products.length) return [0, 1000];
  
  const prices = products.map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
};

// Format price for display
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};
