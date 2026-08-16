import React from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../types/game';

interface PlayerTokenProps {
  player: Player;
  isCurrentTurn: boolean;
  index?: number;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({ player, isCurrentTurn }) => {
  const initials = player.name.substring(0, 2).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      style={{
        backgroundColor: player.color,
        border: `2px solid ${isCurrentTurn ? '#2D1B0E' : 'rgba(45,27,14,0.5)'}`,
        boxShadow: isCurrentTurn
          ? `2px 2px 0 #2D1B0E, 0 0 0 3px ${player.color}55`
          : '1px 1px 0 rgba(45,27,14,0.4)',
        animation: isCurrentTurn ? 'bounce 0.8s ease-in-out infinite alternate' : undefined,
      }}
      className="relative w-7 h-7 rounded-full flex items-center justify-center font-retro font-bold text-white text-[10px] z-10 cursor-pointer hover:scale-110 transition-transform"
      title={`${player.name} (H:${player.hydration}% Na:${player.sodium}%)`}
    >
      {initials}
      {player.isBot && (
        <span
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-white"
          style={{ background: '#A855F7', border: '1px solid #2D1B0E', fontSize: '7px', fontFamily: 'Space Mono' }}
        >
          B
        </span>
      )}
      {isCurrentTurn && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ background: player.color, zIndex: -1 }}
        />
      )}
    </motion.div>
  );
};
