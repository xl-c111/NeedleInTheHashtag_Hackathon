---
title: Been There Matcher
emoji: 🤗
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Been There - Semantic Matcher API

This Hugging Face Space provides semantic matching for the "been there" peer support platform.

## What it does

Matches user descriptions of their struggles to relevant mentor stories from people who have overcome similar challenges.

## API Endpoints

### POST `/api/match`
Match user text to mentor stories

**Request:**
```json
{
  "user_text": "I feel lonely and misunderstood",
  "top_k": 3,
  "min_similarity": 0.3
}
```

**Response:**
```json
[
  {
    "content": "...",
    "topic_tags": ["loneliness", "mental health"],
    "similarity_score": 0.85,
    "user_id": "123",
    "timestamp": "2025-11-30T12:00:00Z"
  }
]
```

### GET `/health`
Check if the service is ready

## Tech Stack

- **FastAPI** - Web framework
- **sentence-transformers** - Embedding model (all-MiniLM-L6-v2)
- **scikit-learn** - Cosine similarity calculation

## Setup

1. Upload `mentor_embeddings.pkl` to this Space
2. The service will automatically load the embeddings on startup
3. Ready to handle requests!

## Local Testing

```bash
pip install -r requirements.txt
uvicorn app:app --reload --port 7860
```

Visit http://localhost:7860/docs for API documentation.
