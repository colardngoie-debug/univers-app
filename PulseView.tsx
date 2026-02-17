
import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Zap } from 'lucide-react';
import { Post } from '../types';
import { CertifiedBadge } from '../App';

interface PulseViewProps {
  reels: Post[];
  onCommentClick: (post: any) => void;
  onShareClick: (post: any) => void;
  onLike: (id: string) => void;
  t: (k: string) => string;
}

const ReelItem: React.FC<{ video: Post, isMuted: boolean, onComment: any, onShare: any, onLike: any }> = ({ video, isMuted, onComment, onShare, onLike }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (videoRef.current) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: [0, 0.8, 1.0] }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full w-full snap-start relative flex flex-col justify-end">
      <video ref={videoRef} src={video.mediaUrl} className="absolute inset-0 w-full h-full object-cover" loop muted={isMuted} playsInline />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 flex justify-between items-end gap-4 w-full p-8 pb-10">
        <div className="space-y-4 max-w-[75%] text-white">
          <div className="flex items-center gap-3">
            <img src={video.user.avatar} className="w-10 h-10 rounded-full border-2 border-indigo-500" /> 
            <div className="flex items-center font-bold text-sm">
              <span>{video.user.handle}</span>
              {video.user.verified && <CertifiedBadge />}
            </div>
          </div>
          <p className="text-sm opacity-80">{video.content}</p>
        </div>
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => onLike(video.id)} className={`${video.isLiked ? 'text-red-600' : 'text-white'}`}><Heart size={36} fill={video.isLiked ? 'currentColor' : 'none'} /></button>
            <span className="text-white text-[10px] font-bold">{video.likes}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => onComment(video)} className="text-white"><MessageCircle size={36} /></button>
            <span className="text-white text-[10px] font-bold">{video.comments}</span>
          </div>
          <button onClick={() => onShare(video)} className="text-white"><Share2 size={36} /></button>
        </div>
      </div>
    </div>
  );
};

const PulseView: React.FC<PulseViewProps> = ({ reels, onCommentClick, onShareClick, onLike, t }) => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="h-[calc(100vh-14rem)] w-full max-w-[420px] mx-auto overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black rounded-[3rem] border border-white/10 shadow-2xl">
      {reels.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-white/20 p-8 text-center">
          <Zap size={64} className="mb-4 animate-pulse" />
          <p className="uppercase font-bold tracking-[0.4em] text-[10px]">No Neural Streams Active</p>
        </div>
      ) : (
        reels.map((video) => (
          <ReelItem key={video.id} video={video} isMuted={isMuted} onComment={onCommentClick} onShare={onShareClick} onLike={onLike} />
        ))
      )}
      <button onClick={() => setIsMuted(!isMuted)} className="fixed bottom-32 right-10 p-4 bg-white/10 backdrop-blur-md rounded-full text-white z-50 border border-white/10">
        {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
      </button>
    </div>
  );
};

export default PulseView;
