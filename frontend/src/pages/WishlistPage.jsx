import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-10 h-10 fill-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't saved any products to your favorites list yet. Click the heart icon on any product to save it here!
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
      
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Saved Favorites
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You have <strong className="text-slate-900">{wishlistItems.length}</strong> items in your wishlist.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const productId = product._id || product.id;

          return (
            <div
              key={productId}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover bg-slate-50"
                />
                <button
                  onClick={() => removeFromWishlist(productId)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-rose-500 hover:bg-rose-50 shadow-md transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <Link to={`/products/${productId}`}>
                    <h4 className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors line-clamp-1 mt-1">
                      {product.name}
                    </h4>
                  </Link>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, 1);
                    removeFromWishlist(productId);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Move to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
