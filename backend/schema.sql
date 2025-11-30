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
-- MENTOR STORIES TABLE
-- ============================================================================

-- Mentor stories: Recovery stories from men who have overcome challenges
CREATE TABLE IF NOT EXISTS mentor_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,                            -- Story title
  author TEXT NOT NULL,                           -- Author name and age (e.g., "Marcus, 24")
  excerpt TEXT NOT NULL,                          -- Short summary for cards
  content TEXT NOT NULL,                          -- Full story content
  tags TEXT[],                                    -- Story tags (e.g., "mindset shift", "self-reflection")
  themes TEXT[],                                  -- Theme categories for filtering
  read_time INTEGER DEFAULT 3,                    -- Estimated read time in minutes
  date_posted DATE DEFAULT CURRENT_DATE,          -- When the story was posted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast array searches on themes
CREATE INDEX IF NOT EXISTS idx_mentor_stories_themes ON mentor_stories USING GIN (themes);

-- Index for sorting by date
CREATE INDEX IF NOT EXISTS idx_mentor_stories_date ON mentor_stories (date_posted DESC);

-- Enable RLS on mentor_stories table
ALTER TABLE mentor_stories ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read mentor stories (public for demo)
CREATE POLICY IF NOT EXISTS "Mentor stories are viewable by everyone"
  ON mentor_stories FOR SELECT
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
