
import React, { useState, useRef, useEffect } from 'react';
import { Radio, Users, Play, Camera, Mic, X, Target, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';

interface LiveViewProps {
  t: (key: string) => string;
}

const LiveView: React.FC<LiveViewProps> = ({ t }) => {
  const [isLive, setIsLive] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsPreviewing(true);
      }
    } catch (e) { alert("Accès refusé. Vérifiez vos permissions caméra/micro."); }
  };

  const startLive = () => {
    setIsLive(true);
    setIsPreviewing(false);
  };

  const stopLive = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsLive(false);
    setIsPreviewing(false);
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
      {!isLive && !isPreviewing ? (
        <div className="text-center space-y-16 animate-in zoom-in duration-700">
           <div className="relative mx-auto">
              <div className="w-40 h-40 bg-indigo-500/5 rounded-full flex items-center justify-center border border-indigo-500/20">
                 <Radio size={64} className="text-indigo-500 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 animate-ping opacity-10" />
           </div>
           <button onClick={startPreview} className="bg-indigo-600 px-16 py-6 rounded-[2.5rem] font-black text-lg neural-click flex items-center gap-6 mx-auto shadow-2xl text-white">
             <Camera size={24} /> INITIALISER PRÉVISUALISATION
           </button>
        </div>
      ) : isPreviewing ? (
        <div className="w-full max-w-4xl glass-effect rounded-[4rem] overflow-hidden relative shadow-2xl border border-white/10 animate-in zoom-in duration-500">
          <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover scale-x-[-1]" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-8">
            <h2 className="text-white font-display font-bold text-2xl uppercase tracking-widest">Prêt pour la transmission ?</h2>
            <div className="flex gap-6">
              <button onClick={startLive} className="bg-emerald-600 px-12 py-5 rounded-full font-bold text-white shadow-xl hover:bg-emerald-500 transition-all flex items-center gap-3">
                <Play size={20}/> LANCER LE DIRECT
              </button>
              <button onClick={stopLive} className="bg-white/10 backdrop-blur-md px-12 py-5 rounded-full font-bold text-white border border-white/20">
                ANNULER
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full glass-effect rounded-[4rem] border border-indigo-500/30 overflow-hidden relative shadow-[0_0_100px_rgba(99,102,241,0.2)] bg-black">
           <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
           
           <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between text-[10px] text-cyan-400/80 font-black tracking-widest uppercase">
              <div className="flex justify-between items-start">
                 <div className="space-y-4 bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                    <p className="flex items-center gap-3 text-emerald-400"><Activity size={14}/> HEART_RATE: 72 BPM</p>
                    <p className="flex items-center gap-3"><ShieldCheck size={14}/> NEURAL_SEC: ACTIVE</p>
                    <p className="flex items-center gap-3 text-indigo-400"><Zap size={14}/> POWER_GRID: 98%</p>
                 </div>
                 <div className="flex items-center gap-4 bg-red-600 px-6 py-2 rounded-full text-white animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full" /> LIVE_PRO
                 </div>
              </div>

              <div className="flex justify-between items-end">
                 <div className="space-y-4 bg-black/60 p-8 rounded-[3rem] border border-indigo-500/20 w-80 backdrop-blur-xl pointer-events-auto text-white">
                   <p className="opacity-40 text-[9px]">Neural Feedback</p>
                   <div className="space-y-2">
                     <p><span className="text-indigo-400">@aether:</span> signal optimal.</p>
                     <p><span className="text-cyan-400">@citoyen:</span> incroyable qualité.</p>
                   </div>
                 </div>
                 <div className="flex flex-col gap-6 pointer-events-auto">
                   <button className="p-5 bg-white/10 backdrop-blur-xl rounded-full text-white border border-white/20 hover:bg-indigo-600"><Camera size={24}/></button>
                   <button onClick={stopLive} className="p-5 bg-red-600 rounded-full text-white shadow-2xl"><X size={24}/></button>
                 </div>
              </div>
           </div>
           <div className="absolute inset-0 pointer-events-none border-[30px] border-black/10 opacity-50" />
        </div>
      )}
    </div>
  );
};

export default LiveView;
