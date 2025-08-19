import React from "react";

const FilterSidebar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange, 
  sortBy, 
  setSortBy 
}) => {
  // Clothing-specific categories
  const clothingCategories = [
    { id: "all", name: "All Clothing" },
    { id: "men's clothing", name: "Men's Fashion" },
    { id: "women's clothing", name: "Women's Fashion" },
    { id: "latest", name: "Latest Trends" }
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4 mb-6">
      <div className="container mx-auto px-4">
        {/* Filter Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {clothingCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Price and Sort Controls */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Price :</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Low to High</option>
                <option value="price-high">High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange([0, 1000]);
                setSortBy("featured");
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
