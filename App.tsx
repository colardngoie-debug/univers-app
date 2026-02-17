
import React, { useState, useEffect, useRef, useMemo } from 'react';
import FeedView from './components/FeedView';
import PulseView from './components/PulseView';
import StudioView from './components/StudioView';
import ProfileView from './components/ProfileView';
import ActualiteView from './components/ActualiteView';
import ShopView from './components/ShopView';
import LiveView from './components/LiveView';
import MessengerView from './components/MessengerView';
import CommentModal from './components/CommentModal';
import ShareModal from './components/ShareModal';
import RegistrationView from './components/RegistrationView';
import { ViewType, Theme, Post, LangCode, Comment } from './types';
import { supabase } from './lib/supabase';
import { 
  Home, Search, Zap, PlusSquare, Bell, Newspaper, ShoppingBag, Radio, X, Heart, MessageCircle, Send
} from 'lucide-react';

export const CertifiedBadge = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} text-emerald-500 flex-shrink-0 fill-current drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]`} viewBox="0 0 24 24">
    <path d="M12 1L14.4 3.6L18 3.5L18.4 7.1L21.7 8.7L20.2 12L21.7 15.3L18.4 16.9L18 20.5L14.4 20.4L12 23L9.6 20.4L6 20.5L5.6 16.9L2.3 15.3L3.8 12L2.3 8.7L5.6 7.1L6 3.5L9.6 3.6L12 1ZM10 17L17 10L15.6 8.6L10 14.2L7.4 11.6L6 13L10 17Z" />
  </svg>
);

const UniversMessengerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div className={`relative ${className} group cursor-pointer`}>
    <div className="absolute inset-0 bg-indigo-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-12.7 8.38 8.38 0 0 1 3.8.9L21 3z" />
      <path d="M12 8l4 4-4 4-4-4 4-4z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  </div>
);

const TRANSLATIONS: Record<string, any> = {
  en: { universes: "SEARCH UNIVERS...", back: "BACK", reply: "Reply", single: "Single", married: "Married", widowed: "Widowed", divorcing: "Divorcing", separated: "Separated", other: "Other", shop: "Shop", sell: "Sell", share: "Share" },
  fr: { universes: "RECHERCHE UNIVERS...", back: "RETOUR", reply: "Répondre", single: "Célibataire", married: "Marié(e)", widowed: "Veuf/Veuve", divorcing: "En instance de divorce", separated: "Séparé(e)", other: "Autre", shop: "Boutique", sell: "Vendre", share: "Partager" },
  zh: { universes: "搜索宇宙...", back: "返回", reply: "回复", single: "单身", married: "已婚", widowed: "丧偶", divorcing: "离婚中", separated: "分居", other: "其他", shop: "商店", sell: "卖", share: "分享" }
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>({ name: '', handle: 'user', avatar_url: '', tokens: 1000, status: 'single', city: '', studies: '', bio: '', email: '', password: '' });
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.FEED);
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<LangCode>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [reels, setReels] = useState<Post[]>([]);
  const [stories, setStories] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [zoomedPost, setZoomedPost] = useState<Post | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const t = (k: string) => TRANSLATIONS[lang]?.[k] || TRANSLATIONS['en']?.[k] || k;

  // Persistence logic remains to ensure data conservation
  useEffect(() => {
    const savedPosts = localStorage.getItem('univers_data_posts');
    const savedReels = localStorage.getItem('univers_data_reels');
    const savedStories = localStorage.getItem('univers_data_stories');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedReels) setReels(JSON.parse(savedReels));
    if (savedStories) setStories(JSON.parse(savedStories));
  }, []);

  useEffect(() => {
    localStorage.setItem('univers_data_posts', JSON.stringify(posts));
    localStorage.setItem('univers_data_reels', JSON.stringify(reels));
    localStorage.setItem('univers_data_stories', JSON.stringify(stories));
  }, [posts, reels, stories]);

  // Language Auto-Detection
  useEffect(() => {
    const userLang = navigator.language.split('-')[0];
    if (TRANSLATIONS[userLang]) {
      setLang(userLang);
    } else {
      setLang('en');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  const addNotification = (text: string, type: string = 'info') => {
    setNotifications(prev => [{ id: Date.now(), text, time: "Just now", type }, ...prev]);
  };

  const handleLike = (postId: string) => {
    const p = posts.find(p => p.id === postId) || reels.find(p => p.id === postId) || stories.find(p => p.id === postId);
    if (!p) return;
    const update = (list: Post[]) => list.map(item => item.id === postId ? { ...item, likes: item.isLiked ? item.likes - 1 : item.likes + 1, isLiked: !item.isLiked } : item);
    setPosts(update(posts));
    setReels(update(reels));
    setStories(update(stories));
    if (!p.isLiked) addNotification(`Someone liked your ${p.isStory ? 'story' : 'post'}.`, 'like');
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    const update = (list: Post[]) => list.map(p => p.id === postId ? {
      ...p,
      commentList: p.commentList?.map(c => c.id === commentId ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked } : c)
    } : p);
    setPosts(update(posts));
    setReels(update(reels));
    addNotification("A comment on your post was liked.", "like");
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setReels(prev => prev.filter(p => p.id !== postId));
    setStories(prev => prev.filter(p => p.id !== postId));
  };

  const handleCommentSubmit = (text: string) => {
    if (!selectedPostForComments) return;
    const newComment: Comment = { id: Date.now().toString(), handle: profile?.handle, avatar: profile?.avatar_url, text, likes: 0, time: 'Just now' };
    const update = (list: Post[]) => list.map(p => p.id === selectedPostForComments.id ? { ...p, comments: p.comments + 1, commentList: [...(p.commentList || []), newComment] } : p);
    setPosts(update(posts));
    setReels(update(reels));
    addNotification(`New signal on your post: "${text.slice(0, 20)}..."`, 'comment');
  };

  const handleStoryComment = (storyId: string, text: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, comments: s.comments + 1 } : s));
    addNotification(`New story response from @${profile.handle}`, 'comment');
  };

  const handleLogout = () => {
    setSession(null);
    setProfile({ name: '', handle: 'user', avatar_url: '', tokens: 1000, status: 'single', city: '', studies: '', bio: '', email: '', password: '' });
    setCurrentView(ViewType.FEED);
  };

  const handleDeleteAccount = () => {
    const confirmation = prompt("To confirm account destruction, please enter your email address:");
    if (confirmation === profile.email) {
      localStorage.clear();
      alert("Neural signature destroyed.");
      handleLogout();
    } else {
      alert("Verification failed.");
    }
  };

  const filteredPosts = useMemo(() => {
    const base = posts.filter(p => !p.isProduct && !p.isNews && !p.isStory);
    if (!searchQuery) return base;
    return base.filter(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.user.handle.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [posts, searchQuery]);

  const handleNewPost = (newPost: Post, target: any) => {
    const postWithUser = {
      ...newPost,
      user: { name: profile.name || 'Citizen', handle: profile.handle, avatar: profile.avatar_url, verified: true },
      likes: 0, comments: 0, commentList: [], timestamp: Date.now(),
      isProduct: target === 'SHOP',
      isNews: target === 'NEWS'
    };
    if (target === 'REEL') setReels(prev => [postWithUser, ...prev]);
    else if (target === 'STORY') setStories(prev => [{ ...postWithUser, isStory: true }, ...prev]);
    else setPosts(prev => [postWithUser, ...prev]);
    
    if (target === 'REEL') setCurrentView(ViewType.PULSE);
    else if (target === 'SHOP') setCurrentView(ViewType.SHOP);
    else if (target === 'NEWS') setCurrentView(ViewType.ACTUALITE);
    else setCurrentView(ViewType.FEED);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setSession(session); fetchOrCreateProfile(session.user); }
    });
  }, []);

  const fetchOrCreateProfile = async (user: any) => {
    const userName = user.user_metadata?.name || 'Citizen';
    setProfile({
      id: user.id,
      name: userName,
      email: user.email,
      handle: (userName).toLowerCase().replace(/\s/g, '_') + '_' + user.id.slice(-4),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      tokens: 1000, status: 'single', city: '', studies: ''
    });
  };

  if (!session && !profile.id) {
    return <RegistrationView onRegister={(user) => { setSession({ user }); fetchOrCreateProfile(user); }} />;
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#D1D5DB] text-slate-900'} font-sans overflow-x-hidden`}>
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => {
        const f = e.target.files?.[0];
        if(f) { const r = new FileReader(); r.onloadend = () => setProfile({...profile, avatar_url: r.result}); r.readAsDataURL(f); }
      }} />
      
      <header className={`fixed top-0 left-0 right-0 z-[60] glass-effect border-b px-6 py-4 ${theme === 'light' ? 'border-black/5 bg-white/70' : 'border-indigo-500/10'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button onClick={() => setCurrentView(ViewType.PROFILE)} className="relative shrink-0">
            <div className={`w-12 h-12 rounded-full p-1 bg-gradient-to-tr from-[#800020] via-purple-600 to-indigo-500 shadow-xl`}>
              <img src={profile?.avatar_url} className={`w-full h-full rounded-full object-cover border-2 ${theme === 'light' ? 'border-white' : 'border-black'}`} />
            </div>
            <div className="absolute -bottom-1 -right-1"><CertifiedBadge className="w-5 h-5" /></div>
          </button>

          <div className={`flex items-center rounded-full px-5 py-2.5 border transition-all duration-500 ease-out focus-within:w-[400px] w-[180px] md:w-[280px] ${theme === 'light' ? 'bg-black/5 border-black/5 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10' : 'bg-white/5 border-white/10'}`}>
            <Search size={14} className="opacity-40" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('universes')} className="bg-transparent border-none outline-none text-[10px] ml-3 w-full uppercase tracking-widest font-bold placeholder:opacity-30" />
          </div>
          
          <div className="flex items-center gap-2 md:gap-5">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 rounded-full hover:bg-black/5 transition-all">
                <Bell size={22} className="opacity-60" />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-72 glass-effect rounded-3xl border border-white/10 p-6 shadow-2xl animate-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4">Neural Feedback Stream</h4>
                  <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? <p className="text-[9px] opacity-20">No recent signals.</p> : notifications.map(n => (
                      <div key={n.id} className="flex gap-3 text-[11px] border-b border-white/5 pb-2">
                        {n.type === 'like' ? <Heart className="text-red-500 shrink-0" size={14} fill="currentColor"/> : <MessageCircle className="text-indigo-400 shrink-0" size={14}/>}
                        <div>
                          <p className="text-white">{n.text}</p>
                          <span className="text-[8px] opacity-40">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setCurrentView(ViewType.MESSENGER)} className="p-3 rounded-full hover:bg-black/5 transition-all"><UniversMessengerIcon className="w-7 h-7" /></button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 max-w-6xl mx-auto px-4 relative z-10">
        {currentView === ViewType.FEED && <FeedView posts={filteredPosts} stories={stories} onCommentClick={setSelectedPostForComments} onShareClick={setSharingPost} onLike={handleLike} onStoryComment={handleStoryComment} onZoom={setZoomedPost} onDelete={handleDeletePost} currentUserAvatar={profile?.avatar_url} currentUserHandle={profile?.handle} currentUserName={profile?.name} t={t} theme={theme} />}
        {currentView === ViewType.PULSE && <PulseView reels={reels} onCommentClick={setSelectedPostForComments} onShareClick={setSharingPost} onLike={handleLike} t={t} />}
        {currentView === ViewType.STUDIO && <StudioView onNewPost={handleNewPost} t={t} theme={theme} />}
        {currentView === ViewType.ACTUALITE && <ActualiteView posts={posts.filter(p => p.isNews)} onCommentClick={setSelectedPostForComments} onShareClick={setSharingPost} t={t} theme={theme} />}
        {currentView === ViewType.SHOP && <ShopView posts={posts.filter(p => p.isProduct)} t={t} theme={theme} onSellClick={() => setCurrentView(ViewType.STUDIO)} />}
        {currentView === ViewType.LIVE && <LiveView t={t} />}
        {currentView === ViewType.MESSENGER && <MessengerView onBack={() => setCurrentView(ViewType.FEED)} currentUserAvatar={profile?.avatar_url} currentUserHandle={profile?.handle} t={t} />}
        {currentView === ViewType.PROFILE && <ProfileView posts={posts} reels={reels} onLangChange={setLang} currentLang={lang} avatar={profile?.avatar_url} avatarInputRef={avatarInputRef} t={t} theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} profileData={profile} setProfileData={setProfile} userName={profile.name} setUserName={(v) => setProfile({...profile, name: v})} tokens={profile.tokens} setTokens={(v) => setProfile({...profile, tokens: v})} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />}
      </main>

      <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-8 py-4 glass-effect rounded-[2.5rem] border shadow-2xl flex items-center gap-10 md:gap-14 ${theme === 'light' ? 'bg-white/70' : 'bg-black/70'}`}>
        {[Home, Zap, ShoppingBag, PlusSquare, Newspaper, Radio].map((Icon, idx) => {
          const v = [ViewType.FEED, ViewType.PULSE, ViewType.SHOP, ViewType.STUDIO, ViewType.ACTUALITE, ViewType.LIVE][idx];
          return <button key={idx} onClick={() => setCurrentView(v)} className={`transition-all duration-300 ${currentView === v ? 'text-indigo-600 scale-125' : 'opacity-30 hover:opacity-100 hover:scale-110'}`}><Icon size={22} /></button>
        })}
      </nav>

      {zoomedPost && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setZoomedPost(null)}>
          <button className="absolute top-10 right-10 p-4 text-white hover:scale-110 transition-transform"><X size={40}/></button>
          <div className="max-w-[90vw] max-h-[90vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)]" onClick={e => e.stopPropagation()}>
            {zoomedPost.mediaType === 'video' ? <video src={zoomedPost.mediaUrl} controls autoPlay className="w-full h-full object-contain" /> : <img src={zoomedPost.mediaUrl} className="w-full h-full object-contain" />}
          </div>
        </div>
      )}

      {selectedPostForComments && <CommentModal post={selectedPostForComments} theme={theme} onClose={() => setSelectedPostForComments(null)} t={t} onCommentSubmit={handleCommentSubmit} onLikeComment={(cid) => handleLikeComment(selectedPostForComments.id, cid)} currentUserAvatar={profile?.avatar_url} currentUserHandle={profile?.handle} userName={profile?.name} />}
      {sharingPost && <ShareModal post={sharingPost} onClose={() => setSharingPost(null)} t={t} />}
    </div>
  );
};

export default App;
