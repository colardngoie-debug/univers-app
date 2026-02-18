
import React, { useState } from 'react';
import { X, Heart, Send, MessageCircle, RadioIcon } from 'lucide-react';
import { Post } from './types';

interface CommentModalProps {
  post: Post;
  theme: string;
  onClose: () => void;
  t: (key: string) => string;
  onCommentSubmit: (text: string) => void;
  onLikeComment: (commentId: string) => void;
  currentUserAvatar: string;
  currentUserHandle: string;
  userName: string;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, theme, onClose, t, onCommentSubmit, onLikeComment, currentUserAvatar, currentUserHandle }) => {
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    const finalContent = replyTo ? `@${replyTo} ${commentText}` : commentText;
    onCommentSubmit(finalContent);
    setCommentText('');
    setReplyTo(null);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`w-full max-w-xl border-t md:border border-white/10 md:rounded-[4rem] h-[85vh] flex flex-col ${theme === 'dark' ? 'bg-obsidian' : 'bg-[#6b6b6b]'} text-white`}>
        <header className="p-10 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-5">
            <MessageCircle className="text-indigo-400" size={28} />
            <h3 className="font-bold uppercase tracking-[0.4em] text-[11px] opacity-70 text-white">Réseau Neuronal</h3>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full transition-all text-white"><X size={28} /></button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
          {(post.commentList || []).map(c => (
            <div key={c.id} className="flex gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <img src={c.avatar} className="w-12 h-12 rounded-full border border-indigo-500/30 shadow-2xl" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-indigo-400">@{c.handle}</p>
                  <span className="text-[9px] opacity-40 font-bold uppercase text-white">{c.time}</span>
                </div>
                <p className="text-[13px] font-light text-white/90">{c.text}</p>
                <div className="flex gap-8 text-[9px] opacity-60 font-bold uppercase mt-3 pt-3 border-t border-white/5">
                   <button onClick={() => onLikeComment(c.id)} className={`flex items-center gap-2 transition-colors ${c.isLiked ? 'text-red-500' : 'text-white'}`}>
                     <Heart size={14} fill={c.isLiked ? 'currentColor' : 'none'} /> {c.likes} likes
                   </button>
                   <button onClick={() => setReplyTo(c.handle)} className="text-white">Répondre</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 border-t border-white/10 bg-black/20">
          {replyTo && (
            <div className="mb-4 flex items-center justify-between bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] text-indigo-400 font-bold">RÉPONSE À @{replyTo}</span>
              <button onClick={() => setReplyTo(null)} className="text-white/40"><X size={14}/></button>
            </div>
          )}
          <div className="flex items-center gap-5 rounded-[2.5rem] p-4 bg-white/5 border border-white/10">
            <img src={currentUserAvatar} className="w-10 h-10 rounded-full" />
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Votre signal..." className="flex-1 bg-transparent border-none outline-none text-white text-sm" />
            <button onClick={handleSubmit} className="p-4 bg-indigo-600 rounded-full text-white"><Send size={24}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
