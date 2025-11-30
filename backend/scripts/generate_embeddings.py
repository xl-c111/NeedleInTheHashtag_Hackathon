"""
Generate embeddings for mentor posts from Supabase.

This creates a .pkl file that the matcher service uses for fast startup.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from supabase import create_client, Client
from services.matcher import SemanticMatcher

# Load environment variables
load_dotenv()

# Initialize Supabase client
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
    sys.exit(1)

supabase: Client = create_client(url, key)

print("="*60)
print("GENERATING EMBEDDINGS FOR MENTOR POSTS")
print("="*60)

# Fetch all posts from Supabase
print("\n1. Fetching posts from Supabase...")
try:
    response = supabase.table('posts').select("*").execute()
    posts = response.data
    print(f"   Fetched {len(posts)} posts")
except Exception as e:
    print(f"Error fetching posts: {str(e)}")
    sys.exit(1)

if not posts:
    print("No posts found in database. Please add posts first.")
    sys.exit(1)

# Initialize matcher
print("\n2. Initializing semantic matcher...")
matcher = SemanticMatcher()

# Load posts into matcher (this generates embeddings)
print("\n3. Generating embeddings (this may take a minute)...")
matcher.load_mentor_posts_from_list(posts)

# Save embeddings to file
output_path = Path("../data/processed/mentor_embeddings.pkl")
output_path.parent.mkdir(parents=True, exist_ok=True)

print(f"\n4. Saving embeddings to {output_path}...")
matcher.save_embeddings(str(output_path))

print("\n" + "="*60)
print("SUCCESS")
print("="*60)
print(f"Generated embeddings for {len(posts)} posts")
print(f"Saved to: {output_path}")
print("\nNext steps:")
print("1. Start the backend API: uvicorn main:app --reload")
print("2. Test the /api/match endpoint")
print("3. Integrate with Next.js frontend")
