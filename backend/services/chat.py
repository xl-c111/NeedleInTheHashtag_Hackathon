"""
Chat Assistant Service

Conversational interface that helps users articulate their struggles using Gemini via OpenRouter.

IMPORTANT: This does NOT provide advice or therapy.
It helps users express their feelings clearly, then passes to the matcher.
"""

import os
from typing import Optional
import requests

class ChatAssistant:
    """
    Conversational interface that helps users articulate their struggles.

    Uses Gemini via OpenRouter API (fast, free LLM inference).

    Usage:
        chat = ChatAssistant()
        response = chat.send("I don't know how to explain how I feel")
        # Response helps user articulate better

        summary = chat.get_summary()
        # Use summary as input to semantic matcher
    """

    SYSTEM_PROMPT = """You are a compassionate listener helping someone express what they're going through.

Your role is to:
1. Listen empathetically and acknowledge their feelings
2. Ask gentle clarifying questions to understand their situation better
3. Help them put their feelings into words
4. After 2-3 exchanges, summarize the key themes

You do NOT:
- Give advice or solutions
- Act as a therapist or counselor
- Make diagnoses or judgments
- Generate lengthy responses

Keep responses brief (2-3 sentences) and warm. Focus on understanding, not fixing.

When summarizing, use this format:
SUMMARY:
- Main struggle: [one sentence description]
- Key feelings: [emotions mentioned]
- Themes: [relevant themes like: loneliness, relationships, self-esteem, anger, rejection, belonging]"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize chat assistant with OpenRouter API.

        Args:
            api_key: OpenRouter API key (or set OPENROUTER_API_KEY env var)
        """
        self.api_key = api_key or os.getenv('OPENROUTER_API_KEY')
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY must be set in .env or passed to constructor")

        self.model = "google/gemini-2.0-flash-exp:free"  # Fast and free via OpenRouter
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.conversation_history = []

    def send(self, user_message: str) -> str:
        """
        Send a message and get a response.

        Args:
            user_message: What the user said

        Returns:
            Assistant's response
        """
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })

        # Build messages with system prompt
        messages = [{"role": "system", "content": self.SYSTEM_PROMPT}]
        messages.extend(self.conversation_history)

        # Call OpenRouter API
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://been-there.app",  # Required by OpenRouter
            "X-Title": "Been There"  # Optional but recommended
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 300,
            "temperature": 0.7
        }

        response = requests.post(self.api_url, headers=headers, json=payload)
        response.raise_for_status()

        result = response.json()
        assistant_message = result['choices'][0]['message']['content']

        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })

        return assistant_message

    def get_summary(self) -> str:
        """
        Ask the assistant to summarize the conversation.
        Use this as input to the semantic matcher.
        """
        return self.send("Please provide a SUMMARY of what I've shared, using the format specified.")

    def get_user_text_for_matching(self) -> str:
        """
        Combine all user messages for matching.
        Alternative to get_summary() - uses raw text instead of LLM summary.
        """
        user_messages = [
            msg['content'] for msg in self.conversation_history
            if msg['role'] == 'user'
        ]
        return " ".join(user_messages)

    def reset(self):
        """Clear conversation history for a new session."""
        self.conversation_history = []

    def get_message_count(self) -> int:
        """How many messages in the conversation."""
        return len(self.conversation_history)


def simple_intake_prompt() -> str:
    """
    If you don't want to use LLM API, you can use a simple form instead.

    Returns template text to show users.
    """
    return """
Tell us what you're going through. Take your time.

Some questions that might help:
- What's been on your mind lately?
- How have you been feeling?
- Is there a specific situation or thought that's been bothering you?
- What would you like to change or feel differently about?

(Your response is private and will only be used to find relevant stories from others who've been through similar experiences.)
"""
