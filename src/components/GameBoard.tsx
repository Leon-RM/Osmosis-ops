import React, { useState } from 'react';
import { BOARD_TILES } from '../data/boardData';
import type { Player, BoardTile } from '../types/game';
import { PlayerToken } from './PlayerToken';
import {
  Activity, Zap, HelpCircle, Gift, ShieldCheck,
  RefreshCw, Award, TrendingUp, Layers, Droplet,
  Compass, ArrowDownRight, Percent, Sparkles,
  Sun, ArrowRightCircle, Trophy, Flame, MapPin,
  Route, Info, X, ChevronRight
} from 'lucide-react';

interface GameBoardProps {
  players: Player[];
  activePlayerId: string;
  tiles?: BoardTile[];
  onTileClick?: (tile: BoardTile) => void;
}

const getTileIcon = (iconName: string) => {
  const cls = "w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0";
  switch (iconName) {
    case 'Activity': return <Activity className={cls} />;
    case 'Zap': return <Zap className={cls} />;
    case 'HelpCircle': return <HelpCircle className={cls} />;
    case 'Gift': return <Gift className={cls} />;
    case 'ShieldCheck': return <ShieldCheck className={cls} />;
    case 'RefreshCw': return <RefreshCw className={cls} />;
    case 'Award': return <Award className={cls} />;
    case 'TrendingUp': return <TrendingUp className={cls} />;
    case 'Layers': return <Layers className={cls} />;
    case 'Droplet': return <Droplet className={cls} />;
    case 'Compass': return <Compass className={cls} />;
    case 'ArrowDownRight': return <ArrowDownRight className={cls} />;
    case 'Percent': return <Percent className={cls} />;
    case 'Sparkles': return <Sparkles className={cls} />;
    case 'Sun': return <Sun className={cls} />;
    case 'ArrowRightCircle': return <ArrowRightCircle className={cls} />;
    case 'Trophy': return <Trophy className={cls} />;
    case 'Flame': return <Flame className={cls} />;
    default: return <Droplet className={cls} />;
  }
};

const SECTION_METADATA: Record<string, {
  nameTh: string;
  nameEn: string;
  range: string;
  bg: string;
  border: string;
  badge: string;
  badgeText: string;
  accent: string;
  emoji: string;
  landmark: string;
  descTh: string;
}> = {
  'Glomerulus': {
    nameTh: 'โกลเมอรูลัส (จุดกรองของเสีย)',
    nameEn: 'Glomerulus & Bowman\'s Capsule',
    range: 'ช่อง 1–5',
    bg: 'rgba(255,80,80,0.08)',
    border: 'rgba(239,68,68,0.4)',
    badge: 'rgba(255,80,80,0.15)',
    badgeText: '#C0392B',
    accent: '#EF4444',
    emoji: '🔴',
    landmark: 'Filtration Plant (โรงงานกรองสาร)',
    descTh: 'กรองน้ำและโมเลกุลเล็กออกจากเม็ดเลือดด้วยความดันสูง'
  },
  'Proximal Tubule': {
    nameTh: 'ท่อขดส่วนต้น (ดูดกลับสาร 65%)',
    nameEn: 'Proximal Convoluted Tubule (PCT)',
    range: 'ช่อง 6–15',
    bg: 'rgba(255,140,50,0.08)',
    border: 'rgba(249,115,22,0.4)',
    badge: 'rgba(255,140,50,0.15)',
    badgeText: '#C05920',
    accent: '#F97316',
    emoji: '🟠',
    landmark: 'Reabsorption Highway (ทางหลวงดูดกลับ)',
    descTh: 'ดูดกลับกลูโคส กรดอะมิโน โซเดียม และน้ำ 65% กลับสู่ร่างกาย'
  },
  'Loop of Henle': {
    nameTh: 'ห่วงเฮนเล (ปรับความเข้มข้น)',
    nameEn: 'Loop of Henle (Countercurrent)',
    range: 'ช่อง 16–25',
    bg: 'rgba(220,180,30,0.08)',
    border: 'rgba(234,179,8,0.4)',
    badge: 'rgba(220,180,30,0.15)',
    badgeText: '#A0760A',
    accent: '#EAB308',
    emoji: '🟡',
    landmark: 'Medulla Canyon (หุบเขาเข้มข้น)',
    descTh: 'ขาลงระบายน้ำออก (-10 H₂O) / ขาขึ้นปั๊มเกลือออก (-10 Na⁺)'
  },
  'Distal Tubule & Collecting Duct': {
    nameTh: 'ท่อขดปลาย & ท่อรวม (ศูนย์ฮอร์โมน)',
    nameEn: 'Distal Tubule & Collecting Duct',
    range: 'ช่อง 26–35',
    bg: 'rgba(40,180,110,0.08)',
    border: 'rgba(16,185,129,0.4)',
    badge: 'rgba(40,180,110,0.15)',
    badgeText: '#166534',
    accent: '#10B981',
    emoji: '🟢',
    landmark: 'Hormone Ridge (ควบคุมฮอร์โมน)',
    descTh: 'จุดออกฤทธิ์ของฮอร์โมน ADH, Aldosterone และ ANP'
  },
  'Bladder': {
    nameTh: 'กระเพาะปัสสาวะ (เส้นชัย)',
    nameEn: 'Urinary Bladder (Finish Line)',
    range: 'ช่อง 36–40',
    bg: 'rgba(60,130,220,0.08)',
    border: 'rgba(59,130,246,0.4)',
    badge: 'rgba(60,130,220,0.15)',
    badgeText: '#1D4ED8',
    accent: '#3B82F6',
    emoji: '🔵',
    landmark: 'Finish Line (ตัดสินคะแนนสมดุล)',
    descTh: 'กักเก็บและขับปัสสาวะ ตัดสินคะแนน Homeostasis ใกล้ 50%'
  },
};

export const GameBoard: React.FC<GameBoardProps> = ({ players, activePlayerId, tiles, onTileClick }) => {
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [viewMode, setViewMode] = useState<'monopoly' | 'adventure'>('monopoly');
  const [autoFollow, setAutoFollow] = useState(true);
  const tileRefs = React.useRef<Record<number, HTMLDivElement | null>>({});

  const boardTiles = tiles && tiles.length === 40 ? tiles : BOARD_TILES;
  const activePlayer = players.find(p => p.id === activePlayerId);

  // Auto-scroll to active player's station
  const scrollToPlayerTile = React.useCallback((pos?: number) => {
    const targetPos = pos ?? activePlayer?.position ?? 1;
    const el = tileRefs.current[targetPos];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePlayer?.position]);

  React.useEffect(() => {
    if (autoFollow && activePlayer?.position) {
      const timer = setTimeout(() => {
        scrollToPlayerTile(activePlayer.position);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [activePlayer?.position, activePlayerId, autoFollow, scrollToPlayerTile]);

  const handleTileSelect = (tile: BoardTile) => {
    setSelectedTile(tile);
    if (onTileClick) onTileClick(tile);
  };

  return (
    <div
      className="w-full rounded-3xl p-3 sm:p-5 relative"
      style={{
        background: 'rgba(255,255,255,0.76)',
        border: '2px solid #2D1B0E',
        boxShadow: '4px 4px 0 #2D1B0E',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Board Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 pb-3 border-b border-dashed border-amber-900/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">🗺️</span>
            <h2 className="font-display font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
              NEPHRON ROAD MAP (แผนที่เส้นทางหน่วยไต)
            </h2>
          </div>
          <p className="font-body text-[11px] sm:text-xs mt-0.5 text-amber-900/80">
            เส้นทาง 40 ช่อง • หน้าจอจะเลื่อนตามตำแหน่งตัวหมากของผู้เล่นโดยอัตโนมัติ
          </p>
        </div>

        {/* View Switcher & Focus Button */}
        <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
          {/* Quick Focus Button */}
          <button
            onClick={() => scrollToPlayerTile()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-retro text-[10px] font-bold bg-orange-500/15 text-orange-800 border border-orange-500/30 transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="เลื่อนจอไปยังตำแหน่งหมากของผู้เล่นปัจจุบัน"
          >
            <MapPin className="w-3 h-3 text-orange-600 animate-bounce" />
            <span>โฟกัสหมาก #{activePlayer?.position || 1}</span>
          </button>

          {/* Auto-Follow Toggle */}
          <button
            onClick={() => setAutoFollow(!autoFollow)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-retro text-[10px] font-bold border transition-all ${
              autoFollow
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
            title="เปิด/ปิดการเลื่อนจอตามตัวหมากอัตโนมัติ"
          >
            <span>Auto-Scroll: {autoFollow ? 'ON' : 'OFF'}</span>
          </button>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-1 bg-amber-900/10 p-1 rounded-xl border border-amber-900/20">
            <button
              onClick={() => setViewMode('monopoly')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-retro text-[10px] font-bold transition-all ${
                viewMode === 'monopoly'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900/70 hover:text-amber-900'
              }`}
            >
              <Route className="w-3 h-3" />
              <span>Winding Track</span>
            </button>
            <button
              onClick={() => setViewMode('adventure')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-retro text-[10px] font-bold transition-all ${
                viewMode === 'adventure'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900/70 hover:text-amber-900'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Station List</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Anatomical Section Landmark Badges */}
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
        {Object.entries(SECTION_METADATA).map(([key, meta]) => (
          <div
            key={key}
            className="flex flex-col p-2 rounded-xl border transition-all hover:scale-[1.02]"
            style={{
              background: meta.bg,
              borderColor: meta.border,
              boxShadow: '1.5px 1.5px 0 rgba(45,27,14,0.06)'
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs">{meta.emoji}</span>
              <span className="font-retro text-[8px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap"
                style={{ background: meta.badge, color: meta.badgeText }}>
                {meta.range}
              </span>
            </div>
            <p className="font-display font-bold text-[10px] sm:text-[11px] text-slate-900 truncate">
              {key}
            </p>
            <p className="font-body text-[9px] truncate" style={{ color: meta.badgeText }}>
              {meta.nameTh}
            </p>
          </div>
        ))}
      </div>

      {/* VIEW MODE 1: CURVED TUBE WINDING PATH */}
      {viewMode === 'monopoly' && (
        <div className="relative w-full overflow-hidden rounded-3xl p-2 sm:p-5 mb-3"
             style={{
               background: 'rgba(255,250,245,0.85)',
               border: '2px solid rgba(45,27,14,0.12)',
               boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.03)'
             }}>
          
          <div className="max-w-lg mx-auto relative pb-10 pt-4">
            {boardTiles.map((tile, idx) => {
              const isLeft = idx % 2 === 0;
              const isLast = idx === boardTiles.length - 1;
              const meta = SECTION_METADATA[tile.section] || SECTION_METADATA['Glomerulus'];
              const isFinish = tile.tileId === 40;
              const isStart = tile.tileId === 1;
              const playersOnTile = players.filter(p => p.position === tile.tileId);
              const hasActivePlayer = playersOnTile.some(p => p.id === activePlayerId);

              return (
                <div
                  key={`tile-${tile.tileId}`}
                  ref={el => { tileRefs.current[tile.tileId] = el; }}
                  className="relative w-full h-[135px] flex items-center mt-[-18px]"
                >
                  
                  {/* Curved SVG tube connecting to next tile */}
                  {!isLast && (
                    <svg className="absolute top-1/2 left-0 w-full h-[135px] z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Outer colored nephron tube */}
                      {isLeft ? (
                         <path d="M 26,0 C 26,50 74,50 74,100" stroke={meta.accent} strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.65" />
                      ) : (
                         <path d="M 74,0 C 74,50 26,50 26,100" stroke={meta.accent} strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.65" />
                      )}
                      {/* Inner fluid glow */}
                      {isLeft ? (
                         <path d="M 26,0 C 26,50 74,50 74,100" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
                      ) : (
                         <path d="M 74,0 C 74,50 26,50 26,100" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
                      )}
                    </svg>
                  )}

                  {/* Tile Station Card */}
                  <div className={`absolute z-10 w-[47%] sm:w-[43%] max-w-[230px] transition-all duration-200 hover:scale-[1.03] cursor-pointer ${
                    isLeft ? 'left-[1%] sm:left-[3%]' : 'right-[1%] sm:right-[3%]'
                  }`}
                       onClick={() => handleTileSelect(tile)}>
                    
                    <div className={`rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between ${
                      hasActivePlayer ? 'ring-4 ring-orange-500 ring-offset-2' : ''
                    }`}
                         style={{
                           background: isFinish
                             ? 'linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,107,53,0.9))'
                             : isStart
                             ? 'linear-gradient(135deg, rgba(255,80,80,0.95), rgba(255,140,50,0.9))'
                             : 'rgba(255,255,255,0.96)',
                           border: `2px solid ${isFinish ? '#B45309' : isStart ? '#B91C1C' : meta.border}`,
                           boxShadow: `3px 3px 0 ${isFinish ? '#B45309' : isStart ? '#B91C1C' : meta.border}`,
                           minHeight: '98px',
                           backdropFilter: 'blur(8px)'
                         }}>
                      
                      {/* Station Badge & Icon */}
                      <div className="flex items-center justify-between mb-1 gap-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-retro font-bold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md text-white shadow-sm flex items-center gap-0.5 shrink-0"
                                style={{ background: isFinish ? '#F59E0B' : isStart ? '#EF4444' : meta.accent }}>
                            #{tile.tileId}
                          </span>
                          {isStart && <span className="text-[10px]">🏁</span>}
                          {isFinish && <span className="text-[10px]">🏆</span>}
                        </div>

                        <div className="p-1 rounded-lg shrink-0 shadow-sm" style={{ background: isFinish || isStart ? 'white' : meta.bg, color: meta.accent }}>
                          {getTileIcon(tile.icon)}
                        </div>
                      </div>

                      {/* Station Name & Quick Effect Badges */}
                      <div className="flex-1 my-0.5 min-w-0">
                        <p className={`font-display font-extrabold leading-tight text-[10px] sm:text-xs line-clamp-2 ${
                          isFinish || isStart ? 'text-white drop-shadow-sm' : 'text-slate-900'
                        }`}>
                          {tile.name}
                        </p>

                        {/* Badges */}
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          {tile.effectType === 'quiz' && (
                            <span className="font-retro text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 shrink-0">
                              ❓ QUIZ
                            </span>
                          )}
                          {tile.effectType === 'hormone' && (
                            <span className="font-retro text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                              💊 HORMONE
                            </span>
                          )}
                          {tile.statChange && (tile.statChange.hydration !== 0 || tile.statChange.sodium !== 0) && (
                            <span className="font-retro text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 border border-slate-300 shrink-0">
                              {tile.statChange.hydration !== 0 && `${tile.statChange.hydration > 0 ? '+' : ''}${tile.statChange.hydration}💧 `}
                              {tile.statChange.sodium !== 0 && `${tile.statChange.sodium > 0 ? '+' : ''}${tile.statChange.sodium}🧂`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Player Token Pit */}
                      <div className="flex flex-wrap gap-1 mt-1.5 pt-1 items-end min-h-[24px]"
                           style={{ borderTop: `1.5px dashed ${isFinish || isStart ? 'rgba(255,255,255,0.4)' : meta.border}` }}>
                        {playersOnTile.map((player, pIdx) => (
                          <PlayerToken
                            key={player.id}
                            player={player}
                            isCurrentTurn={player.id === activePlayerId}
                            index={pIdx}
                          />
                        ))}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ROAD ADVENTURE MAP (Station by Station List) */}
      {viewMode === 'adventure' && (
        <div className="space-y-3.5 max-h-[540px] overflow-y-auto pr-1">
          {Object.entries(SECTION_METADATA).map(([secKey, meta]) => {
            const sectionTiles = boardTiles.filter(t => t.section === secKey);

            return (
              <div
                key={secKey}
                className="rounded-2xl p-3.5 border"
                style={{
                  background: meta.bg,
                  borderColor: meta.border,
                  boxShadow: '2px 2px 0 rgba(45,27,14,0.06)'
                }}
              >
                {/* Station Section Header */}
                <div className="flex items-start justify-between gap-2 pb-2 mb-2.5 border-b border-dashed border-amber-900/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.emoji}</span>
                    <div>
                      <h3 className="font-display font-extrabold text-xs sm:text-sm text-slate-900">
                        {meta.nameEn}
                      </h3>
                      <p className="font-body text-[11px] text-amber-900">
                        {meta.descTh}
                      </p>
                    </div>
                  </div>
                  <span className="font-retro text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: meta.badge, color: meta.badgeText, border: `1px solid ${meta.border}` }}>
                    {meta.range}
                  </span>
                </div>

                {/* Road Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sectionTiles.map(tile => {
                    const playersOnTile = players.filter(p => p.position === tile.tileId);
                    const isCurrentTile = activePlayer?.position === tile.tileId;

                    return (
                      <div
                        key={tile.tileId}
                        onClick={() => handleTileSelect(tile)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all hover:scale-[1.01] ${
                          isCurrentTile ? 'ring-2 ring-orange-500' : ''
                        }`}
                        style={{
                          background: 'rgba(255,255,255,0.85)',
                          borderColor: meta.border,
                          boxShadow: '1.5px 1.5px 0 rgba(45,27,14,0.05)'
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-retro font-bold text-xs w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                            style={{ background: meta.accent }}>
                            {tile.tileId}
                          </span>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-xs text-slate-900 truncate">
                              {tile.name}
                            </p>
                            <p className="font-body text-[10px] text-amber-900 truncate">
                              {tile.effect}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {playersOnTile.map((p, idx) => (
                            <PlayerToken
                              key={p.id}
                              player={p}
                              isCurrentTurn={p.id === activePlayerId}
                              index={idx}
                            />
                          ))}
                          <ChevronRight className="w-4 h-4 text-amber-800/40" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TILE DETAILS MODAL / DRAWER */}
      {selectedTile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay cursor-pointer"
          onClick={() => setSelectedTile(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-3xl p-5 sm:p-6 space-y-3.5 animate-pop-in max-h-[90vh] overflow-y-auto cursor-default"
            style={{
              background: 'rgba(255,252,248,0.98)',
              border: '2px solid #2D1B0E',
              boxShadow: '6px 6px 0 #2D1B0E',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-dashed border-orange-500/20">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-retro font-bold text-sm shadow-sm shrink-0"
                  style={{
                    background: SECTION_METADATA[selectedTile.section]?.accent || '#FF6B35',
                    border: '2px solid #2D1B0E',
                    boxShadow: '2px 2px 0 #2D1B0E'
                  }}
                >
                  #{selectedTile.tileId}
                </div>
                <div>
                  <span className="font-retro text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full"
                    style={{
                      background: SECTION_METADATA[selectedTile.section]?.badge,
                      color: SECTION_METADATA[selectedTile.section]?.badgeText
                    }}>
                    {selectedTile.section}
                  </span>
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                    {selectedTile.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedTile(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 shrink-0"
                style={{ background: 'rgba(224,92,139,0.12)', border: '1.5px solid rgba(224,92,139,0.3)', color: '#E05C8B' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scientific Biological Mechanism */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex items-center gap-1.5 font-display font-bold text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>กลไกการทำงานทางชีววิทยา (Biological Mechanism):</span>
              </div>
              <p className="font-body text-xs text-amber-950/85 leading-relaxed">
                {selectedTile.description}
              </p>
            </div>

            {/* Game Effect */}
            <div className="p-3.5 rounded-2xl bg-white border border-amber-900/15 space-y-1">
              <div className="flex items-center gap-1.5 font-display font-bold text-xs text-orange-950">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                <span>ผลกระทบในเกม (Game Effect):</span>
              </div>
              <p className="font-body font-semibold text-xs text-orange-800">
                {selectedTile.effect}
              </p>
            </div>

            {/* Close CTA */}
            <button
              onClick={() => setSelectedTile(null)}
              className="w-full py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm text-white transition-all hover:-translate-y-0.5 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #FF6B35, #E05C8B)',
                border: '2px solid #2D1B0E',
                boxShadow: '3px 3px 0 #2D1B0E'
              }}
            >
              ปิดหน้าต่าง (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
