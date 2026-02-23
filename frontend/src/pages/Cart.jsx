import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  CreditCard,
  ShoppingCart
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-unigo-slate-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingCart className="w-10 h-10 text-unigo-black/20" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Empty Bag</h2>
        <p className="text-unigo-black/40 text-xs font-black uppercase tracking-widest mb-10">Add some study gear to get started</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-unigo-black text-unigo-green font-black px-12 py-5 rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all"
        >
          Go Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-32">
      {/* Header */}
      <header className="bg-white px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-unigo-slate-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter italic">Uni<span className="text-unigo-green">Go</span> Bag</h1>
          <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-unigo-red border-b border-unigo-red">
            Drop All
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 lg:p-12 pt-[96px] lg:pt-[96px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 items-center group bg-unigo-slate-50 p-6 rounded-[32px] border border-transparent hover:border-unigo-black transition-all">
                <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow flex flex-col min-w-0">
                  <h4 className="font-black text-sm uppercase tracking-tight mb-1 truncate">{item.title}</h4>
                  <p className="text-[10px] font-bold text-unigo-black/30 uppercase tracking-widest mb-4">₹{item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center bg-white rounded-xl p-1 border border-unigo-black/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-unigo-red transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-black text-xs">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-unigo-green transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-unigo-black/20 hover:text-unigo-red transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-unigo-black text-white p-8 rounded-[40px] shadow-2xl lg:sticky lg:top-32">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-8">Pay Bill</h3>
              
              <div className="space-y-4 mb-10 opacity-80">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t border-white/10 pt-4">
                  <span>Delivery</span>
                  <span className="text-unigo-green">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-black uppercase tracking-tighter italic">Total</span>
                  <span className="text-3xl font-black italic">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-unigo-green text-unigo-black font-black py-5 rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs">
                  Checkout
                </button>
                <button onClick={() => navigate('/')} className="w-full bg-white/10 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs hover:bg-white/20">
                  Add More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-unigo-black/5 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Total Bill</span>
            <span className="text-2xl font-black tracking-tighter italic italic">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button className="bg-unigo-black text-unigo-green font-black px-10 py-4 rounded-2xl uppercase tracking-widest text-xs">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
