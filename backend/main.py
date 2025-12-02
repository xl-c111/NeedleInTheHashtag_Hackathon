"""
Been There - Backend API

FastAPI backend for the peer-support platform.
Integrates AI services for matching, moderation, and chat assistance.

Run with: uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from root directory
root_dir = Path(__file__).parent.parent
load_dotenv(root_dir / '.env')

# Import our AI services
from services.matcher import SemanticMatcher
from services.moderator import ContentModerator
from services.chat import ChatAssistant

# Initialize app
app = FastAPI(
    title="Been There API",
    description="AI-powered peer-support platform matching users to real mentor stories",
    version="1.0.0"
)

# CORS - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",  # For deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# GLOBAL AI MODELS (loaded at startup)
# ============================================================================

matcher: Optional[SemanticMatcher] = None
moderator: Optional[ContentModerator] = None

# Paths to trained models
EMBEDDINGS_PATH = Path("../data/processed/mentor_embeddings.pkl")
MODERATOR_PATH = Path("../models/moderator.pkl")


@app.on_event("startup")
async def load_models():
    """Load AI models when the server starts."""
    global matcher, moderator

    print("\n" + "="*60)
    print("LOADING AI MODELS")
    print("="*60)

    # Load semantic matcher
    try:
        matcher = SemanticMatcher()
        if EMBEDDINGS_PATH.exists():
            print(f"Loading embeddings from {EMBEDDINGS_PATH}")
            matcher.load_embeddings(str(EMBEDDINGS_PATH))
        else:
            print(f"Warning: Embeddings not found at {EMBEDDINGS_PATH}")
            print("  Matching will not work until you generate embeddings.")
            print("  See docs/claude_ai_training.md for instructions.")
    except Exception as e:
        print(f"Warning: Failed to load semantic matcher: {e}")
        matcher = None

    # Load content moderator
    try:
        moderator = ContentModerator()
        if MODERATOR_PATH.exists():
            print(f"Loading moderator from {MODERATOR_PATH}")
            moderator.load(str(MODERATOR_PATH))
        else:
            print(f"Warning: Moderator not found at {MODERATOR_PATH}")
            print("  Content moderation will use default safe mode.")
            print("  Train the moderator for better accuracy.")
    except Exception as e:
        print(f"Warning: Failed to load moderator: {e}")
        moderator = ContentModerator()  # Use untrained moderator

    print("="*60)
    print(f"Matcher loaded: {matcher is not None and matcher.mentor_embeddings is not None}")
    print(f"Moderator loaded: {moderator is not None and moderator.is_trained}")
    print("="*60 + "\n")


# ============================================================================
# API MODELS
# ============================================================================

class MatchRequest(BaseModel):
    user_text: str = Field(..., min_length=1, max_length=5000, description="User's description of their struggle")
    top_k: int = Field(5, ge=1, le=20, description="Number of matches to return")
    min_similarity: float = Field(0.3, ge=0.0, le=1.0, description="Minimum similarity threshold")


class ModerateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)


class ModerateResponse(BaseModel):
    is_risky: bool
    risk_score: float
    confidence: float


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    conversation_history: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    response: str
    should_show_stories: bool = False


class HealthResponse(BaseModel):
    status: str
    version: str
    matcher_ready: bool
    moderator_ready: bool


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": "1.0.0",
        "matcher_ready": matcher is not None and matcher.mentor_embeddings is not None,
        "moderator_ready": moderator is not None and moderator.is_trained
    }


@app.post("/api/match")
async def match_to_mentors(request: MatchRequest):
    """
    Match user's description to relevant mentor stories.

    This is the CORE API endpoint for Been There.

    Flow:
    1. Check user input with moderator (crisis detection)
    2. Find matching mentor stories using semantic similarity
    3. Filter matches through moderator (safety check)
    4. Return ranked, filtered results as array of MatchedStory objects
    """
    if matcher is None or matcher.mentor_embeddings is None:
        raise HTTPException(
            status_code=503,
            detail="Matcher not loaded. Please generate embeddings first."
        )

    # Step 1: Check user input with moderator (if available)
    if moderator is not None and moderator.is_trained:
        mod_result = moderator.predict(request.user_text)
        # High risk = crisis detected
        if mod_result['is_risky'] and mod_result['risk_score'] > 0.8:
            # Still return matches, but could add crisis resources here
            pass

    # Step 2: Find matching mentor stories
    try:
        matches = matcher.match(
            request.user_text,
            top_k=request.top_k,
            min_similarity=request.min_similarity
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

    # Step 3: Filter matches through moderator (if available)
    if moderator is not None and moderator.is_trained:
        safe_matches = []
        for match in matches:
            content = match.get('content', '')
            mod_result = moderator.predict(content)
            if not mod_result['is_risky']:
                safe_matches.append(match)
            # If risky, skip this mentor post
        matches = safe_matches

    # Return array directly (frontend expects List[MatchedStory])
    return matches


@app.post("/api/moderate", response_model=ModerateResponse)
async def moderate_content(request: ModerateRequest):
    """
    Check if content is risky.

    Used for:
    - Checking user input
    - Filtering mentor posts
    """
    if moderator is None:
        # Default to safe if no moderator
        return ModerateResponse(
            is_risky=False,
            risk_score=0.0,
            confidence=0.5
        )

    result = moderator.predict(request.text)
    return ModerateResponse(**result)


@app.get("/api/chat/greeting")
async def get_initial_greeting():
    """
    Get initial greeting to start the conversation.
    """
    return {
        "greeting": """Hey, I'm here to listen. Sometimes it helps to talk about what's on your mind.

Take your time - there's no rush. You can share whatever feels right.

Some things that might help get started:
• What's been weighing on you lately?
• Is there something specific that's been bothering you?
• How have you been feeling?

I'm here to understand, not to judge. When you're ready, I'll help you find stories from others who've been through similar experiences."""
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat_assistance(request: ChatRequest):
    """
    Chat interface to help users articulate their struggles.

    After 2-3 exchanges, automatically suggests matching mentor posts.
    Uses Gemini via OpenRouter API (fast, free LLM).
    """
    try:
        # Create a new chat assistant instance
        chat = ChatAssistant()

        # If conversation history provided, use it
        if request.conversation_history:
            # Convert Pydantic models to dict for ChatAssistant
            chat.conversation_history = [
                {"role": msg.role, "content": msg.content}
                for msg in request.conversation_history
            ]

        # Send message and get response
        response = chat.send(request.message)

        # Count user messages from conversation history
        user_message_count = len(request.conversation_history) if request.conversation_history else 0
        # Add 1 for the current message
        user_message_count += 1

        # After 2-3 user messages, signal frontend to show stories
        should_show_stories = user_message_count >= 2

        return ChatResponse(
            response=response,
            should_show_stories=should_show_stories
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {str(e)}. Make sure OPENROUTER_API_KEY is set in .env"
        )


# ============================================================================
# ADMIN/UTILITY ENDPOINTS
# ============================================================================

@app.get("/api/stats")
async def get_stats():
    """Get system statistics."""
    stats = {
        "matcher": {
            "loaded": matcher is not None and matcher.mentor_embeddings is not None,
            "num_posts": len(matcher.mentor_posts) if matcher and matcher.mentor_posts is not None else 0
        },
        "moderator": {
            "loaded": moderator is not None and moderator.is_trained,
            "model_type": "logistic_regression" if moderator and moderator.is_trained else "none"
        }
    }
    return stats


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
