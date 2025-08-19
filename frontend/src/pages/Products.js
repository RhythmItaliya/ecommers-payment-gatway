import React, { useState, useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";

const Products = () => {
  const { products } = useContext(ProductContext);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "latest") {
        // Show newest products (first 20 products)
        filtered = filtered.slice(0, 20);
      } else {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
    }

    // Price filter
    filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "popular":
        // Sort by rating count (popularity)
        filtered.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        break;
      default:
        // Keep original order for "featured"
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Filter Bar */}
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showQuickActions={true}
                showRating={true}
                showCategory={true}
                showAddToCart={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
