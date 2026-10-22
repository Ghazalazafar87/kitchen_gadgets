import React, { useState } from 'react';
import { FilterState, SortOption, CategoryType } from '../types';
import { formatPKR } from '../config';
import { Search, SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';

interface SearchFilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  onResetFilters: () => void;
  resultCount: number;
  totalCount: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filter,
  onFilterChange,
  onResetFilters,
  resultCount,
  totalCount,
}) => {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const hasActiveFilters = 
    filter.searchQuery !== '' ||
    filter.minPrice > 0 ||
    filter.maxPrice < 25000 ||
    filter.inStockOnly ||
    filter.minRating > 0 ||
    filter.sortBy !== 'featured';

  return (
    <div className="bg-white border-b border-stone-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search pans, air fryers, spice mills, canisters..."
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#2D5A46] transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Utilities: Filter Trigger + Sort Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between md:justify-end">
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                hasActiveFilters
                  ? 'bg-emerald-50 text-[#2D5A46] border-emerald-300'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#2D5A46]" />
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-stone-500 whitespace-nowrap">Sort:</span>
              <select
                value={filter.sortBy}
                onChange={(e) => onFilterChange({ ...filter, sortBy: e.target.value as SortOption })}
                className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white text-stone-800 font-medium focus:outline-none focus:border-[#2D5A46]"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Result count */}
            <span className="text-xs text-stone-500 tabular-nums whitespace-nowrap hidden lg:inline">
              Showing <strong>{resultCount}</strong> of {totalCount} tools
            </span>

          </div>

        </div>

        {/* Expandable Filter Drawer Panel */}
        {showFilterDrawer && (
          <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-1 text-xs">
            
            {/* Price Range Filter */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-800 block">
                Max Price: {formatPKR(filter.maxPrice)}
              </label>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={filter.maxPrice}
                onChange={(e) => onFilterChange({ ...filter, maxPrice: Number(e.target.value) })}
                className="w-full accent-[#2D5A46]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 tabular-nums">
                <span>{formatPKR(1000)}</span>
                <span>{formatPKR(25000)}</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <span className="font-bold text-stone-800 block">Availability</span>
              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.inStockOnly}
                  onChange={(e) => onFilterChange({ ...filter, inStockOnly: e.target.checked })}
                  className="rounded text-[#2D5A46] focus:ring-[#2D5A46]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Customer Rating Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-stone-800 block">Minimum Rating</span>
              <div className="flex gap-1.5">
                {[0, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onFilterChange({ ...filter, minRating: rating })}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                      filter.minRating === rating
                        ? 'bg-[#2D5A46] text-white border-[#2D5A46]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {rating === 0 ? 'All' : `${rating}★ & above`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex items-end justify-start sm:justify-end">
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
