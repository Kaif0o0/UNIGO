import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  MessageSquare, 
  CreditCard, 
  Users, 
  Star, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

const MentorSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const mentor = location.state?.mentor;

  const handleStartChat = async () => {
    try {
      if (!user) {
        toast.info('Please login to chat with a mentor', { icon: '🔐' });
        navigate('/account');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats`, {
        mentorId: id,
        participantId: mentor.user?._id || mentor.user
      }, config);

      toast.success(`Chat started with ${mentor.name}! 💬`);
      navigate(`/chat/${data._id}`, { state: { chat: data } });
    } catch (error) {
      console.error('CHAT ERROR:', error);
      toast.error('Could not start chat. Please try again.', { icon: '❌' });
    }
  };

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <button onClick={() => navigate('/mentors')} className="text-unigo-green font-black uppercase tracking-widest text-xs flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Mentors
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-24">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between">
        <button onClick={() => navigate('/mentors')} className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">Book <span className="text-unigo-green">Session</span></h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-4xl mx-auto p-6 lg:p-12 pt-[96px] lg:pt-[96px]">
        {/* Mentor Quick Info */}
        <div className="bg-unigo-slate-50 rounded-[40px] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 border border-white shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-unigo-green opacity-5 blur-3xl -mr-16 -mt-16"></div>
          
          <div className="w-32 h-32 bg-unigo-black rounded-[40px] flex items-center justify-center text-unigo-green shadow-2xl shrink-0">
            <Users className="w-16 h-16" />
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">{mentor.name}</h2>
              <span className="inline-block bg-unigo-green text-unigo-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                {mentor.experience}
              </span>
            </div>
            <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Expert in {mentor.skills?.slice(0, 3).join(", ")}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-unigo-black/5 shadow-sm">
                <Star className="w-3 h-3 text-unigo-orange fill-unigo-orange" />
                <span className="text-[10px] font-black uppercase tracking-widest">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-unigo-black/5 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-unigo-green" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Mentor</span>
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-right shrink-0 bg-white px-8 py-6 rounded-[32px] border border-unigo-black/5 shadow-sm">
            <p className="text-[10px] font-black text-unigo-black/20 uppercase tracking-widest mb-1">Session Rate</p>
            <p className="text-4xl font-black italic tracking-tighter leading-none">₹{mentor.price}<span className="text-xs not-italic">/hr</span></p>
          </div>
        </div>

        {/* Action Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {user?._id === (mentor.user?._id || mentor.user) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[48px]">
              <div className="bg-unigo-black text-unigo-green px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl">
                You cannot book your own session
              </div>
            </div>
          )}
          
          {/* Chat Option */}
          <div 
            onClick={user?._id === (mentor.user?._id || mentor.user) ? null : handleStartChat}
            className={`group bg-white rounded-[48px] p-10 border-2 border-unigo-slate-100 ${user?._id === (mentor.user?._id || mentor.user) ? 'opacity-50 cursor-not-allowed' : 'hover:border-unigo-black cursor-pointer'} transition-all relative overflow-hidden flex flex-col items-center text-center`}
          >
            <div className="w-20 h-20 bg-unigo-slate-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-unigo-black group-hover:text-unigo-green transition-all duration-500">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Chat First</h3>
            <p className="text-[10px] font-black text-unigo-black/30 uppercase tracking-widest leading-relaxed mb-8 max-w-[200px]">Discuss your requirements and schedule with {mentor.name.split(' ')[0]}</p>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
              Message Now <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Payment Option */}
          <div className={`group bg-unigo-black rounded-[48px] p-10 border-2 border-unigo-black ${user?._id === (mentor.user?._id || mentor.user) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer'} transition-all relative overflow-hidden flex flex-col items-center text-center shadow-2xl`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-unigo-green/20"></div>
            <div className="w-20 h-20 bg-unigo-green rounded-full flex items-center justify-center mb-8 text-unigo-black">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4 text-white">Direct Booking</h3>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-relaxed mb-8 max-w-[200px]">Confirm your session immediately and get priority support</p>
            <div className={`mt-auto flex items-center gap-3 bg-unigo-green text-unigo-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}>
              <CreditCard className="w-4 h-4" /> Pay ₹{mentor.price}
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <p className="text-[9px] font-black text-unigo-black/20 uppercase tracking-[0.3em] mb-4">Secure Platform Guaranteed</p>
          <div className="flex justify-center items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <div className="h-6 w-16 bg-unigo-slate-200 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-unigo-slate-200 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-unigo-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorSession;
