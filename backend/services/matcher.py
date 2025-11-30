"""
Semantic Matcher Service

Matches user descriptions to relevant mentor posts using embeddings.
This is the CORE AI component of the Been There platform.
"""

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import pickle
from pathlib import Path
from typing import Optional


class SemanticMatcher:
    """
    Matches user descriptions to relevant mentor posts using embeddings.

    Uses pre-trained sentence-transformers — NO TRAINING REQUIRED!

    Usage:
        matcher = SemanticMatcher()
        matcher.load_mentor_posts('data/mentor_posts.csv')
        matcher.save_embeddings('data/mentor_embeddings.pkl')

        # Later (fast startup):
        matcher.load_embeddings('data/mentor_embeddings.pkl')
        matches = matcher.match("I feel so lonely", top_k=5)
    """

    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize with a sentence-transformer model.

        Recommended models:
        - 'all-MiniLM-L6-v2': Fast, good quality (RECOMMENDED)
        - 'all-mpnet-base-v2': Slower, best quality

        The model downloads automatically on first use (~90MB).
        """
        print(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.model_name = model_name
        self.mentor_posts: Optional[pd.DataFrame] = None
        self.mentor_embeddings: Optional[np.ndarray] = None

    def load_mentor_posts_from_list(self, posts: list[dict]):
        """
        Load mentor posts from a list of dictionaries.

        Args:
            posts: List of dicts with at least 'content' field

        Each post should have:
        - content: str (the post text)
        - title: str (optional)
        - id: str (optional)
        - tags: list[str] (optional)
        """
        self.mentor_posts = pd.DataFrame(posts)

        print(f"Loaded {len(self.mentor_posts)} mentor posts")
        print(f"Columns: {list(self.mentor_posts.columns)}")

        # Find text column
        text_column = 'content'
        if text_column not in self.mentor_posts.columns:
            for col in ['body', 'selftext', 'text', 'post_content']:
                if col in self.mentor_posts.columns:
                    text_column = col
                    print(f"Using column '{col}' for text content")
                    break
            else:
                raise ValueError(f"No text column found. Available: {list(self.mentor_posts.columns)}")

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

        # Filter out very short posts
        original_count = len(self.mentor_posts)
        self.mentor_posts = self.mentor_posts[
            self.mentor_posts['_text_for_embedding'].str.len() > 50
        ].reset_index(drop=True)
        print(f"Filtered to {len(self.mentor_posts)} posts (removed {original_count - len(self.mentor_posts)} short posts)")

        # Generate embeddings
        texts = self.mentor_posts['_text_for_embedding'].tolist()
        print(f"Generating embeddings for {len(texts)} posts...")

        self.mentor_embeddings = self.model.encode(
            texts,
            show_progress_bar=True,
            convert_to_numpy=True,
            batch_size=32
        )

        print(f"Embeddings generated. Shape: {self.mentor_embeddings.shape}")

    def save_embeddings(self, filepath: str):
        """
        Save pre-computed embeddings to disk for faster startup.

        Args:
            filepath: Where to save (e.g., 'data/mentor_embeddings.pkl')
        """
        if self.mentor_embeddings is None:
            raise ValueError("No embeddings to save. Call load_mentor_posts_from_list() first.")

        filepath = Path(filepath)
        filepath.parent.mkdir(parents=True, exist_ok=True)

        with open(filepath, 'wb') as f:
            pickle.dump({
                'posts': self.mentor_posts,
                'embeddings': self.mentor_embeddings,
                'model_name': self.model_name
            }, f)

        print(f"Saved embeddings to {filepath}")
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
            print(f"Warning: Embeddings were created with {data['model_name']}, "
                  f"but current model is {self.model_name}")

        print(f"Loaded {len(self.mentor_posts)} posts with embeddings from {filepath}")

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
            raise ValueError("No mentor posts loaded. Call load_mentor_posts_from_list() or load_embeddings() first.")

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
