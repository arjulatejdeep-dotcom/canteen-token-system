import React from 'react';
import { Utensils, ShoppingBag, Tv, ChefHat, LogIn, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, cartCount, openCart, openAuthModal }) {
  const { user, logout, isStaff, isStudent } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Campus Canteen</h1>
              <span className="text-xs text-blue-600 font-medium">Live Token System</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'menu' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menu
            </button>

            {user && isStudent && (
              <button
                onClick={() => setActiveTab('my-orders')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'my-orders' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-4 h-4" /> My Orders
              </button>
            )}

            {user && isStaff && (
              <button
                onClick={() => setActiveTab('kitchen')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'kitchen' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ChefHat className="w-4 h-4" /> Kitchen Board
              </button>
            )}

            <button
              onClick={() => setActiveTab('display')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'display' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tv className="w-4 h-4" /> TV Display
            </button>
          </nav>

          <div className="flex items-center gap-3">
            
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-slate-200 text-slate-700">
                    {user.role === 'ROLE_STAFF' ? 'Staff' : 'Student'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="md:hidden flex items-center justify-around bg-slate-50 border-t border-slate-200 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            activeTab === 'menu' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" /> Menu
        </button>

        {user && isStudent && (
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'my-orders' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> My Orders
          </button>
        )}

        {user && isStaff && (
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'kitchen' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> Kitchen
          </button>
        )}

        <button
          onClick={() => setActiveTab('display')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            activeTab === 'display' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Tv className="w-3.5 h-3.5" /> TV Display
        </button>
      </div>
    </header>
  );
}
