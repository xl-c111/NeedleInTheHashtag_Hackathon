# Backend API - been there

FastAPI backend for semantic story matching and AI chat assistance.

## Quick Start

### 1. Install Dependencies

```bash
# From the backend directory
cd backend

# Install Python dependencies
python -m pip install -r requirements.txt
```

### 2. Set Environment Variables

Make sure the root `.env` file contains:

```bash
# Supabase (for fetching posts)
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key

# OpenRouter (for AI chat with Gemini)
OPENROUTER_API_KEY=your-openrouter-key
```

### 3. Generate Embeddings (Required for Matching)

The semantic matcher needs embeddings generated from your Supabase posts:

```bash
# Fetch posts from Supabase and generate embeddings
python scripts/fetch_supabase_posts.py
python scripts/generate_embeddings.py
```

This creates `../data/processed/mentor_embeddings.pkl` with semantic vectors for all posts.

**When to regenerate:**
- After adding new posts to Supabase
- After updating existing post content
- If posts in database have changed since last generation

### 4. Run the Server

```bash
# Start FastAPI server with auto-reload
python -m uvicorn main:app --reload
```

Server runs at: **http://localhost:8000**

## API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/api/health

## How It Works

### Architecture

1. **Chat Interface** (`/api/chat`)
   - Uses Gemini 2.0 Flash via OpenRouter API
   - Provides empathetic, supportive conversation
   - Helps users articulate their feelings

2. **Semantic Matching** (`/api/match`)
   - Uses sentence-transformers (all-MiniLM-L6-v2)
   - Finds mentor stories similar to user's description
   - Returns top matches with similarity scores

3. **Content Moderation** (`/api/moderate`)
   - Detects risky/harmful content (optional)
   - Filters matches for safety

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check and model status |
| POST | `/api/chat` | Chat with AI assistant (Gemini) |
| POST | `/api/match` | Find semantically similar stories |
| POST | `/api/moderate` | Check content safety |
| GET | `/api/stats` | Get system statistics |

See `docs/backend/BACKEND_INTEGRATION.md` for full API contract.

## Project Structure

```
backend/
├── main.py                  # FastAPI app and routes
├── services/
│   ├── matcher.py           # Semantic matching with sentence-transformers
│   ├── chat.py              # Chat assistant with Gemini/OpenRouter
│   └── moderator.py         # Content moderation
├── scripts/
│   ├── fetch_supabase_posts.py      # Download posts from Supabase
│   ├── generate_embeddings.py       # Generate semantic embeddings
│   └── seed_comments.py             # Seed mock comments
├── requirements.txt
└── README.md
```

## Development Workflow

### Testing the API

```bash
# Health check
curl http://localhost:8000/api/health

# Test chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I feel lonely and anxious"}'

# Test matching
curl -X POST http://localhost:8000/api/match \
  -H "Content-Type: application/json" \
  -d '{"user_text": "I struggle with social anxiety", "top_k": 3, "min_similarity": 0.3}'
```

### Updating Posts

If posts change in Supabase:

```bash
# 1. Re-fetch posts
python scripts/fetch_supabase_posts.py

# 2. Regenerate embeddings
python scripts/generate_embeddings.py

# 3. Restart server (if using --reload, it auto-restarts)
```

## Models Used

- **Chat AI:** Gemini 2.0 Flash (via OpenRouter)
  - Free tier available
  - Fast response times
  - Conversational and empathetic

- **Semantic Matching:** sentence-transformers/all-MiniLM-L6-v2
  - 384-dimensional embeddings
  - Runs locally (no API calls)
  - Cosine similarity for matching

## Troubleshooting

### "Matcher not loaded" Error

**Problem:** Embeddings file doesn't exist

**Solution:**
```bash
python scripts/fetch_supabase_posts.py
python scripts/generate_embeddings.py
```

### "Chat failed: Make sure OPENROUTER_API_KEY is set"

**Problem:** Missing OpenRouter API key

**Solution:** Add to root `.env` file:
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

Get free key at: https://openrouter.ai/

### Backend won't start

**Problem:** Missing dependencies

**Solution:**
```bash
python -m pip install -r requirements.txt
```

## CORS Configuration

Frontend origins allowed:
- http://localhost:3000
- http://127.0.0.1:3000
- https://*.vercel.app (for deployed frontend)

Add more in `main.py` if needed.

## Production Deployment

For production, consider:
- Use production ASGI server (uvicorn with workers)
- Set up Redis for session management
- Add rate limiting
- Use environment-specific `.env` files
- Set up monitoring and logging

Example production command:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```
