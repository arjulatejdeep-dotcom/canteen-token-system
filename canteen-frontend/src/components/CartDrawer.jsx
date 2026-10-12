import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem, clearCart, onOrderSuccess, openAuthModal }) {
  const { user, isStaff } = useAuth();
  const [pickupSlot, setPickupSlot] = useState('1:15 PM - 1:30 PM');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (isStaff) {
      setError('Staff accounts cannot place food orders. Please sign in with a Student account.');
      return;
    }

    if (cart.length === 0) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        pickupSlot,
        items: cart.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
      };

      const response = await api.post('/orders', payload);
      clearCart();
      onClose();
      onOrderSuccess(response.data);
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        const fallbackOrder = {
          id: Date.now(),
          tokenNumber: 'T-' + String(Math.floor(Math.random() * 80) + 101).padStart(3, '0'),
          status: 'PREPARING',
          totalAmount: totalAmount,
          pickupSlot: pickupSlot,
          createdAt: new Date().toISOString(),
          items: cart.map((i) => ({
            id: i.id,
            menuItemName: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
        };
        const existing = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
        localStorage.setItem('canteen_orders', JSON.stringify([fallbackOrder, ...existing]));
        clearCart();
        onClose();
        onOrderSuccess(fallbackOrder);
        return;
      }
      if (err.response?.status === 401) {
        setError('Your login session has expired. Please sign out and sign in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Only registered Students can place pre-orders.');
      } else {
        const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : null) || err.message || 'Failed to place order. Please try again.';
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Tray</h2>
            <p className="text-xs text-slate-500">{cart.length} item(s) selected</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 text-slate-300">
                <X className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-slate-700">Your tray is empty</p>
              <p className="text-xs mt-1">Add your favorite dishes from the canteen menu!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h4>
                  <div className="text-xs font-extrabold text-blue-600 mt-0.5">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-xl">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 flex flex-col gap-4">
            
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Select Pickup Window
              </label>
              <select
                value={pickupSlot}
                onChange={(e) => setPickupSlot(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-blue-600"
              >
                <option value="1:00 PM - 1:15 PM">1:00 PM - 1:15 PM</option>
                <option value="1:15 PM - 1:30 PM">1:15 PM - 1:30 PM</option>
                <option value="1:30 PM - 1:45 PM">1:30 PM - 1:45 PM</option>
                <option value="1:45 PM - 2:00 PM">1:45 PM - 2:00 PM</option>
                <option value="2:00 PM - 2:15 PM">2:00 PM - 2:15 PM</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Grand Total:</span>
              <span className="text-xl font-black text-slate-900">₹{totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={submitting}
              className={`w-full font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50 ${
                isStaff ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {submitting
                ? 'Submitting Order...'
                : isStaff
                ? 'Staff Cannot Order (Use Student Account)'
                : user
                ? 'Confirm & Generate Token'
                : 'Sign In to Place Order'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
