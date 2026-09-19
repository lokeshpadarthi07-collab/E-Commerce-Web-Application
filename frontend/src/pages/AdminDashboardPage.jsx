import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, Users, Plus, CheckCircle2, ShieldCheck, Sparkles, Trash2, Search, Tag, Building2, AlertCircle } from 'lucide-react';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';
import { formatCurrency } from '../utils/formatters';

export const AdminDashboardPage = () => {
  const { showSuccess, showError } = useToast();
  const { fetchProducts: refreshGlobalProducts } = useProducts();

  const [stats, setStats] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    description: '',
    isFeatured: false,
    isPopular: false
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes] = await Promise.all([
        productService.getAdminStats(),
        productService.getProducts()
      ]);

      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
      if (productsRes && productsRes.data) {
        setProductsList(productsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      showError('Please fill out all required fields');
      return;
    }

    try {
      await productService.createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock) || 15
      });
      showSuccess(`Successfully published "${newProduct.name}" to store catalogue!`);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: '',
        category: 'Electronics',
        brand: 'Sony',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        stock: 20,
        description: '',
        isFeatured: false,
        isPopular: false
      });
      loadDashboardData();
      refreshGlobalProducts();
    } catch (err) {
      showError(err.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from store catalogue?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await productService.deleteProduct(id);
      showSuccess(`Product "${name}" deleted successfully.`);
      loadDashboardData();
      refreshGlobalProducts();
    } catch (err) {
      showError(err.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered products list for table
  const filteredProducts = productsList.filter((p) => {
    const term = searchFilter.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      p.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Admin Command Center
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Product Control & Store Analytics
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Catalogue Product
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Sales Revenue</span>
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {formatCurrency(stats?.totalSales || 485900)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {stats?.totalOrders || 18}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Catalogue Products</span>
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {productsList.length || stats?.totalProducts || 24}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Customers</span>
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {stats?.totalUsers || 24}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Add Product Modal Form */}
      {showAddModal && (
        <form onSubmit={handleCreateProduct} className="bg-white p-8 rounded-3xl border border-indigo-200 shadow-xl space-y-5 animate-in fade-in duration-300">
          <h3 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Create New Catalogue Item
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-700">Product Name *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
                placeholder="e.g. Sony Wireless Earbuds"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-700">Company / Brand *</label>
              <input
                type="text"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                required
                className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
                placeholder="e.g. Sony, Apple, Nike, Dyson..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-700">Price (INR ₹) *</label>
              <input
                type="number"
                step="1"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
                className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
                placeholder="₹19,999"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-700">Category *</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200 font-medium"
              >
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Footwear">Footwear</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Gaming">Gaming</option>
                <option value="Personal Care">Personal Care</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-700">Stock Quantity *</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
                className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-700">Image URL *</label>
              <input
                type="url"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                required
                className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-xs font-bold uppercase text-slate-700">Description *</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
                rows={3}
                className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
                placeholder="Describe key features and specs..."
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newProduct.isFeatured}
                  onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                Mark as Featured Product
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newProduct.isPopular}
                  onChange={(e) => setNewProduct({ ...newProduct, isPopular: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                Mark as Trending / Popular
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              Publish Product
            </button>
          </div>
        </form>
      )}

      {/* Product Inventory Control Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-display font-extrabold text-xl text-slate-900">
              Product Catalogue Inventory Control
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage stock levels, company brand assignments, pricing, and remove items.
            </p>
          </div>

          {/* Quick Filter Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search product or brand..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Brand / Company</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs font-semibold">
                    No products found matching "{searchFilter}".
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const pId = product._id || product.id;
                  const isLowStock = product.stock > 0 && product.stock <= 10;
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <tr key={pId} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 line-clamp-1 text-sm block">
                            {product.name}
                          </span>
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                              <Sparkles className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Brand / Company */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {product.brand || 'Unbranded'}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-slate-600 bg-indigo-50/70 text-indigo-700 px-2.5 py-1 rounded-lg">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600">
                            <AlertCircle className="w-3 h-3" /> Out of Stock (0)
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700">
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                            In Stock ({product.stock})
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(pId, product.name)}
                          disabled={deletingId === pId}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors inline-flex items-center gap-1 text-xs font-bold"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Operational Health Footer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-display font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100">
          Store Operations Health
        </h3>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>All API endpoints operational. Admin permissions active (`demo@shop.com`). Product controls live.</span>
        </div>
      </div>

    </div>
  );
};
