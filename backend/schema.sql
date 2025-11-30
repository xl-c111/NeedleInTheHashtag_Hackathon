-- ============================================================================
-- Supabase Database Schema for Incel Support Platform
-- ============================================================================
-- This schema stores posts from r/IncelExit and similar communities
-- to help people who are struggling with incel ideology find support
-- ============================================================================

-- ============================================================================
-- TABLES
-- ============================================================================

-- Posts table: Stores supportive posts and comments from the community
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,                          -- Reddit user ID
  content TEXT NOT NULL,                          -- Post/comment content
  post_id TEXT,                                   -- Reddit post ID (if applicable)
  comment_id TEXT,                                -- Reddit comment ID (if applicable)
  topic_tags TEXT[],                              -- Topic categories (e.g., "Mental health history")
  timestamp TIMESTAMP WITH TIME ZONE,             -- Original post timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- When added to our database
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- GIN index for fast array searches on topic_tags
-- Enables efficient filtering like: WHERE topic_tags @> ARRAY['Mental health history']
CREATE INDEX IF NOT EXISTS idx_posts_topic_tags ON posts USING GIN (topic_tags);

-- Index for sorting posts by timestamp (newest first)
CREATE INDEX IF NOT EXISTS idx_posts_timestamp ON posts (timestamp DESC);

-- Index for filtering posts by user_id
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read posts (no authentication required for demo)
CREATE POLICY IF NOT EXISTS "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- Future enhancements:
-- 1. Add users table for authentication
-- 2. Add journal_entries table for private user posts
-- 3. Add chat_sessions and chat_messages tables for AI chat
-- 4. Add resource_matches table to link similar posts
-- 5. Add user progress tracking (growth_score, etc.)
--
-- To apply this schema:
--   1. Go to Supabase Dashboard → SQL Editor
--   2. Copy and paste this entire file
--   3. Click "Run"
--
-- ============================================================================
