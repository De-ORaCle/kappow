-- Supabase Database Schema for Kapoww Quiz Platform

-- 1. Quizzes Table (Questions)
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings: ["Option A", "Option B", ...]
  correct_answer_index INTEGER NOT NULL,
  points INTEGER DEFAULT 1000,
  time_limit INTEGER DEFAULT 20,
  category TEXT DEFAULT 'General',
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Game Sessions Table (Real-time Sync)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- e.g. "KAPOWW"
  host_id TEXT NOT NULL,
  current_question_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'lobby', -- 'lobby', 'playing', 'results'
  question_ids JSONB DEFAULT '[]'::jsonb, -- Array of UUIDs for the selected questions
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for game_sessions
ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;

-- 3. Players Table (Users in a Session)
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL, -- The ID generated in React state
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  is_host BOOLEAN DEFAULT false,
  last_answer_correct BOOLEAN,
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for players (to see them join the lobby)
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- 4. Leaderboard Table (Persistent High Scores)
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  played_at TIMESTAMPTZ DEFAULT now()
);

-- Migration hint:
-- ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium';
-- ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS question_ids JSONB DEFAULT '[]'::jsonb;
