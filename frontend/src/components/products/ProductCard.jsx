import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Sparkles, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency, truncateText } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = product._id || product.id;
  const isOutOfStock = product.stock <= 0;
  const isWishlisted = isInWishlist(productId);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-500/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Featured / Popular Badge */}
      {product.isFeatured && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
          <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
        </span>
      )}

      {/* Wishlist Heart Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 shadow-md transition-colors"
        title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Image Container with Hover Actions */}
      <div className="relative w-full h-56 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <Link
            to={`/products/${productId}`}
            className="p-3 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl shadow-lg transition-colors font-medium text-xs flex items-center gap-1.5"
            title="View Product Details"
          >
            <Eye className="w-4 h-4" /> Quick View
          </Link>
        </div>

        {/* Category Pill */}
        <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-lg">
          {product.category}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {product.brand || 'AuraStyle'}
            </span>
            <RatingStars rating={product.rating?.rate} count={product.rating?.count} />
          </div>

          <Link to={`/products/${productId}`}>
            <h3 className="font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {truncateText(product.description, 85)}
          </p>
        </div>

        {/* Footer Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:shadow-md'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
