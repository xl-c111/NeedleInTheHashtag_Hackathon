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

- CORS is enabled for `http://localhost:3000` (Next.js dev server)
- Add request validation using Pydantic models
- Log all requests for debugging during hackathon
