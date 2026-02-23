import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const { user, login, signup, logout, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password, formData.role);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-tighter italic text-4xl">Loading...</div>;

  // Profile View
  if (user) {
    return (
      <div className="bg-white min-h-screen font-sans">
        <header className="bg-white px-6 py-6 fixed top-0 left-0 right-0 z-[9998] border-b border-unigo-black/5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-unigo-slate-100 rounded-full text-unigo-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black uppercase tracking-tighter italic">Uni<span className="text-unigo-green">Go</span> ID</h1>
            <button onClick={logout} className="p-2 hover:bg-unigo-red/10 rounded-full text-unigo-red">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="max-w-xl mx-auto p-6 md:p-20 pt-[96px] md:pt-[96px]">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-24 h-24 bg-unigo-black rounded-[32px] flex items-center justify-center mb-8 border border-white shadow-2xl shadow-unigo-black/20">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black text-unigo-black uppercase tracking-tighter italic mb-2">{user.name}</h2>
            <p className="text-unigo-black/40 font-bold tracking-widest uppercase text-[10px] mb-8">{user.email}</p>
            <span className="bg-unigo-green text-unigo-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-unigo-black">
              {user.role} Account
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-unigo-black/5 hover:border-unigo-black transition-all cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <ShoppingBag className="w-5 h-5 text-unigo-black" />
                <h4 className="font-black text-unigo-black uppercase text-xs tracking-widest">My Gear</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-unigo-black/20" />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-unigo-black/5 hover:border-unigo-black transition-all cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <ShieldCheck className="w-5 h-5 text-unigo-black" />
                <h4 className="font-black text-unigo-black uppercase text-xs tracking-widest">Store Dashboard</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-unigo-black/20" />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-unigo-black/5 hover:border-unigo-black transition-all cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <Settings className="w-5 h-5 text-unigo-black" />
                <h4 className="font-black text-unigo-black uppercase text-xs tracking-widest">Configs</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-unigo-black/20" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Login/Signup View
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-unigo-black">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-2">Uni<span className="text-unigo-green">Go</span></h1>
            <p className="text-unigo-black/30 text-[10px] font-black uppercase tracking-widest">Minimal Study Gear</p>
          </div>

          <div className="flex gap-2 mb-10 bg-unigo-slate-100 p-1.5 rounded-3xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${isLogin ? 'bg-white text-unigo-black shadow-sm' : 'text-unigo-black/40'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${!isLogin ? 'bg-white text-unigo-black shadow-sm' : 'text-unigo-black/40'}`}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <input 
                type="text" 
                name="name"
                placeholder="Name" 
                className="w-full bg-unigo-slate-100 border-none py-5 px-8 rounded-2xl focus:ring-2 focus:ring-unigo-black font-black uppercase text-[10px] tracking-widest"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            )}
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              className="w-full bg-unigo-slate-100 border-none py-5 px-8 rounded-2xl focus:ring-2 focus:ring-unigo-black font-black uppercase text-[10px] tracking-widest"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              className="w-full bg-unigo-slate-100 border-none py-5 px-8 rounded-2xl focus:ring-2 focus:ring-unigo-black font-black uppercase text-[10px] tracking-widest"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            
            {error && <p className="text-unigo-red text-[10px] font-black uppercase tracking-widest text-center py-2">{error}</p>}

            <button className="w-full bg-unigo-black text-unigo-green font-black py-5 rounded-2xl hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest text-xs mt-6">
              {isLogin ? 'Continue' : 'Join UniGo'}
            </button>
          </form>
          
          <div className="mt-12 text-center opacity-20">
            <p className="text-[9px] font-black uppercase tracking-widest leading-loose">
                Secure Authentication &bull; UniGo Global
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Account;
