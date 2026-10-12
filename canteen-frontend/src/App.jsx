import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import FoodCard from './components/FoodCard';
import CartDrawer from './components/CartDrawer';
import OrderSuccessModal from './components/OrderSuccessModal';
import StudentOrders from './components/StudentOrders';
import StaffDashboard from './components/StaffDashboard';
import LiveDisplay from './components/LiveDisplay';
import AuthModal from './components/AuthModal';
import api from './api/api';
import { Search, Sparkles, ShieldAlert } from 'lucide-react';

const DEFAULT_MENU_ITEMS = [
  {
    id: 1,
    name: 'Crispy Veg Burger',
    category: 'Snacks',
    description: 'Crispy herb patty with lettuce, tomatoes, and secret mayo',
    price: 60.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'
  },
  {
    id: 2,
    name: 'Grilled Cheese Sandwich',
    category: 'Snacks',
    description: 'Golden toasted butter bread loaded with gooey cheddar cheese',
    price: 50.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80'
  },
  {
    id: 3,
    name: 'Hot Samosa (2 pcs)',
    category: 'Snacks',
    description: 'Crispy flaky crust with spiced potato-pea filling & mint chutney',
    price: 25.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80'
  },
  {
    id: 4,
    name: 'Paneer Tikka Roll',
    category: 'Snacks',
    description: 'Charcoal grilled paneer cubes wrapped in layered paratha with onions',
    price: 75.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&q=80'
  },
  {
    id: 5,
    name: 'Veg Fried Rice with Manchurian',
    category: 'Lunch',
    description: 'Wok-tossed basmati rice served with savory veggie dumplings in gravy',
    price: 90.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80'
  },
  {
    id: 6,
    name: 'Paneer Butter Masala Thali',
    category: 'Lunch',
    description: 'Rich butter gravy paneer, 2 butter rotis, jeera rice, salad & dal',
    price: 110.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80'
  },
  {
    id: 7,
    name: 'Masala Dosa',
    category: 'Breakfast',
    description: 'Crispy fermented crepe filled with spiced potatoes & coconut chutney',
    price: 50.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80'
  },
  {
    id: 8,
    name: 'Idli Vada Combo',
    category: 'Breakfast',
    description: '2 steamed rice cakes & 1 crispy lentil donut with piping hot sambar',
    price: 40.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80'
  },
  {
    id: 9,
    name: 'Thick Cold Coffee',
    category: 'Beverages',
    description: 'Creamy blended espresso milkshake topped with chocolate drizzle',
    price: 45.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80'
  },
  {
    id: 10,
    name: 'Hot Masala Chai',
    category: 'Beverages',
    description: 'Brewed black tea infused with fresh crushed ginger and cardamom',
    price: 15.00,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80'
  }
];

function MainContent() {
  const { user, isStaff, isStudent } = useAuth();
  const [activeTab, setActiveTab] = useState('menu'); 
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  const fetchMenu = async (category = 'All') => {
    try {
      const url = category === 'All' ? '/menu' : `/menu?category=${encodeURIComponent(category)}`;
      const res = await api.get(url);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setMenuItems(res.data);
      } else {
        const filtered = category === 'All'
          ? DEFAULT_MENU_ITEMS
          : DEFAULT_MENU_ITEMS.filter((i) => i.category.toLowerCase() === category.toLowerCase());
        setMenuItems(filtered);
      }
    } catch (err) {
      const filtered = category === 'All'
        ? DEFAULT_MENU_ITEMS
        : DEFAULT_MENU_ITEMS.filter((i) => i.category.toLowerCase() === category.toLowerCase());
      setMenuItems(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (user && !isStaff && activeTab === 'kitchen') {
      setActiveTab('menu');
    }
    if (user && !isStudent && activeTab === 'my-orders') {
      setActiveTab('kitchen');
    }
    if (!user && (activeTab === 'kitchen' || activeTab === 'my-orders')) {
      setActiveTab('menu');
    }
    if (user && isStaff && activeTab === 'menu') {
      setActiveTab('kitchen');
    }
    if (user && isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  }, [user, isStaff, isStudent, activeTab, isAuthModalOpen]);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => setCart([]);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-lg relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Zero Queue Dining
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Skip the Lunch Line. <br className="hidden sm:inline" />Pre-order Your Food & Track Live Tokens!
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-2">
                  Select your dishes, choose your recess slot, and watch the TV display board for your token number.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search burger, coffee, dosa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-blue-600 shadow-2xs"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 text-slate-400 text-sm font-medium">Loading fresh menu...</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <p className="text-sm font-bold text-slate-700">No dishes found matching your search</p>
                <p className="text-xs text-slate-400 mt-1">Try a different keyword or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    isInCart={cart.some((i) => i.id === item.id)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {activeTab === 'my-orders' && (
          isStudent ? (
            <StudentOrders />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
              <p className="text-sm font-bold text-slate-700">Please sign in as a student to view your orders.</p>
            </div>
          )
        )}

        {activeTab === 'kitchen' && (
          isStaff ? (
            <StaffDashboard />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 text-center shadow-xs">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
              <p className="text-xs text-slate-500 mt-1">This area is reserved exclusively for Canteen Kitchen Staff.</p>
            </div>
          )
        )}

        {activeTab === 'display' && <LiveDisplay />}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeItem={handleRemoveItem}
        clearCart={handleClearCart}
        onOrderSuccess={(order) => setPlacedOrder(order)}
        openAuthModal={() => {
          setIsCartOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <OrderSuccessModal
        order={placedOrder}
        onClose={() => setPlacedOrder(null)}
        onViewOrders={() => setActiveTab('my-orders')}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
