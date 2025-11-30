"""
Fetch mentor posts from Supabase to see their structure.

This will help us understand the data format and prepare embeddings.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from supabase import create_client, Client

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
print("FETCHING MENTOR POSTS FROM SUPABASE")
print("="*60)

# Fetch posts from posts table (Reddit data)
try:
    response = supabase.table('posts').select("*").limit(5).execute()

    posts = response.data

    print(f"\nFound {len(posts)} posts (showing first 5)\n")

    for i, post in enumerate(posts, 1):
        print(f"--- Post {i} ---")
        print(f"ID: {post.get('id')}")
        print(f"User ID: {post.get('user_id', 'N/A')}")
        print(f"Content preview: {post.get('content', '')[:200]}...")
        print(f"Topic tags: {post.get('topic_tags', [])}")
        print(f"Post ID: {post.get('post_id', 'N/A')}")
        print(f"Comment ID: {post.get('comment_id', 'N/A')}")
        print(f"Timestamp: {post.get('timestamp', 'N/A')}")
        print()

    # Show all available fields
    if posts:
        print("Available fields:")
        print(list(posts[0].keys()))

    # Get total count
    count_response = supabase.table('posts').select("*", count='exact').execute()
    total = count_response.count

    print(f"\nTotal posts in database: {total}")

except Exception as e:
    print(f"Error fetching posts: {str(e)}")
    sys.exit(1)

print("\n" + "="*60)
print("NEXT STEPS")
print("="*60)
print("1. Review the post structure above")
print("2. Run generate_embeddings.py to create embeddings for matching")
print("3. Start the backend API: uvicorn main:app --reload")
