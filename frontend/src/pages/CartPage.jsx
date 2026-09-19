import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck, ArrowLeft, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage = () => {
  const {
    cartItems,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    tax,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet. Explore our catalogue to discover top picks!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all"
        >
          Explore Catalogue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your items before proceeding to secure checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 transition-colors"
        >
          Clear All Items
        </button>
      </div>

      {/* Main Grid: Cart Items & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = item.product || {};
            const itemId = item._id || product._id;

            return (
              <div
                key={itemId}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                      {product.category || 'Product'}
                    </span>
                    <Link to={`/products/${product._id}`}>
                      <h4 className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors line-clamp-1 mt-1">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                {/* Quantity Modifiers & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-200/80 rounded-l-xl transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity + 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-200/80 rounded-r-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatCurrency((product.price || 0) * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-display font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          {/* Promo Coupon Form */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-600" /> Apply Coupon Code
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span>{appliedCoupon.code} ({appliedCoupon.label})</span>
                <button onClick={removeCoupon} className="text-emerald-700 hover:text-rose-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10 or AURA20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-slate-50 text-xs text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          <div className="space-y-3 text-sm pt-2">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping Charge</span>
              {shipping === 0 ? (
                <span className="font-extrabold text-emerald-600 uppercase text-xs">FREE</span>
              ) : (
                <span className="font-bold text-slate-900">{formatCurrency(shipping)}</span>
              )}
            </div>

            {subtotal < 100 && !appliedCoupon?.type === 'freeship' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                Add <strong>{formatCurrency(100 - subtotal)}</strong> more for <strong>FREE Shipping</strong>!
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Payable</span>
              <span className="text-2xl font-extrabold text-slate-900 font-display">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Guaranteed 256-Bit SSL Encryption</span>
          </div>
        </div>

      </div>

    </div>
  );
};
