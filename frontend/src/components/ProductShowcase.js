import React, { useState, useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import ProductCard from "./ProductCard";

const ProductShowcase = () => {
  const { products } = useContext(ProductContext);
  const [activeCategory, setActiveCategory] = useState("all");

  // Category definitions
  const categories = [
    { id: "all", name: "All Products", color: "bg-primary" },
    { id: "men", name: "Men", color: "bg-blue-600" },
    { id: "women", name: "Women", color: "bg-pink-600" },
    { id: "new", name: "New Arrivals", color: "bg-green-600" },
    { id: "sale", name: "Sale", color: "bg-red-600" }
  ];

  // Filter products based on active category
  const getFilteredProducts = () => {
    switch (activeCategory) {
      case "men":
        return products.filter(item => item.category === "men's clothing").slice(0, 8);
      case "women":
        return products.filter(item => item.category === "women's clothing").slice(0, 8);
      case "new":
        return products.filter(item => item.id <= 10).slice(0, 8); // First 10 products as "new"
      case "sale":
        return products.filter(item => item.price < 50).slice(0, 8); // Products under $50 as "sale"
      default:
        return products.filter(item => 
          item.category === "men's clothing" || 
          item.category === "women's clothing" || 
          item.category === "jewelery"
        ).slice(0, 8);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our curated collections for every style and occasion
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? `${category.color} text-white shadow-lg`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
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

        {/* View All Button */}
        <div className="text-center">
          <Link 
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 uppercase tracking-wider group"
          >
            View All Products
            <BsArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
