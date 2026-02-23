import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  Calendar,
  Box
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  
  // Mock orders data for demonstration
  // In a real app, this would be fetched from the backend
  const [orders] = useState([
    {
      id: "UG-92837",
      date: "Oct 22, 2024",
      status: "Delivered",
      total: 149.00,
      items: [
        { name: "Biology Class 12 Notes", type: "Notes", price: 49.00 },
        { name: "NEET Prep 2024 Q-Bank", type: "Q-Bank", price: 100.00 }
      ],
      color: "bg-unigo-green"
    },
    {
      id: "UG-92840",
      date: "Oct 20, 2024",
      status: "Processing",
      total: 49.00,
      items: [
        { name: "B.Sc Botany Guide", type: "Book", price: 49.00 }
      ],
      color: "bg-unigo-orange"
    }
  ]);

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-24">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">Your <span className="text-unigo-green">Orders</span></h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-2xl mx-auto p-6 lg:p-12 pt-[96px] lg:pt-[96px]">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Order History</h2>
          <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em]">Track and manage your study gear</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-unigo-slate-50 rounded-[40px] border border-dashed border-unigo-black/10">
            <ShoppingBag className="w-12 h-12 mx-auto mb-6 opacity-10" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">No Orders Yet</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30 mb-8">Ready to gear up for your studies?</p>
            <button 
              onClick={() => navigate('/store')}
              className="bg-unigo-black text-unigo-green font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all"
            >
              Shop Store
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-unigo-slate-50 rounded-[32px] p-6 border border-unigo-black/5 hover:border-unigo-black/10 transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-2 h-full ${order.status === 'Delivered' ? 'bg-unigo-green' : 'bg-unigo-orange'} opacity-20`}></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-unigo-black rounded-full flex items-center justify-center">
                      <Package className="text-unigo-green w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-unigo-black opacity-30 uppercase tracking-widest">Order ID</p>
                      <p className="text-xs font-black uppercase">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-unigo-green/10 text-unigo-green' : 'bg-unigo-orange/10 text-unigo-orange'} text-[8px] font-black uppercase tracking-widest`}>
                      {order.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-unigo-black/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-unigo-black/5">
                          <Box className="w-5 h-5 text-unigo-black opacity-20" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tight truncate max-w-[150px]">{item.name}</p>
                          <p className="text-[8px] font-black text-unigo-black/20 uppercase tracking-widest">{item.type}</p>
                        </div>
                      </div>
                      <p className="text-xs font-black italic">₹{item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-unigo-black/5">
                  <div className="flex items-center gap-2 text-unigo-black/30">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{order.date}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-unigo-black/20 uppercase tracking-widest">Total Amount</p>
                    <p className="text-lg font-black italic tracking-tighter">₹{order.total.toFixed(2)}</p>
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

export default Orders;
