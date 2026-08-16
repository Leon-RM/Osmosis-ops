import React from 'react';
import { Volume2, VolumeX, HelpCircle, RefreshCw, Zap } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface NavbarProps {
  roomCode: string;
  onOpenHowToPlay: () => void;
  onRestart: () => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  roomCode,
  onOpenHowToPlay,
  onRestart,
  soundMuted,
  setSoundMuted
}) => {
  const toggleSound = () => {
    const isNowMuted = sounds.toggleMute();
    setSoundMuted(isNowMuted);
  };

  return (
    <header
      className="w-full sticky top-0 z-40"
      style={{
        background: 'rgba(255, 252, 248, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(255, 107, 53, 0.2)',
        boxShadow: '0 2px 20px rgba(255, 107, 53, 0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #E05C8B 100%)',
              border: '2px solid #2D1B0E',
              boxShadow: '3px 3px 0 #2D1B0E',
            }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1
              className="font-display font-extrabold tracking-tight leading-none text-shimmer"
              style={{ fontSize: '1.25rem' }}
            >
              OSMOSIS OPS
            </h1>
            <p className="font-retro text-[9px] tracking-widest" style={{ color: '#B06040' }}>
              KIDNEY OSMOREGULATION GAME
            </p>
          </div>
        </div>

        {/* Room Code */}
        <div
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl"
          style={{
            background: 'rgba(255, 245, 228, 0.8)',
            border: '1.5px solid rgba(255, 107, 53, 0.25)',
            boxShadow: '2px 2px 0 rgba(255, 107, 53, 0.2)',
          }}
        >
          <span className="font-retro text-[10px] tracking-widest" style={{ color: '#B06040' }}>
            ROOM
          </span>
          <span className="font-retro font-bold text-sm tracking-wider" style={{ color: '#FF6B35' }}>
            {roomCode}
          </span>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full font-retro font-bold"
            style={
              isSupabaseConfigured
                ? { background: 'rgba(40, 200, 120, 0.15)', color: '#1a9e5c', border: '1px solid rgba(40, 200, 120, 0.35)' }
                : { background: 'rgba(255, 180, 50, 0.15)', color: '#C07820', border: '1px solid rgba(255, 180, 50, 0.35)' }
            }
          >
            {isSupabaseConfigured ? '● ONLINE' : '◌ LOCAL'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255, 245, 228, 0.9)',
              border: '1.5px solid rgba(255, 107, 53, 0.25)',
              boxShadow: '2px 2px 0 rgba(255, 107, 53, 0.2)',
            }}
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted
              ? <VolumeX className="w-4 h-4" style={{ color: '#E05C8B' }} />
              : <Volume2 className="w-4 h-4" style={{ color: '#FF6B35' }} />
            }
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs transition-all hover:-translate-y-0.5 active:translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(224, 92, 139, 0.08))',
              border: '1.5px solid rgba(255, 107, 53, 0.3)',
              color: '#FF6B35',
              boxShadow: '2px 2px 0 rgba(255, 107, 53, 0.2)',
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">วิธีเล่น</span>
          </button>

          <button
            onClick={onRestart}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255, 245, 228, 0.9)',
              border: '1.5px solid rgba(255, 107, 53, 0.25)',
              boxShadow: '2px 2px 0 rgba(255, 107, 53, 0.2)',
            }}
            title="Back to Lobby"
          >
            <RefreshCw className="w-4 h-4" style={{ color: '#B06040' }} />
          </button>
        </div>
      </div>
    </header>
  );
};
