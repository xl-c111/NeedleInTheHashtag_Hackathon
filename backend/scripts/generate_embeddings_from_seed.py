"""
Generate embeddings from local seed data (for testing without Supabase).

This version doesn't require Supabase to be set up yet.
It reads directly from data/seed/posts.json
"""

import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.matcher import SemanticMatcher

print("="*60)
print("GENERATING EMBEDDINGS FROM SEED DATA")
print("="*60)

# Read seed data
seed_file = Path(__file__).parent.parent.parent / "data" / "seed" / "posts.json"

print(f"\n1. Reading posts from {seed_file}...")
try:
    with open(seed_file, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    print(f"   Loaded {len(posts)} posts")
except Exception as e:
    print(f"Error reading seed file: {str(e)}")
    sys.exit(1)

if not posts:
    print("No posts found in seed file.")
    sys.exit(1)

# Initialize matcher
print("\n2. Initializing semantic matcher...")
print("   (This will download ~90MB model on first run)")
matcher = SemanticMatcher()

# Load posts into matcher (this generates embeddings)
print("\n3. Generating embeddings (this may take a minute)...")
matcher.load_mentor_posts_from_list(posts)

# Save embeddings to file
output_path = Path(__file__).parent.parent.parent / "data" / "processed" / "mentor_embeddings.pkl"
output_path.parent.mkdir(parents=True, exist_ok=True)

print(f"\n4. Saving embeddings to {output_path}...")
matcher.save_embeddings(str(output_path))

print("\n" + "="*60)
print("SUCCESS")
print("="*60)
print(f"Generated embeddings for {len(posts)} posts")
print(f"Saved to: {output_path.absolute()}")
print(f"\nTest the matcher:")
print("  cd backend")
print("  python scripts/test_matcher.py")
print(f"\nStart the backend API:")
print("  cd backend")
print("  python -m uvicorn main:app --reload")
print("\nAPI will be available at http://localhost:8000")
print("API docs at http://localhost:8000/docs")
