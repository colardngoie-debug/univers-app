
import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, PlusCircle, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Post, Theme } from '../types';

interface ShopViewProps {
  posts: Post[];
  t: (key: string) => string;
  onSellClick: () => void;
  theme: Theme;
}

const ShopView: React.FC<ShopViewProps> = ({ posts, t, onSellClick, theme }) => {
  const products = posts.filter(p => p.isProduct);
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

  const nextImg = (pid: string, max: number) => {
    setActiveImageIndices(prev => ({ ...prev, [pid]: ((prev[pid] || 0) + 1) % max }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-display font-bold flex items-center gap-4 text-white">
          <ShoppingBag className="text-emerald-500" size={36} /> {t('shop')}
        </h2>
        <button onClick={onSellClick} className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-[2rem] font-bold shadow-lg hover:bg-emerald-500 transition-colors"><PlusCircle size={20}/> {t('sell')}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map(post => {
          const images = post.mediaUrls || [post.mediaUrl];
          const activeIdx = activeImageIndices[post.id] || 0;
          return (
            <div key={post.id} className="glass-effect rounded-[3rem] border border-white/10 overflow-hidden group shadow-2xl">
              <div className="aspect-square relative">
                <img src={images[activeIdx]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                {images.length > 1 && (
                  <>
                    <button onClick={() => nextImg(post.id, images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 backdrop-blur-md rounded-full text-white"><ChevronRight /></button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === activeIdx ? 'bg-emerald-500' : 'bg-white/30'}`} />)}
                    </div>
                  </>
                )}

                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full font-bold text-emerald-400 border border-emerald-500/30 text-lg shadow-2xl">
                  {post.price} {post.currency}
                </div>
              </div>
              <div className="p-10 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 opacity-40 text-[10px] uppercase font-bold tracking-widest text-white">
                    <img src={post.user.avatar} className="w-5 h-5 rounded-full" /> @{post.user.handle}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{post.title || "Produit Univers"}</h3>
                  <button className="flex items-center gap-3 text-emerald-400 font-bold text-sm mt-4 group">
                    <MessageSquare size={18} /> CONTACTER LE VENDEUR
                    <div className="w-0 group-hover:w-full h-0.5 bg-emerald-500 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopView;
