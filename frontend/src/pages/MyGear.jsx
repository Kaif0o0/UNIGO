import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  FileText,
  Book,
  ClipboardList,
  HelpCircle,
  Download,
  Eye,
  Calendar,
  Search,
  Filter
} from 'lucide-react';

/* ── Mock purchased items — replace with real API data when backend is ready ── */
const PURCHASED_GEAR = [
  {
    id: 'PG-001',
    title: 'Biology Class 12 Notes',
    category: 'Notes',
    seller: 'Priya Sharma',
    price: 49.00,
    purchasedOn: 'Oct 22, 2024',
    pdfUrl: null,
    thumbnailUrl: 'https://placehold.co/300x400/1a1a1a/39ff14?text=Bio+Notes',
  },
  {
    id: 'PG-002',
    title: 'NEET Prep 2024 Q-Bank',
    category: 'Question Bank',
    seller: 'Arjun Patel',
    price: 100.00,
    purchasedOn: 'Oct 22, 2024',
    pdfUrl: null,
    thumbnailUrl: 'https://placehold.co/300x400/1a1a1a/39ff14?text=NEET+QB',
  },
  {
    id: 'PG-003',
    title: 'B.Sc Botany Guide',
    category: 'Books',
    seller: 'Kavita Reddy',
    price: 49.00,
    purchasedOn: 'Oct 20, 2024',
    pdfUrl: null,
    thumbnailUrl: 'https://placehold.co/300x400/1a1a1a/39ff14?text=Botany',
  },
];

const CATEGORY_ICONS = {
  Notes: <FileText className="w-4 h-4" />,
  Books: <Book className="w-4 h-4" />,
  'Test-Series': <ClipboardList className="w-4 h-4" />,
  'Question Bank': <HelpCircle className="w-4 h-4" />,
};

const CATEGORY_COLORS = {
  Notes: 'bg-unigo-green/10 text-unigo-green',
  Books: 'bg-unigo-orange/10 text-unigo-orange',
  'Test-Series': 'bg-unigo-red/10 text-unigo-red',
  'Question Bank': 'bg-blue-50 text-blue-500',
};

const FILTERS = ['All', 'Notes', 'Books', 'Test-Series', 'Question Bank'];

const MyGear = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = PURCHASED_GEAR.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-32">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between">
        <button
          onClick={() => navigate('/account')}
          className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">
          My <span className="text-unigo-green">Gear</span>
        </h1>
        <span className="w-10 h-10 bg-unigo-black text-unigo-green rounded-full flex items-center justify-center font-black text-sm">
          {filtered.length}
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-[96px] pb-12">
        {/* Title */}
        <div className="py-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-1">
            Purchased <span className="text-unigo-green">Library</span>
          </h2>
          <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em]">
            All your study materials in one place
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-unigo-black/30" />
          <input
            type="text"
            placeholder="Search your gear…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-unigo-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-unigo-black transition-all"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-unigo-black text-white'
                  : 'bg-unigo-slate-100 text-unigo-black/40 hover:bg-unigo-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-unigo-slate-50 rounded-[40px] border border-dashed border-unigo-black/10">
            <ShoppingBag className="w-12 h-12 mx-auto mb-6 opacity-10" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">
              {search || activeFilter !== 'All' ? 'No Results Found' : 'No Gear Yet'}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30 mb-8">
              {search || activeFilter !== 'All'
                ? 'Try a different search or filter'
                : 'Head to the store and grab your first study material'}
            </p>
            {!search && activeFilter === 'All' && (
              <button
                onClick={() => navigate('/store')}
                className="bg-unigo-black text-unigo-green font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all"
              >
                Browse Store
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 items-center bg-unigo-slate-50 rounded-[28px] p-5 border border-transparent hover:border-unigo-black/10 transition-all group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-[20px] overflow-hidden flex-shrink-0 bg-unigo-black">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {/* Category badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${CATEGORY_COLORS[item.category] || 'bg-unigo-slate-200 text-unigo-black/40'}`}>
                      {CATEGORY_ICONS[item.category]}
                      {item.category}
                    </span>
                  </div>

                  <h4 className="font-black text-sm uppercase tracking-tight truncate mb-1">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-3 text-unigo-black/30">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.purchasedOn}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      by {item.seller}
                    </span>
                  </div>
                </div>

                {/* Price + Actions */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className="text-base font-black italic tracking-tighter">
                    ₹{item.price.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* View */}
                    <button
                      onClick={() => {
                        if (item.pdfUrl) {
                          window.open(item.pdfUrl, '_blank');
                        }
                      }}
                      title="View"
                      className="p-2.5 bg-white rounded-xl border border-unigo-black/5 hover:border-unigo-black hover:bg-unigo-black hover:text-white transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => {
                        if (item.pdfUrl) {
                          const a = document.createElement('a');
                          a.href = item.pdfUrl;
                          a.download = item.title;
                          a.click();
                        }
                      }}
                      title="Download"
                      className="p-2.5 bg-unigo-black text-unigo-green rounded-xl hover:scale-105 transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary footer */}
        {filtered.length > 0 && (
          <div className="mt-10 bg-unigo-black text-white rounded-[32px] p-6 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Total Spent</p>
              <p className="text-3xl font-black italic tracking-tighter text-unigo-green">
                ₹{PURCHASED_GEAR.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Items Owned</p>
              <p className="text-3xl font-black italic tracking-tighter">
                {PURCHASED_GEAR.length}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyGear;
