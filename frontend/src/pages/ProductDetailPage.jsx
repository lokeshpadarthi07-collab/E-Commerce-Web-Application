import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, Plus, Minus, CheckCircle, Package, Heart, Star, Send, MessageSquare } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/products/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProductById(id);
      setProduct(res.data);

      if (res.data?.category) {
        const relatedRes = await productService.getProducts({ category: res.data.category });
        setRelatedProducts(
          (relatedRes.data || []).filter((p) => (p._id || p.id) !== id).slice(0, 4)
        );
      }
    } catch (err) {
      console.error('Error fetching product details:', err.message);
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showError('Please enter a review comment');
      return;
    }

    try {
      setIsSubmittingReview(true);
      // Simulate/trigger review post
      const updatedReviewList = [
        {
          _id: `rev_${Date.now()}`,
          name: 'Verified Customer',
          rating: Number(newRating),
          comment: newComment,
          createdAt: new Date().toISOString()
        },
        ...(product.reviews || [])
      ];

      setProduct({
        ...product,
        reviews: updatedReviewList,
        rating: {
          rate: Number((updatedReviewList.reduce((acc, r) => acc + r.rating, 0) / updatedReviewList.length).toFixed(1)),
          count: updatedReviewList.length
        }
      });

      showSuccess('Thank you! Your review has been submitted.');
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      showError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="w-full h-96 bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 rounded" />
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-20 w-full bg-slate-200 rounded" />
            <div className="h-12 w-48 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="font-display font-bold text-2xl text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for might have been moved or removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalogue
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <button
          onClick={() => toggleWishlist(product)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image Showcase */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Column: Product Metadata & Actions */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Brand: <strong className="text-slate-700">{product.brand || 'AuraStyle'}</strong>
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-4">
              <RatingStars rating={product.rating?.rate} count={product.rating?.count} size="lg" />
              <span className="text-xs text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} units)`}
              </div>
            </div>
          </div>

          {/* Price Tag */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Retail Price</span>
              <span className="text-3xl font-extrabold font-display">
                {formatCurrency(product.price)}
              </span>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Authentic
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Product Overview</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Counter */}
          {!isOutOfStock && (
            <div className="space-y-2 pt-2">
              <label className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                Select Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">Max limit per order: {product.stock}</span>
              </div>
            </div>
          )}

          {/* Actions: Add to Cart & Buy Now */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 hover:scale-[1.02]'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Shopping Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`py-4 px-6 rounded-2xl font-bold text-sm transition-all border ${
                isOutOfStock
                  ? 'hidden'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
              }`}
            >
              Buy Now
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Fast 2-3 Day Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>30-Day Free Return Policy</span>
            </div>
          </div>

        </div>

      </div>

      {/* Reviews & Ratings Section */}
      <section className="pt-12 border-t border-slate-200 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" /> Customer Reviews & Ratings
            </h3>
            <p className="text-xs text-slate-500 mt-1">Real feedback from verified purchasers.</p>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm">Write a Customer Review</h4>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Rating:</span>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1"
                >
                  <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={3}
            required
            className="w-full bg-slate-50 text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Review
          </button>
        </form>

        {/* Review List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{rev.name}</span>
                  <span className="text-xs text-slate-400">{formatDate(rev.createdAt)}</span>
                </div>
                <RatingStars rating={rev.rating} size="sm" />
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to leave a review!</p>
          )}
        </div>
      </section>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="font-display font-extrabold text-2xl text-slate-900">
            Related Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id || rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
