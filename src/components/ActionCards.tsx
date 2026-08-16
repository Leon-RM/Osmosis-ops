import React from 'react';
import type { Player } from '../types/game';
import { Droplet, Percent, CheckCircle2, Flame, ArrowDown, ArrowUp, Heart, Pill, HelpCircle, Timer } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ActionCardsProps {
  player: Player;
  onUseCard: (cardType: 'adh' | 'aldosterone' | 'diuretic' | 'anp') => void;
  onPassTurn: () => void;
  disabled: boolean;
}

export const ActionCards: React.FC<ActionCardsProps> = ({ player, onUseCard, onPassTurn, disabled }) => {
  const isHydrationLow = player.hydration < 40;
  const isHydrationHigh = player.hydration > 60;
  const isSodiumLow = player.sodium < 40;
  const isSodiumHigh = player.sodium > 60;

  const adhCooldown = player.adhCooldown || 0;
  const diureticCooldown = player.diureticCooldown || 0;
  const aldosteroneCooldown = player.aldosteroneCooldown || 0;
  const anpCooldown = player.anpCooldown || 0;

  const handleCardClick = (cardType: 'adh' | 'aldosterone' | 'diuretic' | 'anp') => {
    if (disabled) return;
    if (cardType === 'adh' && (player.adhCards <= 0 || adhCooldown > 0)) return;
    if (cardType === 'aldosterone' && (player.aldosteroneCards <= 0 || aldosteroneCooldown > 0)) return;
    if (cardType === 'diuretic' && ((player.diureticCards || 0) <= 0 || diureticCooldown > 0)) return;
    if (cardType === 'anp' && ((player.anpCards || 0) <= 0 || anpCooldown > 0)) return;

    sounds.playCardUse();
    onUseCard(cardType);
  };

  return (
    <div
      className="rounded-2xl p-3 sm:p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.85)',
        border: '2px solid #2D1B0E',
        boxShadow: '4px 4px 0 #2D1B0E',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-dashed border-orange-500/25">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="font-retro text-[10px] font-bold tracking-widest text-amber-950">
            PHASE 4: OSMOREGULATION CARDS
          </span>
        </div>
        <span className="font-retro text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 shrink-0">
          โซนสมดุล 40-60%
        </span>
      </div>

      {/* Guide & Usage Explanation with Cooldown Rule */}
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-900/15 space-y-1">
        <div className="flex items-center gap-1 font-display font-bold text-[11px] text-amber-950">
          <HelpCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>กติกาและระบบคูลดาวน์ (Cooldown System):</span>
        </div>
        <p className="font-body text-[10px] text-amber-950/85 leading-relaxed">
          • <strong>ระบบคูลดาวน์ (1 ตา):</strong> เมื่อใช้การ์ดชนิดใด การ์ดนั้นจะติดคูลดาวน์ <strong>1 ตา</strong> (ต้องทอยลูกเต๋าเดินในรอบถัดไปเพื่อรีชาร์จ)<br />
          • <strong>ปุ่มสีสดใส:</strong> พร้อมใช้งาน | <strong>⏳ ติดคูลดาวน์ / สีเทา:</strong> รอรอบถัดไปหรือการ์ดหมด
        </p>
      </div>

      {/* 4 Osmoregulation Cards Grid */}
      <div className="grid grid-cols-2 gap-2">

        {/* 1. ADH (Water UP) */}
        {(() => {
          const isCoolingDown = adhCooldown > 0;
          const hasCard = player.adhCards > 0 && !disabled && !isCoolingDown;
          const isRecommended = isHydrationLow && hasCard;

          return (
            <button
              onClick={() => handleCardClick('adh')}
              disabled={!hasCard}
              className={`p-2.5 rounded-xl text-left flex flex-col justify-between transition-all relative ${
                isRecommended ? 'ring-2 ring-blue-500 animate-pulse' : ''
              } ${
                !hasCard ? 'grayscale opacity-45 cursor-not-allowed bg-slate-100 border-slate-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
              style={{
                background: hasCard
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(96,165,250,0.06))'
                  : undefined,
                border: hasCard ? '1.5px solid #2563EB' : undefined,
                boxShadow: hasCard ? '2px 2px 0 #2563EB' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <Droplet className={`w-3.5 h-3.5 shrink-0 ${hasCard ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-display font-bold text-xs truncate ${hasCard ? 'text-blue-900' : 'text-slate-500'}`}>
                    ADH
                  </span>
                </div>
                <span className={`font-retro text-[8px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  hasCard ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  ×{player.adhCards}
                </span>
              </div>

              <div className="space-y-0.5">
                <div className={`flex items-center gap-0.5 font-body font-bold text-[10px] sm:text-[11px] ${
                  hasCard ? 'text-blue-700' : 'text-slate-500'
                }`}>
                  <ArrowUp className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>+20% น้ำ (Water)</span>
                </div>
                <p className={`font-body text-[9px] line-clamp-1 ${hasCard ? 'text-blue-950/70' : 'text-slate-400'}`}>
                  ดึงน้ำกลับเข้ากระแสเลือด
                </p>
              </div>

              {isCoolingDown ? (
                <span className="mt-1 font-retro text-[8px] text-amber-900 bg-amber-100 px-1 py-0.2 rounded text-center font-bold flex items-center justify-center gap-0.5">
                  <Timer className="w-2.5 h-2.5" /> ติดคูลดาวน์ ({adhCooldown} ตา)
                </span>
              ) : isRecommended ? (
                <span className="mt-1 font-retro text-[8px] text-blue-800 bg-blue-100 px-1 py-0.2 rounded text-center font-bold">
                  ⚡ แนะนำ! (น้ำ &lt;40%)
                </span>
              ) : (
                <span className="mt-1 font-body text-[8px] text-slate-500">
                  {hasCard ? '✓ พร้อมใช้งาน' : '(ไม่มีการ์ด)'}
                </span>
              )}
            </button>
          );
        })()}

        {/* 2. Diuretic (Water DOWN) */}
        {(() => {
          const isCoolingDown = diureticCooldown > 0;
          const hasCard = (player.diureticCards || 0) > 0 && !disabled && !isCoolingDown;
          const isRecommended = isHydrationHigh && hasCard;

          return (
            <button
              onClick={() => handleCardClick('diuretic')}
              disabled={!hasCard}
              className={`p-2.5 rounded-xl text-left flex flex-col justify-between transition-all relative ${
                isRecommended ? 'ring-2 ring-cyan-500 animate-pulse' : ''
              } ${
                !hasCard ? 'grayscale opacity-45 cursor-not-allowed bg-slate-100 border-slate-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
              style={{
                background: hasCard
                  ? 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(103,232,249,0.06))'
                  : undefined,
                border: hasCard ? '1.5px solid #0891B2' : undefined,
                boxShadow: hasCard ? '2px 2px 0 #0891B2' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <Pill className={`w-3.5 h-3.5 shrink-0 ${hasCard ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <span className={`font-display font-bold text-xs truncate ${hasCard ? 'text-cyan-900' : 'text-slate-500'}`}>
                    Diuretic
                  </span>
                </div>
                <span className={`font-retro text-[8px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  hasCard ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  ×{player.diureticCards || 0}
                </span>
              </div>

              <div className="space-y-0.5">
                <div className={`flex items-center gap-0.5 font-body font-bold text-[10px] sm:text-[11px] ${
                  hasCard ? 'text-cyan-700' : 'text-slate-500'
                }`}>
                  <ArrowDown className="w-3 h-3 text-cyan-600 shrink-0" />
                  <span>-15% น้ำ (Water)</span>
                </div>
                <p className={`font-body text-[9px] line-clamp-1 ${hasCard ? 'text-cyan-950/70' : 'text-slate-400'}`}>
                  ยาขับปัสสาวะ/ลดบวม
                </p>
              </div>

              {isCoolingDown ? (
                <span className="mt-1 font-retro text-[8px] text-amber-900 bg-amber-100 px-1 py-0.2 rounded text-center font-bold flex items-center justify-center gap-0.5">
                  <Timer className="w-2.5 h-2.5" /> ติดคูลดาวน์ ({diureticCooldown} ตา)
                </span>
              ) : isRecommended ? (
                <span className="mt-1 font-retro text-[8px] text-cyan-800 bg-cyan-100 px-1 py-0.2 rounded text-center font-bold">
                  ⚡ แนะนำ! (น้ำ &gt;60%)
                </span>
              ) : (
                <span className="mt-1 font-body text-[8px] text-slate-500">
                  {hasCard ? '✓ พร้อมใช้งาน' : '(ไม่มีการ์ด)'}
                </span>
              )}
            </button>
          );
        })()}

        {/* 3. Aldosterone (Sodium UP) */}
        {(() => {
          const isCoolingDown = aldosteroneCooldown > 0;
          const hasCard = player.aldosteroneCards > 0 && !disabled && !isCoolingDown;
          const isRecommended = isSodiumLow && hasCard;

          return (
            <button
              onClick={() => handleCardClick('aldosterone')}
              disabled={!hasCard}
              className={`p-2.5 rounded-xl text-left flex flex-col justify-between transition-all relative ${
                isRecommended ? 'ring-2 ring-orange-500 animate-pulse' : ''
              } ${
                !hasCard ? 'grayscale opacity-45 cursor-not-allowed bg-slate-100 border-slate-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
              style={{
                background: hasCard
                  ? 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(251,146,60,0.06))'
                  : undefined,
                border: hasCard ? '1.5px solid #EA580C' : undefined,
                boxShadow: hasCard ? '2px 2px 0 #EA580C' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <Percent className={`w-3.5 h-3.5 shrink-0 ${hasCard ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span className={`font-display font-bold text-xs truncate ${hasCard ? 'text-orange-900' : 'text-slate-500'}`}>
                    Aldosterone
                  </span>
                </div>
                <span className={`font-retro text-[8px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  hasCard ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  ×{player.aldosteroneCards}
                </span>
              </div>

              <div className="space-y-0.5">
                <div className={`flex items-center gap-0.5 font-body font-bold text-[10px] sm:text-[11px] ${
                  hasCard ? 'text-orange-700' : 'text-slate-500'
                }`}>
                  <ArrowUp className="w-3 h-3 text-orange-600 shrink-0" />
                  <span>+15% เกลือ (Na⁺)</span>
                </div>
                <p className={`font-body text-[9px] line-clamp-1 ${hasCard ? 'text-orange-950/70' : 'text-slate-400'}`}>
                  ดูดโซเดียมกลับเข้าเลือด
                </p>
              </div>

              {isCoolingDown ? (
                <span className="mt-1 font-retro text-[8px] text-amber-900 bg-amber-100 px-1 py-0.2 rounded text-center font-bold flex items-center justify-center gap-0.5">
                  <Timer className="w-2.5 h-2.5" /> ติดคูลดาวน์ ({aldosteroneCooldown} ตา)
                </span>
              ) : isRecommended ? (
                <span className="mt-1 font-retro text-[8px] text-orange-800 bg-orange-100 px-1 py-0.2 rounded text-center font-bold">
                  ⚡ แนะนำ! (Na⁺ &lt;40%)
                </span>
              ) : (
                <span className="mt-1 font-body text-[8px] text-slate-500">
                  {hasCard ? '✓ พร้อมใช้งาน' : '(ไม่มีการ์ด)'}
                </span>
              )}
            </button>
          );
        })()}

        {/* 4. ANP (Sodium DOWN) */}
        {(() => {
          const isCoolingDown = anpCooldown > 0;
          const hasCard = (player.anpCards || 0) > 0 && !disabled && !isCoolingDown;
          const isRecommended = isSodiumHigh && hasCard;

          return (
            <button
              onClick={() => handleCardClick('anp')}
              disabled={!hasCard}
              className={`p-2.5 rounded-xl text-left flex flex-col justify-between transition-all relative ${
                isRecommended ? 'ring-2 ring-rose-500 animate-pulse' : ''
              } ${
                !hasCard ? 'grayscale opacity-45 cursor-not-allowed bg-slate-100 border-slate-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
              style={{
                background: hasCard
                  ? 'linear-gradient(135deg, rgba(225,29,72,0.12), rgba(244,63,94,0.06))'
                  : undefined,
                border: hasCard ? '1.5px solid #E11D48' : undefined,
                boxShadow: hasCard ? '2px 2px 0 #E11D48' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <Heart className={`w-3.5 h-3.5 shrink-0 ${hasCard ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span className={`font-display font-bold text-xs truncate ${hasCard ? 'text-rose-900' : 'text-slate-500'}`}>
                    ANP
                  </span>
                </div>
                <span className={`font-retro text-[8px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  hasCard ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  ×{player.anpCards || 0}
                </span>
              </div>

              <div className="space-y-0.5">
                <div className={`flex items-center gap-0.5 font-body font-bold text-[10px] sm:text-[11px] ${
                  hasCard ? 'text-rose-700' : 'text-slate-500'
                }`}>
                  <ArrowDown className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>-15% เกลือ (Na⁺)</span>
                </div>
                <p className={`font-body text-[9px] line-clamp-1 ${hasCard ? 'text-rose-950/70' : 'text-slate-400'}`}>
                  ฮอร์โมนขับเกลือส่วนเกิน
                </p>
              </div>

              {isCoolingDown ? (
                <span className="mt-1 font-retro text-[8px] text-amber-900 bg-amber-100 px-1 py-0.2 rounded text-center font-bold flex items-center justify-center gap-0.5">
                  <Timer className="w-2.5 h-2.5" /> ติดคูลดาวน์ ({anpCooldown} ตา)
                </span>
              ) : isRecommended ? (
                <span className="mt-1 font-retro text-[8px] text-rose-800 bg-rose-100 px-1 py-0.2 rounded text-center font-bold">
                  ⚡ แนะนำ! (Na⁺ &gt;60%)
                </span>
              ) : (
                <span className="mt-1 font-body text-[8px] text-slate-500">
                  {hasCard ? '✓ พร้อมใช้งาน' : '(ไม่มีการ์ด)'}
                </span>
              )}
            </button>
          );
        })()}

      </div>

      {/* Pass Turn Button */}
      <button
        onClick={onPassTurn}
        disabled={disabled}
        className={`w-full py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
          disabled
            ? 'grayscale opacity-50 cursor-not-allowed bg-slate-200 text-slate-500 border border-slate-300'
            : 'hover:-translate-y-0.5 text-white'
        }`}
        style={
          !disabled
            ? {
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: '2px solid #064E3B',
                boxShadow: '2px 2px 0 #064E3B',
              }
            : undefined
        }
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>จบตาของผู้เล่น (End Turn)</span>
      </button>
    </div>
  );
};
