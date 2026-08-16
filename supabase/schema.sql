-- ========================================================
-- Osmosis Ops - Supabase Database Schema
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting', -- 'waiting', 'playing', 'finished'
  current_player_index INT DEFAULT 0,
  phase VARCHAR(20) DEFAULT 'EVENT', -- 'EVENT', 'ROLL', 'ACTION', 'CARD', 'ENDED'
  current_global_event JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Game State / Players Table
CREATE TABLE IF NOT EXISTS game_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_id VARCHAR(100) NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(30) NOT NULL DEFAULT '#3b82f6',
  position INT DEFAULT 1, -- Tiles 1 to 40
  hydration INT DEFAULT 50, -- 0 to 100 (Homeostasis: 40-60)
  sodium INT DEFAULT 50, -- 0 to 100 (Homeostasis: 40-60)
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

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_game_state_room ON game_state(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

-- Permissive policies for public demo game access
CREATE POLICY "Allow public all rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all game_state" ON game_state FOR ALL USING (true) WITH CHECK (true);

-- Enable Supabase Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;
