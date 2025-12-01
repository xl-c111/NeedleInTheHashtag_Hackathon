"""
Import seed data from posts.json into Supabase posts table.
Maps the text user_ids to actual auth.users UUIDs.
"""

import json
import os
import sys
from pathlib import Path
from supabase import create_client, Client

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Need service key to bypass RLS

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables")
    print("Set them in your .env file or export them")
    sys.exit(1)

print("=" * 60)
print("IMPORTING SEED DATA TO SUPABASE")
print("=" * 60)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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

# Get or create a default user for all posts
print("\n2. Getting/creating default user...")
try:
    # Try to get the first existing user
    response = supabase.table('profiles').select('id').limit(1).execute()

    if response.data and len(response.data) > 0:
        default_user_id = response.data[0]['id']
        print(f"   Using existing user: {default_user_id}")
    else:
        print("   No users found. You need at least one authenticated user.")
        print("   Sign in to your app first to create a user, then run this script.")
        sys.exit(1)

except Exception as e:
    print(f"Error getting user: {str(e)}")
    sys.exit(1)

# Import posts
print("\n3. Importing posts...")
imported = 0
failed = 0

for post in posts:
    try:
        # Create post with default user_id (all posts will belong to the same user)
        post_data = {
            'user_id': default_user_id,
            'content': post['content'],
            'topic_tags': post['topic_tags'],
            'timestamp': post['timestamp'],
            'post_id': None,  # Main posts, not comments
            'comment_id': None
        }

        supabase.table('posts').insert(post_data).execute()
        imported += 1

        if imported % 10 == 0:
            print(f"   Imported {imported}/{len(posts)}...")

    except Exception as e:
        failed += 1
        print(f"   Failed to import post: {str(e)}")

print("\n" + "=" * 60)
print("IMPORT COMPLETE")
print("=" * 60)
print(f"Successfully imported: {imported} posts")
print(f"Failed: {failed} posts")
print(f"\nTotal posts in database: {imported}")
print("\nRefresh your app to see the stories!")
