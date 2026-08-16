import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Player, Phase, GlobalEvent } from '../types/game';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// ========================================================
// Helper to safely Insert or Update player in game_state
// (Does not rely on ON CONFLICT constraint in PostgreSQL)
// ========================================================
export async function savePlayerRecord(roomId: string, player: Player) {
  if (!supabase) return { error: 'Supabase is not configured' };

  try {
    const { data: existing } = await supabase
      .from('game_state')
      .select('id')
      .eq('room_id', roomId)
      .eq('player_id', player.id)
      .maybeSingle();

    const payload = {
      room_id: roomId,
      player_id: player.id,
      name: player.name,
      color: player.color,
      position: player.position || 1,
      hydration: typeof player.hydration === 'number' ? player.hydration : 50,
      sodium: typeof player.sodium === 'number' ? player.sodium : 50,
      adh_cards: typeof player.adhCards === 'number' ? player.adhCards : 1,
      aldosterone_cards: typeof player.aldosteroneCards === 'number' ? player.aldosteroneCards : 1,
      diuretic_cards: typeof player.diureticCards === 'number' ? player.diureticCards : 1,
      anp_cards: typeof player.anpCards === 'number' ? player.anpCards : 1,
      is_ready: player.isReady ?? true,
      is_bot: player.isBot ?? false
    };

    if (existing && existing.id) {
      const { error: updateErr } = await supabase
        .from('game_state')
        .update(payload)
        .eq('id', existing.id);
      if (updateErr) return { error: updateErr.message };
    } else {
      const { error: insertErr } = await supabase
        .from('game_state')
        .insert(payload);
      if (insertErr) return { error: insertErr.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || 'Failed to save player' };
  }
}

// ========================================================
// Room Creation & Joining
// ========================================================
export async function createOnlineRoom(roomCode: string, hostPlayer: Player) {
  if (!supabase) return { error: 'Supabase is not configured' };

  try {
    const cleanCode = roomCode.toUpperCase().trim();

    // 1. Insert room into rooms table
    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .insert({
        code: cleanCode,
        status: 'waiting',
        current_player_index: 0,
        phase: 'EVENT'
      })
      .select()
      .single();

    if (roomErr) {
      console.error('Error creating Supabase room:', roomErr);
      return { error: roomErr.message };
    }

    // 2. Insert host player into game_state
    const playerRes = await savePlayerRecord(room.id, hostPlayer);
    if (playerRes.error) {
      return { error: playerRes.error };
    }

    return { room };
  } catch (err: any) {
    return { error: err?.message || 'Failed to connect to Supabase' };
  }
}

export async function joinOnlineRoom(roomCode: string, joiningPlayer: Player) {
  if (!supabase) return { error: 'Supabase is not configured' };

  try {
    const cleanCode = roomCode.toUpperCase().trim();

    // 1. Find room by code
    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select()
      .eq('code', cleanCode)
      .single();

    if (roomErr || !room) {
      return { error: `ไม่พบห้องรหัส "${cleanCode}" กรุณาตรวจสอบอีกครั้ง` };
    }

    // 2. Insert or update joining player
    const playerRes = await savePlayerRecord(room.id, joiningPlayer);
    if (playerRes.error) {
      return { error: playerRes.error };
    }

    return { room };
  } catch (err: any) {
    return { error: err?.message || 'Failed to join online room' };
  }
}

export async function fetchRoomPlayers(roomId: string): Promise<Player[]> {
  if (!supabase || !roomId) return [];

  try {
    const { data, error } = await supabase
      .from('game_state')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.player_id,
      name: d.name,
      color: d.color,
      position: d.position || 1,
      hydration: typeof d.hydration === 'number' ? d.hydration : 50,
      sodium: typeof d.sodium === 'number' ? d.sodium : 50,
      adhCards: typeof d.adh_cards === 'number' ? d.adh_cards : 1,
      aldosteroneCards: typeof d.aldosterone_cards === 'number' ? d.aldosterone_cards : 1,
      diureticCards: typeof d.diuretic_cards === 'number' ? d.diuretic_cards : 1,
      anpCards: typeof d.anp_cards === 'number' ? d.anp_cards : 1,
      isReady: d.is_ready ?? true,
      isBot: d.is_bot ?? false,
      score: d.score,
    }));
  } catch {
    return [];
  }
}

export async function startOnlineGame(roomId: string) {
  if (!supabase || !roomId) return;
  await supabase
    .from('rooms')
    .update({ status: 'playing', phase: 'EVENT' })
    .eq('id', roomId);
}

export async function updateOnlineGameState(
  roomId: string,
  players: Player[],
  currentPlayerIndex: number,
  phase: Phase,
  currentEvent: GlobalEvent | null
) {
  if (!supabase || !roomId) return;

  try {
    // 1. Update room state
    await supabase
      .from('rooms')
      .update({
        current_player_index: currentPlayerIndex,
        phase,
        current_global_event: currentEvent
      })
      .eq('id', roomId);

    // 2. Sync individual player states safely
    for (const p of players) {
      await savePlayerRecord(roomId, p);
    }
  } catch (err) {
    console.error('Error syncing online game state:', err);
  }
}

// ========================================================
// Leave & Delete Room Cleanup Services
// ========================================================
export async function leaveOnlineRoom(roomId: string, playerId: string, isHost = false) {
  if (!supabase || !roomId) return;

  try {
    // 1. Delete this player from game_state
    await supabase
      .from('game_state')
      .delete()
      .eq('room_id', roomId)
      .eq('player_id', playerId);

    // 2. Check remaining players count in this room
    const { data: remaining } = await supabase
      .from('game_state')
      .select('id')
      .eq('room_id', roomId);

    // If host left before game started or room has 0 players, delete the entire room
    if (isHost || !remaining || remaining.length === 0) {
      await deleteOnlineRoom(roomId);
    }
  } catch (err) {
    console.error('Error leaving online room:', err);
  }
}

export async function deleteOnlineRoom(roomId: string) {
  if (!supabase || !roomId) return;

  try {
    // Delete game_state rows first
    await supabase.from('game_state').delete().eq('room_id', roomId);
    // Delete rooms row
    await supabase.from('rooms').delete().eq('id', roomId);
  } catch (err) {
    console.error('Error deleting online room:', err);
  }
}
