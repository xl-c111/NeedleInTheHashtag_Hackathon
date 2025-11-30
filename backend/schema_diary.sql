-- Diary Entries Table for been there
-- This table stores private journal entries written by users

CREATE TABLE IF NOT EXISTS diary_entries (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to auth.users
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Entry content
  title TEXT NOT NULL DEFAULT 'Untitled Entry',
  content TEXT NOT NULL,

  -- Optional mood tracking
  mood TEXT CHECK (mood IN ('happy', 'calm', 'sad', 'anxious', 'frustrated', 'reflective')),

  -- Privacy flag
  is_private BOOLEAN NOT NULL DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON diary_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diary_entries_mood ON diary_entries(mood) WHERE mood IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own entries
CREATE POLICY "Users can view their own diary entries"
  ON diary_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert their own entries
CREATE POLICY "Users can create their own diary entries"
  ON diary_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can only update their own entries
CREATE POLICY "Users can update their own diary entries"
  ON diary_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can only delete their own entries
CREATE POLICY "Users can delete their own diary entries"
  ON diary_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_diary_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update function
CREATE TRIGGER diary_entries_updated_at_trigger
  BEFORE UPDATE ON diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_diary_entries_updated_at();

-- Optional: Add a comment to the table
COMMENT ON TABLE diary_entries IS 'Private journal entries written by users for personal reflection';
COMMENT ON COLUMN diary_entries.user_id IS 'Reference to the user who created this entry';
COMMENT ON COLUMN diary_entries.title IS 'Title of the journal entry (defaults to "Untitled Entry")';
COMMENT ON COLUMN diary_entries.content IS 'Main content/body of the journal entry';
COMMENT ON COLUMN diary_entries.mood IS 'Optional mood tag for the entry';
COMMENT ON COLUMN diary_entries.is_private IS 'Whether this entry is private (true) or can be shared (false)';
