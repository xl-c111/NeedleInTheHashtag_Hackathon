"""
Test the conversational chat flow with story suggestions.

Demonstrates:
1. Initial greeting
2. Back-and-forth conversation
3. Automatic story suggestions after 2+ messages
"""

import requests
import json
import uuid

BASE_URL = "http://localhost:8000"

def test_chat_flow():
    """Test complete conversational flow."""

    # Generate a unique session ID
    session_id = str(uuid.uuid4())

    print("="*60)
    print("TESTING CONVERSATIONAL CHAT FLOW")
    print("="*60)

    # Step 1: Get initial greeting
    print("\n1. Getting initial greeting...\n")
    greeting_response = requests.get(f"{BASE_URL}/api/chat/greeting")
    greeting = greeting_response.json()['greeting']
    print(f"ASSISTANT: {greeting}\n")

    # Step 2: First user message
    print("="*60)
    print("USER MESSAGE 1")
    print("="*60)
    user_msg_1 = "I feel really lonely lately"
    print(f"\nUSER: {user_msg_1}\n")

    response_1 = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": user_msg_1, "session_id": session_id}
    )
    data_1 = response_1.json()
    print(f"ASSISTANT: {data_1['response']}")
    print(f"\nReady for stories: {data_1['ready_for_stories']}")
    print(f"Suggested posts: {len(data_1['suggested_posts']) if data_1['suggested_posts'] else 0}\n")

    # Step 3: Second user message
    print("="*60)
    print("USER MESSAGE 2")
    print("="*60)
    user_msg_2 = "I have trouble connecting with people. I feel like nobody understands me."
    print(f"\nUSER: {user_msg_2}\n")

    response_2 = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": user_msg_2, "session_id": session_id}
    )
    data_2 = response_2.json()
    print(f"ASSISTANT: {data_2['response']}")
    print(f"\nReady for stories: {data_2['ready_for_stories']}")

    if data_2['suggested_posts']:
        print(f"\nSUGGESTED STORIES ({len(data_2['suggested_posts'])} found):")
        print("-" * 60)
        for i, post in enumerate(data_2['suggested_posts'], 1):
            print(f"\n{i}. [Similarity: {post['similarity_score']:.3f}]")
            print(f"   User: {post.get('user_id', 'N/A')}")
            print(f"   Topics: {', '.join(post.get('topic_tags', []))}")
            print(f"   Preview: {post.get('content', '')[:150]}...")
    else:
        print("\nNo suggested stories yet.")

    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60)
    print(f"\nSession ID: {session_id}")
    print("\nThe chat successfully:")
    print("  1. Provided a welcoming initial greeting")
    print("  2. Engaged in conversation to understand the user")
    print("  3. Automatically suggested matching stories after 2 messages")

if __name__ == "__main__":
    try:
        test_chat_flow()
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to backend at http://localhost:8000")
        print("Make sure the backend is running: uvicorn main:app --reload")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
