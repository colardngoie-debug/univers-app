
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Volume2, VolumeX, X, Trash2, Download, Flag, Send } from 'lucide-react';
import { Post } from './types';
import { CertifiedBadge } from './App';

interface FeedViewProps {
  posts: Post[];
  stories: Post[];
  onCommentClick: (post: Post) => void;
  onShareClick: (post: Post) => void;
  onLike: (id: string) => void;
  onStoryComment: (id: string, text: string) => void;
  onZoom: (post: Post) => void;
  onDelete: (id: string) => void;
  currentUserAvatar: string;
  currentUserHandle: string;
  currentUserName: string;
  t: (k: string) => string;
  theme: string;
}

const getRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

const FeedView: React.FC<FeedViewProps> = ({ posts, stories, onCommentClick, onShareClick, onLike, onStoryComment, onZoom, onDelete, currentUserAvatar, currentUserHandle, currentUserName, t, theme }) => {
  const [activeStory, setActiveStory] = useState<Post | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({});
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [storyCommentText, setStoryCommentText] = useState('');

  const toggleMute = (id: string) => {
    setMutedVideos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'univers-media';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStory || !storyCommentText.trim()) return;
    onStoryComment(activeStory.id, storyCommentText);
    setStoryCommentText('');
    alert("Signal emitted to nexus!");
  };

  const myStories = stories.filter(s => s.user.handle === currentUserHandle);

  return (
    <div className="max-w-xl mx-auto space-y-12 pb-32">
      <div className="flex gap-8 overflow-x-auto no-scrollbar py-6 px-2">
        {myStories.length > 0 && (
          <div className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group" onClick={() => setActiveStory(myStories[0])}>
            <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl">
               <div className="w-full h-full rounded-[1.8rem] bg-obsidian border-2 border-black overflow-hidden relative">
                  {myStories[0].mediaType === 'video' ? <video src={myStories[0].mediaUrl} className="w-full h-full object-cover" /> : <img src={myStories[0].mediaUrl} className="w-full h-full object-cover" />}
                  <img src={currentUserAvatar} className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-indigo-500" />
               </div>
            </div>
            <span className={`text-[9px] font-black uppercase opacity-40 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>My Story</span>
          </div>
        )}

        {stories.filter(s => s.user.handle !== currentUserHandle).map((story, i) => (
          <div key={i} onClick={() => setActiveStory(story)} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer animate-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-tr from-[#800020] via-purple-600 to-indigo-500 shadow-2xl group-hover:scale-110 transition-transform">
              <div className="w-full h-full rounded-[1.8rem] border-2 border-black overflow-hidden bg-obsidian relative">
                 {story.mediaType === 'video' ? <video src={story.mediaUrl} className="w-full h-full object-cover" /> : <img src={story.mediaUrl} className="w-full h-full object-cover" />}
                 <div className="absolute inset-0 bg-black/20" />
                 <img src={story.user.avatar} className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-indigo-500 shadow-lg" />
              </div>
            </div>
            <div className="px-4 py-1 bg-indigo-500/10 backdrop-blur-md rounded-full border border-indigo-500/20">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">@{story.user.handle}</span>
            </div>
          </div>
        ))}
      </div>

      {activeStory && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="w-full max-w-lg h-full md:h-[90vh] relative rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
              <div className="relative flex-1">
                {activeStory.mediaType === 'video' ? <video src={activeStory.mediaUrl} autoPlay playsInline loop className="w-full h-full object-cover" /> : <img src={activeStory.mediaUrl} className="w-full h-full object-cover" />}
                
                {/* Story Top Info */}
                <div className="absolute top-10 left-10 flex items-center gap-4">
                   <img src={activeStory.user.handle === currentUserHandle ? currentUserAvatar : activeStory.user.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-500" />
                   <div>
                      <p className="text-white font-bold">@{activeStory.user.handle}</p>
                      <p className="text-[10px] text-white/50">{getRelativeTime(activeStory.timestamp)}</p>
                   </div>
                </div>

                {/* Vertical Controls for Stories */}
                <div className="absolute right-6 bottom-32 flex flex-col gap-8 items-center z-10">
                   <div className="flex flex-col items-center gap-2">
                     <button 
                        onClick={() => onLike(activeStory.id)} 
                        className={`p-4 rounded-full glass-effect border transition-all ${activeStory.isLiked ? 'text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'text-white border-white/20'}`}
                     >
                       <Heart size={32} fill={activeStory.isLiked ? 'currentColor' : 'none'} />
                     </button>
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeStory.likes}</span>
                   </div>
                   
                   <div className="flex flex-col items-center gap-2">
                     <button className="p-4 rounded-full glass-effect border border-white/20 text-white shadow-xl">
                       <MessageCircle size={32} />
                     </button>
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeStory.comments}</span>
                   </div>
                </div>

                <button onClick={() => setActiveStory(null)} className="absolute top-10 right-10 text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={36}/></button>
              </div>
              
              <div className="p-8 bg-gradient-to-t from-black to-transparent">
                <form onSubmit={handleStorySubmit} className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-4">
                    <input 
                      value={storyCommentText}
                      onChange={(e) => setStoryCommentText(e.target.value)}
                      placeholder="Neural response..." 
                      className="bg-transparent border-none outline-none text-white text-sm flex-1"
                    />
                    <button type="submit" className="text-indigo-400 p-2"><Send size={22}/></button>
                </form>
              </div>
           </div>
        </div>
      )}

      {posts.map((post) => {
        const isMine = post.user.handle === currentUserHandle;
        const displayName = isMine ? currentUserName : post.user.name;
        
        return (
          <article key={post.id} className="glass-effect rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all relative">
            <div className="p-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-[#800020] via-purple-600 to-indigo-500 relative">
                  <img src={isMine ? currentUserAvatar : post.user.avatar} className="w-full h-full rounded-full border-2 border-black object-cover" />
                  <div className="absolute -bottom-1 -right-1 scale-75"><CertifiedBadge /></div>
                </div>
                <div className="flex flex-col">
                  <h3 className={`font-bold text-sm tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{displayName} <span className="opacity-40 font-light ml-1">@{post.user.handle}</span></h3>
                  <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">{getRelativeTime(post.timestamp)}</span>
                </div>
              </div>
              
              <div className="relative">
                <button onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)} className={`p-3 opacity-40 hover:opacity-100 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}><MoreHorizontal /></button>
                {activeMenuId === post.id && (
                  <div className="absolute top-full right-0 mt-2 w-48 glass-effect rounded-2xl border border-white/10 p-2 z-50 shadow-2xl animate-in zoom-in-95">
                    <button onClick={() => handleDownload(post.mediaUrl)} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/5 rounded-xl transition-all">
                      <Download size={14} /> Download
                    </button>
                    {isMine && (
                      <button onClick={() => { onDelete(post.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button onClick={() => { alert("Report emitted to neural core."); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:bg-white/5 rounded-xl transition-all">
                      <Flag size={14} /> Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="aspect-square bg-black relative group overflow-hidden cursor-zoom-in" onClick={() => onZoom(post)}>
               {post.mediaType === 'video' ? (
                  <>
                    <video src={post.mediaUrl} className="w-full h-full object-cover" loop muted={mutedVideos[post.id] ?? true} autoPlay playsInline />
                    <button onClick={(e) => { e.stopPropagation(); toggleMute(post.id); }} className="absolute bottom-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-indigo-600 transition-all">
                      {mutedVideos[post.id] === false ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                  </>
               ) : (
                  <img src={post.mediaUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               )}
            </div>

            <div className="p-10 space-y-4">
              <p className={`text-sm font-light ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>
                <span className="font-bold mr-2 text-indigo-400">@{post.user.handle}</span>
                {post.content}
              </p>
              <div className="flex items-center gap-10 pt-4 border-t border-white/5">
                <button onClick={() => onLike(post.id)} className={`flex items-center gap-3 transition-all ${post.isLiked ? 'text-red-500 scale-110' : 'text-white opacity-60'}`}>
                  <Heart size={28} fill={post.isLiked ? 'currentColor' : 'none'} /><span className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : ''}`}>{post.likes}</span>
                </button>
                <button onClick={() => onCommentClick(post)} className="flex items-center gap-3 text-white opacity-60">
                  <MessageCircle size={28} /><span className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : ''}`}>{post.comments}</span>
                </button>
                <button onClick={() => onShareClick(post)} className={`ml-auto opacity-40 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}><Share2 size={24} /></button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default FeedView;
