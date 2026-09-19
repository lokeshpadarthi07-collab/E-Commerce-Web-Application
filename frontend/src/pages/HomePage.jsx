import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Zap, Headphones, Watch, Shirt, Tv, Home } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';

export const HomePage = () => {
  const { products, loading, setSelectedCategory } = useProducts();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const popularProducts = products.slice(0, 8);

  const categoryIcons = [
    { name: 'Audio', icon: Headphones, bg: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { name: 'Wearables', icon: Watch, bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { name: 'Fashion', icon: Shirt, bg: 'bg-rose-50 text-rose-600 border-rose-200' },
    { name: 'Electronics', icon: Tv, bg: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'Home', icon: Home, bg: 'bg-purple-50 text-purple-600 border-purple-200' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mt-4 mx-4 sm:mx-6 lg:mx-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/30 via-slate-900 to-slate-950 opacity-90" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Next-Gen E-Commerce Experience
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Elevate Your Lifestyle with <span className="gradient-text">Premium Gear</span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover curated audio electronics, smart wearables, and modern fashion crafted for quality performance. Built for speed, security, and elegance.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Explore Catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-slate-800 text-xs text-slate-400 font-medium">
              <div>
                <p className="font-extrabold text-white text-lg font-display">12+</p>
                <p>Curated Items</p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <p className="font-extrabold text-white text-lg font-display">99.9%</p>
                <p>API Uptime</p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <p className="font-extrabold text-white text-lg font-display">4.9 ★</p>
                <p>Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Banner Showcase Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Featured Product"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Floating Product Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Top Pick</p>
                  <h4 className="font-bold text-sm">Aura Studio ANC Headphones</h4>
                  <p className="text-xs text-slate-300 font-extrabold mt-0.5">₹19,999</p>
                </div>
                <Link
                  to="/products/1"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Selection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Browse by Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a category to filter live catalogue items instantly.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryIcons.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to="/products"
                onClick={() => setSelectedCategory(cat.name)}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.bg} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-1">
              <Zap className="w-3.5 h-3.5 fill-amber-500" /> Handpicked Highlights
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Explore Catalogue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Catalogue Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Popular Arrivals
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Trending items loved by our customer community.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Recruiter Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
            <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Portfolio & Assignment Submission
            </span>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              Ready to Test Full Stack Functionality?
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Use our 1-click Demo Login feature to instantly test JWT authentication, shopping cart state, order checkout creation, and REST APIs.
            </p>
          </div>

          <div className="z-10 shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-2xl bg-white text-indigo-600 font-extrabold text-sm hover:bg-slate-100 transition-colors shadow-lg"
            >
              Test Demo Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
