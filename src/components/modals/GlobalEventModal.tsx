import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GlobalEvent } from '../../types/game';
import { Sun, Utensils, Droplet, Zap, Feather, CloudRain, Check } from 'lucide-react';

interface GlobalEventModalProps {
  event: GlobalEvent | null;
  onConfirm: () => void;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  Sun: <Sun className="w-8 h-8" />,
  Utensils: <Utensils className="w-8 h-8" />,
  Droplet: <Droplet className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Feather: <Feather className="w-8 h-8" />,
  CloudRain: <CloudRain className="w-8 h-8" />,
};

export const GlobalEventModal: React.FC<GlobalEventModalProps> = ({ event, onConfirm }) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay cursor-pointer"
        onClick={onConfirm}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="max-w-sm w-full p-6 rounded-3xl text-center space-y-5 cursor-default"
          style={{
            background: 'rgba(255,252,248,0.97)',
            border: '2px solid #2D1B0E',
            boxShadow: '6px 6px 0 #2D1B0E',
          }}
        >
          {/* Event Icon */}
          <div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,180,50,0.15), rgba(255,107,53,0.1))',
              border: '2px solid #2D1B0E',
              boxShadow: '3px 3px 0 #2D1B0E',
              color: '#D97706',
            }}
          >
            {EVENT_ICONS[event.icon] || <Sun className="w-8 h-8" />}
          </div>

          {/* Label */}
          <div>
            <span
              className="font-retro text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase"
              style={{ background: 'rgba(255,180,50,0.12)', color: '#B45309', border: '1.5px solid rgba(255,180,50,0.3)' }}
            >
              ⚡ PHASE 1 — GLOBAL EVENT
            </span>
            <h3 className="font-display font-extrabold text-xl mt-3 mb-1" style={{ color: '#2D1B0E' }}>
              {event.titleTh}
            </h3>
            <p className="font-body text-sm leading-relaxed" style={{ color: '#7A4528' }}>
              {event.descriptionTh}
            </p>
          </div>

          {/* Stat Pills */}
          <div className="flex justify-center gap-3">
            {event.hydrationChange !== 0 && (
              <div
                className="px-4 py-2 rounded-xl font-retro font-bold text-xs"
                style={
                  event.hydrationChange > 0
                    ? { background: 'rgba(60,130,220,0.1)', color: '#1D4ED8', border: '2px solid #2D1B0E', boxShadow: '2px 2px 0 #2D1B0E' }
                    : { background: 'rgba(255,80,80,0.1)', color: '#C0392B', border: '2px solid #2D1B0E', boxShadow: '2px 2px 0 #2D1B0E' }
                }
              >
                Hydration {event.hydrationChange > 0 ? `+${event.hydrationChange}` : event.hydrationChange}%
              </div>
            )}
            {event.sodiumChange !== 0 && (
              <div
                className="px-4 py-2 rounded-xl font-retro font-bold text-xs"
                style={
                  event.sodiumChange > 0
                    ? { background: 'rgba(255,140,50,0.12)', color: '#C05920', border: '2px solid #2D1B0E', boxShadow: '2px 2px 0 #2D1B0E' }
                    : { background: 'rgba(255,80,80,0.1)', color: '#C0392B', border: '2px solid #2D1B0E', boxShadow: '2px 2px 0 #2D1B0E' }
                }
              >
                Sodium {event.sodiumChange > 0 ? `+${event.sodiumChange}` : event.sodiumChange}%
              </div>
            )}
          </div>

          <button
            onClick={onConfirm}
            className="w-full py-2.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #FF8C42, #FF6B35)',
              border: '2px solid #2D1B0E',
              boxShadow: '3px 3px 0 #2D1B0E',
              color: 'white',
            }}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            รับทราบ! ไปทอยลูกเต๋า
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
