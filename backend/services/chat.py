"""
Chat Assistant Service

Conversational interface that helps users articulate their struggles using Groq API.

IMPORTANT: This does NOT provide advice or therapy.
It helps users express their feelings clearly, then passes to the matcher.
"""

import os
from typing import Optional

# Try to import Groq SDK
try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False
    print("⚠ Groq SDK not installed. Run: pip install groq")


class ChatAssistant:
    """
    Conversational interface that helps users articulate their struggles.

    Uses Groq API (fast, free LLM inference).

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
        Initialize chat assistant with Groq API.

        Args:
            api_key: Groq API key (or set GROQ_API_KEY env var)
        """
        if not HAS_GROQ:
            raise ImportError("groq package not installed. Run: pip install groq")

        self.client = Groq(api_key=api_key or os.getenv('GROQ_API_KEY'))
        self.model = "llama-3.1-8b-instant"  # Fast and free
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

        # Call Groq API
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )

        assistant_message = response.choices[0].message.content

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
