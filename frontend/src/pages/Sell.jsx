import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Book, 
  ClipboardList, 
  HelpCircle,
  IndianRupee,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Sell = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Notes',
    price: '',
    thumbnailUrl: '',
    description: ''
  });

  const categories = ['Notes', 'Books', 'Test-Series', 'Question Bank'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = user?.token;
      if (!token) throw new Error('Please login to sell');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, config);
      setSuccess(true);
      setTimeout(() => navigate('/store'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-unigo-green rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle className="w-12 h-12 text-unigo-black" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Drop Success</h2>
        <p className="text-unigo-black/40 text-xs font-black uppercase tracking-widest">Your gear is now live on UniGo Store</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">Sell <span className="text-unigo-green">Gear</span></h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-2xl mx-auto p-6 lg:p-12 pt-[96px] lg:pt-[96px]">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">New Drop</h2>
          <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em]">Fill details to list your study material</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-unigo-red/10 text-unigo-red p-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Item Title</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Physics NEET Notes 2024"
              className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 px-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 px-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold appearance-none cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Price (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                <input 
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 pl-14 pr-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Thumbnail URL</label>
                <div className="relative">
                   <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                   <input 
                    required
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 pl-14 pr-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold"
                  />
                </div>
             </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Full Description</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tell buyers what makes this study gear special..."
              className="w-full bg-unigo-slate-50 border-none rounded-2xl py-6 px-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-unigo-black text-unigo-green font-black py-6 rounded-[24px] uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-unigo-slate-200 disabled:opacity-50"
          >
            {loading ? 'Dropping...' : 'List on UniGo'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Sell;
