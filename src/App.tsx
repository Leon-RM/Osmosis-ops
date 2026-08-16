import React, { useState, useEffect, useCallback } from 'react';
import type { Player, Phase, GlobalEvent, QuizQuestion, SectionType, BoardTile } from './types/game';
import { generateDynamicBoard, BASE_BOARD_TILES } from './data/boardData';
import { QUIZ_QUESTIONS, getRandomizedQuizQuestion } from './data/quizData';
import { GLOBAL_EVENTS } from './data/eventsData';
import { sounds } from './utils/soundEffects';
import {
  supabase,
  updateOnlineGameState,
  fetchRoomPlayers,
  leaveOnlineRoom
} from './services/supabaseClient';

import { Navbar } from './components/Navbar';
import { GameBoard } from './components/GameBoard';
import { PlayerHUD } from './components/PlayerHUD';
import { DiceRoller } from './components/DiceRoller';
import { ActionCards } from './components/ActionCards';
import { Lobby } from './components/Lobby';

import { HowToPlayModal } from './components/modals/HowToPlayModal';
import { GlobalEventModal } from './components/modals/GlobalEventModal';
import { QuizModal } from './components/modals/QuizModal';
import { GameOverModal } from './components/modals/GameOverModal';
import {
  Scroll, Dices, ShieldCheck, X, Droplet, Percent,
  ChevronUp, User, Pill, Heart, ArrowUp, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  // Game setup & room state
  const [inLobby, setInLobby] = useState(true);
  const [roomCode, setRoomCode] = useState('OSMO88');
  const [players, setPlayers] = useState<Player[]>([]);
  const [dynamicBoard, setDynamicBoard] = useState<BoardTile[]>(BASE_BOARD_TILES);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('EVENT');

  // Online Multiplayer Tracking
  const [isOnline, setIsOnline] = useState(false);
  const [onlineRoomId, setOnlineRoomId] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('');

  // Modals & events
  const [soundMuted, setSoundMuted] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isMobileHudOpen, setIsMobileHudOpen] = useState(false);
  const [isMobileCardsOpen, setIsMobileCardsOpen] = useState(false);
  const [isMobileDiceRolling, setIsMobileDiceRolling] = useState(false);
  const [mobileDiceValue, setMobileDiceValue] = useState<number>(1);
  const [currentEvent, setCurrentEvent] = useState<GlobalEvent | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  // Game log stream
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 30)]);
  };

  // Active player helper
  const activePlayer = players[currentPlayerIndex] || null;
  const isMyTurn = !isOnline || activePlayer?.id === myPlayerId;

  // ----------------------------------------------------
  // SMART RANDOM QUIZ PICKER (DYNAMIC CHOICES SHUFFLE)
  // ----------------------------------------------------
  const pickRandomQuiz = useCallback((_section?: SectionType): QuizQuestion => {
    // 1. Filter out already asked questions across entire bank
    let pool = QUIZ_QUESTIONS.filter((q) => !askedQuestionIds.includes(q.id));
    if (pool.length === 0) {
      pool = QUIZ_QUESTIONS;
      setAskedQuestionIds([]);
    }

    // 2. Pick a random question from pool
    const rawPicked = pool[Math.floor(Math.random() * pool.length)];
    setAskedQuestionIds((prev) => [...prev, rawPicked.id]);

    // 3. Dynamically randomize the choices order (A, B, C, D)
    return getRandomizedQuizQuestion(rawPicked);
  }, [askedQuestionIds]);

  // ----------------------------------------------------
  // ONLINE REALTIME SYNC + 1.5S POLLING FALLBACK
  // ----------------------------------------------------
  useEffect(() => {
    if (!isOnline || !onlineRoomId) return;

    let isSubscribed = true;

    const syncRoom = async () => {
      if (!isSubscribed) return;
      try {
        const latestPlayers = await fetchRoomPlayers(onlineRoomId);
        if (latestPlayers.length > 0 && isSubscribed) {
          setPlayers(latestPlayers);
        }

        if (supabase) {
          const { data: r } = await supabase
            .from('rooms')
            .select('current_player_index, phase, current_global_event')
            .eq('id', onlineRoomId)
            .single();

          if (r && isSubscribed) {
            setCurrentPlayerIndex(r.current_player_index);
            setPhase(r.phase);
            if (r.current_global_event) {
              setCurrentEvent(r.current_global_event);
            }
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    // Immediate sync
    syncRoom();

    // 1. Polling interval (Every 1500ms)
    const interval = setInterval(syncRoom, 1500);

    // 2. Unload / tab close listener
    const handleUnload = () => {
      if (isOnline && onlineRoomId && myPlayerId) {
        leaveOnlineRoom(onlineRoomId, myPlayerId, false);
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    // 3. Realtime WebSocket listener
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel(`game_${onlineRoomId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${onlineRoomId}` },
          (payload: any) => {
            if (payload.new && isSubscribed) {
              setCurrentPlayerIndex(payload.new.current_player_index);
              setPhase(payload.new.phase);
              if (payload.new.current_global_event) {
                setCurrentEvent(payload.new.current_global_event);
              }
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'game_state' },
          () => {
            fetchRoomPlayers(onlineRoomId).then((latest) => {
              if (latest.length > 0 && isSubscribed) {
                setPlayers(latest);
              }
            });
          }
        )
        .subscribe();
    }

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [isOnline, onlineRoomId, myPlayerId]);

  // Sync to Supabase helper
  const syncOnline = useCallback(
    (
      newPlayers: Player[],
      newPlayerIndex: number,
      newPhase: Phase,
      event: GlobalEvent | null = currentEvent
    ) => {
      if (isOnline && onlineRoomId) {
        updateOnlineGameState(onlineRoomId, newPlayers, newPlayerIndex, newPhase, event);
      }
    },
    [isOnline, onlineRoomId, currentEvent]
  );

  // ----------------------------------------------------
  // START GAME FROM LOBBY (GENERATES NEW RANDOMIZED BOARD)
  // ----------------------------------------------------
  const handleStartGame = (
    initialPlayers: Player[],
    code: string,
    online = false,
    roomId = '',
    localPlayerId = ''
  ) => {
    // Generate a fresh procedural dynamic board with varied tile values!
    const newBoard = generateDynamicBoard();
    setDynamicBoard(newBoard);

    setPlayers(initialPlayers);
    setRoomCode(code);
    setIsOnline(online);
    setOnlineRoomId(roomId || null);
    setMyPlayerId(localPlayerId || initialPlayers[0]?.id || '');
    setInLobby(false);
    setCurrentPlayerIndex(0);
    setAskedQuestionIds([]);
    setWinner(null);
    setLogs([]);
    addLog('🚀 เกม Osmosis Ops เริ่มต้นขึ้นแล้ว! สุ่มค่าสถานะกระดานใหม่ประจำรอบเสร็จสมบูรณ์');
    setIsHowToPlayOpen(true);

    // Trigger Phase 1 Global Event
    triggerGlobalEvent(initialPlayers, 0);
  };

  // ----------------------------------------------------
  // PHASE 1: GLOBAL EVENT
  // ----------------------------------------------------
  const triggerGlobalEvent = (currentPlayersList?: Player[], activeIdx = currentPlayerIndex) => {
    const event = GLOBAL_EVENTS[Math.floor(Math.random() * GLOBAL_EVENTS.length)];
    setCurrentEvent(event);
    setPhase('EVENT');

    // Apply stat changes to all players
    const updatedPlayers = (currentPlayersList || players).map((p) => ({
      ...p,
      hydration: Math.min(100, Math.max(0, p.hydration + event.hydrationChange)),
      sodium: Math.min(100, Math.max(0, p.sodium + event.sodiumChange))
    }));

    setPlayers(updatedPlayers);
    addLog(`📢 Global Event: ${event.titleTh} - ${event.descriptionTh}`);

    syncOnline(updatedPlayers, activeIdx, 'EVENT', event);
  };

  const handleConfirmEvent = () => {
    setCurrentEvent(null);
    setPhase('ROLL');
    syncOnline(players, currentPlayerIndex, 'ROLL', null);
  };

  // ----------------------------------------------------
  // PHASE 2: ROLL DICE & STEP MOVEMENT
  // ----------------------------------------------------
  const handleRollDice = (diceValue: number) => {
    if (!activePlayer || phase !== 'ROLL') return;

    addLog(`🎲 ${activePlayer.name} ทอยลูกเต๋าได้ ${diceValue} แต้ม!`);

    const startPos = activePlayer.position || 1;
    const targetPos = Math.min(40, startPos + diceValue);

    let curr = startPos;
    const interval = setInterval(() => {
      curr++;
      sounds.playStep();

      setPlayers((prev) => {
        return prev.map((p) => (p.id === activePlayer.id ? { ...p, position: curr } : p));
      });

      if (curr >= targetPos) {
        clearInterval(interval);
        setTimeout(() => {
          handleTileLanding(activePlayer.id, targetPos);
        }, 300);
      }
    }, 180);
  };

  // Mobile Dice Roll Animation
  const handleMobileDiceRoll = () => {
    if (!activePlayer || phase !== 'ROLL' || !isMyTurn || isMobileDiceRolling) return;
    setIsMobileDiceRolling(true);
    sounds.playDiceRoll();

    let count = 0;
    const timer = setInterval(() => {
      setMobileDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 12) {
        clearInterval(timer);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setMobileDiceValue(finalVal);
        setIsMobileDiceRolling(false);
        handleRollDice(finalVal);
      }
    }, 80);
  };

  // ----------------------------------------------------
  // PHASE 3: TILE ACTION & QUIZ (USING DYNAMIC BOARD)
  // ----------------------------------------------------
  const handleTileLanding = (playerId: string, targetPos: number) => {
    const tile = dynamicBoard.find((t) => t.tileId === targetPos);
    if (!tile) return;

    setPhase('ACTION');
    addLog(`📍 ${activePlayer?.name} เดินทางถึงช่อง #${targetPos}: ${tile.name} (${tile.section})`);

    // Check if player reached tile 40 (Finish Line)
    if (targetPos >= 40) {
      handleFinishGame(playerId);
      return;
    }

    const statChange = tile.statChange || { hydration: 0, sodium: 0 };
    let statLog = '';

    if (statChange.hydration !== 0 || statChange.sodium !== 0) {
      statLog = `(${statChange.hydration !== 0 ? (statChange.hydration > 0 ? '+' : '') + statChange.hydration + ' 💧' : ''} ${statChange.sodium !== 0 ? (statChange.sodium > 0 ? '+' : '') + statChange.sodium + ' 🧂' : ''})`;
      addLog(`⚡ ผลจากช่อง ${tile.name}: ${statLog}`);
    }

    // Apply POSITION and STAT CHANGES functionally to avoid stale closures
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((p) => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          position: targetPos,
          hydration: Math.min(100, Math.max(0, p.hydration + statChange.hydration)),
          sodium: Math.min(100, Math.max(0, p.sodium + statChange.sodium))
        };
      });

      // Handle specific tile effect types
      if (tile.effectType === 'quiz') {
        const q = pickRandomQuiz(tile.section);
        setCurrentQuiz(q);
        syncOnline(updatedPlayers, currentPlayerIndex, 'ACTION');
      } else if (tile.effectType === 'hormone') {
        // Randomly award 1 of the 4 osmoregulation cards
        const rand = Math.random();
        const granted = rand < 0.25 ? 'ADH' : rand < 0.5 ? 'Diuretic' : rand < 0.75 ? 'Aldosterone' : 'ANP';

        const listWithCard = updatedPlayers.map((p) => {
          if (p.id !== playerId) return p;
          return {
            ...p,
            adhCards: granted === 'ADH' ? p.adhCards + 1 : p.adhCards,
            diureticCards: granted === 'Diuretic' ? (p.diureticCards || 0) + 1 : (p.diureticCards || 0),
            aldosteroneCards: granted === 'Aldosterone' ? p.aldosteroneCards + 1 : p.aldosteroneCards,
            anpCards: granted === 'ANP' ? (p.anpCards || 0) + 1 : (p.anpCards || 0),
          };
        });

        addLog(`🎁 ${activePlayer?.name} ได้รับการ์ด ${granted} ฟรี 1 ใบ!`);
        setPhase('CARD');
        syncOnline(listWithCard, currentPlayerIndex, 'CARD');
        return listWithCard;
      } else {
        setPhase('CARD');
        syncOnline(updatedPlayers, currentPlayerIndex, 'CARD');
      }

      return updatedPlayers;
    });
  };

  const handleQuizAnswer = (isCorrect: boolean, question: QuizQuestion) => {
    setCurrentQuiz(null);

    setPlayers((prevPlayers) => {
      let updatedPlayers = prevPlayers;
      if (isCorrect && activePlayer) {
        updatedPlayers = prevPlayers.map((p) =>
          p.id === activePlayer.id
            ? {
                ...p,
                hydration: Math.min(100, p.hydration + question.statReward.hydration),
                sodium: Math.min(100, p.sodium + question.statReward.sodium)
              }
            : p
        );
        addLog(`🎉 ${activePlayer.name} ตอบคำถามถูกต้อง! ได้รับโบนัสสมดุล`);
      } else {
        addLog(`❌ ${activePlayer?.name} ตอบคำถามยังไม่ถูกต้อง`);
      }

      setPhase('CARD');
      syncOnline(updatedPlayers, currentPlayerIndex, 'CARD');
      return updatedPlayers;
    });
  };

  // ----------------------------------------------------
  // PHASE 4: USE CARD & PASS TURN (WITH 1-TURN COOLDOWN)
  // ----------------------------------------------------
  const handleUseCard = (cardType: 'adh' | 'aldosterone' | 'diuretic' | 'anp') => {
    if (!activePlayer || phase !== 'CARD') return;

    setPlayers((prevPlayers) => {
      let updatedPlayers = prevPlayers;

      if (cardType === 'adh' && activePlayer.adhCards > 0 && (activePlayer.adhCooldown || 0) <= 0) {
        updatedPlayers = prevPlayers.map((p) =>
          p.id === activePlayer.id
            ? { ...p, adhCards: p.adhCards - 1, adhCooldown: 1, hydration: Math.min(100, p.hydration + 20) }
            : p
        );
        addLog(`💧 ${activePlayer.name} ใช้ ADH (+20% Hydration / เพิ่มน้ำ) [⏳ คูลดาวน์ 1 ตา]`);
      } else if (cardType === 'diuretic' && (activePlayer.diureticCards || 0) > 0 && (activePlayer.diureticCooldown || 0) <= 0) {
        updatedPlayers = prevPlayers.map((p) =>
          p.id === activePlayer.id
            ? { ...p, diureticCards: (p.diureticCards || 0) - 1, diureticCooldown: 1, hydration: Math.max(0, p.hydration - 15) }
            : p
        );
        addLog(`💊 ${activePlayer.name} ใช้ยาขับปัสสาวะ Diuretic (-15% Hydration / ลดน้ำ) [⏳ คูลดาวน์ 1 ตา]`);
      } else if (cardType === 'aldosterone' && activePlayer.aldosteroneCards > 0 && (activePlayer.aldosteroneCooldown || 0) <= 0) {
        updatedPlayers = prevPlayers.map((p) =>
          p.id === activePlayer.id
            ? { ...p, aldosteroneCards: p.aldosteroneCards - 1, aldosteroneCooldown: 1, sodium: Math.min(100, p.sodium + 15) }
            : p
        );
        addLog(`🧂 ${activePlayer.name} ใช้ Aldosterone (+15% Sodium / เพิ่มเกลือ) [⏳ คูลดาวน์ 1 ตา]`);
      } else if (cardType === 'anp' && (activePlayer.anpCards || 0) > 0 && (activePlayer.anpCooldown || 0) <= 0) {
        updatedPlayers = prevPlayers.map((p) =>
          p.id === activePlayer.id
            ? { ...p, anpCards: (p.anpCards || 0) - 1, anpCooldown: 1, sodium: Math.max(0, p.sodium - 15) }
            : p
        );
        addLog(`🫀 ${activePlayer.name} ใช้ฮอร์โมน ANP (-15% Sodium / ลดเกลือ) [⏳ คูลดาวน์ 1 ตา]`);
      }

      syncOnline(updatedPlayers, currentPlayerIndex, 'CARD');
      return updatedPlayers;
    });
  };

  const handleNextTurn = useCallback(() => {
    if (winner) return;

    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    setIsMobileCardsOpen(false);

    // Metabolic consumption (-2,-2) and Cooldown decrement for players
    const updatedPlayers = players.map((p, idx) => {
      const isNext = idx === nextIndex;
      return {
        ...p,
        hydration: isNext ? Math.max(0, p.hydration - 2) : p.hydration,
        sodium: isNext ? Math.max(0, p.sodium - 2) : p.sodium,
        adhCooldown: isNext ? Math.max(0, (p.adhCooldown || 0) - 1) : p.adhCooldown,
        diureticCooldown: isNext ? Math.max(0, (p.diureticCooldown || 0) - 1) : p.diureticCooldown,
        aldosteroneCooldown: isNext ? Math.max(0, (p.aldosteroneCooldown || 0) - 1) : p.aldosteroneCooldown,
        anpCooldown: isNext ? Math.max(0, (p.anpCooldown || 0) - 1) : p.anpCooldown,
      };
    });
    setPlayers(updatedPlayers);

    // If full cycle completed, trigger Phase 1 Global Event
    if (nextIndex === 0) {
      triggerGlobalEvent(updatedPlayers, nextIndex);
    } else {
      setPhase('ROLL');
      syncOnline(updatedPlayers, nextIndex, 'ROLL');
    }

    const nextPlayerName = players[nextIndex]?.name || '';
    addLog(`➡️ ถึงตาของ ${nextPlayerName} (Metabolism: -2 💧 -2 🧂, คูลดาวน์ฟื้นฟูแล้ว)`);
  }, [currentPlayerIndex, players, winner, syncOnline]);

  // ----------------------------------------------------
  // GAME END / WINNER DETERMINATION
  // ----------------------------------------------------
  const handleFinishGame = (playerId: string) => {
    const playerWhoFinished = players.find((p) => p.id === playerId);
    if (!playerWhoFinished) return;

    // Calculate Homeostasis score: 100 - total deviation from 50%
    const hDiff = Math.abs(playerWhoFinished.hydration - 50);
    const nDiff = Math.abs(playerWhoFinished.sodium - 50);
    const finalScore = Math.max(0, 100 - (hDiff + nDiff));

    const updated = players.map((p) =>
      p.id === playerId ? { ...p, hasFinished: true, score: finalScore } : p
    );
    setPlayers(updated);
    setWinner({ ...playerWhoFinished, score: finalScore });
    setPhase('ENDED');
    addLog(`🏆 ${playerWhoFinished.name} เดินทางถึง Bladder! คะแนนสมดุล: ${finalScore}/100`);
    syncOnline(updated, currentPlayerIndex, 'ENDED');
  };

  // ----------------------------------------------------
  // BOT AUTOMATION TURN LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    if (!activePlayer || !activePlayer.isBot || winner || inLobby) return;

    if (phase === 'ROLL') {
      const timer = setTimeout(() => {
        handleRollDice(Math.floor(Math.random() * 6) + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (phase === 'CARD') {
      const timer = setTimeout(() => {
        // Smart Bot Logic: Adjust toward 50%
        if (activePlayer.hydration < 40 && activePlayer.adhCards > 0) {
          handleUseCard('adh');
        } else if (activePlayer.hydration > 60 && (activePlayer.diureticCards || 0) > 0) {
          handleUseCard('diuretic');
        } else if (activePlayer.sodium < 40 && activePlayer.aldosteroneCards > 0) {
          handleUseCard('aldosterone');
        } else if (activePlayer.sodium > 60 && (activePlayer.anpCards || 0) > 0) {
          handleUseCard('anp');
        }
        handleNextTurn();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [activePlayer, phase, winner, inLobby, handleNextTurn]);

  // If in Lobby, show room setup
  if (inLobby) {
    return <Lobby onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-36 lg:pb-8 w-full" style={{ background: 'var(--bg-page)', position: 'relative' }}>
      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(224,92,139,0.07) 0%, transparent 70%)' }} />

      {/* Navbar */}
      <Navbar
        roomCode={roomCode}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onRestart={async () => {
          if (isOnline && onlineRoomId && myPlayerId) {
            await leaveOnlineRoom(onlineRoomId, myPlayerId, false);
          }
          setInLobby(true);
        }}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
      />

      {/* Main Game Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 lg:p-5 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 items-start">

        {/* Board Area (cols 1-3) */}
        <div className="lg:col-span-3 space-y-3 sm:space-y-4 min-w-0">
          <GameBoard
            players={players}
            activePlayerId={activePlayer?.id || ''}
            tiles={dynamicBoard}
          />

          {/* Activity Log */}
          <div
            className="rounded-2xl p-3 sm:p-3.5"
            style={{
              background: 'rgba(255,255,255,0.72)',
              border: '1.5px solid rgba(45,27,14,0.12)',
              boxShadow: '2px 2px 0 rgba(45,27,14,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between mb-2 pb-2"
              style={{ borderBottom: '1.5px dashed rgba(255,107,53,0.2)' }}>
              <div className="flex items-center gap-2">
                <Scroll className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="font-retro text-[9px] sm:text-[10px] font-bold tracking-widest text-amber-950 truncate">
                  LIVE EVENT LOG (บันทึกเหตุการณ์)
                </span>
              </div>
              <button
                onClick={() => setIsMobileHudOpen(true)}
                className="lg:hidden flex items-center gap-1 font-retro text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200 shrink-0"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>ดู HUD</span>
              </button>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="font-retro text-[10px] shrink-0 text-orange-500">▸</span>
                  <span className="font-body text-xs leading-relaxed text-amber-950 break-words">{log}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="font-body text-xs italic text-amber-800/60">รอเกมเริ่มต้น...</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Desktop Sticky Scroll-Follow Panel) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 min-w-0">
          {/* Active Turn Banner */}
          {activePlayer && (
            <div
              className="rounded-2xl p-3.5 flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(224,92,139,0.08))',
                border: '2px solid rgba(255,107,53,0.35)',
                boxShadow: '3px 3px 0 rgba(255,107,53,0.2)',
              }}
            >
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-retro text-[9px] tracking-widest font-bold text-orange-600">
                    ▶ CURRENT TURN
                  </span>
                  {isOnline && (
                    <span className="font-retro text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                      ONLINE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-black shrink-0" style={{ background: activePlayer.color }} />
                  <span className="font-display font-extrabold text-sm text-slate-900 truncate max-w-[120px]">
                    {activePlayer.name} {activePlayer.id === myPlayerId ? '(คุณ)' : ''}
                  </span>
                </div>
              </div>
              <span
                className="font-retro text-[9px] font-bold px-2 py-1 rounded-lg bg-orange-500/10 text-orange-700 border border-orange-500/30 shrink-0"
              >
                {phase}
              </span>
            </div>
          )}

          {/* Dice Roller */}
          <DiceRoller
            onRollComplete={handleRollDice}
            disabled={phase !== 'ROLL' || !isMyTurn || Boolean(activePlayer?.isBot)}
            playerName={activePlayer?.name || 'Player'}
          />

          {/* Action Hormone Cards */}
          {activePlayer && (
            <ActionCards
              player={activePlayer}
              onUseCard={handleUseCard}
              onPassTurn={handleNextTurn}
              disabled={phase !== 'CARD' || !isMyTurn || Boolean(activePlayer?.isBot)}
            />
          )}

          {/* Player HUD List */}
          <PlayerHUD
            players={players}
            activePlayerId={activePlayer?.id || ''}
          />
        </div>
      </main>

      {/* ======================================================== */}
      {/* MOBILE RICH FLOATING CONTROL PANEL & QUICK ACTION DOCK   */}
      {/* ======================================================== */}
      {activePlayer && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-3 bg-white/95 backdrop-blur-xl border-t-2 border-amber-900/20 shadow-2xl space-y-1.5 max-w-full">

          {/* Top Mini HUD Status Bar */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {/* Active Player Status Card */}
            <div
              onClick={() => setIsMobileHudOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 flex-1 p-1.5 rounded-2xl bg-amber-500/10 border border-amber-900/15 cursor-pointer min-w-0"
            >
              <div
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0"
                style={{ background: activePlayer.color, border: '1.5px solid #2D1B0E' }}
              >
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-[11px] sm:text-xs text-slate-900 truncate">
                    {activePlayer.name} {activePlayer.id === myPlayerId ? '(คุณ)' : ''}
                  </span>
                  <span className="font-retro text-[8px] sm:text-[9px] font-bold text-orange-600 shrink-0 ml-1">
                    #{activePlayer.position || 1}
                  </span>
                </div>

                {/* Stat Progress Bars */}
                <div className="flex items-center gap-1.5 mt-0.5 font-retro text-[8px] sm:text-[9px]">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <Droplet className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500 shrink-0" />
                    <div className="flex-1 h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${activePlayer.hydration}%`,
                          background: activePlayer.hydration >= 40 && activePlayer.hydration <= 60 ? '#10B981' : '#3B82F6'
                        }}
                      />
                    </div>
                    <span className="font-bold text-blue-700">{activePlayer.hydration}%</span>
                  </div>

                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <Percent className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500 shrink-0" />
                    <div className="flex-1 h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${activePlayer.sodium}%`,
                          background: activePlayer.sodium >= 40 && activePlayer.sodium <= 60 ? '#10B981' : '#F97316'
                        }}
                      />
                    </div>
                    <span className="font-bold text-orange-700">{activePlayer.sodium}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Full HUD Button */}
            <button
              onClick={() => setIsMobileHudOpen(true)}
              className="p-1.5 sm:p-2 rounded-2xl bg-amber-100 text-amber-900 border border-amber-900/20 shadow-sm shrink-0"
              title="เปิด HUD ผู้เล่นทั้งหมด"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Action Button Area */}
          <div className="flex items-center gap-1.5">
            {/* PHASE 2: ROLL DICE */}
            {phase === 'ROLL' && (
              <button
                onClick={handleMobileDiceRoll}
                disabled={!isMyTurn || Boolean(activePlayer.isBot) || isMobileDiceRolling}
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl font-display font-extrabold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                style={{
                  background: !isMyTurn
                    ? 'rgba(150,150,150,0.8)'
                    : 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                  border: '2px solid #2D1B0E',
                  boxShadow: '2px 2px 0 #2D1B0E'
                }}
              >
                <Dices className={`w-4 h-4 sm:w-5 sm:h-5 ${isMobileDiceRolling ? 'animate-spin' : ''}`} />
                <span className="truncate">
                  {isMobileDiceRolling
                    ? `กำลังทอย... (${mobileDiceValue})`
                    : !isMyTurn
                    ? `รอตาของ ${activePlayer.name}...`
                    : `ทอยลูกเต๋า (${activePlayer.name})`}
                </span>
              </button>
            )}

            {/* PHASE 4: ACTION CARDS & PASS TURN */}
            {phase === 'CARD' && (
              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={() => setIsMobileCardsOpen(!isMobileCardsOpen)}
                  className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl font-display font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 bg-amber-500/15 text-amber-950 border-2 border-amber-900/20 truncate"
                >
                  <span className="truncate">💊 การ์ดฮอร์โมน (ADH/Aldo/ยาขับ)</span>
                  <ChevronUp className={`w-3.5 h-3.5 shrink-0 transition-transform ${isMobileCardsOpen ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={handleNextTurn}
                  disabled={!isMyTurn}
                  className="py-2 sm:py-2.5 px-3 rounded-xl font-display font-bold text-[11px] sm:text-xs text-white bg-emerald-600 border-2 border-emerald-900 shadow-sm shrink-0"
                >
                  ✓ จบตา
                </button>
              </div>
            )}

            {/* PHASE 1: EVENT */}
            {phase === 'EVENT' && (
              <button
                onClick={handleConfirmEvent}
                className="w-full py-2 sm:py-2.5 px-3 rounded-2xl font-display font-bold text-xs text-white bg-amber-500 border-2 border-amber-900 shadow-md truncate"
              >
                รับทราบ Event ประจำรอบ
              </button>
            )}

            {/* PHASE 3: ACTION */}
            {phase === 'ACTION' && (
              <div className="w-full p-2 rounded-xl bg-orange-100 border border-orange-300 text-center font-retro text-[10px] sm:text-xs font-bold text-orange-900 animate-pulse truncate">
                ⚡ กำลังประมวลผลผลลัพธ์ประจำช่อง...
              </div>
            )}
          </div>

          {/* Expandable Mobile 4-Card Drawer */}
          <AnimatePresence>
            {isMobileCardsOpen && phase === 'CARD' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-amber-900/15"
              >
                {/* 1. ADH (+ Water) */}
                {(() => {
                  const isCooling = (activePlayer.adhCooldown || 0) > 0;
                  const canUse = isMyTurn && activePlayer.adhCards > 0 && !isCooling;
                  return (
                    <button
                      onClick={() => handleUseCard('adh')}
                      disabled={!canUse}
                      className={`p-1.5 sm:p-2 rounded-xl text-left bg-blue-50 border-2 border-blue-300 transition-all ${
                        !canUse ? 'grayscale opacity-40 cursor-not-allowed' : 'active:scale-95'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-display font-bold text-[10px] sm:text-[11px] text-blue-900 flex items-center gap-1 truncate">
                          <Droplet className="w-3 h-3 text-blue-600 shrink-0" /> ADH
                        </span>
                        <span className="font-retro text-[8px] font-bold px-1 py-0.2 rounded bg-blue-200 text-blue-800 shrink-0">
                          {isCooling ? `⏳${activePlayer.adhCooldown}` : `×${activePlayer.adhCards}`}
                        </span>
                      </div>
                      <p className="font-body text-[9px] text-blue-950 font-bold flex items-center gap-0.5">
                        <ArrowUp className="w-2.5 h-2.5 text-blue-600" /> +20% น้ำ
                      </p>
                    </button>
                  );
                })()}

                {/* 2. Diuretic (- Water) */}
                {(() => {
                  const isCooling = (activePlayer.diureticCooldown || 0) > 0;
                  const canUse = isMyTurn && (activePlayer.diureticCards || 0) > 0 && !isCooling;
                  return (
                    <button
                      onClick={() => handleUseCard('diuretic')}
                      disabled={!canUse}
                      className={`p-1.5 sm:p-2 rounded-xl text-left bg-cyan-50 border-2 border-cyan-300 transition-all ${
                        !canUse ? 'grayscale opacity-40 cursor-not-allowed' : 'active:scale-95'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-display font-bold text-[10px] sm:text-[11px] text-cyan-900 flex items-center gap-1 truncate">
                          <Pill className="w-3 h-3 text-cyan-600 shrink-0" /> Diuretic
                        </span>
                        <span className="font-retro text-[8px] font-bold px-1 py-0.2 rounded bg-cyan-200 text-cyan-800 shrink-0">
                          {isCooling ? `⏳${activePlayer.diureticCooldown}` : `×${activePlayer.diureticCards || 0}`}
                        </span>
                      </div>
                      <p className="font-body text-[9px] text-cyan-950 font-bold flex items-center gap-0.5">
                        <ArrowDown className="w-2.5 h-2.5 text-cyan-600" /> -15% น้ำ
                      </p>
                    </button>
                  );
                })()}

                {/* 3. Aldosterone (+ Salt) */}
                {(() => {
                  const isCooling = (activePlayer.aldosteroneCooldown || 0) > 0;
                  const canUse = isMyTurn && activePlayer.aldosteroneCards > 0 && !isCooling;
                  return (
                    <button
                      onClick={() => handleUseCard('aldosterone')}
                      disabled={!canUse}
                      className={`p-1.5 sm:p-2 rounded-xl text-left bg-orange-50 border-2 border-orange-300 transition-all ${
                        !canUse ? 'grayscale opacity-40 cursor-not-allowed' : 'active:scale-95'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-display font-bold text-[10px] sm:text-[11px] text-orange-900 flex items-center gap-1 truncate">
                          <Percent className="w-3 h-3 text-orange-600 shrink-0" /> Aldo
                        </span>
                        <span className="font-retro text-[8px] font-bold px-1 py-0.2 rounded bg-orange-200 text-orange-800 shrink-0">
                          {isCooling ? `⏳${activePlayer.aldosteroneCooldown}` : `×${activePlayer.aldosteroneCards}`}
                        </span>
                      </div>
                      <p className="font-body text-[9px] text-orange-950 font-bold flex items-center gap-0.5">
                        <ArrowUp className="w-2.5 h-2.5 text-orange-600" /> +15% เกลือ
                      </p>
                    </button>
                  );
                })()}

                {/* 4. ANP (- Salt) */}
                {(() => {
                  const isCooling = (activePlayer.anpCooldown || 0) > 0;
                  const canUse = isMyTurn && (activePlayer.anpCards || 0) > 0 && !isCooling;
                  return (
                    <button
                      onClick={() => handleUseCard('anp')}
                      disabled={!canUse}
                      className={`p-1.5 sm:p-2 rounded-xl text-left bg-rose-50 border-2 border-rose-300 transition-all ${
                        !canUse ? 'grayscale opacity-40 cursor-not-allowed' : 'active:scale-95'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-display font-bold text-[10px] sm:text-[11px] text-rose-900 flex items-center gap-1 truncate">
                          <Heart className="w-3 h-3 text-rose-600 shrink-0" /> ANP
                        </span>
                        <span className="font-retro text-[8px] font-bold px-1 py-0.2 rounded bg-rose-200 text-rose-800 shrink-0">
                          {isCooling ? `⏳${activePlayer.anpCooldown}` : `×${activePlayer.anpCards || 0}`}
                        </span>
                      </div>
                      <p className="font-body text-[9px] text-rose-950 font-bold flex items-center gap-0.5">
                        <ArrowDown className="w-2.5 h-2.5 text-rose-600" /> -15% เกลือ
                      </p>
                    </button>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* MOBILE FULL PLAYER HUD MODAL */}
      {isMobileHudOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 modal-overlay cursor-pointer"
          onClick={() => setIsMobileHudOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-3xl p-4 sm:p-5 space-y-3 max-h-[85vh] overflow-y-auto animate-pop-in cursor-default"
            style={{
              background: 'rgba(255,252,248,0.98)',
              border: '2px solid #2D1B0E',
              boxShadow: '6px 6px 0 #2D1B0E'
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/20">
              <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>PLAYER HOMEOSTASIS HUD</span>
              </h3>
              <button
                onClick={() => setIsMobileHudOpen(false)}
                className="p-1 rounded-lg bg-rose-100 text-rose-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <PlayerHUD
              players={players}
              activePlayerId={activePlayer?.id || ''}
            />

            <button
              onClick={() => setIsMobileHudOpen(false)}
              className="w-full py-2.5 rounded-xl font-display font-bold text-xs text-white bg-amber-600 shadow-md"
            >
              กลับสู่กระดาน (Back to Board)
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <GlobalEventModal event={currentEvent} onConfirm={handleConfirmEvent} />
      <QuizModal question={currentQuiz} onAnswer={handleQuizAnswer} />
      <GameOverModal winner={winner} players={players} onPlayAgain={() => setInLobby(true)} />
    </div>
  );
};

export default App;
