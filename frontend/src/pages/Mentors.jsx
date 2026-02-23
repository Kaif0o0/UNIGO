import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Award, 
  MessageSquare,
  ShieldCheck,
   IndianRupee,
  Briefcase,
  Search,
  Home,
  ShoppingBag,
  PlusCircle,
  ShoppingCart,
  User
} from 'lucide-react';


const Mentors = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('hire');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    skills: '',
    price: '',
    bio: '',
    experience: ''
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/mentors`);
      setMentors(data);
    } catch (err) {
      console.error('FETCH MENTORS ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const token = user?.token;
      if (!token) throw new Error('Please login to join as mentor');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Convert skills string to array
      const mentorData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/mentors`, mentorData, config);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveTab('hire');
        fetchMentors();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-unigo-black pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-6 border-b border-unigo-black/5 fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-unigo-slate-100 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">Uni<span className="text-unigo-green">Go</span> Mentors</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-4xl mx-auto p-6 lg:p-12 pt-[96px] lg:pt-[96px]">
        {/* Tabs */}
        <div className="flex bg-unigo-slate-50 p-2 rounded-[24px] mb-12">
          <button 
            onClick={() => setActiveTab('hire')}
            className={`flex-1 py-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'hire' ? 'bg-white shadow-sm text-unigo-black' : 'text-unigo-black/30 hover:text-unigo-black'}`}
          >
            Hire a Mentor
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-white shadow-sm text-unigo-black' : 'text-unigo-black/30 hover:text-unigo-black'}`}
          >
            Add My Skills
          </button>
        </div>

        {activeTab === 'hire' ? (
          <div>
            <div className="mb-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Expert Help</h2>
              <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em]">Learn from the top 1% of students</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-unigo-slate-100 border-t-unigo-green rounded-full animate-spin mb-4"></div>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-20 bg-unigo-slate-50 rounded-[40px] border border-dashed border-unigo-black/10">
                <Users className="w-12 h-12 mx-auto mb-6 opacity-10" />
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">No Mentors Yet</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Be the first to share your expert knowledge</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mentors.map((mentor) => (
                  <div key={mentor._id} className="bg-unigo-slate-50 rounded-[40px] p-8 border border-white hover:border-unigo-black/10 transition-all hover:scale-[1.02] shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-unigo-green rounded-3xl flex items-center justify-center text-unigo-black shadow-lg">
                          <Users className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-black text-xl uppercase tracking-tight italic">{mentor.name}</h4>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-unigo-green bg-unigo-black px-3 py-1 rounded-full">{mentor.experience}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-unigo-black/20 uppercase tracking-widest">Rate</p>
                        <p className="text-2xl font-black italic tracking-tighter">₹{mentor.price}<span className="text-[10px] not-italic">/hr</span></p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs text-unigo-black/60 font-medium leading-relaxed mb-4">{mentor.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.skills.map((skill, idx) => (
                          <span key={idx} className="bg-white border border-unigo-black/5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {user?._id !== (mentor.user?._id || mentor.user) && (
                      <button 
                        onClick={() => navigate(`/session/${mentor._id}`, { state: { mentor } })}
                        className="w-full bg-unigo-black text-unigo-green font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                      >
                        <MessageSquare className="w-4 h-4" /> Book Session
                      </button>
                    )}
                    {user?._id === (mentor.user?._id || mentor.user) && (
                      <div className="w-full bg-unigo-green/10 text-unigo-green text-center py-4 rounded-2xl font-black uppercase tracking-widest text-[8px]">
                        This is your Mentor Profile
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Become a Mentor</h2>
              <p className="text-unigo-black/40 text-[10px] font-black uppercase tracking-[0.2em]">Share your expertise & earn rewards</p>
            </div>

            {success ? (
              <div className="bg-unigo-green/10 p-12 rounded-[40px] text-center">
                <div className="w-20 h-20 bg-unigo-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-unigo-black" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Application Received</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-unigo-black/40">You are now part of the UniGo mentor club</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 bg-unigo-slate-50 p-8 md:p-12 rounded-[40px]">
                {error && (
                  <div className="bg-unigo-red/10 text-unigo-red p-4 rounded-xl flex items-center gap-3 text-xs font-black uppercase">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Display Name</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your professional name"
                      className="w-full bg-white border-none rounded-2xl py-5 px-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Price per Hour (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input 
                        required
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full bg-white border-none rounded-2xl py-5 pl-14 pr-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Skills (Comma Separated)</label>
                  <div className="relative">
                    <Award className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input 
                      required
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g. Biology, NEET Prep, Coding, Notes Writing"
                      className="w-full bg-white border-none rounded-2xl py-5 pl-14 pr-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Experience Level</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input 
                      required
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 3rd Year MBBS Student / Senior Educator"
                      className="w-full bg-white border-none rounded-2xl py-5 pl-14 pr-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-unigo-black/30">Professional Bio</label>
                  <textarea 
                    required
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell students how you can help them excel..."
                    className="w-full bg-white border-none rounded-2xl py-6 px-8 text-sm focus:ring-2 focus:ring-unigo-black transition-all font-bold resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-unigo-black text-unigo-green font-black py-6 rounded-[24px] uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                >
                  {submitLoading ? 'Applying...' : 'Join UniGo Mentors'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default Mentors;
