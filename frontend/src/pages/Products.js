import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { PRODUCT_CATEGORIES, SORT_OPTIONS, filterProductsByCategory, sortProducts, filterProductsByPrice } from "../utils";

const Products = () => {
  const { products, loading, error } = useContext(ProductContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(PRODUCT_CATEGORIES.ALL);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.FEATURED);

  // Read URL parameters on component mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    console.log('Products page - URL category param:', categoryParam);
    console.log('Products page - Available categories:', Object.values(PRODUCT_CATEGORIES));
    
    if (categoryParam && Object.values(PRODUCT_CATEGORIES).includes(categoryParam)) {
      console.log('Products page - Setting category to:', categoryParam);
      setSelectedCategory(categoryParam);
    } else {
      console.log('Products page - No valid category param, using default:', PRODUCT_CATEGORIES.ALL);
    }
  }, [searchParams]);

  // Update URL when category changes
  const handleCategoryChange = (category) => {
    console.log('Products page - Category changed to:', category);
    setSelectedCategory(category);
    if (category === PRODUCT_CATEGORIES.ALL) {
      console.log('Products page - Removing category parameter from URL');
      setSearchParams({}); // Remove category parameter
    } else {
      console.log('Products page - Setting category parameter in URL:', category);
      setSearchParams({ category });
    }
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Category filter
    filtered = filterProductsByCategory(filtered, selectedCategory);

    // Price filter
    filtered = filterProductsByPrice(filtered, priceRange);

    // Sort products
    filtered = sortProducts(filtered, sortBy);

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="pt-20">
        {/* Header Section */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory === PRODUCT_CATEGORIES.ALL ? 'Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h1>
              <div className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
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

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="text-red-500 text-6xl mb-6">⚠️</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Products</h3>
                <p className="text-gray-600 mb-6 text-lg">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-gray-400 text-6xl mb-6">📦</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Products Available</h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      {products.length === 0 
                        ? "We're currently setting up our product catalog. Check back soon!" 
                        : `No products found in the ${selectedCategory} category.`
                      }
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
