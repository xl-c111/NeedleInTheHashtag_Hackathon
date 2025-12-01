# Database Schema - Been There

## Overview
Been There uses Supabase (PostgreSQL) with Row Level Security (RLS) for data storage. This document consolidates all database schemas and integration requirements.

---

## Table of Contents
1. [Profiles Table](#profiles-table)
2. [Posts Table](#posts-table)
3. [Diary Entries Table](#diary-entries-table)
4. [User Favorites Table](#user-favorites-table-new)
5. [Deployment Instructions](#deployment-instructions)

---

## Profiles Table

**Purpose**: Store user profile information (username, avatar) linked to Supabase auth.users

**SQL File**: [`backend/schema_profiles.sql`](../backend/schema_profiles.sql)

### Schema

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key, links to auth.users | `PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE` |
| `username` | TEXT | Unique username | `UNIQUE NOT NULL` |
| `avatar_url` | TEXT | Avatar emoji or image URL | Optional |
| `created_at` | TIMESTAMPTZ | Profile creation timestamp | `NOT NULL DEFAULT NOW()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | `NOT NULL DEFAULT NOW()` |

### Indexes
- `idx_profiles_username` - Fast username lookups

### Row Level Security (RLS)
✅ **Enabled**
- **SELECT**: Everyone can view profiles (public)
- **INSERT**: Users can only create their own profile
- **UPDATE**: Users can only update their own profile

### Automatic Features
- **Auto-create profile on signup**: Trigger creates profile when user registers
- **Auto-update timestamp**: `updated_at` updates on every change
- **Default avatar**: 👤 emoji if none provided
- **Default username**: `user_[id]` if none provided

---

## Posts Table

**Purpose**: Store user-generated posts/stories shared in the community (mentor stories)

**SQL File**: [`backend/schema_posts.sql`](../backend/schema_posts.sql)

### Schema

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `PRIMARY KEY DEFAULT gen_random_uuid()` |
| `user_id` | UUID | User who created post | `NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE` |
| `content` | TEXT | Main content of the post | `NOT NULL` |
| `post_id` | UUID | Parent post (for threading/comments) | `REFERENCES posts(id) ON DELETE CASCADE` |
| `comment_id` | UUID | Parent comment (nested replies) | `REFERENCES posts(id) ON DELETE CASCADE` |
| `topic_tags` | TEXT[] | Array of topic tags | Optional |
| `timestamp` | TIMESTAMPTZ | Original post timestamp | Optional |
| `created_at` | TIMESTAMPTZ | Creation timestamp in our system | `NOT NULL DEFAULT NOW()` |

### Indexes
- `idx_posts_user_id` - Fast user queries
- `idx_posts_created_at` - Chronological sorting
- `idx_posts_topic_tags` - GIN index for array tag searches

### Row Level Security (RLS)
✅ **Enabled**
- **SELECT**: Everyone can view posts (public stories)
- **INSERT**: Authenticated users can create posts
- **UPDATE**: Users can only update their own posts
- **DELETE**: Users can only delete their own posts

### Frontend Integration
See `frontend/lib/supabase.ts`:
- `fetchMentorStories()` - Fetch all posts
- `fetchMentorStoryById(id)` - Fetch single post
- `fetchStoriesByThemes(themes)` - Filter by topic_tags

---

## Diary Entries Table

**Purpose**: Private journal entries for personal reflection and mood tracking

**SQL File**: [`backend/schema_diary.sql`](../backend/schema_diary.sql)

### Schema

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `PRIMARY KEY DEFAULT gen_random_uuid()` |
| `user_id` | UUID | User who created entry | `NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE` |
| `title` | TEXT | Entry title | `NOT NULL DEFAULT 'Untitled Entry'` |
| `content` | TEXT | Entry content/body | `NOT NULL` |
| `mood` | TEXT | Optional mood tag | `CHECK (mood IN ('happy', 'calm', 'sad', 'anxious', 'frustrated', 'reflective'))` |
| `is_private` | BOOLEAN | Privacy flag | `NOT NULL DEFAULT true` |
| `created_at` | TIMESTAMPTZ | Creation timestamp | `NOT NULL DEFAULT NOW()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | `NOT NULL DEFAULT NOW()` |

### Indexes
- `idx_diary_entries_user_id` - Fast user queries
- `idx_diary_entries_created_at` - Chronological sorting
- `idx_diary_entries_mood` - Mood filtering

### Row Level Security (RLS)
✅ **Enabled** - **Strict Privacy**
- **SELECT**: Users can ONLY view their own entries
- **INSERT**: Users can ONLY create entries for themselves
- **UPDATE**: Users can ONLY update their own entries
- **DELETE**: Users can ONLY delete their own entries

### Automatic Features
- **Auto-update timestamp**: `updated_at` updates on every change

### Mood Options
- 😊 `happy`
- 😌 `calm`
- 😔 `sad`
- 😰 `anxious`
- 😤 `frustrated`
- 🤔 `reflective`

### Frontend Integration (TODO - IN PROGRESS)

**Status**: ⚠️ Pages exist but use mock data

**Required Functions** (add to `frontend/lib/supabase.ts`):
```typescript
export async function saveDiaryEntry(entry: {
  user_id: string;
  title: string;
  content: string;
  mood?: string;
}) {
  const { data, error } = await createClient()
    .from('diary_entries')
    .insert([entry])
    .select()

  if (error) throw error
  return data
}

export async function fetchUserDiaryEntries(userId: string) {
  const { data, error } = await createClient()
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function deleteDiaryEntry(id: string, userId: string) {
  const { error } = await createClient()
    .from('diary_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}
```

**Pages to Update**:
1. `frontend/app/write/page.tsx:47` - Replace mock setTimeout with `saveDiaryEntry()`
2. `frontend/app/diary/page.tsx:49` - Replace mock data with `fetchUserDiaryEntries()`
3. `frontend/app/diary/page.tsx:89` - Replace mock delete with `deleteDiaryEntry()`

---

## User Favorites Table (NEW)

**Purpose**: Track which stories users have liked/favorited

**Status**: ⚠️ **NOT YET CREATED** - Required for Demo Step 4

### Schema

```sql
CREATE TABLE IF NOT EXISTS user_favorites (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate favorites
  UNIQUE(user_id, post_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_post_id ON user_favorites(post_id);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### Frontend Integration (TODO)

**Required Functions** (add to `frontend/lib/supabase.ts`):
```typescript
export async function toggleFavorite(userId: string, postId: string) {
  // Check if already favorited
  const { data: existing } = await createClient()
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single()

  if (existing) {
    // Remove favorite
    const { error } = await createClient()
      .from('user_favorites')
      .delete()
      .eq('id', existing.id)
    if (error) throw error
    return { favorited: false }
  } else {
    // Add favorite
    const { error } = await createClient()
      .from('user_favorites')
      .insert([{ user_id: userId, post_id: postId }])
    if (error) throw error
    return { favorited: true }
  }
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await createClient()
    .from('user_favorites')
    .select('post_id')
    .eq('user_id', userId)

  if (error) throw error
  return data?.map(f => f.post_id) || []
}

export async function getFavoriteCount(postId: string) {
  const { count, error } = await createClient()
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (error) throw error
  return count || 0
}
```

**Component to Update**:
- `frontend/components/Stories/StoryCard.tsx` - Add heart icon with `toggleFavorite()` handler

---

## Deployment Instructions

### Prerequisites
1. Supabase project created
2. Environment variables configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY` (backend only)

### Deployment Order

Run SQL scripts in Supabase SQL Editor in this order:

1. **Profiles** (depends on: auth.users)
   ```bash
   # Run: backend/schema_profiles.sql
   ```

2. **Posts** (depends on: auth.users, profiles)
   ```bash
   # Run: backend/schema_posts.sql
   ```

3. **Diary Entries** (depends on: auth.users)
   ```bash
   # Run: backend/schema_diary.sql
   ```

4. **User Favorites** (NEW - depends on: auth.users, posts)
   ```bash
   # Create table using SQL above
   ```

### Verification Checklist

After deployment, verify:
- [ ] All tables created successfully
- [ ] RLS policies are enabled on all tables
- [ ] Indexes created successfully
- [ ] Triggers working (profiles auto-create, timestamps auto-update)
- [ ] Test with authenticated user (can CRUD own data)
- [ ] Test with different user (cannot access other user's data)

### Seed Data

**Posts Table** - Upload mentor stories:
```bash
# Use Supabase dashboard or run:
python backend/scripts/fetch_supabase_posts.py
```

Expected seed data source: `data/seed/posts.json`

---

## Future Enhancements

Potential additions (not required for MVP):
- **Mood tracking table** - Separate mood logs with timestamps
- **Story interactions table** - Track views, shares, helps
- **User tags table** - User-selected interest tags for matching
- **Comments table** - Replies to mentor stories (if enabling discussion)
- **Reports table** - Content moderation/reporting system

---

## References

- **Original Diary Schema Doc**: `DIARY_FEATURE_SCHEMA.md` (moved to this file)
- **SQL Files**: `backend/schema_*.sql`
- **Frontend Integration**: `frontend/lib/supabase.ts`
- **Supabase Docs**: https://supabase.com/docs/guides/database
