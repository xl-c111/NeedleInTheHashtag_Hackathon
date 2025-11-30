#!/usr/bin/env python3
"""
Upload posts from JSON file to Supabase database
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path to import config
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.config import supabase


def upload_posts(json_file_path: str, batch_size: int = 100):
    """
    Upload posts from JSON file to Supabase

    Args:
        json_file_path: Path to the JSON file containing posts
        batch_size: Number of posts to upload in each batch
    """
    print(f"Reading posts from {json_file_path}...")

    with open(json_file_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    print(f"Found {len(posts)} posts")

    # Transform posts to match database schema
    db_posts = []
    for post in posts:
        db_post = {
            'user_id': post['user_id'],
            'content': post['content'],
            'post_id': post.get('post_id'),
            'comment_id': post.get('comment_id'),
            'topic_tags': post.get('topic_tags', []),
            'timestamp': post.get('timestamp'),
        }
        db_posts.append(db_post)

    # Upload in batches
    total_uploaded = 0
    for i in range(0, len(db_posts), batch_size):
        batch = db_posts[i:i + batch_size]

        try:
            response = supabase.table('posts').insert(batch).execute()
            total_uploaded += len(batch)
            print(f"Uploaded {total_uploaded}/{len(db_posts)} posts...")
        except Exception as e:
            print(f"Error uploading batch {i//batch_size + 1}: {e}")
            # Continue with next batch
            continue

    print(f"\n✅ Successfully uploaded {total_uploaded} posts to Supabase!")


def main():
    # Default path to posts.json
    default_path = Path(__file__).parent.parent / 'data' / 'seed' / 'posts.json'

    if len(sys.argv) > 1:
        json_file = sys.argv[1]
    else:
        json_file = str(default_path)

    if not os.path.exists(json_file):
        print(f"❌ Error: File not found: {json_file}")
        sys.exit(1)

    upload_posts(json_file)


if __name__ == '__main__':
    main()
