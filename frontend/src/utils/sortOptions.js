// Product Sorting Configuration - Used across the entire project
export const SORT_OPTIONS = {
  FEATURED: 'featured',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  NEWEST: 'newest',
  POPULAR: 'popular'
};

export const SORT_LABELS = {
  [SORT_OPTIONS.FEATURED]: 'Featured',
  [SORT_OPTIONS.PRICE_LOW]: 'Price Low',
  [SORT_OPTIONS.PRICE_HIGH]: 'Price High',
  [SORT_OPTIONS.NEWEST]: 'Newest',
  [SORT_OPTIONS.POPULAR]: 'Popular'
};

// Sort products by option
export const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case SORT_OPTIONS.PRICE_LOW:
      return sortedProducts.sort((a, b) => a.price - b.price);
    
    case SORT_OPTIONS.PRICE_HIGH:
      return sortedProducts.sort((a, b) => b.price - a.price);
    
    case SORT_OPTIONS.NEWEST:
      return sortedProducts.sort((a, b) => b.id - a.id);
    
    case SORT_OPTIONS.POPULAR:
      // Sort by rating count (popularity)
      return sortedProducts.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
    
    case SORT_OPTIONS.FEATURED:
    default:
      return sortedProducts; // Keep original order
  }
};
