import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Truck, Calendar, MapPin, Package } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { OrderTimeline } from '../components/common/OrderTimeline';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8">
      
      {/* Success Banner */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed
          </span>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 pt-2">
            Thank You for Your Order!
          </h1>
          <p className="text-xs text-slate-500">
            Order Reference ID: <strong className="text-slate-900">#{order?._id || id}</strong>
          </p>
        </div>

        {/* Visual Order Progress Tracker Stepper */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Order Delivery Tracker</h4>
          <OrderTimeline status={order?.orderStatus || 'Processing'} />
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-center gap-3 text-xs text-indigo-900 font-medium max-w-md mx-auto">
          <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Estimated Delivery: <strong>3-5 Business Days</strong></span>
        </div>
      </div>

      {/* Order Details Breakdown */}
      {order && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-display font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Ordered Items Breakdown
          </h3>

          <div className="space-y-4">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xl bg-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{item.name}</h5>
                    <p className="text-xs text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Delivery Address
              </span>
              <p>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
              <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Payment & Status
              </span>
              <p>Status: <strong className="text-emerald-600">{order.orderStatus}</strong></p>
              <p>Method: {order.paymentMethod}</p>
              <p>Total Paid: <strong className="text-slate-900">{formatCurrency(order.totalPrice)}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition-all text-center flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors text-center"
        >
          View My Orders History
        </Link>
      </div>

    </div>
  );
};
