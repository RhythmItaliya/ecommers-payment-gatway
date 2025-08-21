import React, { useState, useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import ProductCard from "./ProductCard";
import { PRODUCT_CATEGORIES, CATEGORY_LABELS, filterProductsByCategory } from "../utils";

const ProductShowcase = () => {
  const { products, loading, error } = useContext(ProductContext);
  const [activeCategory, setActiveCategory] = useState(PRODUCT_CATEGORIES.ALL);

  const getFilteredProducts = () => {
    const filtered = filterProductsByCategory(products, activeCategory);
    return filtered.slice(0, 8);
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our curated collections for every style and occasion
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.values(PRODUCT_CATEGORIES).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Products</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
                <p className="text-gray-600 mb-4">
                  {products.length === 0 
                    ? "We're currently setting up our product catalog. Check back soon!" 
                    : `No products found in the ${CATEGORY_LABELS[activeCategory]} category.`
                  }
                </p>
                {products.length === 0 && (
                  <Link to="/products" className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Browse All Products
                    <BsArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* View All Button - Only show if there are products */}
        {!loading && !error && products.length > 0 && (
          <div className="text-center">
            <Link to="/products" className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              View All Products
              <BsArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
