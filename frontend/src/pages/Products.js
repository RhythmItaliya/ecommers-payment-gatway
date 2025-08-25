import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import {
    PRODUCT_CATEGORIES,
    SORT_OPTIONS,
    filterProductsByCategory,
    sortProducts,
    filterProductsByPrice,
} from '../utils';
import { ErrorState, LoadingSpinner } from '../components/ui';

const Products = () => {
    const { products, loading, error } = useContext(ProductContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(PRODUCT_CATEGORIES.ALL);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.FEATURED);

    useEffect(() => {
        const categoryParam = searchParams.get('category');

        if (categoryParam && Object.values(PRODUCT_CATEGORIES).includes(categoryParam)) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === PRODUCT_CATEGORIES.ALL) {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

    const getFilteredProducts = () => {
        let filtered = [...products];

        filtered = filterProductsByCategory(filtered, selectedCategory);
        filtered = filterProductsByPrice(filtered, priceRange);
        filtered = sortProducts(filtered, sortBy);

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-20">
                <section className="bg-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {selectedCategory === PRODUCT_CATEGORIES.ALL
                                    ? 'Products'
                                    : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                            </h1>
                            <div className="text-sm text-gray-500">
                                Showing {filteredProducts.length} of {products.length} products
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="mb-8">
                            <FilterSidebar
                                selectedCategory={selectedCategory}
                                setSelectedCategory={handleCategoryChange}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                            />
                        </div>

                        {loading && (
                            <div className="text-center py-20">
                                <LoadingSpinner />
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-20">
                                <ErrorState error={error} onRetry={() => window.location.reload()} />
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {filteredProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="text-gray-400 text-6xl mb-6">📦</div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                            No Products Available
                                        </h3>
                                        <p className="text-gray-600 mb-6 text-lg">
                                            {products.length === 0
                                                ? "We're currently setting up our product catalog. Check back soon!"
                                                : `No products found in the ${selectedCategory} category.`}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Products;
