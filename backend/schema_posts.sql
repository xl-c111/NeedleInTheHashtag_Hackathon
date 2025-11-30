-- Posts Table for Village
-- This table stores user-generated posts/stories shared in the community

CREATE TABLE IF NOT EXISTS posts (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to auth.users
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Post content
  content TEXT NOT NULL,

  -- Optional parent post (for threading/comments)
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES posts(id) ON DELETE CASCADE,

  -- Topic categorization
  topic_tags TEXT[],

  -- Timestamps
  timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_topic_tags ON posts USING GIN(topic_tags);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can view posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts
  FOR SELECT
  USING (true);

-- RLS Policy: Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE posts IS 'User-generated posts and stories shared in the community';
COMMENT ON COLUMN posts.user_id IS 'User who created this post';
COMMENT ON COLUMN posts.content IS 'Main content of the post';
COMMENT ON COLUMN posts.topic_tags IS 'Array of topic tags for categorization';
COMMENT ON COLUMN posts.post_id IS 'Parent post ID if this is a reply';
COMMENT ON COLUMN posts.comment_id IS 'Parent comment ID if this is a nested reply';
