import React from 'react';
import { Plus, Check } from 'lucide-react';

export default function FoodCard({ item, onAddToCart, isInCart }) {
  const isAvailable = item.available !== undefined ? item.available : (item.isAvailable !== undefined ? item.isAvailable : true);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
      !isAvailable ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:shadow-md hover:border-slate-300'
    }`}>
      
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
          }}
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
          {item.category}
        </span>
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">{item.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.description}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <div className="text-lg font-extrabold text-slate-900">₹{parseFloat(item.price).toFixed(2)}</div>
          </div>

          <button
            onClick={() => onAddToCart(item)}
            disabled={!isAvailable}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              !isAvailable
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
