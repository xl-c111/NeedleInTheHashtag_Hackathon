# Setup Guide for Team Members

Quick setup guide to get the project running on your machine.

## Prerequisites

- Python 3.9+
- Node.js 18+
- Git

## 1. Clone the Repository

```bash
git clone <repository-url>
cd NeedleInTheHashtag_Hackathon
```

## 2. Get Supabase Credentials

Ask the team lead (Xiaoling) for the Supabase credentials. You'll need:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` (for backend)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for frontend)

## 3. Create `.env` File

Create a `.env` file in the **project root**:

```bash
# Copy the example and fill in the values
cp .env.example .env
```

Then edit `.env` with the credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_xxxxx

# Frontend (Next.js)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

**Note:** Never commit this file to git! It's already in `.gitignore`.

## 4. Backend Setup

```bash
# Create virtual environment (macOS/Linux)
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### Test Backend Connection

```bash
python -c "from backend.config import supabase; print('✅ Backend connected to Supabase!')"
```

## 5. Frontend Setup

```bash
cd frontend
npm install
```

### Run Frontend Dev Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 6. Database Schema

The database is already set up in Supabase with:
- **posts** table (29 posts from r/IncelExit)
- Topic tags, timestamps, user data
- Full schema in `backend/schema.sql`

### View Data

Go to [Supabase Dashboard](https://supabase.com/dashboard) → Table Editor → posts

## 7. Quick Commands

### Activate Virtual Environment

```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### Query Posts from Python

```python
from backend.config import supabase

# Get all posts
response = supabase.table('posts').select('*').execute()
posts = response.data
print(f"Found {len(posts)} posts")
```

### Query Posts from Frontend

```typescript
import { supabase } from '@/lib/supabase'

const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .order('timestamp', { ascending: false })

console.log(`Found ${posts?.length} posts`)
```

## 8. Project Structure

```
NeedleInTheHashtag_Hackathon/
├── .env                     # Credentials (DO NOT COMMIT)
├── backend/
│   ├── config.py            # Supabase client setup
│   ├── schema.sql           # Database schema
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── lib/supabase.ts  # Frontend Supabase client
│   │   ├── components/      # React components
│   │   └── app/             # Next.js pages
│   └── package.json
├── data/seed/posts.json     # 29 posts data
└── scripts/
    └── upload_posts_to_supabase.py  # Data upload script
```

## Troubleshooting

### "Cannot resolve host" error
- Check your `.env` file has the correct `SUPABASE_URL`
- Make sure URL format is: `https://xxxxx.supabase.co`

### "Missing SUPABASE_URL" error
- Make sure `.env` file is in the project root
- Check environment variables are loaded correctly

### Frontend can't connect to Supabase
- Restart the dev server after changing `.env`
- Make sure variables have `NEXT_PUBLIC_` prefix

## Need Help?

Ask in the team chat or contact Xiaoling!

---

**Ready to build!** 🚀
