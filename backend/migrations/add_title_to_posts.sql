-- Migration: Add title column to posts table
-- Date: 2025-12-03
-- Purpose: Add title field for Reddit-style post titles

-- Add title column (nullable initially to allow migration)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS title TEXT;

-- Add comment
COMMENT ON COLUMN posts.title IS 'Title/headline for the post (similar to Reddit post titles)';

-- Update schema_posts.sql for future deployments
-- After running this migration, update schema_posts.sql to include:
-- title TEXT,
