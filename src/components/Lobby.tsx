import React, { useState, useEffect, useCallback } from 'react';
import type { Player } from '../types/game';
import {
  Users, Play, Plus, Trash2, Bot, Sparkles, Globe,
  Copy, Check, Database, LogIn, AlertCircle, RefreshCw, X, ArrowLeft, LogOut
} from 'lucide-react';
import {
  isSupabaseConfigured,
  supabase,
  createOnlineRoom,
  joinOnlineRoom,
  fetchRoomPlayers,
  startOnlineGame,
  leaveOnlineRoom
} from '../services/supabaseClient';
import { Footer } from './Footer';

interface LobbyProps {
  onStartGame: (players: Player[], roomCode: string, isOnline?: boolean, roomId?: string, myPlayerId?: string) => void;
}

const PRESET_COLORS = [
  '#FF6B35', '#E05C8B', '#FF8C42', '#4FAFCB',
  '#A855F7', '#10B981', '#F59E0B', '#EF4444',
  '#06B6D4', '#6366F1'
];

const PLAYER_AVATARS = ['🧬', '🫀', '🔬', '⚗️', '🧪', '🫁', '🩺', '💊', '🧫', '⚡'];

export const Lobby: React.FC<LobbyProps> = ({ onStartGame }) => {
  // Mode selection: 'local' vs 'online'
  const [lobbyMode, setLobbyMode] = useState<'local' | 'online'>(isSupabaseConfigured ? 'online' : 'local');
  const [onlineAction, setOnlineAction] = useState<'menu' | 'create' | 'join' | 'waiting'>('menu');

  // Local Game State
  const [roomCode, setRoomCode] = useState<string>(
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [players, setPlayers] = useState<Player[]>([
    { id: 'p1', name: 'ผู้เล่น 1', color: PRESET_COLORS[0], position: 1, hydration: 50, sodium: 50, adhCards: 1, aldosteroneCards: 1, diureticCards: 1, anpCards: 1, isReady: true, isBot: false },
    { id: 'p2', name: 'ผู้เล่น 2', color: PRESET_COLORS[1], position: 1, hydration: 50, sodium: 50, adhCards: 1, aldosteroneCards: 1, diureticCards: 1, anpCards: 1, isReady: true, isBot: false },
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Online Multiplayer State
  const [onlineRoomId, setOnlineRoomId] = useState<string>('');
  const [onlineRoomCode, setOnlineRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [onlinePlayerName, setOnlinePlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Initialize unique player ID per session tab
  useEffect(() => {
    let pid = sessionStorage.getItem('osmo_session_player_id');
    if (!pid) {
      pid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('osmo_session_player_id', pid);
    }
    setMyPlayerId(pid);

    const savedName = localStorage.getItem('osmo_player_name');
    if (savedName) {
      setOnlinePlayerName(savedName);
    }
  }, []);

  // ----------------------------------------------------
  // LEAVE / CANCEL ROOM ACTION
  // ----------------------------------------------------
  const handleLeaveOrCancelRoom = useCallback(async () => {
    if (onlineRoomId && myPlayerId) {
      await leaveOnlineRoom(onlineRoomId, myPlayerId, isHost);
    }
    setOnlineRoomId('');
    setOnlineRoomCode('');
    setIsHost(false);
    setOnlinePlayers([]);
    setOnlineAction('menu');
  }, [onlineRoomId, myPlayerId, isHost]);

  // Tab Close / Page Unload Handler
  useEffect(() => {
    const handleUnload = () => {
      if (onlineRoomId && myPlayerId && onlineAction === 'waiting') {
        leaveOnlineRoom(onlineRoomId, myPlayerId, isHost);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [onlineRoomId, myPlayerId, isHost, onlineAction]);

  // ----------------------------------------------------
  // ONLINE REALTIME SYNC + 1.2S POLLING
  // ----------------------------------------------------
  useEffect(() => {
    if (!onlineRoomId || onlineAction !== 'waiting') return;

    let isSubscribed = true;

    const refreshRoster = async () => {
      // 1. Fetch current room info to check if deleted
      if (supabase) {
        const { data: r, error: rErr } = await supabase.from('rooms').select('id, status').eq('id', onlineRoomId).maybeSingle();
        if (rErr || !r) {
          // Room was closed or deleted by host!
          if (isSubscribed && !isHost) {
            setErrorMessage('ห้องนี้ถูกปิดหรือหัวหน้าห้องได้ออกจากห้องแล้ว');
            setOnlineAction('menu');
            setOnlineRoomId('');
          }
          return;
        }

        if (r.status === 'playing' && !isHost && isSubscribed) {
          const list = await fetchRoomPlayers(onlineRoomId);
          onStartGame(list.length > 0 ? list : onlinePlayers, onlineRoomCode, true, onlineRoomId, myPlayerId);
          return;
        }
      }

      // 2. Fetch players
      const list = await fetchRoomPlayers(onlineRoomId);
      if (isSubscribed && list.length > 0) {
        setOnlinePlayers(list);
      }
    };

    refreshRoster();
    const interval = setInterval(refreshRoster, 1200);

    // Realtime channel
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel(`lobby_${onlineRoomId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, () => {
          refreshRoster();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${onlineRoomId}` }, (payload: any) => {
          if (payload.eventType === 'DELETE' && !isHost) {
            setErrorMessage('ห้องนี้ถูกปิดโดยหัวหน้าห้อง');
            setOnlineAction('menu');
          } else if (payload.new && payload.new.status === 'playing') {
            fetchRoomPlayers(onlineRoomId).then(latest => {
              onStartGame(latest.length > 0 ? latest : onlinePlayers, onlineRoomCode, true, onlineRoomId, myPlayerId);
            });
          }
        })
        .subscribe();
    }

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [onlineRoomId, onlineAction, onlineRoomCode, isHost, myPlayerId, onStartGame, onlinePlayers]);

  // ----------------------------------------------------
  // LOCAL HANDLERS
  // ----------------------------------------------------
  const handleAddPlayer = () => {
    if (players.length >= 10) return;
    const idx = players.length;
    setPlayers([...players, {
      id: `p_${Date.now()}`,
      name: newPlayerName.trim() || `ผู้เล่น ${idx + 1}`,
      color: PRESET_COLORS[idx % PRESET_COLORS.length],
      position: 1, hydration: 50, sodium: 50, adhCards: 1, aldosteroneCards: 1, diureticCards: 1, anpCards: 1, isReady: true, isBot: false
    }]);
    setNewPlayerName('');
  };

  const handleAddBot = () => {
    if (players.length >= 10) return;
    const idx = players.length;
    setPlayers([...players, {
      id: `bot_${Date.now()}`,
      name: `NephronBot ${idx}`,
      color: PRESET_COLORS[idx % PRESET_COLORS.length],
      position: 1, hydration: 50, sodium: 50, adhCards: 1, aldosteroneCards: 1, diureticCards: 1, anpCards: 1, isReady: true, isBot: true
    }]);
  };

  const handleRemoveLocal = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleColorChangeLocal = (id: string, color: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, color } : p));
  };

  // ----------------------------------------------------
  // ONLINE HANDLERS
  // ----------------------------------------------------
  const handleCreateOnlineRoom = async () => {
    if (!onlinePlayerName.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้เล่นก่อนสร้างห้อง');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    localStorage.setItem('osmo_player_name', onlinePlayerName.trim());

    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const host: Player = {
      id: myPlayerId,
      name: onlinePlayerName.trim(),
      color: selectedColor,
      position: 1,
      hydration: 50,
      sodium: 50,
      adhCards: 1,
      aldosteroneCards: 1,
      diureticCards: 1,
      anpCards: 1,
      isReady: true,
      isBot: false
    };

    const res = await createOnlineRoom(generatedCode, host);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(`สร้างห้องไม่สำเร็จ: ${res.error}`);
      return;
    }

    if (res.room) {
      setOnlineRoomId(res.room.id);
      setOnlineRoomCode(res.room.code);
      setIsHost(true);
      setOnlinePlayers([host]);
      setOnlineAction('waiting');
    }
  };

  const handleJoinOnlineRoom = async () => {
    if (!onlinePlayerName.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้เล่นก่อนเข้าร่วมห้อง');
      return;
    }
    if (!joinCodeInput.trim()) {
      setErrorMessage('กรุณากรอกรหัสห้อง (Room Code 6 ตัวอักษร)');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    localStorage.setItem('osmo_player_name', onlinePlayerName.trim());

    const joining: Player = {
      id: myPlayerId,
      name: onlinePlayerName.trim(),
      color: selectedColor,
      position: 1,
      hydration: 50,
      sodium: 50,
      adhCards: 1,
      aldosteroneCards: 1,
      diureticCards: 1,
      anpCards: 1,
      isReady: true,
      isBot: false
    };

    const res = await joinOnlineRoom(joinCodeInput.trim(), joining);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(`เข้าร่วมห้องไม่สำเร็จ: ${res.error}`);
      return;
    }

    if (res.room) {
      setOnlineRoomId(res.room.id);
      setOnlineRoomCode(res.room.code);
      setIsHost(false);
      setOnlineAction('waiting');
      const latest = await fetchRoomPlayers(res.room.id);
      setOnlinePlayers(latest.length > 0 ? latest : [joining]);
    }
  };

  const handleStartOnlineGame = async () => {
    if (onlinePlayers.length < 1) {
      setErrorMessage('ต้องมีผู้เล่นอย่างน้อย 1 คน');
      return;
    }
    setIsLoading(true);
    await startOnlineGame(onlineRoomId);
    onStartGame(onlinePlayers, onlineRoomCode, true, onlineRoomId, myPlayerId);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(onlineRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-6 sm:py-8 px-3 sm:px-5 relative" style={{ background: 'var(--bg-page)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(224,92,139,0.15) 0%, transparent 70%)' }} />

      <div className="relative max-w-lg w-full space-y-4">

        {/* Title Banner */}
        <div
          className="text-center p-6 sm:p-8 rounded-3xl relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.78)',
            border: '2px solid #2D1B0E',
            boxShadow: '5px 5px 0 #2D1B0E',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-orange-500/10 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-retro text-[10px] tracking-widest font-bold text-orange-600">
              MULTIPLAYER SCI-GAME
            </span>
          </div>

          <h1 className="font-display font-extrabold mb-1 text-shimmer"
            style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', letterSpacing: '-1px', lineHeight: 1 }}>
            OSMOSIS OPS
          </h1>
          <p className="font-body text-xs sm:text-sm mt-2 leading-relaxed text-amber-950">
            เกมกระดานรักษา <strong>สมดุลน้ำและไต (Osmoregulation)</strong>
            <br />
            <span className="text-orange-700">เล่นข้ามมือถือได้ด้วยระบบ Supabase Realtime</span>
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-4 flex items-center justify-center p-1 bg-amber-900/10 rounded-2xl border border-amber-900/20 max-w-sm mx-auto">
            <button
              onClick={() => { setLobbyMode('online'); setOnlineAction('menu'); setErrorMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                lobbyMode === 'online'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900/70 hover:text-amber-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ออนไลน์ (Supabase)</span>
              {isSupabaseConfigured && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => { setLobbyMode('local'); setErrorMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                lobbyMode === 'local'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900/70 hover:text-amber-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>เครื่องเดียวกัน (Pass & Play)</span>
            </button>
          </div>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-800 text-xs font-body flex items-start gap-2 animate-pop-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">{errorMessage}</p>
              {errorMessage.includes('relation') || errorMessage.includes('table') || errorMessage.includes('schema') ? (
                <button
                  onClick={() => setShowSqlModal(true)}
                  className="mt-1 underline font-bold text-rose-900 block"
                >
                  คลิกที่นี่เพื่อดูคำแนะนำการสร้างตารางบน Supabase SQL Editor
                </button>
              ) : null}
            </div>
            <button onClick={() => setErrorMessage(null)}>
              <X className="w-3.5 h-3.5 text-rose-600" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 1: ONLINE MULTIPLAYER (SUPABASE)                   */}
        {/* ======================================================== */}
        {lobbyMode === 'online' && (
          <div
            className="p-5 rounded-3xl space-y-4"
            style={{
              background: 'rgba(255,255,255,0.76)',
              border: '2px solid #2D1B0E',
              boxShadow: '4px 4px 0 #2D1B0E',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Online Menu */}
            {onlineAction === 'menu' && (
              <div className="space-y-4">
                {/* Profile Form */}
                <div className="space-y-2.5 pb-3 border-b border-dashed border-amber-900/20">
                  <label className="font-retro text-[10px] tracking-widest font-bold block text-amber-900">
                    1. ตั้งชื่อของคุณ (PLAYER PROFILE)
                  </label>
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อของคุณ เช่น Dr. Nephron..."
                    value={onlinePlayerName}
                    onChange={e => setOnlinePlayerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl font-body text-sm font-bold bg-white/90 border-2 border-amber-900/20 focus:outline-none focus:border-orange-500 text-slate-900"
                  />

                  {/* Token Color Picker */}
                  <div className="pt-1">
                    <span className="font-body text-[11px] text-amber-900/80 block mb-1.5">เลือกสีหมากของคุณ:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full transition-all ${selectedColor === c ? 'scale-125 ring-2 ring-orange-500 ring-offset-2' : 'hover:scale-110'}`}
                          style={{ background: c, border: '1.5px solid #2D1B0E' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Create & Join Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => { setOnlineAction('create'); setErrorMessage(null); }}
                    className="p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:-translate-y-1 active:translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,140,50,0.1))',
                      border: '2px solid #2D1B0E',
                      boxShadow: '3px 3px 0 #2D1B0E',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-sm block text-slate-900">
                        สร้างห้องใหม่ (Host)
                      </span>
                      <span className="font-body text-[10px] text-amber-900">
                        เป็นหัวหน้าห้องและชวนเพื่อน
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setOnlineAction('join'); setErrorMessage(null); }}
                    className="p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:-translate-y-1 active:translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(79,175,203,0.15), rgba(16,185,129,0.1))',
                      border: '2px solid #2D1B0E',
                      boxShadow: '3px 3px 0 #2D1B0E',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                      <LogIn className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-sm block text-slate-900">
                        เข้าร่วมห้อง (Join)
                      </span>
                      <span className="font-body text-[10px] text-amber-900">
                        ใส่รหัส 6 หลักจากเพื่อน
                      </span>
                    </div>
                  </button>
                </div>

                {/* Database Setup Helper Link */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowSqlModal(true)}
                    className="inline-flex items-center gap-1 font-body text-[11px] text-amber-800/80 hover:text-amber-900 underline"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>คำแนะนำการตั้งค่า Supabase Database & Schema</span>
                  </button>
                </div>
              </div>
            )}

            {/* Create Room View */}
            {onlineAction === 'create' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-amber-900/20">
                  <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>👑 สร้างห้องออนไลน์ใหม่</span>
                  </h3>
                  <button
                    onClick={() => setOnlineAction('menu')}
                    className="font-retro text-xs text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> ย้อนกลับ
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-body text-amber-900">
                  ระบบจะสร้าง <strong>Room Code 6 หลัก</strong> เพื่อให้คุณชวนเพื่อนเข้ามาเล่นด้วยกัน
                </div>

                <button
                  onClick={handleCreateOnlineRoom}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl font-display font-extrabold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B35, #E05C8B)',
                    border: '2px solid #2D1B0E',
                    boxShadow: '3px 3px 0 #2D1B0E'
                  }}
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>ยืนยันสร้างห้องออนไลน์</span>
                </button>
              </div>
            )}

            {/* Join Room View */}
            {onlineAction === 'join' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-amber-900/20">
                  <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>🔗 เข้าร่วมห้องออนไลน์</span>
                  </h3>
                  <button
                    onClick={() => setOnlineAction('menu')}
                    className="font-retro text-xs text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> ย้อนกลับ
                  </button>
                </div>

                <div>
                  <label className="font-retro text-[10px] tracking-widest font-bold block mb-1 text-amber-900">
                    ใส่รหัสห้อง (ROOM CODE 6 หลัก):
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="เช่น ABC123"
                    value={joinCodeInput}
                    onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                    className="w-full text-center tracking-widest font-retro font-bold text-2xl py-3 rounded-xl bg-white/90 border-2 border-amber-900/30 focus:outline-none focus:border-teal-500 text-orange-600"
                  />
                </div>

                <button
                  onClick={handleJoinOnlineRoom}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl font-display font-extrabold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #4FAFCB, #10B981)',
                    border: '2px solid #2D1B0E',
                    boxShadow: '3px 3px 0 #2D1B0E'
                  }}
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>เข้าร่วมห้องทันที</span>
                </button>
              </div>
            )}

            {/* Waiting Room View (Live Roster + Cancel/Leave Buttons) */}
            {onlineAction === 'waiting' && (
              <div className="space-y-4">
                {/* Room Code Badge */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30">
                  <div>
                    <span className="font-retro text-[9px] font-bold text-amber-800 block">ROOM CODE</span>
                    <span className="font-retro font-extrabold text-2xl tracking-widest text-orange-600">
                      {onlineRoomCode}
                    </span>
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white font-display font-bold text-xs text-amber-950 border border-amber-900/20 shadow-sm transition-all hover:scale-105"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-orange-600" />}
                    <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกรหัส'}</span>
                  </button>
                </div>

                {/* Live Player List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-retro text-[10px] font-bold text-amber-900">
                      ผู้เล่นที่เชื่อมต่อ ({onlinePlayers.length}/10 คน):
                    </span>
                    <span className="font-retro text-[9px] text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      LIVE SYNC
                    </span>
                  </div>

                  <div className="space-y-2">
                    {onlinePlayers.map((p, i) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 border border-amber-900/15"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{PLAYER_AVATARS[i % PLAYER_AVATARS.length]}</span>
                          <div className="w-4 h-4 rounded-full border border-black" style={{ background: p.color }} />
                          <span className="font-display font-bold text-xs text-slate-900">
                            {p.name}
                          </span>
                          {p.id === myPlayerId && (
                            <span className="font-retro text-[8px] bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded-full font-bold">
                              (คุณ)
                            </span>
                          )}
                        </div>
                        <span className="font-retro text-[9px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          ✓ พร้อม
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Host Start or Member Waiting Action */}
                {isHost ? (
                  <button
                    onClick={handleStartOnlineGame}
                    disabled={isLoading || onlinePlayers.length < 1}
                    className="w-full py-4 rounded-2xl font-display font-extrabold text-base text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #FF6B35, #E05C8B)',
                      border: '2px solid #2D1B0E',
                      boxShadow: '4px 4px 0 #2D1B0E'
                    }}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>เริ่มเกมสำหรับทุกคน! (Start Game)</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-center space-y-1">
                    <p className="font-display font-bold text-xs text-amber-900 flex items-center justify-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
                      <span>รอหัวหน้าห้องกดเริ่มเกม...</span>
                    </p>
                    <p className="font-body text-[10px] text-amber-800/80">
                      เมื่อหัวหน้าห้องกดเริ่มเกม หน้าจอของคุณจะเข้าสู่กระดานเกมอัตโนมัติ
                    </p>
                  </div>
                )}

                {/* Cancel / Leave Room Button */}
                <button
                  onClick={handleLeaveOrCancelRoom}
                  className="w-full py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 transition-all hover:bg-rose-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isHost ? 'ยกเลิกและปิดห้องนี้ (Cancel Room)' : 'ออกจากห้อง (Leave Room)'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: LOCAL PASS & PLAY                                */}
        {/* ======================================================== */}
        {lobbyMode === 'local' && (
          <div
            className="p-5 rounded-3xl space-y-4"
            style={{
              background: 'rgba(255,255,255,0.72)',
              border: '2px solid #2D1B0E',
              boxShadow: '4px 4px 0 #2D1B0E',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Room Code Row */}
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-orange-500/25">
              <div>
                <p className="font-retro text-[9px] tracking-widest mb-1 text-amber-900">LOCAL ROOM CODE</p>
                <input
                  type="text"
                  value={roomCode}
                  onChange={e => setRoomCode(e.target.value.toUpperCase())}
                  className="font-retro font-bold text-xl tracking-widest bg-transparent focus:outline-none text-orange-600"
                  style={{ width: '8ch' }}
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="font-retro text-xs font-bold text-amber-900">
                  {players.length}/10
                </span>
              </div>
            </div>

            {/* Player List */}
            <div className="space-y-2">
              {players.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl transition-all bg-amber-500/5 border border-orange-500/15"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{PLAYER_AVATARS[i % PLAYER_AVATARS.length]}</span>
                    {/* Color picker */}
                    <div className="relative group">
                      <input
                        type="color"
                        value={p.color}
                        onChange={e => handleColorChangeLocal(p.id, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div
                        className="w-6 h-6 rounded-full transition-transform group-hover:scale-110"
                        style={{ background: p.color, border: '2px solid #2D1B0E' }}
                      />
                    </div>
                    <div>
                      <span className="font-body font-bold text-sm text-slate-900">
                        {p.name}
                      </span>
                      {p.isBot && (
                        <span className="ml-2 font-retro text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300">
                          BOT
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-retro text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                      ✓ READY
                    </span>
                    {players.length > 2 && (
                      <button
                        onClick={() => handleRemoveLocal(p.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center bg-rose-100 text-rose-600 border border-rose-200 transition-all hover:scale-110"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Player Row */}
            {players.length < 10 && (
              <div className="flex gap-2 pt-2 border-t border-dashed border-orange-500/15">
                <input
                  type="text"
                  placeholder="ชื่อผู้เล่นใหม่..."
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
                  className="flex-1 px-3 py-2 rounded-xl font-body text-xs focus:outline-none transition-all bg-amber-500/10 border border-orange-500/25 text-slate-900"
                />
                <button
                  onClick={handleAddPlayer}
                  className="px-3 py-2 rounded-xl font-body font-bold text-xs flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 text-orange-600 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Plus className="w-3.5 h-3.5" /> เพิ่ม
                </button>
                <button
                  onClick={handleAddBot}
                  className="px-3 py-2 rounded-xl font-body font-bold text-xs flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-700 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Bot className="w-3.5 h-3.5" /> Bot
                </button>
              </div>
            )}

            {/* Start Button Local */}
            <button
              onClick={() => onStartGame(players, roomCode, false)}
              className="w-full py-4 rounded-2xl font-display font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #E05C8B 100%)',
                border: '2px solid #2D1B0E',
                boxShadow: '4px 4px 0 #2D1B0E',
                color: 'white',
              }}
            >
              <Play className="w-5 h-5 fill-current" />
              เริ่มเล่นเครื่องนี้! (Start Local)
            </button>
          </div>
        )}
      </div>

      {/* Group Members & Project Credits Footer */}
      <Footer />

      {/* SQL Schema Instructions Modal */}
      {showSqlModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay cursor-pointer"
          onClick={() => setShowSqlModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full rounded-3xl p-5 sm:p-6 space-y-4 animate-pop-in max-h-[85vh] overflow-y-auto cursor-default"
            style={{
              background: 'rgba(255,252,248,0.98)',
              border: '2px solid #2D1B0E',
              boxShadow: '6px 6px 0 #2D1B0E'
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/20">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-600" />
                <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                  Supabase Database Setup Guide
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-xl bg-rose-100 text-rose-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body text-xs text-amber-950 leading-relaxed">
              หากต้องการให้ผู้เล่นอื่นเข้าร่วมห้องออนไลน์ได้ กรุณานำโค้ด SQL ด้านล่างไปรันใน <strong>Supabase Dashboard → SQL Editor</strong>:
            </p>

            <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 select-all">
{`CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting',
  current_player_index INT DEFAULT 0,
  phase VARCHAR(20) DEFAULT 'EVENT',
  current_global_event JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_id VARCHAR(100) NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(30) NOT NULL DEFAULT '#3b82f6',
  position INT DEFAULT 1,
  hydration INT DEFAULT 50,
  sodium INT DEFAULT 50,
  adh_cards INT DEFAULT 1,
  aldosterone_cards INT DEFAULT 1,
  diuretic_cards INT DEFAULT 1,
  anp_cards INT DEFAULT 1,
  is_ready BOOLEAN DEFAULT false,
  is_bot BOOLEAN DEFAULT false,
  score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_room_player UNIQUE (room_id, player_id)
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all game_state" ON game_state FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;`}
            </pre>

            <button
              onClick={() => setShowSqlModal(false)}
              className="w-full py-2.5 rounded-xl font-display font-bold text-xs bg-amber-600 text-white shadow-sm"
            >
              เข้าใจแล้ว ปิดหน้าต่างนี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
