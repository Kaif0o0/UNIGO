import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi'
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const [upiData, setUpiData] = useState({ id: '' });

  /* ─── Helpers ─── */
  const formatCardNumber = (val) =>
    val
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)} / ${clean.slice(2)}` : clean;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'number') return setCardData({ ...cardData, number: formatCardNumber(value) });
    if (name === 'expiry') return setCardData({ ...cardData, expiry: formatExpiry(value) });
    if (name === 'cvv') return setCardData({ ...cardData, cvv: value.replace(/\D/g, '').slice(0, 3) });
    setCardData({ ...cardData, [name]: value });
  };

  /* ─── Simulated payment ─── */
  const handlePay = async (e) => {
    e.preventDefault();

    // Basic validation
    if (paymentMethod === 'card') {
      if (!cardData.name || cardData.number.replace(/\s/g, '').length < 16 || !cardData.expiry || cardData.cvv.length < 3) {
        toast.error('Please fill in all card details correctly', { icon: '💳' });
        return;
      }
    }
    if (paymentMethod === 'upi') {
      if (!upiData.id.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. name@upi)', { icon: '📱' });
        return;
      }
    }

    setLoading(true);
    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2200));
    setLoading(false);
    setDone(true);
    clearCart();
    toast.success('Payment successful! 🎉 Your order is confirmed.');
    setTimeout(() => navigate('/'), 3500);
  };

  /* ─── Success screen ─── */
  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-28 h-28 bg-unigo-green rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-unigo-green/30 animate-bounce">
          <CheckCircle className="w-14 h-14 text-unigo-black" />
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter italic mb-3">
          Order <span className="text-unigo-green">Placed!</span>
        </h2>
        <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-widest mb-2">
          Your study gear is on the way
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/20">
          Redirecting to home…
        </p>
      </div>
    );
  }

  /* ─── Empty cart guard ─── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Nothing to checkout</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-unigo-black text-unigo-green font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all"
        >
          Go Shop
        </button>
      </div>
    );
  }

  const tax = cartTotal * 0.18;
  const grandTotal = cartTotal + tax;

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/cart')} className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter italic">
            Uni<span className="text-unigo-green">Go</span> Pay
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
            <Lock className="w-3 h-3" /> Secure
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-[96px]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 py-10">

          {/* ── LEFT: Payment Form ── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Payment Method Tabs */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30 mb-4">
                Payment Method
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-3 p-5 rounded-[24px] border-2 transition-all font-black text-[11px] uppercase tracking-widest ${
                    paymentMethod === 'card'
                      ? 'border-unigo-black bg-unigo-black text-unigo-green shadow-xl'
                      : 'border-unigo-black/10 text-unigo-black/40 hover:border-unigo-black/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center gap-3 p-5 rounded-[24px] border-2 transition-all font-black text-[11px] uppercase tracking-widest ${
                    paymentMethod === 'upi'
                      ? 'border-unigo-black bg-unigo-black text-unigo-green shadow-xl'
                      : 'border-unigo-black/10 text-unigo-black/40 hover:border-unigo-black/30'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  UPI
                </button>
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePay} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
                    Cardholder Name
                  </label>
                  <input
                    name="name"
                    value={cardData.name}
                    onChange={handleCardChange}
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="cc-name"
                    className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-unigo-black transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      name="number"
                      value={cardData.number}
                      onChange={handleCardChange}
                      placeholder="0000 0000 0000 0000"
                      autoComplete="cc-number"
                      inputMode="numeric"
                      className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 px-6 pr-14 text-sm font-bold tracking-widest focus:ring-2 focus:ring-unigo-black transition-all"
                    />
                    <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-unigo-black/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
                      Expiry Date
                    </label>
                    <input
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      placeholder="MM / YY"
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-unigo-black transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
                      CVV
                    </label>
                    <input
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="•••"
                      type="password"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-unigo-black transition-all"
                    />
                  </div>
                </div>

                <PayButton loading={loading} total={grandTotal} />
              </form>
            )}

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <form onSubmit={handlePay} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
                    UPI ID
                  </label>
                  <div className="relative">
                    <input
                      value={upiData.id}
                      onChange={(e) => setUpiData({ id: e.target.value })}
                      placeholder="yourname@upi"
                      className="w-full bg-unigo-slate-50 border-none rounded-2xl py-5 px-6 pr-14 text-sm font-bold focus:ring-2 focus:ring-unigo-black transition-all"
                    />
                    <Smartphone className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-unigo-black/20" />
                  </div>
                </div>

                {/* UPI apps quick select */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">
                    Quick Select
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {['@okaxis', '@ybl', '@paytm'].map((suffix) => (
                      <button
                        key={suffix}
                        type="button"
                        onClick={() => setUpiData({ id: upiData.id.split('@')[0] + suffix })}
                        className="py-3 rounded-2xl bg-unigo-slate-50 text-[10px] font-black uppercase tracking-widest hover:bg-unigo-green hover:text-unigo-black transition-all border border-unigo-black/5"
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>
                </div>

                <PayButton loading={loading} total={grandTotal} />
              </form>
            )}

            {/* Security badges */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-unigo-black/5">
              <div className="flex items-center gap-2 text-unigo-black/20">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-unigo-black/20">
                <Lock className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">PCI Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-unigo-black/20">
                <Zap className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Instant Access</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-2">
            <div className="bg-unigo-black text-white rounded-[40px] overflow-hidden shadow-2xl">
              {/* Summary Header — collapsible on mobile */}
              <button
                type="button"
                onClick={() => setOrderSummaryOpen((o) => !o)}
                className="w-full flex items-center justify-between p-8 text-left"
              >
                <h3 className="text-xl font-black uppercase tracking-tighter italic">
                  Order Summary
                </h3>
                <span className="flex items-center gap-2 text-unigo-green text-[10px] font-black uppercase tracking-widest lg:hidden">
                  {cartItems.length} items
                  {orderSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {/* Items list — always visible on desktop */}
              <div className={`px-8 pb-6 space-y-5 ${orderSummaryOpen ? 'block' : 'hidden lg:block'}`}>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-tight truncate">{item.title}</p>
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Qty {item.quantity}</p>
                    </div>
                    <span className="text-unigo-green font-black text-sm italic shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 mx-6" />
              <div className="p-8 space-y-4 text-[10px] font-black uppercase tracking-widest">
                <div className="flex justify-between opacity-50">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between opacity-50">
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between opacity-50">
                  <span>Delivery</span>
                  <span className="text-unigo-green">FREE</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-xl italic tracking-tighter">Total</span>
                  <span className="text-3xl font-black italic text-unigo-green">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ─── Pay Button sub-component ─── */
const PayButton = ({ loading, total }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-unigo-black text-unigo-green font-black py-6 rounded-[24px] uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-60 flex items-center justify-center gap-3"
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-unigo-green border-t-transparent rounded-full animate-spin" />
        Processing…
      </>
    ) : (
      <>
        <Lock className="w-4 h-4" />
        Pay ₹{total.toFixed(2)} Securely
      </>
    )}
  </button>
);

export default Checkout;
