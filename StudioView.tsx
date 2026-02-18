
import React, { useState, useRef } from 'react';
import { Sparkles, Wand2, Upload, Newspaper, ShoppingBag, Share2, Wallet, X, Radio, Plus } from 'lucide-react';
import { generateAuraImage } from './geminiService';
import { Post, Theme } from './types';

interface StudioViewProps {
  onNewPost: (post: Post, target: any) => void;
  t: (key: string) => string;
  theme: Theme;
}

const NEWS_CATEGORIES = ['NEWS', 'SPORT', 'DIVERS'];

const StudioView: React.FC<StudioViewProps> = ({ onNewPost, t, theme }) => {
  const [mode, setMode] = useState<'SOCIAL' | 'NEWS' | 'SHOP'>('SOCIAL');
  const [target, setTarget] = useState<'JOURNAL' | 'REEL' | 'STORY'>('JOURNAL');
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('NEWS');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        // Détection auto Image vs Vidéo
        setMediaType(file.type.startsWith('video') ? 'video' : 'image');
        const reader = new FileReader();
        reader.onloadend = () => setMediaList(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePublish = () => {
    if (mediaList.length === 0) return;
    const post: Post = {
      id: Date.now().toString(),
      user: { name: '', handle: 'creator', avatar: '', verified: true },
      content: caption,
      mediaUrl: mediaList[0],
      mediaUrls: mediaList,
      mediaType,
      likes: 0, comments: 0, timestamp: Date.now(),
      title, price, currency: 'USD',
      source, category
    };
    onNewPost(post, mode === 'SOCIAL' ? target : mode);
    setMediaList([]); setCaption(''); setTitle(''); setPrice(''); setSource('');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 pb-32">
      <div className="flex justify-center gap-4 mb-12 overflow-x-auto no-scrollbar py-2">
        <button onClick={() => setMode('SOCIAL')} className={`flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold border transition-all ${mode === 'SOCIAL' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'glass-effect opacity-60'}`}><Share2 size={16}/> SOCIAL</button>
        <button onClick={() => setMode('NEWS')} className={`flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold border transition-all ${mode === 'NEWS' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'glass-effect opacity-60'}`}><Newspaper size={16}/> UNIVERS NEWS</button>
        <button onClick={() => setMode('SHOP')} className={`flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold border transition-all ${mode === 'SHOP' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'glass-effect opacity-60'}`}><ShoppingBag size={16}/> VENDRE</button>
      </div>

      <div className="glass-effect rounded-[3rem] p-10 space-y-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-indigo-500 uppercase tracking-widest flex items-center gap-3"><Plus size={24}/> Studio Univers</h3>
            
            {mode === 'SOCIAL' && (
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                {['JOURNAL', 'REEL', 'STORY'].map(t => (
                  <button key={t} onClick={() => setTarget(t as any)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${target === t ? 'bg-indigo-600 text-white' : 'opacity-40'}`}>{t}</button>
                ))}
              </div>
            )}

            {mode === 'NEWS' && (
              <div className="space-y-4 animate-in slide-in-from-left duration-300">
                <div className="flex gap-2">
                  {NEWS_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 py-2 rounded-xl text-[9px] font-bold border transition-all ${category === cat ? 'bg-indigo-600 border-indigo-500 text-white' : 'opacity-40'}`}>{cat}</button>
                  ))}
                </div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'info..." className="w-full rounded-2xl px-6 py-4 bg-white/5 border border-white/10 text-white" />
                <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source (ex: Univers Network)" className="w-full rounded-2xl px-6 py-4 bg-white/5 border border-white/10 text-white" />
              </div>
            )}

            {mode === 'SHOP' && (
              <div className="space-y-4">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nom du produit" className="w-full rounded-2xl p-6 bg-white/5 border border-white/10 text-white" />
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Prix USD" type="number" className="w-full rounded-2xl p-6 bg-white/5 border border-white/10 text-white" />
              </div>
            )}

            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Description / Contenu..." className="w-full h-40 rounded-[2rem] p-6 bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            
            <div className="flex gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-6 bg-white/10 border border-white/20 rounded-[2rem] text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3"><Upload size={18}/> MÉDIA</button>
              <button onClick={async () => { setIsGenerating(true); const r = await generateAuraImage(caption); if(r) setMediaList([r]); setIsGenerating(false); }} className="p-6 bg-indigo-600 rounded-[2rem] text-white"><Sparkles/></button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} accept="image/*,video/*" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mediaList.map((m, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/10 bg-black">
                {mediaType === 'video' ? <video src={m} className="w-full h-full object-cover" /> : <img src={m} className="w-full h-full object-cover" />}
                <button onClick={() => setMediaList(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
              </div>
            ))}
            {mediaList.length === 0 && <div className="col-span-2 flex items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] opacity-10"><Radio size={48} className="text-white"/></div>}
          </div>
        </div>
        <button onClick={handlePublish} disabled={mediaList.length === 0} className={`w-full py-8 rounded-[2.5rem] font-black text-white shadow-2xl uppercase tracking-[0.4em] disabled:opacity-20 ${mode === 'SHOP' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>PUBLIER DANS LE RÉSEAU</button>
      </div>
    </div>
  );
};

export default StudioView;
