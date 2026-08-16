import React from 'react';
import type { Player } from '../types/game';
import { Droplet, Percent, ShieldCheck, Bot } from 'lucide-react';

interface PlayerHUDProps {
  players: Player[];
  activePlayerId: string;
}

const getHomeostasisStatus = (hydration: number, sodium: number) => {
  const hOk = hydration >= 40 && hydration <= 60;
  const nOk = sodium >= 40 && sodium <= 60;
  if (hOk && nOk) return { label: '✦ สมดุลสมบูรณ์', bg: 'rgba(40,200,120,0.12)', color: '#15803D', border: 'rgba(40,200,120,0.35)' };
  if (hydration < 40) return { label: '💧 ขาดน้ำ!', bg: 'rgba(255,80,80,0.12)', color: '#C0392B', border: 'rgba(255,80,80,0.35)' };
  if (hydration > 60) return { label: '💧 บวมน้ำ!', bg: 'rgba(60,130,220,0.12)', color: '#1D4ED8', border: 'rgba(60,130,220,0.35)' };
  if (sodium < 40) return { label: '🧂 Na⁺ ต่ำ!', bg: 'rgba(255,180,30,0.15)', color: '#B45309', border: 'rgba(255,180,30,0.35)' };
  return { label: '🧂 Na⁺ สูง!', bg: 'rgba(225,29,72,0.12)', color: '#BE123C', border: 'rgba(225,29,72,0.35)' };
};

const GaugeBar: React.FC<{ value: number; color: string; emptyColor: string; label: string; icon: React.ReactNode }> =
  ({ value, color, emptyColor, label, icon }) => {
    const clamped = Math.min(100, Math.max(0, value));
    const isOptimal = clamped >= 40 && clamped <= 60;
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-body font-bold text-[11px]" style={{ color: '#5C3317' }}>
            {icon} {label}
          </span>
          <span
            className="font-retro font-extrabold text-xs px-1.5 py-0.2 rounded"
            style={{
              color: isOptimal ? '#15803D' : '#C0392B',
              background: isOptimal ? 'rgba(40,200,120,0.1)' : 'rgba(255,80,80,0.1)'
            }}
          >
            {clamped}% {isOptimal ? '✓' : '⚠️'}
          </span>
        </div>
        <div
          className="relative w-full h-3 rounded-full overflow-hidden"
          style={{
            background: 'rgba(255,245,228,0.9)',
            border: '1.5px solid rgba(45,27,14,0.15)',
            boxShadow: 'inset 0 1px 3px rgba(45,27,14,0.08)',
          }}
        >
          {/* Homeostasis zone highlight: 40%–60% */}
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{
              left: '40%', width: '20%',
              background: 'rgba(40,200,120,0.3)',
              borderLeft: '1.5px dashed rgba(22,101,52,0.7)',
              borderRight: '1.5px dashed rgba(22,101,52,0.7)',
            }}
          />
          {/* Fill bar */}
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${clamped}%`,
              background: isOptimal
                ? `linear-gradient(90deg, ${color} 0%, ${emptyColor} 100%)`
                : 'linear-gradient(90deg, #EF4444 0%, #F97316 100%)',
              boxShadow: isOptimal ? `0 0 6px ${color}55` : '0 0 6px rgba(239,68,68,0.4)',
              position: 'relative', zIndex: 5,
            }}
          />
        </div>
        {/* Min/Target/Max indicator */}
        <div className="flex justify-between font-retro text-[8px] font-bold" style={{ color: '#9A6B48' }}>
          <span>0%</span>
          <span className="text-emerald-700">โซนสมดุล: 40–60%</span>
          <span>100%</span>
        </div>
      </div>
    );
  };

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ players, activePlayerId }) => {
  return (
    <div
      className="w-full rounded-2xl p-3.5 sm:p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.76)',
        border: '2px solid #2D1B0E',
        boxShadow: '4px 4px 0 #2D1B0E',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2"
        style={{ borderBottom: '2px dashed rgba(255,107,53,0.2)' }}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          <h3 className="font-display font-extrabold text-sm text-slate-900">PLAYER HOMEOSTASIS</h3>
        </div>
        <span
          className="font-retro text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
        >
          เป้าหมาย 40%–60%
        </span>
      </div>

      {/* Player Cards */}
      <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
        {players.map((player) => {
          const isTurn = player.id === activePlayerId;
          const status = getHomeostasisStatus(player.hydration, player.sodium);

          return (
            <div
              key={player.id}
              className="p-3 rounded-xl transition-all duration-200"
              style={{
                background: isTurn
                  ? 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(224,92,139,0.06))'
                  : 'rgba(255,248,240,0.65)',
                border: isTurn
                  ? '2px solid #FF6B35'
                  : '1.5px solid rgba(45,27,14,0.12)',
                boxShadow: isTurn ? '3px 3px 0 rgba(255,107,53,0.3)' : 'none',
              }}
            >
              {/* Player Header Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 border border-black"
                    style={{ background: player.color }}
                  />
                  <span className="font-display font-extrabold text-xs text-slate-900 truncate">
                    {player.name}
                  </span>
                  {player.isBot && <Bot className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                  {isTurn && (
                    <span
                      className="font-retro text-[8px] px-1.5 py-0.2 rounded-full font-bold bg-orange-500 text-white shrink-0 animate-pulse"
                    >
                      ▶ TURN
                    </span>
                  )}
                </div>
                <span
                  className="font-retro text-[8px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1"
                  style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                >
                  {status.label}
                </span>
              </div>

              {/* Dual Gauges */}
              <div className="space-y-2">
                <GaugeBar
                  value={player.hydration}
                  color="#3B82F6"
                  emptyColor="#60A5FA"
                  label="💧 น้ำ (Hydration)"
                  icon={<Droplet className="w-3 h-3 text-blue-600" />}
                />
                <GaugeBar
                  value={player.sodium}
                  color="#F97316"
                  emptyColor="#FBBF24"
                  label="🧂 โซเดียม (Sodium)"
                  icon={<Percent className="w-3 h-3 text-orange-600" />}
                />
              </div>

              {/* Footer: Position & Inventory Cards */}
              <div
                className="flex items-center justify-between mt-2 pt-1.5 border-t border-amber-900/10"
              >
                <span className="font-retro font-bold text-[9px] text-amber-800">
                  ช่อง #{player.position}
                </span>
                <div className="flex items-center gap-1 flex-wrap justify-end text-[8px] font-retro font-bold">
                  <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    💧ADH ×{player.adhCards}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                    💊Diur ×{player.diureticCards || 0}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200">
                    🧂Aldo ×{player.aldosteroneCards}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                    🫀ANP ×{player.anpCards || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
