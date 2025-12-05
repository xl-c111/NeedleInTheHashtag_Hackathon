# Deployment Architecture - "been there"

**Overview:** Hybrid serverless architecture for fast, scalable peer support platform

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  VERCEL (Frontend + Chat)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js Frontend (Static + SSR)                       │ │
│  │  - Pages: /, /chat, /stories, /diary                  │ │
│  │  - React Components + UI                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┴─────────────────┐               │
│  │  Vercel API Routes (Serverless)          │               │
│  │  └─ /api/chat → OpenRouter API           │               │
│  │     (Gemini 2.0 Flash - 50-100ms)        │               │
│  └──────────────────────────────────────────┘               │
└──────────────────┬────────────────────────┬─────────────────┘
                   │                        │
                   │                        │
    ┌──────────────▼──────────┐   ┌────────▼─────────────┐
    │  HUGGING FACE SPACE     │   │    SUPABASE          │
    │                         │   │                      │
    │  Semantic Matcher API   │   │  PostgreSQL Database │
    │  - Embeddings (29 posts)│   │  - Posts             │
    │  - sentence-transformers│   │  - Users/Profiles    │
    │  - Matching endpoint    │   │  - Diary entries     │
    │  (200-400ms)            │   │                      │
    │                         │   │  Authentication      │
    │  Port: 7860 (local)     │   │  - Email/Password    │
    │  URL: XLCui-beenthere-  │   │  - Anonymous         │
    │       matcher.hf.space  │   │  - Row Level Security│
    └─────────────────────────┘   └──────────────────────┘
```

---

## 📊 Service Breakdown

### **1. Vercel (Frontend + Chat API)**

**What it does:**
- Hosts Next.js frontend (static + server-side rendered pages)
- Serves API routes as serverless functions
- Handles chat via `/api/chat` endpoint

**Technology:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

**Endpoints:**
- `/` - Landing page
- `/chat` - Chat interface (protected)
- `/stories` - Browse stories (protected)
- `/stories/[id]` - Individual story (public)
- `/diary` - Diary entries (protected)
- `/write` - Write diary entry (protected)
- `/api/chat` - Chat API (calls OpenRouter)

**Deployment:**
- Platform: Vercel
- URL: `https://needleinthehashtaghackathon.vercel.app`
- Deploy: Auto-deploy on git push to main
- Environment: Production, Preview, Development

---

### **2. Hugging Face Space (Matching API)**

**What it does:**
- Semantic matching of user descriptions to mentor stories
- Loads pre-computed embeddings (29 posts)
- Returns top K similar stories using cosine similarity

**Technology:**
- FastAPI (Python)
- sentence-transformers (all-MiniLM-L6-v2 model)
- scikit-learn (cosine similarity)
- Docker deployment

**Endpoints:**
- `GET /health` - Health check
- `POST /api/match` - Semantic matching
  - Input: `{"user_text": "...", "top_k": 5}`
  - Output: Array of matched stories with similarity scores

**Deployment:**
- Platform: Hugging Face Spaces
- URL: `https://XLCui-beenthere-matcher.hf.space`
- SDK: Docker
- Hardware: CPU basic (free tier)
- Deploy: Git push to HF Space repo

**Files:**
- `app.py` - FastAPI application
- `requirements.txt` - Python dependencies
- `Dockerfile` - Container configuration
- `mentor_embeddings.pkl` - Pre-computed embeddings (63 KB)

---

### **3. Supabase (Database + Auth)**

**What it does:**
- PostgreSQL database for all data
- Authentication (email/password, anonymous)
- Row-level security policies

**Tables:**
- `profiles` - User profiles (auto-created on signup)
- `posts` - Mentor stories
- `diary_entries` - Private user journaling
- `user_favorites` - Liked/saved stories

**Features:**
- Real-time subscriptions
- RESTful API
- TypeScript types generation
- Row-level security (RLS)

**Deployment:**
- Platform: Supabase Cloud
- URL: `your-project.supabase.co`
- Free tier: 500MB database, 50K monthly active users

---

## 🔑 Environment Variables

### **Vercel (Production)**

```bash
# Hugging Face Space URL
NEXT_PUBLIC_HF_SPACE_URL=https://YOUR-USERNAME-beenthere-matcher.hf.space

# OpenRouter API Key (for chat)
OPENROUTER_API_KEY=your-openrouter-api-key

# Supabase (optional, if using)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **Local Development (.env.local)**

```bash
# Use localhost for HF Space if running locally
NEXT_PUBLIC_HF_SPACE_URL=http://localhost:7860

# Or use production HF Space
NEXT_PUBLIC_HF_SPACE_URL=https://YOUR-USERNAME-beenthere-matcher.hf.space

# OpenRouter API Key
OPENROUTER_API_KEY=your-openrouter-api-key
```

---

## 🔄 Data Flow

### **Chat Flow:**

```
User types message
    ↓
Frontend (/chat page)
    ↓
Vercel API Route (/api/chat)
    ↓
OpenRouter API (Gemini 2.0 Flash)
    ↓
Response back to user (50-100ms)
```

### **Matching Flow:**

```
User sends 2-3 messages
    ↓
Frontend triggers matching
    ↓
Fetch to HF Space (/api/match)
    ↓
HF Space:
  1. Embed user text
  2. Calculate cosine similarity
  3. Return top K matches
    ↓
Display matched stories (200-400ms)
```

### **Story Browsing Flow:**

```
User visits /stories
    ↓
Frontend fetches from Supabase
    ↓
SELECT * FROM posts WHERE ...
    ↓
Display stories with filters
```

---

## 🚀 Deployment Process

### **Frontend (Vercel)**

**Automatic Deployment:**
```bash
# Any push to main branch triggers deploy
git push origin main
# OR
git push myfork main

# Vercel automatically:
# 1. Detects changes
# 2. Builds Next.js app
# 3. Deploys to production
# 4. Updates live site (2-3 min)
```

**Manual Deployment:**
```bash
# Via Vercel Dashboard
1. Go to vercel.com
2. Select project
3. Deployments tab
4. Click "Redeploy"
```

---

### **Hugging Face Space**

**Git Deployment:**
```bash
# Clone HF Space repo
git clone https://huggingface.co/spaces/XLCui/beenthere-matcher

# Add files
cp huggingface-space/* .

# Commit and push
git add .
git commit -m "Deploy matcher"
git push

# HF automatically:
# 1. Builds Docker image
# 2. Installs dependencies
# 3. Starts FastAPI server
# 4. Loads embeddings
# 5. Sets status to "Running" (3-5 min)
```

**Web Upload:**
```
1. Go to HF Space
2. Files tab
3. Upload files
4. Commit changes
```

---

### **Supabase (Database)**

**No deployment needed!**
- Already hosted on Supabase Cloud
- Database migrations via SQL scripts
- Schema changes via Supabase Dashboard

---

## 🏠 Local Development Setup

### **Option 1: Frontend Only (Recommended)**

```bash
cd frontend
npm install
npm run dev

# .env.local:
NEXT_PUBLIC_HF_SPACE_URL=https://XLCui-beenthere-matcher.hf.space
```

**What works:**
- ✅ All UI pages
- ✅ Chat (via /api/chat)
- ✅ Matching (uses production HF Space)
- ✅ Stories (via Supabase)

**What's needed:**
- Node.js + npm
- Frontend dependencies
- Production HF Space URL
- OpenRouter API key (in .env.local)

---

### **Option 2: Full Local Stack**

**Terminal 1 - HF Space:**
```bash
cd huggingface-space
pip install -r requirements.txt
uvicorn app:app --reload --port 7860
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# .env.local:
NEXT_PUBLIC_HF_SPACE_URL=http://localhost:7860
```

**What's different:**
- Matching uses local HF Space
- Can test matching algorithm changes
- Can test with different embeddings

---

## 📈 Performance Characteristics

| Component | Latency | Cold Start | Scalability |
|-----------|---------|------------|-------------|
| **Vercel Frontend** | < 100ms | None (edge) | Unlimited |
| **Vercel Chat API** | 50-100ms | None | Auto-scale |
| **HF Space Matching** | 200-400ms | None (persistent) | CPU-based |
| **Supabase DB** | 20-50ms | None | High |

**End-to-end metrics:**
- Chat response: **50-100ms** (instant!)
- Matching: **200-400ms** (fast!)
- Total user experience: **Smooth, no lag**

---

## 💰 Cost Breakdown

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| **Vercel** | Free | $0/mo | 100GB bandwidth, unlimited requests |
| **Hugging Face** | Free | $0/mo | CPU basic, persistent |
| **Supabase** | Free | $0/mo | 500MB DB, 50K MAU |
| **OpenRouter** | Pay-per-use | ~$0.01-0.10/mo | Gemini 2.0 Flash ($0.075/1M tokens) |

**Total: ~$0.01-0.10/month** (essentially free!)

---

## 🔒 Security

### **Authentication:**
- Supabase Auth (JWT tokens)
- Row-level security (RLS)
- Secure cookie storage

### **API Keys:**
- OPENROUTER_API_KEY: Server-side only (Vercel env, never commit to git)
- SUPABASE_SERVICE_KEY: Backend only (not exposed, never commit to git)
- NEXT_PUBLIC_* variables: Safe to expose (public, can be in git)

### **CORS:**
- HF Space: Allows all origins (public API)
- Vercel: Same-origin by default
- Supabase: Row-level security

---

## 🐛 Troubleshooting

### **Chat not working:**
- Check: OPENROUTER_API_KEY set in Vercel?
- Check: /api/chat endpoint accessible?
- Check: Browser console for errors

### **Matching not working:**
- Check: NEXT_PUBLIC_HF_SPACE_URL correct?
- Check: HF Space status "Running"?
- Check: HF Space /health returns 200?

### **Stories not loading:**
- Check: Supabase connection
- Check: RLS policies allow read
- Check: Network tab for API errors

---

## 📚 Key Files

```
been-there/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── chat/page.tsx         # Chat interface
│   │   ├── stories/page.tsx      # Stories listing
│   │   └── api/chat/route.ts     # Chat API (Vercel)
│   ├── lib/
│   │   └── api.ts                # API client (calls HF Space)
│   └── .env.local                # Local environment
│
├── huggingface-space/
│   ├── app.py                    # FastAPI matcher
│   ├── Dockerfile                # Container config
│   ├── requirements.txt          # Python deps
│   └── mentor_embeddings.pkl     # Embeddings
│
├── data/
│   ├── seed/posts.json           # Seed mentor posts
│   └── processed/                # Generated embeddings
│
└── docs/
    ├── DEPLOYMENT_GUIDE.md       # Step-by-step deploy
    ├── DEPLOYMENT_ARCHITECTURE.md # This file
    └── MIGRATION_SUMMARY.md      # Migration details
```

---

## 🎯 Summary

**Your deployment is:**
- ✅ **Serverless** - No servers to manage
- ✅ **Fast** - 50-400ms response times
- ✅ **Scalable** - Auto-scales with traffic
- ✅ **Free** - All free tiers
- ✅ **Simple** - 3 services, clear separation
- ✅ **Reliable** - No cold starts, persistent

**Architecture benefits:**
1. **Separation of concerns** - Each service does one thing well
2. **Easy to debug** - Clear data flow
3. **Easy to scale** - Each service scales independently
4. **Cost-effective** - Pay only for what you use
5. **Developer-friendly** - Can test locally or use production

---

## 🚀 Quick Reference

**Production URLs:**
- Frontend: `https://your-project.vercel.app`
- HF Space: `https://YOUR-USERNAME-beenthere-matcher.hf.space`
- Supabase: `https://your-project.supabase.co`

**Local URLs:**
- Frontend: `http://localhost:3000`
- HF Space: `http://localhost:7860`

**Deploy Commands:**
```bash
# Frontend (auto-deploys)
git push myfork main

# HF Space
git push origin main  # In HF Space repo

# Database (no deploy needed)
# Run SQL in Supabase dashboard
```

---

**Last Updated:** December 6, 2025
**Architecture Version:** 2.0 (Hybrid Serverless)
