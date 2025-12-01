-- User Favorites Table for Village
-- This table stores which posts users have favorited/liked

CREATE TABLE IF NOT EXISTS user_favorites (
  -- Composite primary key (user_id + post_id)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, post_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_post_id ON user_favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policy: Anyone can count favorites for a post
CREATE POLICY "Anyone can count favorites"
  ON user_favorites
  FOR SELECT
  USING (true);

-- Comments
COMMENT ON TABLE user_favorites IS 'Tracks which posts users have favorited';
COMMENT ON COLUMN user_favorites.user_id IS 'User who favorited the post';
COMMENT ON COLUMN user_favorites.post_id IS 'Post that was favorited';
