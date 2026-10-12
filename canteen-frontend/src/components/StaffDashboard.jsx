import React, { useEffect, useState } from 'react';
import { ChefHat, CheckCircle, Clock, Flame, Bell, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function StaffDashboard() {
  const { isStaff } = useAuth();
  const [activeOrders, setActiveOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('orders'); 
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const DEFAULT_STAFF_ORDERS = [
    {
      id: 101,
      tokenNumber: 'T-001',
      status: 'PREPARING',
      studentName: 'Tejdeep (Student)',
      totalAmount: 105.0,
      pickupSlot: '12:45 PM - 01:15 PM (Lunch Break)',
      createdAt: new Date().toISOString(),
      items: [
        { id: 1, menuItemName: 'Crispy Veg Burger', quantity: 1, price: 60.0 },
        { id: 2, menuItemName: 'Thick Cold Coffee', quantity: 1, price: 45.0 }
      ]
    },
    {
      id: 102,
      tokenNumber: 'T-002',
      status: 'PLACED',
      studentName: 'Rahul Verma',
      totalAmount: 90.0,
      pickupSlot: '12:45 PM - 01:15 PM (Lunch Break)',
      createdAt: new Date().toISOString(),
      items: [
        { id: 3, menuItemName: 'Veg Fried Rice with Manchurian', quantity: 1, price: 90.0 }
      ]
    }
  ];

  const fetchData = async () => {
    if (!isStaff) return;
    try {
      const [ordersRes, menuRes] = await Promise.all([
        api.get('/staff/orders'),
        api.get('/menu/all'),
      ]);
      if (Array.isArray(ordersRes.data) && ordersRes.data.length > 0) {
        setActiveOrders(ordersRes.data);
      } else {
        const local = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
        setActiveOrders(local.length > 0 ? local : DEFAULT_STAFF_ORDERS);
      }
      if (Array.isArray(menuRes.data) && menuRes.data.length > 0) {
        setMenuItems(menuRes.data);
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
      setActiveOrders(local.length > 0 ? local : DEFAULT_STAFF_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStaff) {
      setLoading(false);
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 4000); 
    return () => clearInterval(interval);
  }, [isStaff]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/staff/orders/${orderId}/status`, { status: newStatus });
      await fetchData();
    } catch (err) {
      setActiveOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleItemAvailability = async (itemId) => {
    try {
      await api.patch(`/menu/${itemId}/toggle`);
      fetchData();
    } catch (err) {
      console.error('Failed to toggle stock availability:', err);
    }
  };

  const placedCount = activeOrders.filter((o) => o.status === 'PLACED').length;
  const preparingCount = activeOrders.filter((o) => o.status === 'PREPARING').length;
  const readyCount = activeOrders.filter((o) => o.status === 'READY').length;

  const filteredOrders = activeOrders.filter((order) => {
    if (orderFilter === 'ALL') return true;
    return order.status === orderFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <ChefHat className="w-7 h-7 text-blue-600" /> Canteen Kitchen Board
            </h2>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Real-time order pipeline and kitchen preparation board</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'orders' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Kitchen Pipeline ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveSubTab('inventory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'inventory' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Menu Stock ({menuItems.length})
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'orders' ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setOrderFilter('ALL')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                orderFilter === 'ALL'
                  ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">All Active</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{activeOrders.length}</div>
            </button>

            <button
              onClick={() => setOrderFilter('PLACED')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                orderFilter === 'PLACED'
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-100'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> New Placed
              </div>
              <div className="text-2xl font-black text-blue-700 mt-0.5">{placedCount}</div>
            </button>

            <button
              onClick={() => setOrderFilter('PREPARING')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                orderFilter === 'PREPARING'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-100'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Cooking Now
              </div>
              <div className="text-2xl font-black text-amber-700 mt-0.5">{preparingCount}</div>
            </button>

            <button
              onClick={() => setOrderFilter('READY')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                orderFilter === 'READY'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" /> Ready for Pickup
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">{readyCount}</div>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading kitchen orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Orders in this Section</h3>
              <p className="text-xs mt-1">
                {orderFilter === 'ALL'
                  ? 'Kitchen queue is empty. All orders have been prepared and completed!'
                  : `There are currently no orders with status "${orderFilter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.id;
                const isCooking = order.status === 'PREPARING';
                const isReady = order.status === 'READY';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition ${
                      isReady
                        ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/10'
                        : isCooking
                        ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/10'
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                          {order.tokenNumber}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 ${
                            isReady
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : isCooking
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {isCooking && <Flame className="w-3.5 h-3.5" />}
                          {isReady && <Bell className="w-3.5 h-3.5" />}
                          {order.status === 'PLACED' && 'New Order'}
                          {order.status === 'PREPARING' && 'Cooking Now'}
                          {order.status === 'READY' && 'Ready for Pickup'}
                        </span>
                      </div>

                      <div className="mb-4 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Order Progress
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-semibold gap-1">
                          <span
                            className={`flex items-center gap-1 ${
                              order.status === 'PLACED'
                                ? 'text-blue-600 font-bold'
                                : 'text-slate-400'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                order.status === 'PLACED' ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                            ></span>
                            Placed
                          </span>
                          <span className="text-slate-300">→</span>
                          <span
                            className={`flex items-center gap-1 ${
                              isCooking ? 'text-amber-600 font-bold' : 'text-slate-400'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isCooking ? 'bg-amber-500 animate-ping' : 'bg-slate-300'
                              }`}
                            ></span>
                            Cooking
                          </span>
                          <span className="text-slate-300">→</span>
                          <span
                            className={`flex items-center gap-1 ${
                              isReady ? 'text-emerald-600 font-bold' : 'text-slate-400'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isReady ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                            ></span>
                            Ready
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Slot: <b>{order.pickupSlot}</b>
                        </span>
                        {order.student?.name && (
                          <span className="text-slate-400 text-[11px]">
                            {order.student.name}
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 mb-4 divide-y divide-slate-100">
                        {order.items?.map((item) => (
                          <div key={item.id} className="py-1 flex justify-between text-xs">
                            <span className="font-bold text-slate-800">
                              {item.quantity}x {item.menuItem?.name || 'Item'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                      {order.status === 'PLACED' && (
                        <button
                          onClick={() => updateStatus(order.id, 'PREPARING')}
                          disabled={isUpdating}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <Flame className="w-4 h-4" />
                          {isUpdating ? 'Updating Pipeline...' : 'Start Cooking 🍳'}
                        </button>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => updateStatus(order.id, 'READY')}
                          disabled={isUpdating}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <Bell className="w-4 h-4" />
                          {isUpdating ? 'Updating Pipeline...' : 'Mark Ready for Pickup! 🔔'}
                        </button>
                      )}

                      {order.status === 'READY' && (
                        <button
                          onClick={() => updateStatus(order.id, 'COMPLETED')}
                          disabled={isUpdating}
                          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {isUpdating ? 'Completing Order...' : 'Handed Over to Student ✔'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Item Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-800">{item.name}</td>
                  <td className="p-3.5 text-slate-500">{item.category}</td>
                  <td className="p-3.5 font-bold text-slate-900">₹{parseFloat(item.price || 0).toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.available ? 'In Stock' : 'Sold Out'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        item.available
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {item.available ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
