import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                const response = await axios.get(`${apiUrl}/products`);
                const result = response.data;

                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch products');
                }

                const transformedProducts = result.data.products.map((product) => ({
                    id: product.id,
                    title: product.title || product.name,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    image:
                        product.image ||
                        (product.pictures && product.pictures[0]) ||
                        `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.title || product.name)}`,
                    rating: {
                        rate: product.rating?.rate || 0,
                        count: product.rating?.count || 0,
                    },
                    stock: product.stock || 0,
                    discount: product.discount || 0,
                    salePrice: product.salePrice || product.price,
                    tags: product.tags || [],
                    size: product.size || [],
                    colors: product.colors || [],
                }));

                setProducts(transformedProducts);
            } catch (error) {
                setError(error.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return <ProductContext.Provider value={{ products, loading, error }}>{children}</ProductContext.Provider>;
};

export default ProductProvider;
