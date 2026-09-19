import React from 'react';
import { PackageX, RotateCcw } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilter } from '../components/products/ProductFilter';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';

export const ProductsPage = () => {
  const { products, loading, error, resetFilters, selectedCategory, searchQuery } = useProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Product Catalogue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore high-quality products across audio, wearables, fashion, and electronics.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{products.length}</span> items
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      {/* Main Grid Layout with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Controls Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilter />
        </div>

        {/* Product Catalogue Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
              <p className="text-sm font-bold text-rose-800">{error}</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl"
              >
                Reset Filters & Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                No Products Found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any products matching your current search term or filter criteria. Try adjusting your price range or category.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
