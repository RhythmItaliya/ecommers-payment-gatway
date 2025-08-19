import React, { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  // products state
  const [products, setProducts] = useState([]);
  
  // fetch products from backend instead of external API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use backend products API instead of external API
        const response = await fetch(process.env.REACT_APP_API_URL + "/products");
        const data = await response.json();
        
        // Transform the data to match the expected structure
        const transformedProducts = data.map(product => ({
          id: product.id,
          title: product.name,
          price: product.price / 100, // Convert from cents to dollars
          description: product.description,
          category: product.category.toLowerCase(),
          image: product.pictures && product.pictures[0] ? 
            `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}` : 
            'https://via.placeholder.com/300x300?text=Product',
          rating: {
            rate: product.rating || 0,
            count: product.stock || 0
          }
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty array if backend is not available
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
