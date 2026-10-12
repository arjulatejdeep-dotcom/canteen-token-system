import React, { useEffect, useState } from 'react';
import { Clock, RefreshCw, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function StudentOrders() {
  const { isStudent } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!isStudent) return;
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStudent) {
      setLoading(false);
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000); 
    return () => clearInterval(interval);
  }, [isStudent]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Order Placed</span>;
      case 'PREPARING':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">🍳 Cooking in Kitchen</span>;
      case 'READY':
        return <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">🎉 Ready for Pickup!</span>;
      case 'COMPLETED':
        return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">Collected</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">My Orders & Live Tokens</h2>
          <p className="text-xs text-slate-500 mt-1">Track your order preparation status in real-time (auto-refreshes every 5s)</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-400 mt-1">Go ahead and order delicious snacks from the menu!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border p-5 transition shadow-xs ${
                order.status === 'READY' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-xl">
                    {order.tokenNumber}
                  </span>
                  <div>
                    <div className="text-xs text-slate-400">Pickup Window</div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {order.pickupSlot}
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="my-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <div className="flex items-center justify-between text-[11px] font-semibold gap-1">
                  <span
                    className={`flex items-center gap-1 ${
                      order.status === 'PLACED' ? 'text-blue-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        order.status === 'PLACED' ? 'bg-blue-600' : 'bg-emerald-500'
                      }`}
                    ></span>
                    Placed
                  </span>
                  <span className="text-slate-300">→</span>
                  <span
                    className={`flex items-center gap-1 ${
                      order.status === 'PREPARING'
                        ? 'text-amber-600 font-bold'
                        : order.status === 'READY' || order.status === 'COMPLETED'
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        order.status === 'PREPARING'
                          ? 'bg-amber-500 animate-ping'
                          : order.status === 'READY' || order.status === 'COMPLETED'
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                    ></span>
                    Cooking
                  </span>
                  <span className="text-slate-300">→</span>
                  <span
                    className={`flex items-center gap-1 ${
                      order.status === 'READY'
                        ? 'text-emerald-600 font-bold'
                        : order.status === 'COMPLETED'
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        order.status === 'READY'
                          ? 'bg-emerald-500 ring-2 ring-emerald-200'
                          : order.status === 'COMPLETED'
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                    ></span>
                    Ready
                  </span>
                </div>
              </div>

              <div className="py-3 divide-y divide-slate-50">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-1.5 flex justify-between text-xs text-slate-700">
                    <span>
                      <b>{item.quantity}x</b> {item.menuItem?.name || 'Item'}
                    </span>
                    <span className="font-semibold">₹{parseFloat((item.priceAtOrder || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Placed at: {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  Total: ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
