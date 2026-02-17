
import React from 'react';
import { X, Link as LinkIcon, MessageSquare, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { Post } from '../types';

interface ShareModalProps {
  post: Post;
  onClose: () => void;
  t: (key: string) => string;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose, t }) => {
  const shareOptions = [
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-emerald-500', url: `https://wa.me/?text=${encodeURIComponent(post.content)}` },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600', url: 'https://instagram.com' },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-400', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}` },
    { name: 'TikTok', icon: MessageSquare, color: 'bg-black', url: 'https://tiktok.com' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien copié !');
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm glass-effect rounded-[3rem] border border-white/10 p-8 animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-display font-bold uppercase tracking-widest">{t('share')}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {shareOptions.map(opt => (
            <a key={opt.name} href={opt.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 rounded-full ${opt.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <opt.icon size={24} />
              </div>
              <span className="text-[10px] font-bold opacity-60 uppercase">{opt.name}</span>
            </a>
          ))}
          <button onClick={copyLink} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <LinkIcon size={24} />
            </div>
            <span className="text-[10px] font-bold opacity-60 uppercase">Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
