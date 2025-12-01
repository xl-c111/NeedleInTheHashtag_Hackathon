# Database Backup Guide

## Quick Backup

```bash
cd backend
source ../venv/bin/activate
python3 scripts/backup_database.py
```

This creates timestamped backups in `/data/backups/`

## Backup Schedule (Recommended)

### Daily backups (using cron):
```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2am):
0 2 * * * cd /Users/xiaolingcui/NeedleInTheHashtag_Hackathon && source venv/bin/activate && python3 backend/scripts/backup_database.py
```

### Before major changes:
```bash
# Always backup before running SQL scripts!
python3 scripts/backup_database.py
```

## Backup Storage

Backups are saved to: `/data/backups/`

Files created:
- `posts_YYYYMMDD_HHMMSS.json` - Timestamped backup
- `posts_latest.json` - Latest backup (easy reference)
- Same for `profiles`, `diary_entries`, `user_favorites`

## Git Backups

Add backups to git (for team sharing):

```bash
cd /Users/xiaolingcui/NeedleInTheHashtag_Hackathon
git add data/backups/*_latest.json
git commit -m "backup: database snapshot"
git push
```

**Note:** Don't commit timestamped files (too many). Only commit `*_latest.json`

## Supabase Pro Backups

If you upgrade to Supabase Pro ($25/mo):
- Automatic daily backups (7-30 days retention)
- Point-in-time recovery
- One-click restore
- **Most reliable option for production**

## Restore from Backup

To restore (creates restore script coming next):
```bash
python3 scripts/restore_backup.py 20251201_220000
```

## Best Practices

1. **Backup before any database changes**
   - Before running SQL scripts
   - Before major migrations
   - Before testing destructive operations

2. **Regular schedule**
   - Daily automatic backups (cron job)
   - Before each deployment

3. **Multiple locations**
   - Local backups (data/backups/)
   - Git repository (latest only)
   - External storage (Google Drive, Dropbox)

4. **Test restores**
   - Periodically test that backups work
   - Verify data integrity

5. **Team coordination**
   - Tell team before major DB changes
   - Share backup schedule
   - Keep team informed of schema changes

## What Gets Backed Up

- ✅ All posts/stories
- ✅ All comments
- ✅ User profiles
- ✅ Diary entries
- ✅ User favorites

## What Doesn't Get Backed Up

- ❌ auth.users (managed by Supabase)
- ❌ Embeddings/vector data
- ❌ Files/avatars in storage

For complete protection, consider Supabase Pro with automatic backups.
