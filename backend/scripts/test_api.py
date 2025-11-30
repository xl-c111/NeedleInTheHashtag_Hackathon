"""
Test the FastAPI backend endpoints.

Make sure the backend is running first:
    uvicorn main:app --reload
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint."""
    print("="*60)
    print("Testing /api/health")
    print("="*60)

    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_match():
    """Test semantic matching endpoint."""
    print("="*60)
    print("Testing /api/match")
    print("="*60)

    # Test with a sample user input
    payload = {
        "user_text": "I feel so lonely and isolated. Nobody seems to understand what I'm going through.",
        "num_matches": 3
    }

    response = requests.post(f"{BASE_URL}/api/match", json=payload)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"\nFound {len(data['matches'])} matches")
        print(f"Warning: {data.get('warning', 'None')}")
        print(f"Risk score: {data.get('user_risk_score', 'N/A')}")

        for i, match in enumerate(data['matches'], 1):
            print(f"\n--- Match {i} (similarity: {match['similarity_score']:.3f}) ---")
            print(f"User ID: {match.get('user_id', 'N/A')}")
            print(f"Topic tags: {match.get('topic_tags', [])}")
            print(f"Content preview: {match.get('content', '')[:200]}...")
    else:
        print(f"Error: {response.text}")
    print()

def test_moderate():
    """Test content moderation endpoint."""
    print("="*60)
    print("Testing /api/moderate")
    print("="*60)

    # Test with safe content
    payload = {
        "text": "I'm working on improving myself through therapy and exercise."
    }

    response = requests.post(f"{BASE_URL}/api/moderate", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_chat():
    """Test chat assistance endpoint."""
    print("="*60)
    print("Testing /api/chat")
    print("="*60)

    payload = {
        "message": "I don't know how to explain how I feel"
    }

    response = requests.post(f"{BASE_URL}/api/chat", json=payload)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"Response: {data['response']}")
        print(f"Session ID: {data['session_id']}")
    else:
        print(f"Error: {response.text}")
    print()

if __name__ == "__main__":
    try:
        print("\nTesting Been There API\n")

        test_health()
        test_match()
        test_moderate()
        test_chat()

        print("="*60)
        print("All tests completed!")
        print("="*60)

    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to backend at http://localhost:8000")
        print("Make sure the backend is running: uvicorn main:app --reload")
    except Exception as e:
        print(f"Error: {str(e)}")
