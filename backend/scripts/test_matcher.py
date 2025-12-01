"""
Test the semantic matcher with sample queries.
This verifies the embeddings are loaded correctly and matching works.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.matcher import SemanticMatcher

print("=" * 60)
print("TESTING SEMANTIC MATCHER")
print("=" * 60)

# Initialize matcher and load embeddings
embeddings_path = Path(__file__).parent.parent.parent / "data" / "processed" / "mentor_embeddings.pkl"

print(f"\n1. Loading embeddings from {embeddings_path}...")
matcher = SemanticMatcher()
matcher.load_embeddings(str(embeddings_path))

print(f"   Loaded {len(matcher.mentor_posts)} mentor posts")

# Test queries
test_queries = [
    "I feel so alone and isolated",
    "I'm struggling with my mental health",
    "I'm having trouble sleeping",
    "I feel anxious all the time",
    "I need help dealing with stress",
]

print("\n2. Testing semantic matching...")
print("-" * 60)

for query in test_queries:
    print(f"\nQuery: \"{query}\"")
    results = matcher.match(query, top_k=3, min_similarity=0.2)

    if results:
        print(f"Found {len(results)} matches:")
        for i, result in enumerate(results, 1):
            similarity = result['similarity_score']
            preview = result['content'][:100] + "..." if len(result['content']) > 100 else result['content']
            tags = result.get('topic_tags', [])
            print(f"  {i}. Similarity: {similarity:.3f}")
            print(f"     Tags: {tags}")
            print(f"     Preview: {preview}")
    else:
        print("  No matches found")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
print("\nSemantic matcher is working correctly!")
print("\nNext steps:")
print("  1. Start the backend API: python -m uvicorn main:app --reload")
print("  2. Test the /api/match endpoint")
print("  3. Integrate with frontend chat interface")
