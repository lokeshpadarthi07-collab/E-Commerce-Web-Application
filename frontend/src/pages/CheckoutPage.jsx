import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';

export const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, appliedCoupon, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '+91 98765 43210',
    address: '42 Hill Road, Bandra West',
    city: 'Mumbai',
    postalCode: '400050',
    country: 'India',
    paymentMethod: 'Credit Card / Debit Card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      showError('Please fill out all required shipping fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id || item.product.id || item.product,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };

      const res = await orderService.createOrder(orderData);
      clearCart();
      showSuccess('Order placed successfully!');
      navigate(`/order-success/${res.data._id}`);
    } catch (error) {
      showError(error.message || 'Failed to process order checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-slate-900">No Items to Checkout</h2>
        <p className="text-sm text-slate-500">Your shopping cart is currently empty.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back to Cart */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Checkout & Payment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete your order details below.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted Checkout
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Shipping & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Information Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Shipping Address (India)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pincode / Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              Payment Options
            </h3>

            <div className="space-y-3">
              {[
                { id: 'card', name: 'Credit Card / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                { id: 'cod', name: 'Cash on Delivery (COD)', icon: CheckCircle2, desc: 'Pay cash when order arrives' }
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === pm.name
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.name}
                      checked={formData.paymentMethod === pm.name}
                      onChange={handleChange}
                      className="accent-indigo-600"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">{pm.name}</span>
                      <span className="text-xs text-slate-500">{pm.desc}</span>
                    </div>
                  </div>
                  <pm.icon className="w-5 h-5 text-indigo-600 shrink-0" />
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Summary Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-display font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100">
            Order Items ({cartItems.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id || item.product._id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block line-clamp-1">{item.product.name}</span>
                    <span className="text-slate-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Tax (8%)</span>
              <span className="font-bold">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Shipping</span>
              <span className="font-bold text-emerald-600">
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-100">
              <span>Total Amount</span>
              <span className="font-display text-indigo-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {isSubmitting ? 'Processing Order...' : 'Place Order Now'}
          </button>
        </div>

      </form>

    </div>
  );
};
