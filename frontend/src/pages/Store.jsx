import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Filter,
  ArrowRight,
  PlusCircle,
  Home,
  MessageSquare,
  User,
  ShoppingCart
} from 'lucide-react';


const Store = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cartCount } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');

  const categories = ['All', 'Notes', 'Books', 'Test-Series', 'Question Bank'];

  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(data);
      } catch (err) {
        console.error('FETCH PRODUCTS ERROR:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-32">
      {/* Header */}
      <header className="bg-white px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-unigo-slate-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black uppercase tracking-tighter italic">Uni<span className="text-unigo-green">Go</span> Store</h1>
          </div>
          
          <div 
            className="relative cursor-pointer group p-2 hover:bg-unigo-slate-100 rounded-full transition-all" 
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag className="w-5 h-5 text-unigo-black" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-unigo-black text-unigo-green text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-[96px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">Gear Library</h2>
            <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em]">Explore premium study resources</p>
          </div>
          
          {/* Categories Filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-unigo-black text-white' : 'bg-unigo-slate-100 text-unigo-black/40 hover:bg-unigo-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-unigo-slate-100 border-t-unigo-green rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Syncing Gear...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-unigo-slate-50 rounded-[40px] border border-dashed border-unigo-black/10">
            <ShoppingBag className="w-12 h-12 mx-auto mb-6 opacity-10" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">No Items Found</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Be the first to drop gear in this category</p>
            <button 
              onClick={() => navigate('/sell')}
              className="mt-8 bg-unigo-black text-unigo-green font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all"
            >
              Start Selling
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
              >
                <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-unigo-slate-50 mb-6 relative">
                  <img 
                    src={product.thumbnailUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: product._id,
                        title: product.title,
                        price: product.price,
                        image: product.thumbnailUrl
                      });
                    }}
                    className="absolute bottom-4 right-4 bg-unigo-black text-unigo-green p-4 rounded-[20px] translate-y-20 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
                
                <div>
                  <h4 className="font-black text-xs uppercase tracking-tight mb-2 truncate group-hover:text-unigo-green transition-colors">{product.title}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black italic tracking-tighter">₹{product.price}</p>
                    <p className="text-[8px] font-black text-unigo-black/20 uppercase tracking-widest">by {product.seller?.name || 'Seller'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
};

export default Store;
