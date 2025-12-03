# Database Migrations

## Adding Titles to Posts

### Overview
This migration adds a `title` field to the posts table and generates AI-powered Reddit-style titles for all existing posts.

### Steps to Run Migration

#### 1. Add Title Column to Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Add title column (nullable initially to allow migration)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS title TEXT;

-- Add comment
COMMENT ON COLUMN posts.title IS 'Title/headline for the post (similar to Reddit post titles)';
```

Or run the migration file:
```bash
# Copy the contents of add_title_to_posts.sql and paste in Supabase SQL Editor
```

#### 2. Generate Titles for Existing Posts

Make sure you have the required environment variables in `backend/.env`:
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

Then run the title generation script:

```bash
cd backend
python scripts/generate_post_titles.py
```

This will:
- Fetch all posts from Supabase
- Use Gemini (via OpenRouter) to generate engaging titles
- Update each post with its generated title

**Expected output:**
```
Fetching posts from Supabase...
Found 50 posts
Generating titles for 50 posts...

[1/50] Processing post abcd1234...
Generated title: Struggling with feeling unwanted after years of rejection
✓ Updated successfully

...

============================================================
Title generation complete!
Successfully updated: 50
Failed: 0
============================================================
```

#### 3. Frontend Automatically Uses New Titles

The frontend code has been updated to:
- Use database titles when available
- Fall back to auto-generated titles for legacy posts
- No additional steps required!

### How Title Generation Works

The script uses Gemini 2.0 Flash (free tier via OpenRouter) to generate titles that:
- Are concise (max 80 characters)
- Capture the main theme/struggle
- Use empathetic, respectful language
- Follow Reddit-style conventions (similar to r/relationship_advice)

**Example transformations:**
- Content: "still have that desire to be wanted so deeply ingrained..."
- Generated Title: "Struggling with feeling unwanted despite working on myself"

### Verification

After running the migration:

1. Check Supabase dashboard:
   - Go to Table Editor > posts
   - Verify `title` column exists
   - Check that posts have titles populated

2. Check frontend:
   - Visit `/stories` page
   - Story cards should now show meaningful titles instead of truncated content

### Rollback (if needed)

To remove the title column:
```sql
ALTER TABLE posts DROP COLUMN IF EXISTS title;
```

**Warning:** This will permanently delete all generated titles.

### Future Posts

New posts created after this migration should include a `title` field. Consider:
- Adding title field to post creation forms
- Making title required for new posts
- Validating title length (max 100 characters)
