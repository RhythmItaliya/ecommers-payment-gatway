import React from "react";
import { PRODUCT_CATEGORIES, CATEGORY_LABELS, SORT_OPTIONS, SORT_LABELS, PRICE_RANGES } from "../utils";

const FilterSidebar = ({ selectedCategory, setSelectedCategory, priceRange, setPriceRange, sortBy, setSortBy }) => {
  const clearFilters = () => {
    setSelectedCategory(PRODUCT_CATEGORIES.ALL);
    setPriceRange(PRICE_RANGES.ALL);
    setSortBy(SORT_OPTIONS.FEATURED);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {Object.values(PRODUCT_CATEGORIES).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Price:</span>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                placeholder="Min"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 1000])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
              >
                {Object.values(SORT_OPTIONS).map(option => (
                  <option key={option} value={option}>{SORT_LABELS[option]}</option>
                ))}
              </select>
            </div>

            <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-gray-800 underline">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
