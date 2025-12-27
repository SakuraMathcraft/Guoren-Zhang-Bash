
import React, { useState } from 'react';
import { Music, ChevronUp } from 'lucide-react';
import { audioService } from '../services/AudioService';

interface VinylRecordProps {
  isPlaying: boolean;
  onTrackChange: (index: number) => void;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ isPlaying, onTrackChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const tracks = [
    "Classic Birthday", 
    "Jubilant 2026", 
    "Starlight Waltz", 
    "Victory Chimes", 
    "Serene Celebration", 
    "Golden Hour",
    "Grand Fanfare",
    "Gentle Breeze"
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {showMenu && (
        <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 min-w-[200px] animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {tracks.map((name, i) => (
            <button
              key={i}
              onClick={() => {
                onTrackChange(i);
                setShowMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-bold transition-all ${
                audioService.getCurrentTrack() === i ? 'bg-white/20 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20"
      >
        <div className={`absolute inset-0 bg-[#111] rounded-full border-[6px] border-[#222] shadow-2xl overflow-hidden ${isPlaying ? 'animate-record-spin' : ''}`}>
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[0.9]" />
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[0.7]" />
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[0.5]" />
          
          <div className="absolute inset-[30%] bg-indigo-500/80 rounded-full flex items-center justify-center shadow-inner">
            <Music className="w-1/2 h-1/2 text-white/80" />
          </div>
        </div>

        <div className="absolute -inset-2 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="absolute -top-2 right-0 bg-white text-black p-1 rounded-full scale-75 shadow-lg">
          <ChevronUp className={`w-3 h-3 transition-transform duration-500 ${showMenu ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <style>{`
        @keyframes record-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-record-spin { animation: record-spin 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default VinylRecord;
