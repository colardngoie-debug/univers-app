
import React, { useState } from 'react';
import { Table, X, Camera, Sun, Moon, MapPin, GraduationCap, Wallet, Zap, Heart, LogOut, Trash2, Ban, CreditCard, Bitcoin, ShieldCheck } from 'lucide-react';
import { Post, Theme } from './types';
import { CertifiedBadge } from './App';

interface ProfileViewProps {
  posts: Post[];
  reels: Post[];
  onLangChange: (lang: string) => void;
  currentLang: string;
  avatar: string;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  t: (k: string) => string;
  theme: Theme;
  toggleTheme: () => void;
  profileData: any;
  setProfileData: (data: any) => void;
  userName: string;
  setUserName: (val: string) => void;
  tokens: number;
  setTokens: (val: number) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' }, { code: 'ja', name: '日本語' }, { code: 'sw', name: 'Kiswahili' }
];

const ProfileView: React.FC<ProfileViewProps> = ({ posts, reels, onLangChange, currentLang, avatar, avatarInputRef, t, theme, toggleTheme, profileData, setProfileData, userName, setUserName, tokens, setTokens, onLogout, onDeleteAccount }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [activeTab, setActiveTab] = useState<'JOURNAL' | 'REELS'>('JOURNAL');
  const [payMethod, setPayMethod] = useState<'CARD' | 'BTC'>('CARD');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className={`glass-effect p-12 md:p-16 mb-12 rounded-[3.5rem] border shadow-2xl transition-all duration-500 ${theme === 'light' ? 'bg-white/80' : ''}`}>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="relative group cursor-pointer shrink-0" onClick={() => avatarInputRef.current?.click()}>
            <div className={`w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 via-purple-600 to-[#800020] shadow-2xl relative`}>
              <img src={avatar} className={`w-full h-full rounded-full border-4 overflow-hidden object-cover group-hover:brightness-75 transition-all ${theme === 'light' ? 'border-white' : 'border-black'}`} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
              </div>
              <div className="absolute bottom-1 right-1">
                <CertifiedBadge className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h2 className={`text-4xl font-display font-bold tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{userName}</h2>
                <p className={`font-bold text-[10px] uppercase tracking-[0.4em] opacity-40`}>@{profileData?.handle}</p>
              </div>
              <button onClick={() => setShowSettings(true)} className={`p-4 rounded-[1.5rem] border transition-all shadow-lg ${theme === 'light' ? 'bg-black/5 border-black/5 text-slate-900 hover:bg-black/10' : 'bg-white/10 border-white/20 text-white hover:bg-indigo-600'}`}>
                <Table size={24} />
              </button>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 opacity-60">
              {profileData?.city && <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><MapPin size={14}/> {profileData?.city}</div>}
              {profileData?.studies && <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><GraduationCap size={14}/> {profileData?.studies}</div>}
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500"><Heart size={14} fill="currentColor"/> {t(profileData?.status)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-12 gap-8">
        <button onClick={() => setActiveTab('JOURNAL')} className={`px-10 py-4 rounded-full text-[10px] font-black tracking-widest border transition-all ${activeTab === 'JOURNAL' ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'glass-effect opacity-50'}`}>JOURNAL</button>
        <button onClick={() => setActiveTab('REELS')} className={`px-10 py-4 rounded-full text-[10px] font-black tracking-widest border transition-all ${activeTab === 'REELS' ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'glass-effect opacity-50'}`}>REELS</button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`relative w-full max-w-2xl border rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in glass-effect h-[90vh] flex flex-col ${theme === 'light' ? 'bg-[#D1D5DB]/95 border-white/50' : 'bg-black/95'}`}>
            <header className="p-8 pb-4 flex justify-between items-center shrink-0">
              <span className={`font-display font-bold text-[10px] uppercase tracking-[0.6em] opacity-40`}>SYSTEM SETTINGS</span>
              <button onClick={() => setShowSettings(false)} className={`p-3 hover:bg-black/5 rounded-full transition-all ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}><X size={24}/></button>
            </header>
            
            <div className="flex-1 p-8 pt-4 space-y-6 overflow-y-auto no-scrollbar">
              <div className={`p-6 rounded-[2rem] border flex items-center justify-between gap-6 shadow-xl relative overflow-hidden ${theme === 'light' ? 'bg-white/60 border-white' : 'bg-indigo-600/10 border-indigo-500/20'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Wallet className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Neural Tokens</p>
                    <div className="flex items-center gap-2 text-white">
                       <Zap className="text-amber-500" size={16} fill="currentColor" />
                       <span className="text-xl font-display font-bold">{tokens} NT</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowPurchase(true)} className="bg-white text-indigo-600 px-5 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">RECHARGE</button>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest ml-4 opacity-40">Neural Signature Name</label>
                    <input value={userName} onChange={(e) => setUserName(e.target.value)} className={`w-full rounded-[1.5rem] p-4 text-xs font-bold border outline-none ${theme === 'light' ? 'bg-white border-black/5' : 'bg-white/5 border-white/10 text-white'}`} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[8px] font-black uppercase tracking-widest ml-4 opacity-40">Relationship Status</label>
                       <select value={profileData?.status} onChange={(e) => setProfileData({...profileData, status: e.target.value})} className={`w-full rounded-[1.5rem] p-4 text-xs font-bold border outline-none appearance-none ${theme === 'light' ? 'bg-white border-black/5' : 'bg-white/5 border-white/10 text-white'}`}>
                         <option value="single">Single</option>
                         <option value="married">Married</option>
                         <option value="widowed">Widowed</option>
                         <option value="divorcing">Divorcing</option>
                         <option value="separated">Separated</option>
                         <option value="other">Other</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[8px] font-black uppercase tracking-widest ml-4 opacity-40">Global Language</label>
                       <select value={currentLang} onChange={(e) => onLangChange(e.target.value)} className={`w-full rounded-[1.5rem] p-4 text-xs font-bold border outline-none appearance-none ${theme === 'light' ? 'bg-white border-black/5' : 'bg-white/5 border-white/10 text-white'}`}>
                         {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              {/* Advanced Security & Logout */}
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => alert("Verification request submitted to Univers Core.")} className="flex items-center justify-center gap-3 p-4 rounded-[1.5rem] border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-md">
                    <ShieldCheck size={18} /> <span className="text-[9px] font-bold uppercase tracking-widest">Verify Profile</span>
                 </button>
                 <button onClick={onLogout} className="flex items-center justify-center gap-3 p-4 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md">
                    <LogOut size={18} /> <span className="text-[9px] font-bold uppercase tracking-widest">Neural Logout</span>
                 </button>
              </div>

              {/* Smaller Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={toggleTheme} className={`flex items-center justify-center p-4 rounded-[1.5rem] border gap-3 transition-all hover:bg-black/5 shadow-md ${theme === 'light' ? 'bg-white border-white/60 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}>
                   {theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-600" />}
                   <span className="text-[8px] font-black uppercase tracking-widest">VISUAL</span>
                </button>
                <button onClick={() => setShowSettings(false)} className="flex items-center justify-center p-4 rounded-[1.5rem] bg-indigo-600 border-indigo-500 text-white shadow-xl hover:scale-105 transition-all">
                   <Zap size={18} />
                   <span className="text-[8px] font-black uppercase tracking-widest">APPLY</span>
                </button>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button onClick={onDeleteAccount} className="w-full flex items-center justify-center gap-3 p-3 rounded-[1.2rem] border border-red-500/5 bg-red-500/5 hover:bg-red-600 hover:text-white text-red-400/50 transition-all">
                  <Trash2 size={14}/> <span className="text-[8px] font-bold uppercase tracking-widest">Purge Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECHARGE MODAL */}
      {showPurchase && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl animate-in zoom-in">
          <div className="w-full max-w-md glass-effect rounded-[3.5rem] p-10 border border-emerald-500/20 shadow-2xl">
             <header className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3 uppercase tracking-tighter"><Zap className="text-emerald-500" /> Buy Neural Tokens</h3>
                <button onClick={() => setShowPurchase(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
             </header>

             <div className="flex gap-4 p-2 bg-white/5 rounded-2xl mb-8 border border-white/5">
                <button onClick={() => setPayMethod('CARD')} className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${payMethod === 'CARD' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40'}`}><CreditCard size={14}/> Card</button>
                <button onClick={() => setPayMethod('BTC')} className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${payMethod === 'BTC' ? 'bg-amber-600 text-white shadow-lg' : 'opacity-40'}`}><Bitcoin size={14}/> Bitcoin</button>
             </div>

             <div className="space-y-6">
                {payMethod === 'CARD' ? (
                  <div className="space-y-4">
                    <input placeholder="Card Identifier (Number)" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 text-white outline-none placeholder:opacity-20 text-sm font-bold" />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="MM/YY" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 text-white outline-none placeholder:opacity-20 text-sm font-bold" />
                      <input placeholder="CVC" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 text-white outline-none placeholder:opacity-20 text-sm font-bold" />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl text-center space-y-6">
                    <div className="w-24 h-24 bg-white mx-auto rounded-3xl flex items-center justify-center shadow-2xl rotate-3"><Bitcoin className="text-amber-600" size={56} /></div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">BTC RECEIVER ADDRESS</p>
                       <p className="text-[9px] text-white opacity-40 select-all font-mono break-all p-3 bg-black/40 rounded-xl">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  {[100, 500, 1000].map(amt => (
                    <button key={amt} className="p-4 rounded-2xl border border-white/10 hover:border-emerald-500 hover:bg-emerald-500/10 text-white transition-all group">
                      <p className="text-xs font-black uppercase tracking-widest">{amt} NT</p>
                      <p className="text-[8px] opacity-40 group-hover:opacity-100">${amt/10}</p>
                    </button>
                  ))}
                </div>

                <button onClick={() => { setTokens(tokens + 1000); setShowPurchase(false); alert("Tokens synced to neural core!"); }} className="w-full py-6 bg-emerald-600 text-black rounded-[2rem] font-black uppercase tracking-widest mt-4 shadow-2xl hover:bg-emerald-400 transition-all">AUTHORIZE NEXUS PAY</button>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {(activeTab === 'JOURNAL' ? posts.filter(p => !p.isProduct) : reels).map((post) => (
          <div key={post.id} className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden relative group cursor-pointer border shadow-xl ${theme === 'light' ? 'border-white bg-white/40' : 'border-white/10 bg-black'}`}>
             {post.mediaType === 'video' ? <video src={post.mediaUrl} className="w-full h-full object-cover" /> : <img src={post.mediaUrl} className="w-full h-full object-cover" />}
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Heart size={28} className="text-white fill-current" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
