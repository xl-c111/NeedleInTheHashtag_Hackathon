# API Contract

> **This is the source of truth for frontend ↔ backend integration.**
> Update this document when endpoints change. Both teams should agree on changes.

## Base URL

- **Development:** `http://localhost:8000`
- **Production:** TBD

## Authentication

None for hackathon (keep it simple).

---

## Endpoints

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

---

### Classify Single Text

Classify a single piece of text.

```
POST /api/classify
```

**Request:**
```json
{
  "text": "I'm HUMBLED to announce that I've been promoted! Agree? 🚀"
}
```

**Response:**
```json
{
  "text": "I'm HUMBLED to announce that I've been promoted! Agree? 🚀",
  "category": "linkedin_lunatic",
  "confidence": 0.85,
  "indicators": ["humbled", "agree?", "🚀"],
  "scores": {
    "linkedin_lunatic": 0.85,
    "body_dysmorphia": 0.05,
    "incel": 0.02,
    "normal": 0.08
  }
}
```

**Category Values:**
- `linkedin_lunatic`
- `body_dysmorphia`
- `incel`
- `toxic`
- `normal`
- `unknown`

---

### Classify Batch

Classify multiple texts at once.

```
POST /api/classify/batch
```

**Request:**
```json
{
  "texts": [
    "Just had a great coffee! ☕",
    "I hate my body so much",
    "Society is rigged against us"
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "text": "Just had a great coffee! ☕",
      "category": "normal",
      "confidence": 0.95
    },
    {
      "text": "I hate my body so much",
      "category": "body_dysmorphia",
      "confidence": 0.78
    },
    {
      "text": "Society is rigged against us",
      "category": "incel",
      "confidence": 0.65
    }
  ],
  "summary": {
    "total": 3,
    "by_category": {
      "normal": 1,
      "body_dysmorphia": 1,
      "incel": 1
    }
  }
}
```

---

### Analyze User

Analyze all messages from a user to determine their persona.

```
POST /api/analyze/user
```

**Request:**
```json
{
  "user_id": "user_123",
  "messages": [
    "Post 1 text...",
    "Post 2 text...",
    "Post 3 text..."
  ]
}
```

**Response:**
```json
{
  "user_id": "user_123",
  "primary_persona": "linkedin_lunatic",
  "confidence": 0.72,
  "message_count": 3,
  "persona_breakdown": {
    "linkedin_lunatic": 0.72,
    "normal": 0.20,
    "toxic": 0.08
  },
  "risk_level": "low",
  "indicators": ["frequent humble-brags", "engagement bait questions"]
}
```

**Risk Levels:**
- `low` - Normal behavior
- `medium` - Some concerning patterns
- `high` - Significant concerning patterns
- `critical` - Immediate attention needed

---

### Get Statistics (Optional)

Dashboard statistics.

```
GET /api/stats
```

**Response:**
```json
{
  "total_analyzed": 1542,
  "category_distribution": {
    "normal": 890,
    "linkedin_lunatic": 312,
    "body_dysmorphia": 156,
    "incel": 98,
    "toxic": 86
  },
  "risk_distribution": {
    "low": 1200,
    "medium": 250,
    "high": 80,
    "critical": 12
  }
}
```

---

## New Endpoints (Peer-Support Platform)

> **Note:** These endpoints will be implemented incrementally as the Loveable frontend skeleton reveals requirements.
> The following are **draft designs** to guide development. Exact request/response shapes may evolve based on frontend needs.

### Story/Mentor Post Matching

#### Match User to Mentor Posts

Match a user's message to relevant mentor posts based on semantic similarity.

```
POST /api/match
```

**Request:**
```json
{
  "user_message": "I've been feeling really lonely lately and don't know how to connect with people",
  "context": ["previous message 1", "previous message 2"],  // Optional: conversation history
  "limit": 5  // Optional: number of matches to return (default: 5)
}
```

**Response:**
```json
{
  "matched_posts": [
    {
      "post_id": "mp_001",
      "author_persona": "Anon123",  // Anonymous pseudonym
      "content": "I used to feel so isolated, but I found that joining a local book club helped me connect with people who shared my interests...",
      "relevance_score": 0.87,
      "themes": ["loneliness", "community_building"],
      "created_at": "2024-11-15T10:30:00Z",
      "engagement": {
        "saves": 45,
        "helpful_count": 23
      }
    },
    {
      "post_id": "mp_002",
      "author_persona": "Anon456",
      "content": "Volunteering at an animal shelter gave me a sense of purpose and introduced me to kind people...",
      "relevance_score": 0.82,
      "themes": ["loneliness", "purpose", "volunteering"],
      "created_at": "2024-10-22T14:20:00Z",
      "engagement": {
        "saves": 32,
        "helpful_count": 18
      }
    }
  ],
  "themes_detected": ["loneliness", "community_building", "purpose"],
  "suggested_resources": [
    {
      "type": "article",
      "title": "Building Social Connections: A Guide",
      "url": "https://example.com/social-connections",
      "description": "Practical tips for making friends as an adult"
    },
    {
      "type": "service",
      "title": "Local Meetup Groups",
      "url": "https://meetup.com",
      "description": "Find groups based on your interests"
    }
  ]
}
```

---

### Story/Mentor Posts (CRUD - Future)

> **To be implemented:** Full CRUD for mentor posts once database is ready

**Placeholder endpoints:**
- `GET /api/posts` - List all mentor posts (with filtering, pagination)
- `GET /api/posts/{post_id}` - Get single post
- `POST /api/posts` - Submit new mentor post (requires moderation)
- `GET /api/posts/trending` - Get trending/popular posts

---

### Diary Entries (Future)

> **To be implemented:** User diary/journaling feature

**Placeholder endpoints:**
- `GET /api/diary` - Get user's diary entries
- `POST /api/diary` - Create new diary entry
- `GET /api/diary/{entry_id}` - Get specific entry
- `PUT /api/diary/{entry_id}` - Update entry
- `DELETE /api/diary/{entry_id}` - Delete entry

**Draft Request (POST /api/diary):**
```json
{
  "content": "Today I felt a bit better. I reached out to an old friend...",
  "mood": "hopeful",  // Optional: mood tag
  "private": true  // Default: true (entries are private by default)
}
```

---

### Resources (Future)

> **To be implemented:** Curated resources (articles, services, crisis support)

**Placeholder endpoints:**
- `GET /api/resources` - List resources (filtered by theme)
- `GET /api/resources/recommend` - Get personalized recommendations based on user's themes

**Draft Response:**
```json
{
  "resources": [
    {
      "id": "res_001",
      "type": "article",  // article, service, video, crisis_hotline
      "title": "Self-Compassion for Difficult Times",
      "url": "https://example.com/self-compassion",
      "description": "A guide to being kind to yourself",
      "themes": ["self_esteem", "mental_health"],
      "difficulty": "beginner"  // beginner, intermediate, advanced
    }
  ]
}
```

---

### User Interactions (Future)

> **To be implemented:** Save posts, mark helpful, etc.

**Placeholder endpoints:**
- `POST /api/interactions/save` - Save a post for later
- `POST /api/interactions/helpful` - Mark a post as helpful
- `GET /api/interactions/saved` - Get user's saved posts

---

### Mood Tracking (Future)

> **To be implemented:** Daily mood check-ins

**Placeholder endpoints:**
- `POST /api/mood` - Log mood
- `GET /api/mood/history` - Get mood history (for charts/trends)

**Draft Request (POST /api/mood):**
```json
{
  "mood": "neutral",  // very_low, low, neutral, good, very_good
  "note": "Feeling a bit better today",  // Optional
  "timestamp": "2024-11-30T10:00:00Z"  // Optional: defaults to now
}
```

---

### AI Chat (Future)

> **To be implemented:** Conversational interface for understanding user issues

**Placeholder endpoints:**
- `POST /api/chat` - Send message, get AI response (guides conversation, doesn't give advice)
- `GET /api/chat/history` - Get conversation history

**Draft Request (POST /api/chat):**
```json
{
  "message": "I don't know how to talk to people at parties",
  "conversation_id": "conv_123"  // Optional: for multi-turn conversations
}
```

**Draft Response:**
```json
{
  "response": "That sounds challenging. Can you tell me more about what happens when you try to start conversations?",
  "conversation_id": "conv_123",
  "suggestions": [
    "Tell me more about social situations",
    "I want to see mentor posts about social anxiety"
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": true,
  "message": "Description of what went wrong",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid request data
- `TEXT_TOO_LONG` - Text exceeds maximum length
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (validation error)
- `429` - Rate limited
- `500` - Internal server error

---

## Notes for Frontend

- All endpoints accept and return JSON
- Use `Content-Type: application/json` header
- Mock responses are available in `frontend/src/lib/mockApi.ts`
- Connect to real backend by changing `API_BASE_URL` in environment

## Notes for Backend

- CORS is enabled for `http://localhost:3000` (Next.js/Loveable dev server)
- Add request validation using Pydantic models
- Log all requests for debugging during hackathon
- **New focus:** Implement `/api/match` endpoint first (core of peer-support platform)
- Use existing text processing utilities (`src/utils/text_utils.py`) for cleaning
- Use existing embedding classifier (`src/classifiers/api_classifiers.py`) for matching
- Keep existing classification endpoints for content moderation
- Database schema TBD by teammate - use in-memory/JSON for MVP if needed
