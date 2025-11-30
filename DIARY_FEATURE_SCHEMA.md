# Diary/Write Feature - Supabase Schema Requirements

## Overview
The diary feature allows users to write private journal entries with mood tracking. Users must be authenticated (including anonymous sign-in) to create and view their entries.

## Pages Created
1. **`/write`** - Create new diary entries
2. **`/diary`** - View all user's diary entries

## Supabase Table Required

### Table Name: `diary_entries`

Run the SQL script in `backend/schema_diary.sql` to create this table.

#### Columns:

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

#### Indexes:
- `idx_diary_entries_user_id` - Fast user queries
- `idx_diary_entries_created_at` - Chronological sorting
- `idx_diary_entries_mood` - Mood filtering

#### Row Level Security (RLS):
✅ RLS is ENABLED with the following policies:
- Users can only **view** their own entries
- Users can only **create** entries for themselves
- Users can only **update** their own entries
- Users can only **delete** their own entries

#### Automatic Triggers:
- `updated_at` is automatically updated on every UPDATE

## Frontend API Integration Needed

Once the table is created, update these files:

### 1. `/write` page - Save Entry
File: `frontend/app/write/page.tsx`

Replace line ~40 (the TODO comment) with:
```typescript
const { error } = await createClient()
  .from('diary_entries')
  .insert([entry])

if (error) throw error
```

### 2. `/diary` page - Fetch Entries
File: `frontend/app/diary/page.tsx`

Replace line ~50 (the TODO comment) with:
```typescript
const { data, error } = await createClient()
  .from('diary_entries')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })

if (error) throw error
setEntries(data || [])
```

### 3. `/diary` page - Delete Entry
File: `frontend/app/diary/page.tsx`

Replace line ~72 (the TODO comment) with:
```typescript
const { error } = await createClient()
  .from('diary_entries')
  .delete()
  .eq('id', id)
  .eq('user_id', user!.id)

if (error) throw error
```

## Testing Checklist

After creating the table:

- [ ] User can sign in anonymously
- [ ] User can create a new diary entry at `/write`
- [ ] Entry appears in `/diary` list
- [ ] User can filter by mood
- [ ] User can delete their own entries
- [ ] User CANNOT see entries from other users (RLS working)
- [ ] `updated_at` updates automatically on edits

## Mood Options

The following moods are available:
- 😊 Happy
- 😌 Calm
- 😔 Sad
- 😰 Anxious
- 😤 Frustrated
- 🤔 Reflective

## Future Enhancements

Potential additions (not required for MVP):
- Edit existing entries
- Search/filter by content
- Export entries
- Share entries anonymously as mentor stories (convert `is_private` to false)
- Tags/categories beyond mood
- Attachment support (images, voice notes)
