// Product Categories Configuration - Used across the entire project
export const PRODUCT_CATEGORIES = {
  ALL: 'all',
  MEN: 'men',
  WOMEN: 'women',
  NEW: 'new',
  SALE: 'sale',
  LATEST: 'latest'
};

export const CATEGORY_LABELS = {
  [PRODUCT_CATEGORIES.ALL]: 'All',
  [PRODUCT_CATEGORIES.MEN]: 'Men',
  [PRODUCT_CATEGORIES.WOMEN]: 'Women',
  [PRODUCT_CATEGORIES.NEW]: 'New',
  [PRODUCT_CATEGORIES.SALE]: 'Sale',
  [PRODUCT_CATEGORIES.LATEST]: 'Latest'
};

// Get category by product data
export const getProductCategory = (product) => {
  if (product.price < 50) return PRODUCT_CATEGORIES.SALE;
  if (product.id <= 10) return PRODUCT_CATEGORIES.NEW;
  return product.category || PRODUCT_CATEGORIES.ALL;
};

// Filter products by category
export const filterProductsByCategory = (products, category) => {
  if (category === PRODUCT_CATEGORIES.ALL) return products;
  
  switch (category) {
    case PRODUCT_CATEGORIES.MEN:
      return products.filter(item => item.category === "men's clothing");
    case PRODUCT_CATEGORIES.WOMEN:
      return products.filter(item => item.category === "women's clothing");
    case PRODUCT_CATEGORIES.NEW:
      return products.filter(item => item.id <= 10);
    case PRODUCT_CATEGORIES.SALE:
      return products.filter(item => item.price < 50);
    case PRODUCT_CATEGORIES.LATEST:
      return products.slice(0, 20); // First 20 products as latest
    default:
      return products;
  }
};
