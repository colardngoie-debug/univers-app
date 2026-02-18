
import React, { useState, useEffect } from 'react';
import { Search, Send, ArrowLeft, MoreVertical, Circle, Paperclip, Smile, Sparkles } from 'lucide-react';
import { Conversation, ChatMessage } from './types';
import { supabase } from './supabase';
import { getAIAssistantResponse } from './geminiService';

interface MessengerViewProps {
  onBack: () => void;
  currentUserAvatar: string;
  currentUserHandle: string;
  t: (k: string) => string;
}

const MessengerView: React.FC<MessengerViewProps> = ({ onBack, currentUserAvatar, currentUserHandle, t }) => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Initialisation avec Aether AI par défaut
  useEffect(() => {
    const aiConv: Conversation = {
      id: 'aether-ai',
      user: {
        name: 'AETHER-1 AI',
        handle: 'aether_core',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aether',
        online: true
      },
      lastMessage: 'Système neuronal actif. Comment puis-je vous aider ?',
      time: 'Now',
      unreadCount: 0,
      messages: [{
        id: '1',
        sender: 'aether_core',
        text: 'Bienvenue dans le Nexus, Citoyen. Je suis AETHER-1, votre assistant de synchronisation universelle.',
        time: 'Now',
        isMe: false
      }]
    };

    const fetchConversations = async () => {
      // Pour l'instant on simule car la table conversations vient d'être créée
      setConversations([aiConv]);
      setSelectedChat(aiConv);
      setLoading(false);
    };

    fetchConversations();
  }, []);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUserHandle,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    // Mise à jour locale immédiate
    const updatedMessages = [...selectedChat.messages, userMsg];
    const updatedChat = { ...selectedChat, messages: updatedMessages, lastMessage: messageText };
    
    setSelectedChat(updatedChat);
    setConversations(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));
    const currentInput = messageText;
    setMessageText('');

    // Réponse de l'IA si c'est Aether
    if (selectedChat.id === 'aether-ai') {
      setIsAiTyping(true);
      try {
        const aiResponse = await getAIAssistantResponse(currentInput);
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'aether_core',
          text: aiResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false
        };
        
        const finalChat = { ...updatedChat, messages: [...updatedMessages, aiMsg], lastMessage: aiResponse };
        setSelectedChat(finalChat);
        setConversations(prev => prev.map(c => c.id === selectedChat.id ? finalChat : c));
      } catch (e) {
        console.error("AI Error", e);
      } finally {
        setIsAiTyping(false);
      }
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-12rem)] flex items-center justify-center text-white">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mr-3" />
      <span className="font-bold tracking-widest uppercase text-xs">Initialisation du Nexus...</span>
    </div>
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`w-full md:w-96 flex flex-col glass-effect rounded-[3rem] border border-white/10 overflow-hidden ${selectedChat && 'hidden md:flex'}`}>
        <header className="p-8 border-b border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-white tracking-tighter">MESSAGES</h2>
            <button onClick={onBack} className="md:hidden opacity-50 text-white"><ArrowLeft /></button>
          </div>
          <div className="flex items-center bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
            <Search size={16} className="opacity-40 text-white" />
            <input placeholder="Fréquence de recherche..." className="bg-transparent border-none outline-none text-xs ml-3 w-full text-white" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setSelectedChat(conv)}
              className={`flex items-center gap-4 p-5 rounded-[2rem] cursor-pointer transition-all ${selectedChat?.id === conv.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="relative shrink-0">
                <img src={conv.user.avatar} className="w-12 h-12 rounded-full border border-white/10 bg-obsidian" />
                {conv.user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />}
              </div>
              <div className="flex-1 min-w-0 text-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm truncate flex items-center gap-2">
                    {conv.user.name} 
                    {conv.id === 'aether-ai' && <Sparkles size={12} className="text-indigo-400" />}
                  </span>
                  <span className="text-[9px] opacity-40 font-bold">{conv.time}</span>
                </div>
                <p className="text-[11px] opacity-60 truncate font-light">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedChat ? (
        <div className="flex-1 flex flex-col glass-effect rounded-[3rem] border border-white/10 overflow-hidden relative shadow-[0_0_80px_rgba(99,102,241,0.1)]">
          <header className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/2 backdrop-blur-md">
            <div className="flex items-center gap-4 text-white">
              <button onClick={() => setSelectedChat(null)} className="md:hidden p-2"><ArrowLeft size={20}/></button>
              <img src={selectedChat.user.avatar} className="w-10 h-10 rounded-full border border-indigo-500/30 bg-obsidian" />
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  {selectedChat.user.name}
                  {selectedChat.id === 'aether-ai' && <Sparkles size={14} className="text-indigo-400 animate-pulse" />}
                </h3>
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                  <Circle size={8} fill="currentColor" className="animate-pulse" /> Synchronisé
                </div>
              </div>
            </div>
            <button className="p-3 opacity-40 hover:opacity-100 text-white"><MoreVertical size={20} /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
            {selectedChat.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === currentUserHandle ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[75%] space-y-1`}>
                   <div className={`p-5 rounded-[2rem] text-sm font-light leading-relaxed ${msg.sender === currentUserHandle ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl' : 'bg-white/5 border border-white/10 text-white rounded-tl-none'}`}>
                      {msg.text}
                   </div>
                   <p className={`text-[9px] opacity-30 font-bold uppercase tracking-widest text-white ${msg.sender === currentUserHandle ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  Aether en cours d'analyse...
                </div>
              </div>
            )}
          </div>

          <footer className="p-6 md:p-8 bg-black/20 border-t border-white/5">
             <div className="flex items-center gap-4 bg-white/5 rounded-[2.5rem] p-3 px-6 border border-white/10 focus-within:border-indigo-500/50 transition-all">
                <button className="p-2 opacity-40 hover:opacity-100 text-white"><Paperclip size={20}/></button>
                <input 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Émettez un signal..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-white placeholder:opacity-30" 
                />
                <button 
                  onClick={handleSend}
                  disabled={!messageText.trim() || isAiTyping}
                  className="p-4 bg-indigo-600 rounded-full text-white shadow-lg disabled:opacity-20 hover:scale-110 transition-transform"
                >
                  <Send size={20} />
                </button>
             </div>
          </footer>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center glass-effect rounded-[3rem] border border-white/10 opacity-20 text-white">
           <div className="text-center space-y-4">
              <Sparkles size={64} className="mx-auto text-indigo-500 animate-pulse" />
              <p className="font-bold uppercase tracking-[0.5em] text-xs">Nexus Prêt pour Synchronisation</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default MessengerView;
