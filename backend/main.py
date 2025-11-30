"""
eSafety Hackathon - Backend API

FastAPI backend for text classification and analysis.
Run with: uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.utils.text_utils import clean_text, count_features, detect_patterns
from services.classifier import ClassifierService

# Initialize app
app = FastAPI(
    title="eSafety Hackathon API",
    description="API for classifying social media content and detecting concerning patterns",
    version="0.1.0"
)

# CORS - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize classifier service
classifier = ClassifierService()


# ============== Request/Response Models ==============

class ClassifyRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)


class ClassifyResponse(BaseModel):
    text: str
    category: str
    confidence: float
    indicators: list[str]
    scores: dict[str, float]


class BatchClassifyRequest(BaseModel):
    texts: list[str] = Field(..., min_items=1, max_items=100)


class BatchClassifyResponse(BaseModel):
    results: list[dict]
    summary: dict


class UserAnalyzeRequest(BaseModel):
    user_id: str
    messages: list[str] = Field(..., min_items=1, max_items=500)


class UserAnalyzeResponse(BaseModel):
    user_id: str
    primary_persona: str
    confidence: float
    message_count: int
    persona_breakdown: dict[str, float]
    risk_level: str
    indicators: list[str]


class HealthResponse(BaseModel):
    status: str
    version: str


class ErrorResponse(BaseModel):
    error: bool = True
    message: str
    code: str


# ============== Endpoints ==============

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "version": "0.1.0"}


@app.post("/api/classify", response_model=ClassifyResponse)
async def classify_text(request: ClassifyRequest):
    """Classify a single piece of text."""
    try:
        result = classifier.classify(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/classify/batch", response_model=BatchClassifyResponse)
async def classify_batch(request: BatchClassifyRequest):
    """Classify multiple texts at once."""
    try:
        results = classifier.classify_batch(request.texts)
        
        # Build summary
        category_counts = {}
        for r in results:
            cat = r["category"]
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        return {
            "results": results,
            "summary": {
                "total": len(results),
                "by_category": category_counts
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze/user", response_model=UserAnalyzeResponse)
async def analyze_user(request: UserAnalyzeRequest):
    """Analyze all messages from a user to determine their persona."""
    try:
        result = classifier.analyze_user(request.user_id, request.messages)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stats")
async def get_stats():
    """Get classification statistics (placeholder)."""
    # TODO: Implement actual stats tracking
    return {
        "total_analyzed": 0,
        "category_distribution": {},
        "risk_distribution": {}
    }


# ============== Main ==============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
