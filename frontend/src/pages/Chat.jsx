import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  Users, 
  Clock,
  CheckCheck,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const scrollRef = useRef();
  const dropdownRef = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInfo, setChatInfo] = useState(location.state?.chat || null);
  const [loading, setLoading] = useState(!chatInfo);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      if (!user) return;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${id}/messages`, config);
      setMessages(data);
      
      // If we don't have chat info (e.g. direct link), fetch it once
      if (!chatInfo) {
        const { data: myChats } = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats`, config);
        const thisChat = myChats.find(c => c._id === id);
        if (thisChat) setChatInfo(thisChat);
      }
    } catch (error) {
      console.error('FETCH MESSAGES ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats/${id}/messages`, {
        text: newMessage
      }, config);

      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('SEND MESSAGE ERROR:', error);
    }
  };

  const handleDeleteChat = async () => {
    setDeleting(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, config);
      navigate('/inbox');
    } catch (error) {
      console.error('DELETE CHAT ERROR:', error);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getOtherParticipant = () => {
    if (!chatInfo || !chatInfo.participants) return 'User';
    const other = chatInfo.participants.find(p => p._id !== user._id && p !== user._id);
    return other?.name || chatInfo.mentor?.name || 'User';
  };

  return (
    <div className="bg-white font-sans text-unigo-black" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', paddingTop: '73px', paddingBottom: '70px', overflow: 'hidden' }}>
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-unigo-black/5 flex items-center justify-between shadow-sm fixed top-0 left-0 right-0 z-[9998]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-unigo-black rounded-2xl flex items-center justify-center text-unigo-green shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tight italic">{getOtherParticipant()}</h1>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-unigo-green rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-unigo-green uppercase tracking-widest">Active Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* More Options Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all text-unigo-black/40 hover:text-unigo-black"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-2xl border border-unigo-black/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowDeleteModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 font-semibold hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Chat
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar bg-unigo-slate-50/50">
        <div className="text-center py-8">
          <p className="text-[8px] font-black text-unigo-black/10 uppercase tracking-[0.4em] mb-2">Beginning of Conversation</p>
          <div className="w-8 h-1 bg-unigo-black/5 mx-auto rounded-full"></div>
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
          return (
            <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] lg:max-w-[60%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-6 py-4 rounded-[28px] text-sm font-medium shadow-sm transition-all ${
                  isMe 
                    ? 'bg-unigo-black text-white rounded-tr-none' 
                    : 'bg-white text-unigo-black border border-unigo-black/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[8px] font-black text-unigo-black/20 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-2 h-2" /> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <CheckCheck className="w-2.5 h-2.5 text-unigo-green opacity-40" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </main>

      {/* Input */}
      <footer className="bg-white px-6 pt-4 pb-4 border-t border-unigo-black/5 shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-grow bg-unigo-slate-50 rounded-[24px] px-6 py-2 flex items-center border border-transparent focus-within:border-unigo-black/10 transition-all shadow-inner">
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent border-none py-4 text-sm focus:ring-0 placeholder:text-unigo-black/20 font-medium"
            />
          </div>
          <button 
            type="submit"
            className="w-14 h-14 bg-unigo-black text-unigo-green rounded-[22px] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
        <p className="text-center text-[7px] font-black text-unigo-black/10 uppercase tracking-[0.3em] mt-3">Messages are encrypted and secure</p>
      </footer>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5">
            <button
              onClick={() => !deleting && setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-2 text-unigo-black/20 hover:text-unigo-black hover:bg-unigo-slate-100 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-[22px] bg-red-50 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <div className="text-center">
              <h2 className="text-lg font-black uppercase tracking-tight mb-2">Delete Chat?</h2>
              <p className="text-sm text-unigo-black/50 font-medium leading-relaxed">
                This will permanently delete this conversation and all messages for everyone. This cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-3 rounded-2xl border-2 border-unigo-black/10 text-sm font-black uppercase tracking-wide hover:bg-unigo-slate-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChat}
                disabled={deleting}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-black uppercase tracking-wide hover:bg-red-600 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
