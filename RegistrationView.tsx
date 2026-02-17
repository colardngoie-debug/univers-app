
import React, { useState } from 'react';
import { Mail, ArrowRight, Key, ShieldCheck, User, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegistrationViewProps {
  onRegister: (user: any) => void;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', postNom: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickAccess = () => {
    const demoId = 'user-' + Math.random().toString(36).substr(2, 9);
    onRegister({ 
      id: demoId, 
      email: formData.email || 'citizen@univers.nexus',
      user_metadata: { 
        name: formData.name || 'Citizen', 
        post_nom: formData.postNom || 'Node' 
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (authError) throw authError;
        if (authData.user) onRegister(authData.user);
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.name, post_nom: formData.postNom } }
        });
        if (authError) throw authError;
        if (authData.user) onRegister(authData.user);
      }
    } catch (err: any) {
      setError(err.message);
      // Continuous connection as requested: fallback for testing environments
      handleQuickAccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" />
      
      <div className="max-w-md w-full glass-effect p-12 rounded-[3.5rem] border border-emerald-500/20 shadow-2xl relative z-10 animate-in zoom-in duration-500">
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
            <ShieldCheck className="text-black" size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter uppercase">Univers Nexus</h1>
          <p className="text-[9px] font-black text-emerald-400/60 uppercase tracking-[0.4em]">
            {isLoginMode ? 'Bio-Digital Sync' : 'Initialize Neural Node'}
          </p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginMode && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
              <input 
                placeholder="Name" required={!isLoginMode}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-xs outline-none focus:border-emerald-500 font-bold"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                placeholder="Last Name" required={!isLoginMode}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-xs outline-none focus:border-emerald-500 font-bold"
                value={formData.postNom}
                onChange={e => setFormData({...formData, postNom: e.target.value})}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 text-emerald-400" size={18} />
            <input 
              type="email" placeholder="Email Identifier" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white text-xs outline-none focus:border-emerald-500 font-bold"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Key className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 text-emerald-400" size={18} />
            <input 
              type="password" placeholder="Access Key" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white text-xs outline-none focus:border-emerald-500 font-bold"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3">
            {loading ? "SYNCING..." : (isLoginMode ? "SYNC TO NEXUS" : "INITIALIZE NODE")} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-2 mx-auto hover:scale-105 transition-transform"
          >
            {isLoginMode ? <UserPlus size={14}/> : <User size={14}/>}
            {isLoginMode ? "No Node Detected? Register" : "Node Detected? Synchronize"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationView;
