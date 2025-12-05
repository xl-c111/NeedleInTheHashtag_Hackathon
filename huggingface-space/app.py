"""
Been There - Semantic Matching API
Deployed on Hugging Face Spaces

This is a lightweight FastAPI service that handles semantic matching
of user descriptions to mentor stories using sentence-transformers.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import pickle
from pathlib import Path
from typing import List, Optional

# Initialize FastAPI
app = FastAPI(
    title="Been There Matcher API",
    description="Semantic matching service for peer support stories",
    version="1.0.0"
)

# CORS - allow all origins for HF Space
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # HF Spaces can be accessed from anywhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and data
model: Optional[SentenceTransformer] = None
mentor_posts: Optional[pd.DataFrame] = None
mentor_embeddings: Optional[np.ndarray] = None


@app.on_event("startup")
async def load_model():
    """Load the embedding model and pre-computed embeddings at startup."""
    global model, mentor_posts, mentor_embeddings

    print("\n" + "="*60)
    print("LOADING SEMANTIC MATCHER")
    print("="*60)

    # Load sentence transformer model
    print("Loading embedding model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✓ Model loaded")

    # Load pre-computed embeddings
    embeddings_path = Path("mentor_embeddings.pkl")
    if embeddings_path.exists():
        print(f"Loading embeddings from {embeddings_path}...")
        with open(embeddings_path, 'rb') as f:
            data = pickle.load(f)

        mentor_posts = data['posts']
        mentor_embeddings = data['embeddings']
        print(f"✓ Loaded {len(mentor_posts)} mentor posts with embeddings")
    else:
        print(f"⚠ Warning: {embeddings_path} not found")
        print("  Upload mentor_embeddings.pkl to your Space")

    print("="*60)
    print(f"Matcher ready: {mentor_embeddings is not None}")
    print("="*60 + "\n")


# API Models
class MatchRequest(BaseModel):
    user_text: str = Field(..., min_length=1, max_length=5000)
    top_k: int = Field(5, ge=1, le=20)
    min_similarity: float = Field(0.3, ge=0.0, le=1.0)


class MatchedStory(BaseModel):
    content: str
    title: Optional[str] = None
    topic_tags: List[str] = []
    similarity_score: float
    user_id: str
    timestamp: str
    post_id: Optional[str] = None
    comment_id: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    matcher_ready: bool
    num_posts: int


# API Endpoints
@app.get("/", include_in_schema=False)
async def root():
    """Root endpoint - redirect to docs."""
    return {
        "message": "Been There Matcher API",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "matcher_ready": mentor_embeddings is not None,
        "num_posts": len(mentor_posts) if mentor_posts is not None else 0
    }


@app.post("/api/match", response_model=List[MatchedStory])
async def match_to_mentors(request: MatchRequest):
    """
    Match user's description to relevant mentor stories.

    This endpoint:
    1. Embeds the user's text using sentence-transformers
    2. Calculates cosine similarity to all mentor post embeddings
    3. Returns the top K most similar stories
    """
    if model is None or mentor_embeddings is None:
        raise HTTPException(
            status_code=503,
            detail="Matcher not loaded. Please wait for startup or check embeddings file."
        )

    if not request.user_text or not request.user_text.strip():
        return []

    try:
        # Embed user text
        user_embedding = model.encode([request.user_text], convert_to_numpy=True)

        # Calculate cosine similarity to all mentor posts
        similarities = cosine_similarity(user_embedding, mentor_embeddings)[0]

        # Get indices of top matches (sorted descending)
        top_indices = np.argsort(similarities)[::-1][:request.top_k * 2]

        # Build results
        results = []
        for idx in top_indices:
            sim = float(similarities[idx])
            if sim >= request.min_similarity and len(results) < request.top_k:
                post_data = mentor_posts.iloc[idx].to_dict()

                # Ensure topic_tags is a list
                if 'topic_tags' in post_data:
                    if isinstance(post_data['topic_tags'], str):
                        import json
                        try:
                            post_data['topic_tags'] = json.loads(post_data['topic_tags'])
                        except:
                            post_data['topic_tags'] = [post_data['topic_tags']]
                else:
                    post_data['topic_tags'] = []

                # Add similarity score
                post_data['similarity_score'] = sim

                # Remove internal column
                post_data.pop('_text_for_embedding', None)

                results.append(post_data)

        return results

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Matching failed: {str(e)}"
        )


# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
