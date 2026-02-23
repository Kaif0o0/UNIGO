import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  Star,
  Package,
  Plus,
  Trash2,
  Edit3,
  Eye,
  AlertTriangle,
  IndianRupee,
  BarChart2,
  Clock,
  CheckCircle2,
  X,
  Tag,
  Users,
} from 'lucide-react';

/* ──────────────────────────────────────
   Mock Data — swap with real API calls
─────────────────────────────────────── */
const MOCK_STATS = {
  totalEarnings: 3480,
  thisMonth: 1250,
  totalSales: 34,
  totalListings: 6,
  avgRating: 4.7,
  views: 892,
};

const MOCK_LISTINGS = [
  { id: 'L-001', title: 'Biology Class 12 Notes', category: 'Notes',  price: 49,  sold: 18, status: 'active' },
  { id: 'L-002', title: 'NEET Prep 2024 Q-Bank',  category: 'Question Bank', price: 100, sold: 9,  status: 'active' },
  { id: 'L-003', title: 'B.Sc Botany Guide',      category: 'Books',  price: 49,  sold: 4,  status: 'active' },
  { id: 'L-004', title: 'Physics Formula Sheet',  category: 'Notes',  price: 29,  sold: 2,  status: 'paused' },
  { id: 'L-005', title: 'JEE Maths Mock Tests',   category: 'Test-Series', price: 149, sold: 1, status: 'active' },
];

const MOCK_ORDERS = [
  { id: 'ORD-8821', buyer: 'Priya S.',   item: 'Biology Class 12 Notes', amount: 49,  status: 'Delivered', date: 'Feb 22' },
  { id: 'ORD-8820', buyer: 'Rahul M.',   item: 'NEET Prep 2024 Q-Bank',  amount: 100, status: 'Processing', date: 'Feb 21' },
  { id: 'ORD-8817', buyer: 'Sneha K.',   item: 'B.Sc Botany Guide',      amount: 49,  status: 'Delivered', date: 'Feb 19' },
  { id: 'ORD-8810', buyer: 'Arjun T.',   item: 'JEE Maths Mock Tests',   amount: 149, status: 'Delivered', date: 'Feb 15' },
];

const TABS = ['Overview', 'Listings', 'Orders'];

/* ── mini confirm modal ── */
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-unigo-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl text-center">
      <div className="w-16 h-16 bg-unigo-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8 text-unigo-red" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">Delete Listing?</h3>
      <p className="text-[10px] font-black text-unigo-black/40 uppercase tracking-widest leading-relaxed mb-8">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-4 bg-unigo-slate-100 text-unigo-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-unigo-slate-200 transition-all">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 py-4 bg-unigo-red text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────
   Main Component
─────────────────────────────────────── */
const StoreDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [deleteTarget, setDeleteTarget] = useState(null); // listing id to delete

  /* ─ toggle paused/active ─ */
  const toggleStatus = (id) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l
      )
    );
    const listing = listings.find((l) => l.id === id);
    const next = listing?.status === 'active' ? 'paused' : 'active';
    toast.info(`"${listing?.title}" ${next === 'paused' ? 'paused' : 'reactivated'}`, { icon: next === 'paused' ? '⏸️' : '▶️' });
  };

  /* ─ delete listing ─ */
  const deleteListing = () => {
    const listing = listings.find((l) => l.id === deleteTarget);
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget));
    toast.error(`Listing "${listing?.title}" deleted`, { icon: '🗑️' });
    setDeleteTarget(null);
  };

  const statEarnings = listings
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + l.price * l.sold, 0);

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-32">

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={`"${listings.find((l) => l.id === deleteTarget)?.title}" will be permanently removed from the store.`}
          onConfirm={deleteListing}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between">
        <button onClick={() => navigate('/account')}
          className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">
          Store <span className="text-unigo-green">Dashboard</span>
        </h1>
        <button onClick={() => navigate('/sell')}
          className="flex items-center gap-2 bg-unigo-black text-unigo-green px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
          <Plus className="w-3.5 h-3.5" /> List
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-[96px]">

        {/* ── Tab bar ── */}
        <div className="flex gap-2 py-6 border-b border-unigo-black/5 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-unigo-black text-white'
                  : 'bg-unigo-slate-100 text-unigo-black/40 hover:bg-unigo-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 pb-12">

            {/* Big headline stat */}
            <div className="bg-unigo-black rounded-[40px] p-8 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Total Earnings</p>
              <p className="text-6xl font-black italic tracking-tighter text-unigo-green mb-6">
                ₹{MOCK_STATS.totalEarnings.toLocaleString()}
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">This Month</p>
                  <p className="text-xl font-black italic">₹{MOCK_STATS.thisMonth.toLocaleString()}</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Total Sales</p>
                  <p className="text-xl font-black italic">{MOCK_STATS.totalSales}</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Avg Rating</p>
                  <p className="text-xl font-black italic">⭐ {MOCK_STATS.avgRating}</p>
                </div>
              </div>
            </div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Active Listings', value: listings.filter((l) => l.status === 'active').length, icon: <Tag className="w-5 h-5" />, color: 'text-unigo-green' },
                { label: 'Total Views',     value: MOCK_STATS.views,  icon: <Eye className="w-5 h-5" />,        color: 'text-unigo-orange' },
                { label: 'Total Buyers',    value: 28,                icon: <Users className="w-5 h-5" />,      color: 'text-blue-500' },
                { label: 'Earnings (live)', value: `₹${statEarnings.toLocaleString()}`, icon: <IndianRupee className="w-5 h-5" />, color: 'text-unigo-green' },
              ].map((s) => (
                <div key={s.label} className="bg-unigo-slate-50 rounded-[28px] p-6 border border-unigo-black/5">
                  <div className={`mb-4 ${s.color}`}>{s.icon}</div>
                  <p className="text-2xl font-black italic tracking-tighter mb-1">{s.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-unigo-black/30">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/sell')}
                  className="flex items-center gap-3 p-5 bg-unigo-black text-unigo-green rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                  <Plus className="w-5 h-5" /> New Listing
                </button>
                <button onClick={() => setActiveTab('Orders')}
                  className="flex items-center gap-3 p-5 bg-unigo-slate-100 text-unigo-black rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-unigo-slate-200 transition-all">
                  <Package className="w-5 h-5" /> View Orders
                </button>
              </div>
            </div>

            {/* Recent order snapshot */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Recent Orders</p>
                <button onClick={() => setActiveTab('Orders')}
                  className="text-[10px] font-black uppercase tracking-widest text-unigo-black/40 hover:text-unigo-black transition-colors">
                  See all →
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_ORDERS.slice(0, 2).map((o) => (
                  <div key={o.id} className="flex items-center gap-4 bg-unigo-slate-50 rounded-[20px] p-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${o.status === 'Delivered' ? 'bg-unigo-green' : 'bg-unigo-orange'}`} />
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-black uppercase truncate">{o.item}</p>
                      <p className="text-[9px] text-unigo-black/30 font-black uppercase tracking-widest">{o.buyer} · {o.date}</p>
                    </div>
                    <span className="font-black text-sm italic shrink-0">₹{o.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ LISTINGS TAB ══════════════ */}
        {activeTab === 'Listings' && (
          <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
                {listings.length} listing{listings.length !== 1 ? 's' : ''}
              </p>
              <button onClick={() => navigate('/sell')}
                className="flex items-center gap-2 bg-unigo-black text-unigo-green px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-24 bg-unigo-slate-50 rounded-[40px] border border-dashed border-unigo-black/10">
                <ShoppingBag className="w-12 h-12 mx-auto mb-6 opacity-10" />
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4">No Listings Yet</h3>
                <button onClick={() => navigate('/sell')}
                  className="bg-unigo-black text-unigo-green font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all">
                  Create First Listing
                </button>
              </div>
            ) : (
              listings.map((listing) => (
                <div key={listing.id}
                  className={`bg-unigo-slate-50 rounded-[28px] p-5 border transition-all ${listing.status === 'paused' ? 'opacity-60 border-unigo-black/5' : 'border-transparent hover:border-unigo-black/10'}`}>

                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-unigo-black rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-unigo-green" />
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-[10px] font-black uppercase tracking-tight truncate">{listing.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${listing.status === 'active' ? 'bg-unigo-green/10 text-unigo-green' : 'bg-unigo-black/10 text-unigo-black/40'}`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-unigo-black/30">
                        <span className="text-[9px] font-black uppercase tracking-widest">{listing.category}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">₹{listing.price}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">{listing.sold} sold</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Pause / Resume */}
                      <button
                        onClick={() => toggleStatus(listing.id)}
                        title={listing.status === 'active' ? 'Pause listing' : 'Resume listing'}
                        className="p-2.5 bg-white rounded-xl border border-unigo-black/5 hover:border-unigo-black transition-all text-unigo-black/40 hover:text-unigo-black"
                      >
                        {listing.status === 'active'
                          ? <Clock className="w-4 h-4" />
                          : <CheckCircle2 className="w-4 h-4" />
                        }
                      </button>

                      {/* Edit — navigates to sell with prefill (stub) */}
                      <button
                        onClick={() => { toast.info('Edit coming soon!', { icon: '✏️' }); }}
                        title="Edit listing"
                        className="p-2.5 bg-white rounded-xl border border-unigo-black/5 hover:border-unigo-black transition-all text-unigo-black/40 hover:text-unigo-black"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(listing.id)}
                        title="Delete listing"
                        className="p-2.5 bg-unigo-red/10 text-unigo-red rounded-xl hover:bg-unigo-red hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════════ ORDERS TAB ══════════════ */}
        {activeTab === 'Orders' && (
          <div className="space-y-4 pb-12">
            <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30 mb-2">
              {MOCK_ORDERS.length} orders received
            </p>

            {MOCK_ORDERS.map((order) => (
              <div key={order.id}
                className="bg-unigo-slate-50 rounded-[28px] p-5 border border-transparent hover:border-unigo-black/10 transition-all">
                <div className="flex items-center gap-4">
                  {/* Status icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${order.status === 'Delivered' ? 'bg-unigo-green/10' : 'bg-unigo-orange/10'}`}>
                    {order.status === 'Delivered'
                      ? <CheckCircle2 className="w-5 h-5 text-unigo-green" />
                      : <Clock className="w-5 h-5 text-unigo-orange" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-tight truncate mb-1">{order.item}</p>
                    <div className="flex items-center gap-3 text-unigo-black/30">
                      <span className="text-[9px] font-black uppercase tracking-widest">{order.id}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">{order.buyer}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">{order.date}</span>
                    </div>
                  </div>

                  {/* Amount + status */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-base italic tracking-tighter">₹{order.amount}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'text-unigo-green' : 'text-unigo-orange'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Orders summary */}
            <div className="mt-6 bg-unigo-black text-white rounded-[32px] p-6 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Revenue</p>
                <p className="text-3xl font-black italic tracking-tighter text-unigo-green">
                  ₹{MOCK_ORDERS.reduce((s, o) => s + o.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Delivered</p>
                <p className="text-3xl font-black italic tracking-tighter">
                  {MOCK_ORDERS.filter((o) => o.status === 'Delivered').length}/{MOCK_ORDERS.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoreDashboard;
