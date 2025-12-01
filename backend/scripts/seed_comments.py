"""
Script to seed mock comments/replies to posts in Supabase.

This creates realistic comments and threaded replies for the existing posts
to demonstrate the forum-like discussion feature.
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta
import random

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

# Load environment variables from root .env
root_dir = backend_dir.parent
load_dotenv(root_dir / '.env')

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not service_key:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
    sys.exit(1)

supabase: Client = create_client(url, service_key)

# Mock user IDs (use existing or create anonymous ones)
MOCK_USER_IDS = [
    "00000000-0000-0000-0000-000000000001",
    "00000000-0000-0000-0000-000000000002",
    "00000000-0000-0000-0000-000000000003",
    "00000000-0000-0000-0000-000000000004",
    "00000000-0000-0000-0000-000000000005",
    "00000000-0000-0000-0000-000000000006",
]

# Mock comments - supportive and relevant to incel/men's mental health topics
MOCK_COMMENTS = [
    "Thank you for sharing this. I went through something similar and it really helps to know I'm not alone.",
    "This hit home. I've been struggling with these feelings too. Anyone else finding it hard to reach out?",
    "Really appreciate your honesty here. It takes courage to open up about this stuff.",
    "I used to think the same way, but therapy helped me see things differently. Have you considered talking to someone?",
    "Man, I feel you on this. The isolation is the worst part. Have you tried joining any local groups?",
    "This is exactly what I needed to read today. Thank you for posting.",
    "I've been there. What helped me was focusing on small goals and celebrating tiny wins.",
    "Your story resonates with me. I found that volunteering helped me connect with others.",
    "Thanks for being real about this. The pressure to have it all figured out is exhausting.",
    "I went through a similar phase. It gets better, but it takes time and effort.",
    "This is so relatable. Anyone else here struggling with social anxiety?",
    "I appreciate you sharing this perspective. It's helping me understand my own feelings better.",
    "Have you looked into CBT? It's been really helpful for me with these thoughts.",
    "I used to blame others too, but working on myself changed everything.",
    "This is important. More men need to talk about mental health openly.",
    "I'm glad you're here sharing this. It's the first step to getting better.",
    "Your experience mirrors mine. The gym helped me a lot with self-esteem.",
    "Thanks for posting. Reading stories like this keeps me motivated to keep trying.",
    "I struggled with the same thing. Joining a men's group helped me realize I wasn't broken.",
    "This is tough stuff to talk about. Respect for being open.",
]

MOCK_REPLIES = [
    "Thanks for the encouragement. It means a lot.",
    "Yeah, that's a good point. I'll look into that.",
    "I appreciate your perspective on this.",
    "This is really helpful advice. Thank you.",
    "I've been thinking about trying that too.",
    "You're right. I need to take that first step.",
    "Thanks for understanding. It's hard to admit this stuff.",
    "I'm glad I'm not the only one who feels this way.",
    "That's exactly what I needed to hear.",
    "I'll give that a shot. Thanks for the suggestion.",
    "Yeah, the isolation makes everything worse.",
    "I've been considering therapy but it's scary, you know?",
    "Small goals sound manageable. I'll try that.",
    "Thanks for the support. This community is great.",
    "You're right, I need to focus on what I can control.",
]


def fetch_all_posts():
    """Fetch all main posts (not comments) from the posts table."""
    response = supabase.table("posts").select("*").is_("post_id", "null").execute()
    return response.data


def create_comment(post_id: str, user_id: str, content: str, parent_comment_id=None):
    """Create a comment or reply in the posts table."""
    comment_data = {
        "user_id": user_id,
        "content": content,
        "post_id": post_id,
        "comment_id": parent_comment_id,
        "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
    }

    response = supabase.table("posts").insert(comment_data).execute()
    return response.data[0] if response.data else None


def seed_comments():
    """Seed comments and replies to existing posts."""
    print("Starting comment seeding...")

    # Fetch all posts
    posts = fetch_all_posts()
    print(f"Found {len(posts)} posts to comment on")

    if not posts:
        print("ERROR: No posts found. Please seed posts first.")
        return

    total_comments = 0
    total_replies = 0

    for post in posts:
        post_id = post["id"]
        post_title = post["content"][:50] + "..."
        print(f"\nAdding comments to: {post_title}")

        # Add 2-4 top-level comments per post
        num_comments = random.randint(2, 4)
        created_comments = []

        for _ in range(num_comments):
            comment_content = random.choice(MOCK_COMMENTS)
            user_id = random.choice(MOCK_USER_IDS)

            comment = create_comment(post_id, user_id, comment_content)
            if comment:
                created_comments.append(comment)
                total_comments += 1
                print(f"  + Added comment: {comment_content[:40]}...")

        # Add 0-2 replies to each comment (30% chance)
        for comment in created_comments:
            if random.random() < 0.3:  # 30% chance of getting replies
                num_replies = random.randint(1, 2)

                for _ in range(num_replies):
                    reply_content = random.choice(MOCK_REPLIES)
                    user_id = random.choice(MOCK_USER_IDS)

                    reply = create_comment(
                        post_id, user_id, reply_content, parent_comment_id=comment["id"]
                    )
                    if reply:
                        total_replies += 1
                        print(f"    -> Added reply: {reply_content[:40]}...")

    print(f"\nSeeding complete!")
    print(f"Total comments: {total_comments}")
    print(f"Total replies: {total_replies}")
    print(f"Total entries: {total_comments + total_replies}")


if __name__ == "__main__":
    seed_comments()
