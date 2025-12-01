"""
Test the backend API endpoints.
Make sure the server is running first: python -m uvicorn main:app --reload
"""

import requests
import json

API_BASE = "http://localhost:8000"

print("=" * 60)
print("TESTING BACKEND API")
print("=" * 60)

# Test 1: Health check
print("\n1. Testing /api/health...")
try:
    response = requests.get(f"{API_BASE}/api/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Semantic matching
print("\n2. Testing /api/match...")
test_queries = [
    "I feel so alone and isolated",
    "I'm struggling with my mental health",
    "I need help dealing with stress"
]

for query in test_queries:
    print(f"\n   Query: \"{query}\"")
    try:
        response = requests.post(
            f"{API_BASE}/api/match",
            json={"user_text": query, "top_k": 3}
        )
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            results = response.json()
            print(f"   Found {len(results)} matches:")
            for i, result in enumerate(results, 1):
                similarity = result.get('similarity_score', 0)
                preview = result.get('content', '')[:80]
                tags = result.get('topic_tags', [])
                print(f"     {i}. Similarity: {similarity:.3f}")
                print(f"        Tags: {tags[:3]}...")  # First 3 tags
                print(f"        Preview: {preview}...")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")

# Test 3: Content moderation
print("\n3. Testing /api/moderate...")
test_texts = [
    "I feel sad and need help",
    "This is violent harmful content"  # Should be flagged
]

for text in test_texts:
    print(f"\n   Text: \"{text}\"")
    try:
        response = requests.post(
            f"{API_BASE}/api/moderate",
            json={"text": text}
        )
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            is_safe = result.get('is_safe', False)
            confidence = result.get('confidence', 0)
            print(f"   Safe: {is_safe}, Confidence: {confidence:.3f}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")

print("\n" + "=" * 60)
print("API TESTS COMPLETE")
print("=" * 60)
print("\nBackend API is ready!")
print(f"API docs: {API_BASE}/docs")
print(f"Interactive API testing: {API_BASE}/docs")
