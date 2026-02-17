
import React, { useRef, useEffect, useState } from 'react';
import { Newspaper, ShieldCheck, AlertCircle, ExternalLink, MessageCircle, Share2, PlusCircle, Globe, Volume2, VolumeX } from 'lucide-react';
import { Post } from '../types';

interface ActualiteViewProps {
  posts: Post[];
  onCommentClick: (post: Post) => void;
  onShareClick: (post: Post) => void;
  t: (key: string) => string;
  theme: string;
}

const NewsVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (videoRef.current) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} src={src} className="w-full h-full object-cover" loop muted={isMuted} playsInline />
      <button 
        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
        className="absolute bottom-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 z-10"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};

const ActualiteView: React.FC<ActualiteViewProps> = ({ posts, onCommentClick, onShareClick, t, theme }) => {
  const newsPosts = posts.filter(p => p.isNews);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-4xl font-display font-bold flex items-center gap-4 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <Globe className="text-indigo-500" size={32} />
            Univers News
          </h2>
          <p className="text-xs opacity-50 uppercase tracking-[0.4em] mt-2 font-bold ml-12">Réseau d'Information Neural</p>
        </div>
      </div>

      {newsPosts.length === 0 ? (
        <div className="py-24 text-center glass-effect border border-white/10 rounded-[3rem] opacity-30 space-y-6">
          <Newspaper size={64} className="mx-auto text-indigo-400" />
          <p className="uppercase font-bold tracking-[0.3em] text-xs">Calme plat sur le flux de données</p>
        </div>
      ) : (
        newsPosts.map((post) => (
          <article key={post.id} className="glass-effect rounded-[3rem] overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all shadow-2xl animate-in fade-in slide-in-from-bottom-6">
            <div className="p-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={post.user.avatar || 'https://picsum.photos/seed/news/100'} className="w-10 h-10 rounded-full border border-indigo-500/30" />
                  <span className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>@{post.user.handle}</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-widest">Flux Vérifié</span>
                  </div>
                  {post.category && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                      {post.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={`text-2xl font-bold leading-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{post.title || "Flash Info"}</h3>
                {/* Correction du contraste ici : text-slate-700 en mode light */}
                <p className={`text-sm font-light leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>{post.content}</p>
              </div>
              
              {post.mediaUrl && (
                <div className="rounded-[2rem] overflow-hidden border border-white/5 aspect-video shadow-xl bg-black">
                  {post.mediaType === 'video' ? (
                    <NewsVideoPlayer src={post.mediaUrl} />
                  ) : (
                    <img src={post.mediaUrl} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-indigo-400 text-xs font-bold bg-indigo-500/5 px-4 py-2 rounded-xl">
                  <Globe size={14} />
                  {post.source || "Source Interne"}
                </div>
                <div className="flex gap-6">
                   <button onClick={() => onCommentClick(post)} className={`flex items-center gap-2 opacity-50 hover:opacity-100 transition-all hover:text-indigo-400 ${theme === 'light' ? 'text-slate-900' : ''}`}>
                      <MessageCircle size={20} /> <span className="text-xs font-bold">{post.comments}</span>
                   </button>
                   <button onClick={() => onShareClick(post)} className={`flex items-center gap-2 opacity-50 hover:opacity-100 transition-all hover:text-indigo-400 ${theme === 'light' ? 'text-slate-900' : ''}`}>
                      <Share2 size={20} />
                   </button>
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
};

export default ActualiteView;
