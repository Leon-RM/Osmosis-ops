import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '../../types/game';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface GameOverModalProps {
  winner: Player | null;
  players: Player[];
  onPlayAgain: () => void;
}

const homeostasisScore = (h: number, s: number) =>
  Math.max(0, Math.round(100 - (Math.abs(h - 50) + Math.abs(s - 50))));

export const GameOverModal: React.FC<GameOverModalProps> = ({ winner, players, onPlayAgain }) => {
  useEffect(() => {
    if (!winner) return;
    sounds.playVictory();
    const end = Date.now() + 2200;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF6B35', '#E05C8B', '#FFB085', '#FFAABB'] });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF8C42', '#FFD6E0', '#FFC89E', '#FF6B35'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [winner]);

  if (!winner) return null;

  const ranked = [...players]
    .map(p => ({ ...p, score: homeostasisScore(p.hydration, p.sodium) }))
    .sort((a, b) => {
      if (a.hasFinished !== b.hasFinished) return a.hasFinished ? -1 : 1;
      return b.score - a.score;
    });

  const MEDAL = ['🥇', '🥈', '🥉'];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay cursor-pointer"
        onClick={onPlayAgain}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="max-w-md w-full rounded-3xl p-6 space-y-5 text-center cursor-default"
          style={{
            background: 'rgba(255,252,248,0.97)',
            border: '2px solid #2D1B0E',
            boxShadow: '6px 6px 0 #2D1B0E',
          }}
        >
          {/* Trophy */}
          <motion.div
            animate={{ rotate: [-8, 8, -8], y: [0, -6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FDE68A, #F59E0B)',
              border: '2px solid #2D1B0E',
              boxShadow: '4px 4px 0 #2D1B0E',
            }}
          >
            <Trophy className="w-12 h-12" style={{ color: '#92400E' }} />
          </motion.div>

          {/* Headline */}
          <div>
            <span className="font-retro text-[9px] tracking-widest px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,200,50,0.15)', color: '#B45309', border: '1.5px solid rgba(255,200,50,0.4)' }}>
              🏆 HOMEOSTASIS CHAMPION
            </span>
            <h2 className="font-display font-extrabold text-2xl mt-2" style={{ color: '#2D1B0E' }}>
              {winner.name} ชนะ!
            </h2>
            <p className="font-body text-sm mt-1" style={{ color: '#7A4528' }}>
              เดินทางถึงกระเพาะปัสสาวะพร้อมรักษาสมดุลได้ยอดเยี่ยม!
            </p>
          </div>

          {/* Winner Stats */}
          <div
            className="p-4 rounded-2xl grid grid-cols-3 gap-3"
            style={{ background: 'rgba(255,245,228,0.8)', border: '1.5px solid rgba(45,27,14,0.12)' }}
          >
            {[
              { label: 'Hydration', val: `${winner.hydration}%`, color: '#3B82F6' },
              { label: 'Sodium', val: `${winner.sodium}%`, color: '#F97316' },
              { label: 'Homeostasis', val: `${homeostasisScore(winner.hydration, winner.sodium)} pt`, color: '#15803D' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-retro text-[9px] mb-0.5" style={{ color: '#B06040' }}>{s.label}</p>
                <p className="font-retro font-bold text-sm" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="space-y-2 text-left">
            <p className="font-retro text-[9px] tracking-widest font-bold px-1" style={{ color: '#B06040' }}>
              LEADERBOARD
            </p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {ranked.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{
                    background: i === 0 ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,140,50,0.08))' : 'rgba(255,245,228,0.5)',
                    border: i === 0 ? '1.5px solid rgba(255,200,0,0.4)' : '1.5px solid rgba(45,27,14,0.08)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base w-6 text-center">{MEDAL[i] || `#${i + 1}`}</span>
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: p.color, border: '1.5px solid #2D1B0E' }} />
                    <span className="font-display font-bold text-xs" style={{ color: '#2D1B0E' }}>{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-[10px]" style={{ color: '#7A4528' }}>
                      H:{p.hydration}% Na:{p.sodium}%
                    </span>
                    <span
                      className="font-retro font-bold text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(40,200,120,0.12)', color: '#15803D', border: '1px solid rgba(40,200,120,0.3)' }}
                    >
                      {p.score}pt
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onPlayAgain}
            className="w-full py-3 rounded-2xl font-display font-extrabold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #E05C8B)',
              border: '2px solid #2D1B0E',
              boxShadow: '4px 4px 0 #2D1B0E',
              color: 'white',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            เล่นใหม่อีกครั้ง!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
