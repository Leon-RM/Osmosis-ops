import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Sparkles } from 'lucide-react';

// Dot positions for standard 3x3 dice face
const DICE_DOTS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

const LargeDiceFace: React.FC<{ value: number }> = ({ value }) => {
  const dots = DICE_DOTS[value] || [[1, 1]];
  return (
    <div
      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl"
      style={{
        background: 'linear-gradient(145deg, #FFFDF8, #FFE6CC)',
        border: '3.5px solid #2D1B0E',
        boxShadow: '6px 6px 0 #2D1B0E, inset 0 2px 4px rgba(255,255,255,0.8)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        padding: '14px',
        gap: '6px',
      }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const hasDot = dots.some(([r, c]) => r === row && c === col);
        return (
          <div key={i} className="flex items-center justify-center">
            {hasDot && (
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                style={{
                  background: value === 1 ? '#EF4444' : '#2D1B0E',
                  boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.3)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface DiceRollModalProps {
  isOpen: boolean;
  diceValue: number;
  isRolling: boolean;
  playerName: string;
  playerColor?: string;
}

export const DiceRollModal: React.FC<DiceRollModalProps> = ({
  isOpen,
  diceValue,
  isRolling,
  playerName,
  playerColor = '#FF6B35',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="max-w-xs w-full p-6 rounded-3xl text-center space-y-4 pointer-events-auto"
          style={{
            background: 'rgba(255,252,248,0.98)',
            border: '3px solid #2D1B0E',
            boxShadow: '8px 8px 0 #2D1B0E',
          }}
        >
          {/* Header Player Tag */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-black shrink-0"
              style={{ background: playerColor }}
            />
            <span className="font-display font-extrabold text-sm text-slate-900 truncate">
              {playerName}
            </span>
          </div>

          <p className="font-retro text-[10px] tracking-widest text-orange-700 font-bold uppercase">
            {isRolling ? '🎲 กำลังทอยลูกเต๋า...' : '🎉 ทอยลูกเต๋าสำเร็จ!'}
          </p>

          {/* Big Animated 3D Dice */}
          <div className="flex items-center justify-center py-2 relative">
            {!isRolling && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1.1], opacity: [0, 0.7, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 m-auto w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)' }}
              />
            )}

            <motion.div
              animate={
                isRolling
                  ? {
                      rotate: [0, -25, 25, -15, 15, 0],
                      scale: [1, 1.18, 0.9, 1.12, 0.96, 1],
                      y: [0, -12, 4, -8, 2, 0],
                    }
                  : {
                      scale: [1.3, 0.95, 1],
                      rotate: [0, -6, 6, 0],
                    }
              }
              transition={{
                duration: isRolling ? 0.45 : 0.35,
                repeat: isRolling ? Infinity : 0,
                ease: 'easeInOut',
              }}
            >
              <LargeDiceFace value={diceValue} />
            </motion.div>
          </div>

          {/* Result Announcement */}
          <div className="space-y-1">
            <AnimatePresence mode="wait">
              {isRolling ? (
                <motion.div
                  key="rolling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-1.5 font-retro text-xs text-amber-900 font-bold"
                >
                  <Dices className="w-4 h-4 text-orange-600 animate-spin" />
                  <span>กำลังสุ่มแต้มเดิน...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="space-y-1"
                >
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-orange-500 text-white font-display font-extrabold text-base border-2 border-amber-950 shadow-sm">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>ได้ {diceValue} แต้ม!</span>
                  </div>
                  <p className="font-body text-xs text-amber-950 font-semibold">
                    เดินก้าวไปข้างหน้า {diceValue} ช่อง
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
