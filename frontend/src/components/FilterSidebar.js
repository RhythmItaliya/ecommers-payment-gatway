import React from "react";
import { PRODUCT_CATEGORIES, SORT_OPTIONS, SORT_LABELS, PRICE_RANGES } from "../utils";
import { Input, Button } from "./ui";

const FilterSidebar = ({ selectedCategory, setSelectedCategory, priceRange, setPriceRange, sortBy, setSortBy }) => {
  const clearFilters = () => {
    setSelectedCategory(PRODUCT_CATEGORIES.ALL);
    setPriceRange(PRICE_RANGES.ALL);
    setSortBy(SORT_OPTIONS.FEATURED);
  };

  const handleMinPriceChange = (e) => {
    const value = Math.max(0, Number(e.target.value) || 0);
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.min(10000, Math.max(priceRange[0], Number(e.target.value) || 1000));
    setPriceRange([priceRange[0], value]);
  };

  const isPriceRangeValid = priceRange[0] <= priceRange[1] && priceRange[0] >= 0 && priceRange[1] <= 10000;

  return (
    <div className="w-full bg-white border-b border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Category Selection */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-primary">Category:</span>
            {Object.values(PRODUCT_CATEGORIES).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">Price:</span>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                className="w-24"
                placeholder="Min"
                min="0"
                max={priceRange[1]}
                step="1"
                error={!isPriceRangeValid ? "Invalid range" : ""}
              />
              <span className="text-neutral">-</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="w-24"
                placeholder="Max"
                min={priceRange[0]}
                max="10000"
                step="1"
                error={!isPriceRangeValid ? "Invalid range" : ""}
              />
              {!isPriceRangeValid && (
                <span className="text-xs text-red-500">Invalid price range</span>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
              >
                {Object.values(SORT_OPTIONS).map(option => (
                  <option key={option} value={option}>{SORT_LABELS[option]}</option>
                ))}
              </select>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-neutral hover:text-primary"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
