import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getUserOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to fetch user orders:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="font-display font-bold text-2xl text-slate-900">No Past Orders Found</h2>
        <p className="text-sm text-slate-500">You haven't placed any orders yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900">My Orders</h1>
        <p className="text-xs text-slate-500 mt-1">View status and history of your recent purchases.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div>
                <span className="text-slate-400">Order ID:</span>{' '}
                <strong className="text-slate-900 font-mono">#{order._id}</strong>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatDate(order.createdAt)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider text-[10px] bg-emerald-100 text-emerald-800">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
                {order.orderItems?.slice(0, 3).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl bg-slate-100 shrink-0"
                    title={item.name}
                  />
                ))}
                {order.orderItems?.length > 3 && (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-4 rounded-xl">
                    +{order.orderItems.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Total Paid</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>

                <Link
                  to={`/order-success/${order._id}`}
                  className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
