import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency } from '../../utils/formatters';

export const ProductFilter = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    brands,
    selectedBrand,
    setSelectedBrand,
    searchQuery,
    setSearchQuery,
    maxPriceFilter,
    setMaxPriceFilter,
    sortOption,
    setSortOption,
    resetFilters
  } = useProducts();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          Filter & Sort
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type product or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Brand / Company Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Brand / Company
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full bg-slate-50 text-sm text-slate-800 py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b === 'All' ? 'All Brands / Companies' : b}
            </option>
          ))}
        </select>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Categories
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold uppercase tracking-wider text-slate-500">
            Max Price
          </label>
          <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {formatCurrency(maxPriceFilter)}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="150000"
          step="1000"
          value={maxPriceFilter}
          onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>₹1,000</span>
          <span>₹1,50,000+</span>
        </div>
      </div>

      {/* Sorting Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Sort By
        </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full bg-slate-50 text-sm text-slate-800 py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

    </div>
  );
};
