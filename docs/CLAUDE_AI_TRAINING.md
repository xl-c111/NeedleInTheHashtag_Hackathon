# AI Training & Integration Guide for Claude Code

> **Project:** eSafety Hackathon - Peer Support Platform
> **Owner:** Cam (Tech Lead / AI Integration)
> **Last Updated:** Nov 30, 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Component 1: Semantic Matcher](#component-1-semantic-matcher-core-feature)
4. [Component 2: Content Moderator](#component-2-content-moderator-trained-model)
5. [Component 3: Chat Interface](#component-3-chat-interface-llm-api)
6. [Training Pipeline](#training-pipeline)
7. [Backend Integration](#backend-integration)
8. [File Structure](#file-structure)
9. [Quick Start Commands](#quick-start-commands)

---

## Executive Summary

### What We're Building

A peer-support platform that connects people struggling with issues (loneliness, relationships, self-esteem) to **real stories from mentors** who have overcome similar challenges.

### Critical Design Principle

> **AI is used for MATCHING only, not for generating content.**
> The authenticity of real human stories is our core value proposition.

### Three AI Components

| Component | Purpose | Technology | Training Required? |
|-----------|---------|------------|-------------------|
| **Semantic Matcher** | Match user struggles → relevant mentor posts | sentence-transformers embeddings | ❌ No (pre-trained works) |
| **Content Moderator** | Filter harmful content, detect concerning input | Classifier (sklearn/keras) | ✅ Yes (hackathon train.csv) |
| **Chat Interface** | Help users articulate their struggles | LLM API (Claude/GPT) | ❌ No (API call) |

### Key Clarifications

1. **Your trained classifier is NOT a chat model** — It outputs a risk score (0-1), not conversational text
2. **For chat, use LLM API** — Claude or GPT API provides the conversational ability
3. **Embeddings don't need training** — Pre-trained sentence-transformers work excellently for matching
4. **The hackathon Module 5/6 approach trains a CLASSIFIER** — Use it for content moderation

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                                  │
│  User describes their struggle (text input or guided chat)          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: CONTENT MODERATION (Your Trained Classifier)               │
│  ─────────────────────────────────────────────────────              │
│  • Check if user input contains concerning patterns                 │
│  • Trained on hackathon train.csv (Module 5/6 approach)             │
│  • Output: risk_score (0-1), is_risky (boolean)                     │
│                                                                     │
│  IF risk_score > 0.8: Show crisis resources                         │
│  ELSE: Continue to matching                                         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: CHAT INTERFACE (Optional - LLM API)                        │
│  ─────────────────────────────────────────────────────              │
│  • Uses Claude or GPT API (NOT your trained model)                  │
│  • Helps user articulate their feelings more clearly                │
│  • Extracts key themes for better matching                          │
│  • Does NOT provide advice (just helps express)                     │
│                                                                     │
│  Technology: anthropic.Anthropic() or openai.OpenAI()               │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: SEMANTIC MATCHING (Embeddings - Pre-trained)               │
│  ─────────────────────────────────────────────────────              │
│  • Convert user's text to a vector (embedding)                      │
│  • Compare to pre-embedded r/IncelExit mentor posts                 │
│  • Return top N most similar stories                                │
│                                                                     │
│  Technology: sentence-transformers (all-MiniLM-L6-v2)               │
│  NO TRAINING NEEDED - just load model and use                       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: FILTER RESULTS (Your Trained Classifier again)             │
│  ─────────────────────────────────────────────────────              │
│  • Run classifier on each mentor post before displaying             │
│  • Filter out any posts that might be harmful                       │
│  • Extra safety layer                                               │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  OUTPUT: MATCHED MENTOR STORIES                                     │
│  • Real human stories from r/IncelExit                              │
│  • Ranked by relevance to user's situation                          │
│  • Filtered for safety                                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component 1: Semantic Matcher (Core Feature)

This is the heart of your platform. It matches user struggles to relevant mentor posts using **semantic similarity**.

### Why Embeddings (Not Your Trained Classifier)?

| Approach | What It Does | Good For |
|----------|--------------|----------|
| **Classifier (Module 5/6)** | "Is this text risky? → Yes/No" | Content moderation |
| **Embeddings** | "How similar are these two texts? → 0.0 to 1.0" | Matching users to stories |

Your classifier can't do matching — it only categorizes. Embeddings measure *similarity* between texts.

### How Embeddings Work

```python
# Conceptual example
user_text = "I feel like no one will ever love me"
mentor_text = "I used to think I was unlovable, but I learned..."

# Convert to vectors (lists of numbers)
user_vector = [0.2, -0.5, 0.8, ...]      # 384 numbers
mentor_vector = [0.3, -0.4, 0.7, ...]    # 384 numbers

# Calculate similarity (cosine similarity)
similarity = 0.87  # Very similar! Show this mentor post.
```

### Implementation

```python
# backend/services/matcher.py

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import pickle
from pathlib import Path


class SemanticMatcher:
    """
    Matches user descriptions to relevant mentor posts using embeddings.
    
    This is the CORE AI component of the platform.
    Uses pre-trained sentence-transformers — NO TRAINING REQUIRED!
    
    Usage:
        matcher = SemanticMatcher()
        matcher.load_mentor_posts('data/incelexit_posts.csv')
        matcher.save_embeddings('data/mentor_embeddings.pkl')
        
        # Later (fast startup):
        matcher.load_embeddings('data/mentor_embeddings.pkl')
        matches = matcher.match("I feel so lonely", top_k=5)
    """
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize with a sentence-transformer model.
        
        Recommended models:
        - 'all-MiniLM-L6-v2': Fast, good quality (RECOMMENDED for hackathon)
        - 'all-mpnet-base-v2': Slower, best quality
        - 'paraphrase-MiniLM-L6-v2': Fast, good for paraphrase detection
        
        The model downloads automatically on first use (~90MB).
        """
        print(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.model_name = model_name
        self.mentor_posts: pd.DataFrame = None
        self.mentor_embeddings: np.ndarray = None
    
    def load_mentor_posts(self, filepath: str, text_column: str = 'content'):
        """
        Load mentor posts from CSV/JSON and generate embeddings.
        
        This is the SLOW step — run once, then save embeddings.
        
        Args:
            filepath: Path to mentor posts file (CSV or JSON)
            text_column: Name of column containing post text
                         Common names: 'content', 'body', 'selftext', 'text'
        
        Example:
            matcher.load_mentor_posts('data/incelexit_posts.csv', text_column='body')
        """
        filepath = Path(filepath)
        
        # Load data based on file extension
        if filepath.suffix == '.csv':
            self.mentor_posts = pd.read_csv(filepath)
        elif filepath.suffix == '.json':
            self.mentor_posts = pd.read_json(filepath)
        elif filepath.suffix == '.jsonl':
            self.mentor_posts = pd.read_json(filepath, lines=True)
        else:
            raise ValueError(f"Unsupported file format: {filepath.suffix}")
        
        print(f"Loaded {len(self.mentor_posts)} mentor posts from {filepath}")
        print(f"Columns: {list(self.mentor_posts.columns)}")
        
        # Find text column if not specified correctly
        if text_column not in self.mentor_posts.columns:
            # Try common column names
            for col in ['content', 'body', 'selftext', 'text', 'post_content']:
                if col in self.mentor_posts.columns:
                    text_column = col
                    print(f"Using column '{col}' for text content")
                    break
            else:
                raise ValueError(f"Column '{text_column}' not found. Available: {list(self.mentor_posts.columns)}")
        
        # Clean text
        self.mentor_posts['_text_for_embedding'] = (
            self.mentor_posts[text_column]
            .fillna("")
            .astype(str)
        )
        
        # Add title if available (improves matching)
        if 'title' in self.mentor_posts.columns:
            self.mentor_posts['_text_for_embedding'] = (
                self.mentor_posts['title'].fillna("") + " " + 
                self.mentor_posts['_text_for_embedding']
            )
        
        # Filter out very short posts (likely low quality)
        original_count = len(self.mentor_posts)
        self.mentor_posts = self.mentor_posts[
            self.mentor_posts['_text_for_embedding'].str.len() > 50
        ].reset_index(drop=True)
        print(f"Filtered to {len(self.mentor_posts)} posts (removed {original_count - len(self.mentor_posts)} short posts)")
        
        # Generate embeddings (this takes time for large datasets)
        texts = self.mentor_posts['_text_for_embedding'].tolist()
        print(f"Generating embeddings for {len(texts)} posts...")
        print("This may take a few minutes for large datasets...")
        
        self.mentor_embeddings = self.model.encode(
            texts,
            show_progress_bar=True,
            convert_to_numpy=True,
            batch_size=32
        )
        
        print(f"✓ Embeddings generated. Shape: {self.mentor_embeddings.shape}")
    
    def save_embeddings(self, filepath: str):
        """
        Save pre-computed embeddings to disk for faster startup.
        
        Args:
            filepath: Where to save (e.g., 'data/mentor_embeddings.pkl')
        """
        if self.mentor_embeddings is None:
            raise ValueError("No embeddings to save. Call load_mentor_posts() first.")
        
        filepath = Path(filepath)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        with open(filepath, 'wb') as f:
            pickle.dump({
                'posts': self.mentor_posts,
                'embeddings': self.mentor_embeddings,
                'model_name': self.model_name
            }, f)
        
        print(f"✓ Saved embeddings to {filepath}")
        print(f"  File size: {filepath.stat().st_size / 1024 / 1024:.1f} MB")
    
    def load_embeddings(self, filepath: str):
        """
        Load pre-computed embeddings from disk (fast startup).
        
        Args:
            filepath: Path to saved embeddings file
        """
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        
        self.mentor_posts = data['posts']
        self.mentor_embeddings = data['embeddings']
        
        if 'model_name' in data and data['model_name'] != self.model_name:
            print(f"⚠ Warning: Embeddings were created with {data['model_name']}, "
                  f"but current model is {self.model_name}")
        
        print(f"✓ Loaded {len(self.mentor_posts)} posts with embeddings from {filepath}")
    
    def match(self, user_text: str, top_k: int = 5, 
              min_similarity: float = 0.2) -> list[dict]:
        """
        Find mentor posts most similar to user's description.
        
        Args:
            user_text: User's description of their struggle
            top_k: Number of matches to return (default 5)
            min_similarity: Minimum similarity threshold 0-1 (default 0.2)
        
        Returns:
            List of dicts, each containing:
            - All original columns from the mentor post
            - 'similarity_score': float between 0 and 1
        
        Example:
            matches = matcher.match("I feel like no one understands me", top_k=3)
            for m in matches:
                print(f"Score: {m['similarity_score']:.2f}")
                print(f"Post: {m['content'][:200]}...")
        """
        if self.mentor_embeddings is None:
            raise ValueError("No mentor posts loaded. Call load_mentor_posts() or load_embeddings() first.")
        
        if not user_text or not user_text.strip():
            return []
        
        # Embed user text
        user_embedding = self.model.encode([user_text], convert_to_numpy=True)
        
        # Calculate cosine similarity to all mentor posts
        similarities = cosine_similarity(user_embedding, self.mentor_embeddings)[0]
        
        # Get indices of top matches (sorted descending)
        top_indices = np.argsort(similarities)[::-1][:top_k * 2]  # Get extra for filtering
        
        # Build results
        results = []
        for idx in top_indices:
            sim = similarities[idx]
            if sim >= min_similarity and len(results) < top_k:
                post_data = self.mentor_posts.iloc[idx].to_dict()
                post_data['similarity_score'] = float(sim)
                # Remove internal column
                post_data.pop('_text_for_embedding', None)
                results.append(post_data)
        
        return results
    
    def match_batch(self, user_texts: list[str], top_k: int = 5) -> list[list[dict]]:
        """
        Match multiple user texts at once (more efficient).
        
        Args:
            user_texts: List of user descriptions
            top_k: Number of matches per user
        
        Returns:
            List of match lists (one per user)
        """
        if not user_texts:
            return []
        
        # Embed all user texts at once
        user_embeddings = self.model.encode(user_texts, convert_to_numpy=True)
        
        # Calculate similarities for all users
        all_similarities = cosine_similarity(user_embeddings, self.mentor_embeddings)
        
        # Get top matches for each user
        all_results = []
        for i, similarities in enumerate(all_similarities):
            top_indices = np.argsort(similarities)[::-1][:top_k]
            results = []
            for idx in top_indices:
                post_data = self.mentor_posts.iloc[idx].to_dict()
                post_data['similarity_score'] = float(similarities[idx])
                post_data.pop('_text_for_embedding', None)
                results.append(post_data)
            all_results.append(results)
        
        return all_results


# ============================================================================
# QUICK TEST FUNCTION
# ============================================================================

def test_matcher():
    """Quick test to verify the matcher works."""
    print("=" * 60)
    print("TESTING SEMANTIC MATCHER")
    print("=" * 60)
    
    # Create matcher
    matcher = SemanticMatcher()
    
    # Create some fake mentor posts for testing
    fake_posts = pd.DataFrame([
        {"content": "I used to feel so alone, like no one could ever understand me. But I learned that reaching out to others was the first step.", "title": "My journey out of loneliness"},
        {"content": "For years I blamed women for my problems. It took therapy to realize I was the one pushing people away.", "title": "How I escaped the incel mindset"},
        {"content": "Exercise changed my life. Not because it made me attractive, but because it gave me confidence.", "title": "Finding confidence through fitness"},
        {"content": "I spent years on forums that fed my anger. Leaving those spaces was hard but necessary.", "title": "Breaking free from toxic communities"},
        {"content": "Learning to be okay alone was the first step to being okay with others.", "title": "Self-acceptance journey"},
    ])
    
    # Temporarily save and load
    fake_posts.to_csv('/tmp/test_posts.csv', index=False)
    matcher.load_mentor_posts('/tmp/test_posts.csv', text_column='content')
    
    # Test matching
    test_query = "I feel like I'll never find love and it's making me angry at the world"
    print(f"\nTest query: '{test_query}'")
    print("\nMatches:")
    
    matches = matcher.match(test_query, top_k=3)
    for i, m in enumerate(matches, 1):
        print(f"\n{i}. (similarity: {m['similarity_score']:.3f})")
        print(f"   Title: {m.get('title', 'N/A')}")
        print(f"   Content: {m['content'][:100]}...")
    
    print("\n✓ Matcher test complete!")
    return matcher


if __name__ == "__main__":
    test_matcher()
```

### Preparing r/IncelExit Data

Your r/IncelExit data might be in various formats. Here's how to prepare it:

```python
# scripts/prepare_incelexit_data.py

import pandas as pd
from pathlib import Path


def prepare_incelexit_data(input_path: str, output_path: str) -> pd.DataFrame:
    """
    Prepare r/IncelExit data for the semantic matcher.
    
    Handles various input formats and cleans the data.
    
    Args:
        input_path: Path to raw r/IncelExit data (CSV, JSON, or JSONL)
        output_path: Where to save prepared data
    
    Returns:
        Cleaned DataFrame
    """
    input_path = Path(input_path)
    output_path = Path(output_path)
    
    print(f"Loading data from {input_path}")
    
    # Load based on format
    if input_path.suffix == '.csv':
        df = pd.read_csv(input_path)
    elif input_path.suffix == '.json':
        df = pd.read_json(input_path)
    elif input_path.suffix == '.jsonl':
        df = pd.read_json(input_path, lines=True)
    else:
        raise ValueError(f"Unsupported format: {input_path.suffix}")
    
    print(f"Loaded {len(df)} rows")
    print(f"Columns: {list(df.columns)}")
    
    # =========================================================================
    # STEP 1: Identify and standardize the text column
    # =========================================================================
    
    text_col = None
    for col in ['selftext', 'body', 'content', 'text', 'post_body']:
        if col in df.columns:
            text_col = col
            break
    
    if text_col is None:
        print("Available columns:", list(df.columns))
        raise ValueError("Could not find text column. Please specify manually.")
    
    df['content'] = df[text_col].fillna("").astype(str)
    print(f"Using '{text_col}' as content column")
    
    # =========================================================================
    # STEP 2: Clean the data
    # =========================================================================
    
    # Remove deleted/removed posts
    df = df[~df['content'].str.contains(r'\[removed\]|\[deleted\]', case=False, na=False)]
    print(f"After removing [deleted]/[removed]: {len(df)} rows")
    
    # Remove very short posts (likely low quality)
    df = df[df['content'].str.len() > 100]
    print(f"After removing short posts (<100 chars): {len(df)} rows")
    
    # Remove posts that are just links
    df = df[~df['content'].str.match(r'^https?://\S+$', na=False)]
    
    # =========================================================================
    # STEP 3: Add metadata for filtering/display
    # =========================================================================
    
    # Add title if not present
    if 'title' not in df.columns:
        df['title'] = ""
    
    # Add word count for filtering
    df['word_count'] = df['content'].str.split().str.len()
    
    # Flag potential recovery stories (posts about personal growth)
    recovery_keywords = [
        'recovered', 'better now', 'got out', 'escaped', 'changed',
        'realized', 'turning point', 'breakthrough', 'healing',
        'therapy helped', 'learned that', 'i was wrong', 'grew',
        'advice', 'what worked for me', 'my journey'
    ]
    pattern = '|'.join(recovery_keywords)
    df['is_recovery_story'] = df['content'].str.lower().str.contains(pattern, na=False)
    
    print(f"Recovery stories detected: {df['is_recovery_story'].sum()}")
    
    # =========================================================================
    # STEP 4: Select final columns and save
    # =========================================================================
    
    # Keep useful columns
    columns_to_keep = ['content', 'title']
    
    # Add optional columns if they exist
    for col in ['author', 'created_utc', 'score', 'num_comments', 'id', 'permalink']:
        if col in df.columns:
            columns_to_keep.append(col)
    
    # Add our computed columns
    columns_to_keep.extend(['word_count', 'is_recovery_story'])
    
    # Filter to existing columns
    columns_to_keep = [c for c in columns_to_keep if c in df.columns]
    df = df[columns_to_keep].reset_index(drop=True)
    
    # Save
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    
    print(f"\n✓ Saved {len(df)} prepared posts to {output_path}")
    print(f"Columns in output: {list(df.columns)}")
    
    return df


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python prepare_incelexit_data.py <input_path> <output_path>")
        print("Example: python prepare_incelexit_data.py data/raw/incelexit.json data/processed/mentor_posts.csv")
        sys.exit(1)
    
    prepare_incelexit_data(sys.argv[1], sys.argv[2])
```

---

## Component 2: Content Moderator (Trained Model)

This uses the **hackathon Module 5/6 approach** to train a classifier on `train.csv`.

### What This Model Does

- **Input:** Text (user message or mentor post)
- **Output:** `is_risky` (0 or 1) and `risk_score` (0.0 to 1.0)

### What This Model Does NOT Do

- ❌ Cannot have conversations
- ❌ Cannot generate text
- ❌ Cannot match users to posts

### Implementation (Extended from Module 5/6)

```python
# backend/services/moderator.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
from pathlib import Path

# Optional: Neural network version (Module 6)
try:
    import tensorflow as tf
    from tensorflow import keras
    HAS_TENSORFLOW = True
except ImportError:
    HAS_TENSORFLOW = False
    print("TensorFlow not installed. Neural network moderator unavailable.")


class ContentModerator:
    """
    Classifies content as safe/risky using the hackathon training data.
    
    Based on Module 5 (Logistic Regression) and Module 6 (Neural Network).
    
    Used for:
    1. Filtering mentor posts before display
    2. Detecting concerning patterns in user input
    3. Routing crisis situations to appropriate resources
    
    Usage:
        moderator = ContentModerator()
        moderator.train('data/train.csv')
        moderator.save('models/moderator.pkl')
        
        # Later:
        moderator.load('models/moderator.pkl')
        result = moderator.predict("some text to check")
        # result = {'is_risky': True, 'risk_score': 0.73, 'confidence': 0.73}
    """
    
    # Labels considered "safe" (everything else is "risky")
    SAFE_LABELS = ['benign', 'recovery_support']
    
    # Features to extract from text
    FEATURE_NAMES = [
        'word_count',
        'char_count', 
        'avg_word_length',
        'exclamation_count',
        'question_count',
        'caps_ratio',
        'sentence_count',
        'avg_sentence_length',
    ]
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_neural = False
    
    def extract_features(self, text: str) -> dict:
        """
        Extract numeric features from a single text.
        
        These are the features the classifier uses to make predictions.
        """
        if not isinstance(text, str):
            text = str(text) if text else ""
        
        # Basic counts
        words = text.split()
        word_count = len(words)
        char_count = len(text)
        
        # Word statistics
        avg_word_length = char_count / max(word_count, 1)
        
        # Punctuation
        exclamation_count = text.count('!')
        question_count = text.count('?')
        
        # Capitalization
        alpha_chars = [c for c in text if c.isalpha()]
        caps_ratio = sum(1 for c in alpha_chars if c.isupper()) / max(len(alpha_chars), 1)
        
        # Sentence statistics
        sentences = [s.strip() for s in text.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        sentence_count = len(sentences)
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        return {
            'word_count': word_count,
            'char_count': char_count,
            'avg_word_length': avg_word_length,
            'exclamation_count': exclamation_count,
            'question_count': question_count,
            'caps_ratio': caps_ratio,
            'sentence_count': sentence_count,
            'avg_sentence_length': avg_sentence_length,
        }
    
    def _extract_features_batch(self, texts: list) -> np.ndarray:
        """Extract features from multiple texts."""
        features_list = [self.extract_features(t) for t in texts]
        features_df = pd.DataFrame(features_list)
        return features_df[self.FEATURE_NAMES].values
    
    def train(self, train_csv_path: str, use_neural: bool = False) -> dict:
        """
        Train the moderator on hackathon data.
        
        Args:
            train_csv_path: Path to train.csv from hackathon
            use_neural: If True, use neural network (Module 6). 
                       If False, use logistic regression (Module 5).
        
        Returns:
            dict with training metrics
        """
        print(f"Loading training data from {train_csv_path}")
        df = pd.read_csv(train_csv_path)
        df['content'] = df['content'].fillna("").astype(str)
        
        print(f"Loaded {len(df)} examples")
        print(f"Label distribution:\n{df['label'].value_counts()}")
        
        # Extract features
        print("\nExtracting features...")
        X = self._extract_features_batch(df['content'].tolist())
        
        # Create binary label
        df['is_risky'] = (~df['label'].isin(self.SAFE_LABELS)).astype(int)
        y = df['is_risky'].values
        
        print(f"Class balance: {(y == 0).sum()} safe, {(y == 1).sum()} risky")
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set: {len(X_train)}, Validation set: {len(X_val)}")
        
        if use_neural and HAS_TENSORFLOW:
            return self._train_neural(X_train, X_val, y_train, y_val)
        else:
            return self._train_logistic(X_train, X_val, y_train, y_val)
    
    def _train_logistic(self, X_train, X_val, y_train, y_val) -> dict:
        """Train logistic regression model (Module 5 approach)."""
        print("\nTraining Logistic Regression model...")
        
        self.is_neural = False
        self.model = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', LogisticRegression(
                class_weight='balanced',
                max_iter=1000,
                random_state=42
            ))
        ])
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)
        
        print(f"\n✓ Training complete!")
        print(f"Validation accuracy: {accuracy:.3f}")
        print("\nClassification Report:")
        print(classification_report(y_val, y_pred, target_names=['safe', 'risky']))
        
        return {
            'accuracy': accuracy,
            'model_type': 'logistic_regression'
        }
    
    def _train_neural(self, X_train, X_val, y_train, y_val, epochs: int = 50) -> dict:
        """Train neural network model (Module 6 approach)."""
        print("\nTraining Neural Network model...")
        
        self.is_neural = True
        
        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_val_scaled = self.scaler.transform(X_val)
        
        # Build model
        self.model = keras.Sequential([
            keras.layers.Dense(16, activation='relu', input_shape=(len(self.FEATURE_NAMES),)),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(8, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        # Train
        history = self.model.fit(
            X_train_scaled, y_train,
            epochs=epochs,
            batch_size=16,
            validation_data=(X_val_scaled, y_val),
            verbose=1
        )
        
        # Evaluate
        val_loss, val_accuracy = self.model.evaluate(X_val_scaled, y_val, verbose=0)
        
        print(f"\n✓ Training complete!")
        print(f"Validation accuracy: {val_accuracy:.3f}")
        
        return {
            'accuracy': val_accuracy,
            'model_type': 'neural_network',
            'history': history.history
        }
    
    def predict(self, text: str) -> dict:
        """
        Predict if text is risky.
        
        Args:
            text: Text to classify
        
        Returns:
            dict with:
            - is_risky: bool
            - risk_score: float (0-1, probability of being risky)
            - confidence: float (0-1, how confident the model is)
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() or load() first.")
        
        features = self.extract_features(text)
        X = np.array([[features[col] for col in self.FEATURE_NAMES]])
        
        if self.is_neural:
            X_scaled = self.scaler.transform(X)
            risk_score = float(self.model.predict(X_scaled, verbose=0)[0][0])
        else:
            probabilities = self.model.predict_proba(X)[0]
            risk_score = float(probabilities[1])  # Probability of risky class
        
        return {
            'is_risky': risk_score > 0.5,
            'risk_score': risk_score,
            'confidence': max(risk_score, 1 - risk_score)
        }
    
    def predict_batch(self, texts: list[str]) -> list[dict]:
        """Predict for multiple texts."""
        return [self.predict(text) for text in texts]
    
    def save(self, filepath: str):
        """Save trained model to disk."""
        filepath = Path(filepath)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        with open(filepath, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'scaler': self.scaler,
                'is_neural': self.is_neural,
                'feature_names': self.FEATURE_NAMES,
                'safe_labels': self.SAFE_LABELS
            }, f)
        
        print(f"✓ Saved model to {filepath}")
    
    def load(self, filepath: str):
        """Load trained model from disk."""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        
        self.model = data['model']
        self.scaler = data.get('scaler')
        self.is_neural = data.get('is_neural', False)
        
        print(f"✓ Loaded {'neural' if self.is_neural else 'logistic regression'} model from {filepath}")


# ============================================================================
# QUICK TEST FUNCTION
# ============================================================================

def test_moderator():
    """Quick test without actual training data."""
    print("=" * 60)
    print("TESTING CONTENT MODERATOR")
    print("=" * 60)
    
    moderator = ContentModerator()
    
    # Test feature extraction
    test_text = "I HATE everyone! Why won't anyone love me???"
    features = moderator.extract_features(test_text)
    print(f"\nFeatures for: '{test_text}'")
    for k, v in features.items():
        print(f"  {k}: {v}")
    
    print("\n✓ Feature extraction works!")
    print("\nTo train the model, run:")
    print("  moderator.train('data/train.csv')")
    
    return moderator


if __name__ == "__main__":
    test_moderator()
```

---

## Component 3: Chat Interface (LLM API)

This uses **Claude or GPT API** to help users articulate their struggles.

### Why LLM API (Not Your Trained Model)?

Your trained classifier can only output "risky/not risky". It cannot:
- Have a conversation
- Ask follow-up questions
- Help users express themselves

For that, you need an LLM API.

### Implementation

```python
# backend/services/chat.py

import os
from typing import Optional

# Try to import Anthropic SDK
try:
    from anthropic import Anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

# Try to import OpenAI SDK
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False


class ChatAssistant:
    """
    Conversational interface that helps users articulate their struggles.
    
    IMPORTANT: This does NOT provide advice or therapy.
    It helps users express their feelings clearly, then passes to the matcher.
    
    Uses Claude or GPT API (NOT your trained classifier).
    
    Usage:
        chat = ChatAssistant()
        response = chat.send("I don't know how to explain how I feel")
        # Response helps user articulate better
        
        summary = chat.get_summary()
        # Use summary as input to semantic matcher
    """
    
    SYSTEM_PROMPT = """You are a compassionate listener helping someone express what they're going through.

Your role is to:
1. Listen empathetically and acknowledge their feelings
2. Ask gentle clarifying questions to understand their situation better
3. Help them put their feelings into words
4. After 2-3 exchanges, summarize the key themes

You do NOT:
- Give advice or solutions
- Act as a therapist or counselor
- Make diagnoses or judgments
- Generate lengthy responses

Keep responses brief (2-3 sentences) and warm. Focus on understanding, not fixing.

When summarizing, use this format:
SUMMARY:
- Main struggle: [one sentence description]
- Key feelings: [emotions mentioned]
- Themes: [relevant themes like: loneliness, relationships, self-esteem, anger, rejection, belonging]
"""
    
    def __init__(self, provider: str = "anthropic", api_key: Optional[str] = None):
        """
        Initialize chat assistant.
        
        Args:
            provider: "anthropic" (Claude) or "openai" (GPT)
            api_key: API key (or set ANTHROPIC_API_KEY / OPENAI_API_KEY env var)
        """
        self.provider = provider
        self.conversation_history = []
        
        if provider == "anthropic":
            if not HAS_ANTHROPIC:
                raise ImportError("anthropic package not installed. Run: pip install anthropic")
            self.client = Anthropic(api_key=api_key or os.getenv('ANTHROPIC_API_KEY'))
            self.model = "claude-3-haiku-20240307"  # Fast and cheap
        elif provider == "openai":
            if not HAS_OPENAI:
                raise ImportError("openai package not installed. Run: pip install openai")
            self.client = OpenAI(api_key=api_key or os.getenv('OPENAI_API_KEY'))
            self.model = "gpt-3.5-turbo"  # Fast and cheap
        else:
            raise ValueError(f"Unknown provider: {provider}")
    
    def send(self, user_message: str) -> str:
        """
        Send a message and get a response.
        
        Args:
            user_message: What the user said
        
        Returns:
            Assistant's response
        """
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        if self.provider == "anthropic":
            response = self.client.messages.create(
                model=self.model,
                max_tokens=300,
                system=self.SYSTEM_PROMPT,
                messages=self.conversation_history
            )
            assistant_message = response.content[0].text
        else:  # openai
            messages = [{"role": "system", "content": self.SYSTEM_PROMPT}]
            messages.extend(self.conversation_history)
            response = self.client.chat.completions.create(
                model=self.model,
                max_tokens=300,
                messages=messages
            )
            assistant_message = response.choices[0].message.content
        
        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return assistant_message
    
    def get_summary(self) -> str:
        """
        Ask the assistant to summarize the conversation.
        Use this as input to the semantic matcher.
        """
        return self.send("Please provide a SUMMARY of what I've shared, using the format specified.")
    
    def get_user_text_for_matching(self) -> str:
        """
        Combine all user messages for matching.
        Alternative to get_summary() - uses raw text instead of LLM summary.
        """
        user_messages = [
            msg['content'] for msg in self.conversation_history 
            if msg['role'] == 'user'
        ]
        return " ".join(user_messages)
    
    def reset(self):
        """Clear conversation history for a new session."""
        self.conversation_history = []
    
    def get_message_count(self) -> int:
        """How many messages in the conversation."""
        return len(self.conversation_history)


# ============================================================================
# NO-API ALTERNATIVE
# ============================================================================

def simple_intake_prompt() -> str:
    """
    If you don't want to use LLM API, you can use a simple form instead.
    
    Returns template text to show users.
    """
    return """
Tell us what you're going through. Take your time.

Some questions that might help:
- What's been on your mind lately?
- How have you been feeling?
- Is there a specific situation or thought that's been bothering you?
- What would you like to change or feel differently about?

(Your response is private and will only be used to find relevant stories from others who've been through similar experiences.)
"""


# ============================================================================
# TEST
# ============================================================================

def test_chat():
    """Test chat assistant (requires API key)."""
    print("=" * 60)
    print("TESTING CHAT ASSISTANT")
    print("=" * 60)
    
    # Check for API keys
    if os.getenv('ANTHROPIC_API_KEY'):
        print("Found ANTHROPIC_API_KEY")
        provider = "anthropic"
    elif os.getenv('OPENAI_API_KEY'):
        print("Found OPENAI_API_KEY")
        provider = "openai"
    else:
        print("No API key found. Set ANTHROPIC_API_KEY or OPENAI_API_KEY")
        print("\nAlternative: Use simple_intake_prompt() instead of chat")
        print(simple_intake_prompt())
        return None
    
    chat = ChatAssistant(provider=provider)
    
    # Simulate conversation
    responses = []
    
    test_messages = [
        "I don't really know how to explain how I feel",
        "I guess I just feel like no one really gets me, you know?",
    ]
    
    for msg in test_messages:
        print(f"\nUser: {msg}")
        response = chat.send(msg)
        print(f"Assistant: {response}")
        responses.append(response)
    
    # Get summary
    print("\n" + "-" * 40)
    summary = chat.get_summary()
    print(f"Summary:\n{summary}")
    
    return chat


if __name__ == "__main__":
    test_chat()
```

---

## Training Pipeline

### Complete Training Script

```python
# scripts/train_all_models.py

#!/usr/bin/env python3
"""
Train all AI models for the peer support platform.

This script:
1. Prepares r/IncelExit data for semantic matching
2. Generates embeddings for mentor posts
3. Trains content moderation classifier

Usage:
    python scripts/train_all_models.py

Requirements:
    - data/raw/train.csv (hackathon training data)
    - data/raw/incelexit_posts.csv (or .json) (mentor stories)
"""

import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Now import our modules
from backend.services.matcher import SemanticMatcher
from backend.services.moderator import ContentModerator


# ============================================================================
# CONFIGURATION - ADJUST THESE PATHS
# ============================================================================

# Input files (adjust based on your data)
HACKATHON_TRAIN_CSV = 'data/raw/train.csv'
INCELEXIT_RAW_FILE = 'data/raw/incelexit_posts.csv'  # or .json

# Output files
PREPARED_MENTOR_CSV = 'data/processed/mentor_posts.csv'
MENTOR_EMBEDDINGS_PKL = 'data/processed/mentor_embeddings.pkl'
MODERATOR_MODEL_PKL = 'models/moderator.pkl'

# Settings
USE_NEURAL_MODERATOR = False  # True for neural net (Module 6), False for logistic (Module 5)


# ============================================================================
# STEP 1: Prepare IncelExit Data
# ============================================================================

def step1_prepare_data():
    """Prepare r/IncelExit data for matching."""
    print("\n" + "=" * 60)
    print("STEP 1: Prepare r/IncelExit data")
    print("=" * 60)
    
    input_path = Path(INCELEXIT_RAW_FILE)
    output_path = Path(PREPARED_MENTOR_CSV)
    
    if not input_path.exists():
        print(f"⚠ WARNING: {input_path} not found")
        print("Skipping this step. You'll need to provide mentor data.")
        print(f"Expected file: {input_path.absolute()}")
        return False
    
    # Import and run preparation
    from scripts.prepare_incelexit_data import prepare_incelexit_data
    prepare_incelexit_data(str(input_path), str(output_path))
    return True


# ============================================================================
# STEP 2: Generate Embeddings
# ============================================================================

def step2_generate_embeddings():
    """Generate embeddings for semantic matching."""
    print("\n" + "=" * 60)
    print("STEP 2: Generate embeddings for semantic matching")
    print("=" * 60)
    
    mentor_file = Path(PREPARED_MENTOR_CSV)
    
    if not mentor_file.exists():
        print(f"⚠ WARNING: {mentor_file} not found")
        print("Skipping embedding generation.")
        return False
    
    matcher = SemanticMatcher()
    matcher.load_mentor_posts(str(mentor_file), text_column='content')
    
    # Save embeddings
    output_path = Path(MENTOR_EMBEDDINGS_PKL)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    matcher.save_embeddings(str(output_path))
    
    # Quick test
    print("\nQuick test of matching...")
    test_query = "I feel alone and like no one understands me"
    matches = matcher.match(test_query, top_k=3)
    print(f"Query: '{test_query}'")
    print(f"Found {len(matches)} matches")
    if matches:
        print(f"Top match similarity: {matches[0]['similarity_score']:.3f}")
    
    return True


# ============================================================================
# STEP 3: Train Content Moderator
# ============================================================================

def step3_train_moderator():
    """Train the content moderation classifier."""
    print("\n" + "=" * 60)
    print("STEP 3: Train content moderator")
    print("=" * 60)
    
    train_file = Path(HACKATHON_TRAIN_CSV)
    
    if not train_file.exists():
        print(f"⚠ WARNING: {train_file} not found")
        print("Skipping moderator training.")
        print(f"Expected file: {train_file.absolute()}")
        return False
    
    moderator = ContentModerator()
    
    model_type = "neural network" if USE_NEURAL_MODERATOR else "logistic regression"
    print(f"Training {model_type} classifier...")
    
    results = moderator.train(str(train_file), use_neural=USE_NEURAL_MODERATOR)
    
    # Save model
    output_path = Path(MODERATOR_MODEL_PKL)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    moderator.save(str(output_path))
    
    # Quick test
    print("\nQuick test of moderation...")
    test_texts = [
        "I really appreciate your support, thank you!",
        "All women are trash and deserve to suffer",
        "I've been feeling down lately, could use some advice"
    ]
    
    for text in test_texts:
        result = moderator.predict(text)
        status = "🚨 RISKY" if result['is_risky'] else "✓ Safe"
        print(f"{status} ({result['risk_score']:.2f}): {text[:50]}...")
    
    return True


# ============================================================================
# MAIN
# ============================================================================

def main():
    print("=" * 60)
    print("AI MODEL TRAINING PIPELINE")
    print("=" * 60)
    
    # Create directories
    Path('data/processed').mkdir(parents=True, exist_ok=True)
    Path('models').mkdir(parents=True, exist_ok=True)
    
    # Run steps
    step1_success = step1_prepare_data()
    step2_success = step2_generate_embeddings()
    step3_success = step3_train_moderator()
    
    # Summary
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)
    print("\nResults:")
    print(f"  Step 1 (Prepare data):        {'✓' if step1_success else '⚠ Skipped'}")
    print(f"  Step 2 (Generate embeddings): {'✓' if step2_success else '⚠ Skipped'}")
    print(f"  Step 3 (Train moderator):     {'✓' if step3_success else '⚠ Skipped'}")
    
    print("\nOutput files:")
    for path in [PREPARED_MENTOR_CSV, MENTOR_EMBEDDINGS_PKL, MODERATOR_MODEL_PKL]:
        exists = "✓" if Path(path).exists() else "✗"
        print(f"  {exists} {path}")
    
    print("\nNext steps:")
    print("  1. Run the backend: cd backend && uvicorn main:app --reload")
    print("  2. Test the API at http://localhost:8000/docs")


if __name__ == '__main__':
    main()
```

---

## Backend Integration

### FastAPI Main File

```python
# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from pathlib import Path

# Initialize FastAPI
app = FastAPI(
    title="Peer Support Platform API",
    description="AI-powered matching to real mentor stories",
    version="0.1.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# LOAD AI MODELS AT STARTUP
# ============================================================================

from services.matcher import SemanticMatcher
from services.moderator import ContentModerator

# Paths to trained models
EMBEDDINGS_PATH = Path("../data/processed/mentor_embeddings.pkl")
MODERATOR_PATH = Path("../models/moderator.pkl")

# Initialize (will be loaded on startup)
matcher: Optional[SemanticMatcher] = None
moderator: Optional[ContentModerator] = None


@app.on_event("startup")
async def load_models():
    """Load AI models when the server starts."""
    global matcher, moderator
    
    # Load semantic matcher
    if EMBEDDINGS_PATH.exists():
        print(f"Loading embeddings from {EMBEDDINGS_PATH}")
        matcher = SemanticMatcher()
        matcher.load_embeddings(str(EMBEDDINGS_PATH))
    else:
        print(f"⚠ Embeddings not found at {EMBEDDINGS_PATH}")
        print("  Matching will not work until you run the training pipeline.")
    
    # Load content moderator
    if MODERATOR_PATH.exists():
        print(f"Loading moderator from {MODERATOR_PATH}")
        moderator = ContentModerator()
        moderator.load(str(MODERATOR_PATH))
    else:
        print(f"⚠ Moderator not found at {MODERATOR_PATH}")
        print("  Content moderation will not work until you run the training pipeline.")


# ============================================================================
# API MODELS
# ============================================================================

class MatchRequest(BaseModel):
    user_text: str
    num_matches: int = 5
    
class MatchResult(BaseModel):
    content: str
    title: Optional[str] = None
    similarity_score: float
    # Add other fields from your mentor data

class MatchResponse(BaseModel):
    matches: list[dict]
    warning: Optional[str] = None
    user_risk_score: Optional[float] = None

class ModerateRequest(BaseModel):
    text: str

class ModerateResponse(BaseModel):
    is_risky: bool
    risk_score: float
    confidence: float


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "matcher_loaded": matcher is not None,
        "moderator_loaded": moderator is not None
    }


@app.post("/api/match", response_model=MatchResponse)
async def match_to_mentors(request: MatchRequest):
    """
    Match user's description to relevant mentor stories.
    
    This is the CORE API endpoint.
    """
    if matcher is None:
        raise HTTPException(
            status_code=503, 
            detail="Matcher not loaded. Run training pipeline first."
        )
    
    # Step 1: Check user input with moderator (if available)
    user_risk_score = None
    warning = None
    
    if moderator is not None:
        mod_result = moderator.predict(request.user_text)
        user_risk_score = mod_result['risk_score']
        
        if mod_result['is_risky'] and mod_result['risk_score'] > 0.8:
            warning = "crisis_detected"
            # Still return matches, but flag the concern
    
    # Step 2: Find matching mentor stories
    matches = matcher.match(request.user_text, top_k=request.num_matches)
    
    # Step 3: Filter matches through moderator (if available)
    if moderator is not None:
        safe_matches = []
        for match in matches:
            content = match.get('content', '')
            mod_result = moderator.predict(content)
            if not mod_result['is_risky']:
                safe_matches.append(match)
            # If risky, skip this mentor post
        matches = safe_matches
    
    return MatchResponse(
        matches=matches,
        warning=warning,
        user_risk_score=user_risk_score
    )


@app.post("/api/moderate", response_model=ModerateResponse)
async def moderate_content(request: ModerateRequest):
    """
    Check if content is risky.
    
    Used for:
    - Checking user input
    - Filtering mentor posts
    """
    if moderator is None:
        raise HTTPException(
            status_code=503,
            detail="Moderator not loaded. Run training pipeline first."
        )
    
    result = moderator.predict(request.text)
    return ModerateResponse(**result)


# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## File Structure

```
esafety-hackathon/
├── CLAUDE_AI_TRAINING.md          # THIS FILE - give to Claude Code
├── data/
│   ├── raw/
│   │   ├── train.csv              # Hackathon training data
│   │   ├── test.csv               # Hackathon test data
│   │   └── incelexit_posts.csv    # r/IncelExit mentor stories (YOU PROVIDE)
│   └── processed/
│       ├── mentor_posts.csv       # Cleaned mentor data (generated)
│       └── mentor_embeddings.pkl  # Pre-computed embeddings (generated)
├── models/
│   └── moderator.pkl              # Trained content moderator (generated)
├── backend/
│   ├── main.py                    # FastAPI app with endpoints
│   ├── requirements.txt           # Python dependencies
│   └── services/
│       ├── __init__.py
│       ├── matcher.py             # SemanticMatcher class
│       ├── moderator.py           # ContentModerator class
│       └── chat.py                # ChatAssistant class (LLM API)
├── scripts/
│   ├── prepare_incelexit_data.py  # Data preparation script
│   └── train_all_models.py        # Main training pipeline
└── frontend/
    └── ...                        # Your Next.js app
```

---

## Quick Start Commands

```bash
# ============================================================================
# 1. INSTALL DEPENDENCIES
# ============================================================================

cd backend
pip install -r requirements.txt

# Requirements should include:
# - fastapi
# - uvicorn
# - pandas
# - numpy
# - scikit-learn
# - sentence-transformers
# - anthropic (optional, for chat)
# - openai (optional, for chat)
# - tensorflow (optional, for neural net moderator)


# ============================================================================
# 2. PREPARE YOUR DATA
# ============================================================================

# Put your files in data/raw/:
# - train.csv (from hackathon)
# - incelexit_posts.csv or incelexit_posts.json (your mentor data)


# ============================================================================
# 3. RUN TRAINING PIPELINE
# ============================================================================

python scripts/train_all_models.py

# This will:
# - Prepare IncelExit data → data/processed/mentor_posts.csv
# - Generate embeddings → data/processed/mentor_embeddings.pkl
# - Train moderator → models/moderator.pkl


# ============================================================================
# 4. START THE BACKEND
# ============================================================================

cd backend
uvicorn main:app --reload

# API will be at http://localhost:8000
# Docs at http://localhost:8000/docs


# ============================================================================
# 5. TEST THE API
# ============================================================================

# Test matching
curl -X POST "http://localhost:8000/api/match" \
  -H "Content-Type: application/json" \
  -d '{"user_text": "I feel alone and like no one understands me", "num_matches": 3}'

# Test moderation
curl -X POST "http://localhost:8000/api/moderate" \
  -H "Content-Type: application/json" \
  -d '{"text": "I hate everyone"}'
```

---

## Summary: What Does What?

| Your Question | Answer |
|---------------|--------|
| "How do I train the AI?" | Run `python scripts/train_all_models.py` — trains moderator on hackathon data |
| "Does training give me a chat AI?" | NO — training gives you a classifier (yes/no decisions), not a chat bot |
| "How do I get chat functionality?" | Use LLM API (Claude or GPT) — see `services/chat.py` |
| "How do I match users to mentor posts?" | Use embeddings (sentence-transformers) — see `services/matcher.py` |
| "Should I use LLM API?" | YES for chat, NO for matching/classification |
| "Where does r/IncelExit data go?" | Put in `data/raw/`, training pipeline will process it |
| "How do I integrate into backend?" | See `backend/main.py` — models load at startup, endpoints use them |

---

## For Claude Code

When working with Claude Code, you can say:

> "Read CLAUDE_AI_TRAINING.md and help me [task]"

Example tasks:
- "Help me run the training pipeline on my data"
- "Help me add a new API endpoint for batch matching"
- "Help me test the moderator on some sample texts"
- "Help me integrate the chat assistant with Claude API"
