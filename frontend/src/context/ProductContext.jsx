import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    'All', 'Audio', 'Wearables', 'Electronics', 'Fashion', 'Footwear', 'Home & Kitchen', 'Gaming', 'Personal Care'
  ]);
  const [brands, setBrands] = useState([
    'All', 'Anker', 'Apple', 'Bose', 'Dyson', 'Fossil', 'GoPro', 'JBL', 'Logitech', 'Marshall', 'Nespresso', 'Nike', 'Philips', 'Puma', 'Razer', 'Ray-Ban', 'Samsung', 'Seiko', 'Sony', 'Theragun'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState(150000);
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedBrand !== 'All') params.brand = selectedBrand;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (maxPriceFilter < 150000) params.maxPrice = maxPriceFilter;
      if (sortOption) params.sort = sortOption;

      const res = await productService.getProducts(params);
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, searchQuery, maxPriceFilter, sortOption]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSearchQuery('');
    setMaxPriceFilter(150000);
    setSortOption('newest');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        brands,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        searchQuery,
        setSearchQuery,
        maxPriceFilter,
        setMaxPriceFilter,
        sortOption,
        setSortOption,
        loading,
        error,
        fetchProducts,
        resetFilters
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
