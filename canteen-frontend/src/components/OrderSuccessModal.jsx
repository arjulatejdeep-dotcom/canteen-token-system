import React from 'react';
import { CheckCircle2, Ticket, Clock, ArrowRight } from 'lucide-react';

export default function OrderSuccessModal({ order, onClose, onViewOrders }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center animate-scale-up">
        
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">Present your token at the canteen counter when called</p>

        <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden mb-5">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xs"></div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-200 flex items-center justify-center gap-1.5 mb-1">
            <Ticket className="w-4 h-4" /> Your Digital Token Number
          </span>
          <div className="text-4xl font-black tracking-wider my-1">{order.tokenNumber}</div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-blue-100 font-medium mt-2">
            <Clock className="w-3.5 h-3.5" /> Pickup Window: <b>{order.pickupSlot}</b>
          </div>
        </div>

        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 mb-5 flex justify-between items-center">
          <span>Total Paid: <b>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</b></span>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg uppercase text-[10px]">
            Status: {order.status}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition cursor-pointer"
          >
            Track in My Orders
          </button>
          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
