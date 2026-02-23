import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  MessageSquare, 
  Users, 
  Clock, 
  ChevronRight,
  Search,
  MessageCircle
} from 'lucide-react';

const Inbox = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/account');
      return;
    }
    fetchChats();
  }, [user]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats`, config);
      setChats(data);
    } catch (error) {
      console.error('FETCH CHATS ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (chat) => {
    const other = chat.participants.find(p => p._id !== user._id);
    return other ? other.name : (chat.mentor?.name || 'User');
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-24">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">Your <span className="text-unigo-green">Inbox</span></h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-2xl mx-auto p-6 lg:p-12 pt-[96px] lg:pt-[96px]">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Messages</h2>
          <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em]">Private conversations with mentors & students</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-unigo-black/20" />
          <input 
            placeholder="Search conversations..."
            className="w-full bg-unigo-slate-50 border-none rounded-3xl py-5 pl-14 pr-8 text-xs font-bold focus:ring-2 focus:ring-unigo-black/5 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-unigo-slate-100 border-t-unigo-green rounded-full animate-spin"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-20 bg-unigo-slate-50 rounded-[40px] border border-dashed border-unigo-black/10">
            <MessageCircle className="w-12 h-12 mx-auto mb-6 opacity-10" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">No Messages Yet</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30 mb-8">Start a conversation with a mentor or student</p>
            <button 
              onClick={() => navigate('/mentors')}
              className="bg-unigo-black text-unigo-green font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all"
            >
              Find a Mentor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div 
                key={chat._id} 
                onClick={() => navigate(`/chat/${chat._id}`, { state: { chat } })}
                className="bg-white rounded-[32px] p-6 border border-unigo-black/5 hover:border-unigo-black/10 hover:bg-unigo-slate-50 transition-all cursor-pointer group flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-unigo-black rounded-3xl flex items-center justify-center text-unigo-green shadow-lg shrink-0 group-hover:scale-105 transition-all">
                  <Users className="w-8 h-8" />
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-black text-sm uppercase tracking-tight truncate pr-4">{getOtherParticipant(chat)}</h4>
                    <span className="text-[8px] font-black text-unigo-black/20 uppercase tracking-widest flex items-center gap-1 shrink-0">
                      <Clock className="w-2.5 h-2.5" /> {chat.lastMessage ? getTimeAgo(chat.lastMessage.createdAt) : 'Empty'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-unigo-black/40 truncate font-medium">
                      {chat.lastMessage ? (
                        <>
                          <span className="font-bold">{chat.lastMessage.sender === user._id ? 'You: ' : ''}</span>
                          {chat.lastMessage.text}
                        </>
                      ) : 'No messages yet...'}
                    </p>
                    <ChevronRight className="w-4 h-4 text-unigo-black/10 group-hover:text-unigo-green transition-all -mr-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WhatsApp Hint/Style Note */}
        <div className="mt-20 p-8 bg-unigo-green/5 rounded-[40px] border border-unigo-green/10 flex items-center gap-6">
          <div className="w-12 h-12 bg-unigo-green rounded-full flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6 text-unigo-black" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-tight mb-1">Encrypted Chats</p>
            <p className="text-[9px] font-medium text-unigo-black/40 leading-relaxed uppercase tracking-widest">Your conversations are private and only visible between you and the other participant.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inbox;
