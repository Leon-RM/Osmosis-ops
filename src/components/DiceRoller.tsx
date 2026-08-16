import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

// Dice face dot patterns
const DICE_DOTS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  const dots = DICE_DOTS[value] || [];
  return (
    <div
      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl"
      style={{
        background: 'linear-gradient(145deg, #FFF8F0, #FFE8CC)',
        border: '2.5px solid #2D1B0E',
        boxShadow: '3px 3px 0 #2D1B0E',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        padding: '8px',
        gap: '4px',
      }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const hasDot = dots.some(([r, c]) => r === row && c === col);
        return (
          <div key={i} className="flex items-center justify-center">
            {hasDot && (
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: '#2D1B0E',
                  boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface DiceRollerProps {
  onRollComplete: (diceValue: number) => void;
  disabled: boolean;
  playerName: string;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete, disabled, playerName }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);

  const handleRoll = () => {
    if (disabled || isRolling) return;
    setIsRolling(true);
    sounds.playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      setCurrentFace(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 14) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setCurrentFace(finalVal);
        setIsRolling(false);
        onRollComplete(finalVal);
      }
    }, 70);
  };

  return (
    <div
      className="rounded-2xl p-4 text-center space-y-3"
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: '2px solid #2D1B0E',
        boxShadow: '4px 4px 0 #2D1B0E',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <Dices className="w-4 h-4" style={{ color: '#FF6B35' }} />
        <span className="font-retro text-[10px] font-bold tracking-widest" style={{ color: '#7A4528' }}>
          PHASE 2 — DICE ROLL
        </span>
      </div>

      {/* Dice Display */}
      <div className="flex items-center justify-center py-1">
        <motion.div
          animate={isRolling
            ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.15, 0.9, 1.1, 0.95, 1] }
            : {}}
          transition={{ duration: 0.6, ease: 'easeInOut', repeat: isRolling ? Infinity : 0 }}
          onClick={handleRoll}
          className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <DiceFace value={currentFace} />
        </motion.div>
      </div>

      {/* Roll Value Callout */}
      <AnimatePresence mode="wait">
        {!isRolling && (
          <motion.div
            key={currentFace}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="font-retro font-bold text-xs"
            style={{ color: '#B06040' }}
          >
            ได้ {currentFace} แต้ม!
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className="w-full py-2.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all"
        style={
          disabled || isRolling
            ? { background: 'rgba(200,180,160,0.4)', color: '#B08060', border: '2px solid rgba(45,27,14,0.2)', cursor: 'not-allowed' }
            : {
              background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
              border: '2px solid #2D1B0E',
              boxShadow: '3px 3px 0 #2D1B0E',
              color: 'white',
              cursor: 'pointer',
            }
        }
        onMouseEnter={e => { if (!disabled && !isRolling) (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
      >
        <Dices className="w-4 h-4" />
        <span>{isRolling ? 'ทอย...' : `ทอยลูกเต๋า (${playerName})`}</span>
      </button>
    </div>
  );
};
