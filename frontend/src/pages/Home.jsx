import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  Home as HomeIcon, 
  Store, 
  PlusCircle, 
  ShoppingCart, 
  FileText, 
  Book, 
  ClipboardList, 
  HelpCircle, 
  Video, 
  Users,
  X,
  ChevronRight,
  Settings,
  ShieldCheck,
  LogOut,
  Mail,
  MessageSquare
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');

  const categories = [
    { name: 'Notes', icon: <FileText className="text-unigo-black" />, bg: 'bg-unigo-green/20', category: 'Notes' },
    { name: 'Books', icon: <Book className="text-unigo-black" />, bg: 'bg-unigo-orange/20', category: 'Books' },
    { name: 'Test Series', icon: <ClipboardList className="text-unigo-black" />, bg: 'bg-unigo-red/20', category: 'Test-Series' },
    { name: 'Q-Banks', icon: <HelpCircle className="text-unigo-black" />, bg: 'bg-unigo-green/20', category: 'Question Bank' },
    { name: 'Videos', icon: <Video className="text-unigo-black" />, bg: 'bg-unigo-orange/20', category: 'Videos' },
    { name: 'Mentors', icon: <Users className="text-unigo-black" />, bg: 'bg-unigo-red/20', category: 'Mentors' },
  ];

  const sidebarCategories = [
    { name: 'Notes', icon: <FileText className="w-4 h-4" />, category: 'Notes' },
    { name: 'Books', icon: <Book className="w-4 h-4" />, category: 'Books' },
    { name: 'Question Bank', icon: <HelpCircle className="w-4 h-4" />, category: 'Question Bank' },
    { name: 'Test Series', icon: <ClipboardList className="w-4 h-4" />, category: 'Test-Series' },
    { name: 'Mentorship', icon: <Users className="w-4 h-4" />, category: 'Mentors' },
    { name: 'All Products', icon: <ShoppingBag className="w-4 h-4" />, category: 'All' },
  ];

  const newArrivals = [
    {
      id: 1,
      title: "Class 12 Biology Notes",
      type: "Notes",
      price: 49.00,
      oldPrice: 99.00,
      discount: "50%",
      image: "https://placehold.co/300x400/000000/ffffff?text=Bio+Notes"
    },
    {
      id: 2,
      title: "B.Sc Botany Viva Guide",
      type: "Q&A",
      price: 29.00,
      oldPrice: 59.00,
      discount: "50%",
      image: "https://placehold.co/300x400/000000/ffffff?text=Botany+Viva"
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-32 font-sans text-unigo-black">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-unigo-black/60 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[110] shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header/Tabs */}
          <div className="flex border-b border-unigo-black/5">
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'text-unigo-black bg-white border-b-2 border-unigo-green' : 'text-unigo-black/30 bg-unigo-slate-50'}`}
            >
              Categories
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'text-unigo-black bg-white border-b-2 border-unigo-green' : 'text-unigo-black/30 bg-unigo-slate-50'}`}
            >
              Menu
            </button>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar">
            {activeTab === 'categories' ? (
              <div className="py-4">
                {sidebarCategories.map((cat, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 px-6 py-4 hover:bg-unigo-green/5 cursor-pointer transition-colors border-b border-unigo-black/5 group"
                    onClick={() => {
                      if (cat.name === 'Mentorship') {
                        navigate('/mentors');
                      } else {
                        navigate('/store', { state: { category: cat.category } });
                      }
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="p-2 bg-unigo-slate-100 rounded-xl group-hover:bg-unigo-green group-hover:text-unigo-black transition-all">
                      {cat.icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider">{cat.name}</span>
                  </div>
                ))}
                
                <div className="px-6 py-6 space-y-2">
                  <div className="text-[9px] font-black text-unigo-black/30 uppercase tracking-[0.2em] mb-4">Streams</div>
                  {['Arts Stream', 'Commerce Stream', 'Science Stream', 'Other Streams'].map((stream, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-unigo-black/5 cursor-pointer hover:px-2 transition-all group">
                      <span className="text-[10px] font-black uppercase tracking-widest">{stream}</span>
                      <ChevronRight className="w-3 h-3 text-unigo-black/20 group-hover:text-unigo-green" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 px-6">
                <div className="space-y-6">
                  <div 
                    className="flex items-center gap-4 p-4 bg-unigo-black rounded-3xl text-white cursor-pointer hover:scale-[1.02] transition-all"
                    onClick={() => { navigate('/account'); setIsSidebarOpen(false); }}
                  >
                    <div className="w-10 h-10 bg-unigo-green rounded-full flex items-center justify-center">
                      <User className="text-unigo-black w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-tighter">{user ? user.name : 'Join UniGo'}</p>
                      <p className="text-[8px] opacity-50 font-black uppercase tracking-[0.2em]">{user ? 'UniGo ID Active' : 'Member Club'}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div 
                      className="flex items-center gap-4 py-4 px-4 hover:bg-unigo-slate-100 rounded-2xl cursor-pointer group"
                      onClick={() => { navigate('/inbox'); setIsSidebarOpen(false); }}
                    >
                      <MessageSquare className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Messages</span>
                    </div>
                    <div 
                      className="flex items-center gap-4 py-4 px-4 hover:bg-unigo-slate-100 rounded-2xl cursor-pointer group"
                      onClick={() => { navigate('/orders'); setIsSidebarOpen(false); }}
                    >
                      <ShoppingBag className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Orders</span>
                    </div>
                    <div 
                      className="flex items-center gap-4 py-4 px-4 hover:bg-unigo-slate-100 rounded-2xl cursor-pointer group"
                      onClick={() => { navigate('/settings'); setIsSidebarOpen(false); }}
                    >
                      <Settings className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-4 hover:bg-unigo-slate-100 rounded-2xl cursor-pointer group">
                      <Mail className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
                    </div>
                  </div>

                  {user && (
                    <button 
                      onClick={() => { logout(); setIsSidebarOpen(false); }}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-unigo-red/10 text-unigo-red rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-unigo-black/5 text-center">
            <p className="text-[8px] font-black text-unigo-black/20 uppercase tracking-[0.3em]">UniGo Global &bull; 2.0.4</p>
          </div>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className={`absolute -right-14 top-6 p-3 bg-white rounded-full text-unigo-black shadow-xl hidden md:block transition-all duration-300 ${isSidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
        >
          <X className="w-5 h-5" />
        </button>
      </aside>

      {/* Header */}
      <header className="bg-white px-6 py-4 sticky top-0 z-50 border-b border-unigo-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Menu 
              className="w-5 h-5 text-unigo-black cursor-pointer" 
              onClick={() => setIsSidebarOpen(true)}
            />
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tighter uppercase italic">Uni<span className="text-unigo-green">Go</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <Heart className="w-5 h-5 text-unigo-black group-hover:text-unigo-red transition-colors" />
            </div>
            <div 
              className="relative cursor-pointer group" 
              onClick={() => navigate('/inbox')}
            >
              <MessageSquare className="w-5 h-5 text-unigo-black group-hover:text-unigo-green transition-colors" />
            </div>
            <div 
              className="relative cursor-pointer group" 
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5 text-unigo-black group-hover:text-unigo-green transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-unigo-black text-unigo-green text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </div>
            <div 
              className="w-8 h-8 rounded-full border border-unigo-black flex items-center justify-center cursor-pointer hover:bg-unigo-black hover:text-white transition-all"
              onClick={() => navigate('/account')}
            >
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Search - Minimalistic */}
        <div className="px-6 py-12 max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-none">Find your <br/><span className="text-unigo-green">Study Gear</span></h1>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search lectures, notes..." 
              className="w-full bg-unigo-slate-100 border-none rounded-2xl py-5 px-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all"
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-unigo-black/30" />
          </div>
        </div>

        {/* Hero - Clean Flat Look */}
        <div className="px-6 mb-16">
          <div className="bg-unigo-black rounded-[40px] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between group">
            <div className="z-10 text-center md:text-left relative">
              <h2 className="text-5xl md:text-7xl font-black text-unigo-green leading-none mb-4 uppercase tracking-tighter italic">BIG SALE</h2>
              <p className="text-white text-xl font-bold mb-8 uppercase tracking-widest opacity-80">Up to 70% Off All Content</p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => navigate('/account')}
                  className="w-full sm:w-auto bg-unigo-green text-unigo-black font-black px-10 py-4 rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-xs"
                >
                  Join UniGo
                </button>
                <button className="w-full sm:w-auto bg-white/10 text-white font-black px-10 py-4 rounded-full hover:bg-white/20 transition-all uppercase tracking-widest text-xs border border-white/10"
                        onClick={() => navigate('/store')}>
                  Shop Drop
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex w-full md:w-1/3 aspect-square relative items-center justify-center">
               <div className="w-64 h-64 bg-unigo-green/20 rounded-full flex items-center justify-center animate-pulse">
                  <ShoppingBag className="w-32 h-32 text-unigo-green" />
               </div>
            </div>
          </div>
        </div>

        {/* Categories - Minimal Icons */}
        <div className="px-6 mb-20">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-3 cursor-pointer group"
                onClick={() => {
                  if (cat.name === 'Mentors') {
                    navigate('/mentors');
                  } else {
                    navigate('/store', { state: { category: cat.category } });
                  }
                }}
              >
                <div className={`${cat.bg} w-full aspect-square rounded-[32px] flex items-center justify-center border border-transparent group-hover:border-unigo-black transition-all`}>
                  <div className="group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                </div>
                <span className="text-[10px] font-black text-unigo-black/40 group-hover:text-unigo-black uppercase tracking-widest">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* New Arrivals - Sleek Grid */}
        <div className="px-6 mb-24">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-black uppercase tracking-tighter">New Drop</h3>
            <button className="text-unigo-black text-[10px] font-black uppercase tracking-widest border-b-2 border-unigo-green pb-1">Shop All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {newArrivals.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-unigo-slate-100 mb-6 border border-transparent group-hover:border-unigo-black transition-all">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-6 left-6 bg-unigo-orange text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {item.discount}
                  </div>
                </div>
                <h4 className="font-black text-sm uppercase mb-1 tracking-tight truncate px-2">{item.title}</h4>
                <p className="text-[10px] font-bold text-unigo-black/30 uppercase tracking-widest mb-4 px-2">{item.type}</p>
                <div className="flex items-center justify-between px-2">
                  <span className="text-lg font-black tracking-tighter italic">₹{item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="p-2 border border-unigo-black rounded-full hover:bg-unigo-black hover:text-white transition-all active:scale-90"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Home;
