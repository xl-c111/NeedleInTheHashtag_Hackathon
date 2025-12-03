"""
Generate AI-powered titles for existing posts in the database.

This script:
1. Fetches all posts from Supabase
2. Uses Gemini (via OpenRouter) to generate Reddit-style titles
3. Updates each post with its generated title

Usage:
    python backend/scripts/generate_post_titles.py
"""

import os
import json
from supabase import create_client
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENROUTER_API_KEY]):
    raise ValueError("Missing required environment variables. Check .env file.")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def generate_title_with_ai(content: str, topic_tags: list) -> str:
    """
    Generate a Reddit-style title for a post using Gemini via OpenRouter.

    Args:
        content: The post content
        topic_tags: List of topic tags for context

    Returns:
        Generated title string
    """
    prompt = f"""You are a Reddit post title generator. Create a concise, engaging title for this personal story.

Rules:
- Maximum 80 characters
- Capture the main theme/struggle
- Use first-person perspective when appropriate
- Be empathetic and respectful
- Similar to r/relationship_advice or r/self style titles
- NO quotation marks in the output

Topic tags: {', '.join(topic_tags) if topic_tags else 'General'}

Post content:
{content[:500]}...

Generate ONLY the title, nothing else:"""

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            title = result['choices'][0]['message']['content'].strip()
            # Remove surrounding quotes if present
            title = title.strip('"\'')
            # Truncate if too long
            if len(title) > 100:
                title = title[:97] + "..."
            return title
        else:
            print(f"API error: {response.status_code} - {response.text}")
            # Fallback to rule-based generation
            return generate_fallback_title(content, topic_tags)

    except Exception as e:
        print(f"Error generating title: {e}")
        return generate_fallback_title(content, topic_tags)


def generate_fallback_title(content: str, topic_tags: list = None) -> str:
    """Generate a Reddit-style title from content using simple rules."""
    # Clean content
    content = content.strip()

    # Extract first meaningful sentence
    sentences = content.split('.')
    first_sentence = sentences[0].strip() if sentences else content

    # If first sentence is reasonable length, use it
    if 20 <= len(first_sentence) <= 80:
        return first_sentence

    # Try to extract a compelling snippet
    # Look for common Reddit post patterns
    patterns = [
        ("I'm ", "I'm "),
        ("I am ", "I am "),
        ("My ", "My "),
        ("How ", "How "),
        ("Why ", "Why "),
        ("Can't ", "Can't "),
        ("Struggling ", "Struggling "),
        ("Need ", "Need "),
    ]

    for pattern, prefix in patterns:
        if pattern.lower() in content.lower():
            idx = content.lower().find(pattern.lower())
            snippet = content[idx:idx+80].split('.')[0].strip()
            if len(snippet) >= 20:
                return snippet if len(snippet) <= 80 else snippet[:77] + "..."

    # Fallback: use first 60-80 chars at word boundary
    if len(content) <= 80:
        return content

    truncated = content[:77]
    last_space = truncated.rfind(' ')
    return content[:last_space if last_space > 30 else 77] + "..."


def main(force_regenerate=False):
    """Main function to generate and update all post titles.

    Args:
        force_regenerate: If True, regenerate titles even if they already exist
    """
    print("Fetching posts from Supabase...")

    # Fetch only main posts (where post_id is null - these are stories, not comments)
    response = supabase.table('posts').select('id, content, topic_tags, title, post_id').is_('post_id', None).execute()
    posts = response.data

    print(f"Found {len(posts)} main posts (excluding comments)")

    # Filter posts based on force_regenerate flag
    if force_regenerate:
        posts_to_process = posts
        print(f"Force regenerating titles for ALL {len(posts_to_process)} posts...")
    else:
        posts_to_process = [p for p in posts if not p.get('title')]
        if not posts_to_process:
            print("All posts already have titles!")
            print("Use force_regenerate=True to regenerate existing titles")
            return
        print(f"Generating titles for {len(posts_to_process)} posts without titles...")

    updated_count = 0
    failed_count = 0

    for i, post in enumerate(posts_to_process, 1):
        print(f"\n[{i}/{len(posts_to_process)}] Processing post {post['id'][:8]}...")

        # Generate title
        title = generate_title_with_ai(
            content=post['content'],
            topic_tags=post.get('topic_tags', [])
        )

        print(f"Generated title: {title}")

        # Update post in database
        try:
            supabase.table('posts').update({
                'title': title
            }).eq('id', post['id']).execute()

            updated_count += 1
            print(f"[OK] Updated successfully")

        except Exception as e:
            print(f"[FAIL] Failed to update: {e}")
            failed_count += 1

    print(f"\n{'='*60}")
    print(f"Title generation complete!")
    print(f"Successfully updated: {updated_count}")
    print(f"Failed: {failed_count}")
    print(f"{'='*60}")


if __name__ == "__main__":
    import sys
    # Check for --force flag
    force = '--force' in sys.argv or '-f' in sys.argv
    main(force_regenerate=force)
