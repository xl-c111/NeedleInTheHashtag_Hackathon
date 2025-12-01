# Backend Integration Guide 🦉

**Status**: ✅ Backend is ready! Supabase connected with 29 real posts.

This guide shows you how to integrate the AI-powered semantic matching with the frontend chat interface.

---

## Quick Start

### 1. Environment Variables

Add to your `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Start the Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

---

## Integration Steps

### Step 1: Use the API Client

I've created `lib/api.ts` with all the functions you need:

```typescript
import { matchStories, sendChatMessage, checkHealth } from '@/lib/api';
```

### Step 2: Update Chat Component

Replace the current `/api/chat` call in `components/Chat/index.tsx` with the backend API:

#### Before (Current):
```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    })),
  }),
});
```

#### After (With Backend Integration):
```typescript
import { sendChatMessage, matchStories } from '@/lib/api';
import type { MatchedStory } from '@/lib/api';

// In your component:
const [matchedStories, setMatchedStories] = useState<MatchedStory[]>([]);

// In handleSend function:
const conversationHistory = messages.map(m => ({
  role: m.role as 'user' | 'assistant',
  content: m.content
}));

const result = await sendChatMessage(userMessage.content, conversationHistory);

const assistantMessage: ChatMessage = {
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: result.response,
  timestamp: new Date(),
};
setMessages((prev) => [...prev, assistantMessage]);

// After 2-3 messages, fetch matched stories
if (userMessages.length >= 2) {
  const stories = await matchStories(userMessage.content, 3, 0.3);
  setMatchedStories(stories);
  setShowStoriesPrompt(true);
}
```

### Step 3: Display Matched Stories

Create a new component `components/Chat/MatchedStories.tsx`:

```typescript
"use client";

import { motion } from "motion/react";
import type { MatchedStory } from "@/lib/api";

interface MatchedStoriesProps {
  stories: MatchedStory[];
  onClose: () => void;
}

export function MatchedStories({ stories, onClose }: MatchedStoriesProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-4"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Stories from Others 🦉</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The owl brings you {stories.length} stories from people who've been there
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {stories.map((story, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            {/* Similarity Score */}
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-medium text-green-600 dark:text-green-400">
                {Math.round(story.similarity_score * 100)}% match
              </div>
              <div className="flex gap-1">
                {story.topic_tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Story Content */}
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {story.content}
            </p>

            {/* Timestamp */}
            <div className="mt-2 text-xs text-gray-500">
              {new Date(story.timestamp).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
```

### Step 4: Update Chat Interface

In `components/Chat/index.tsx`, add the matched stories display:

```typescript
import { MatchedStories } from "./MatchedStories";
import type { MatchedStory } from "@/lib/api";

// Add state:
const [matchedStories, setMatchedStories] = useState<MatchedStory[]>([]);

// In the render:
<AnimatePresence>
  {matchedStories.length > 0 && (
    <MatchedStories
      stories={matchedStories}
      onClose={() => setMatchedStories([])}
    />
  )}
</AnimatePresence>
```

---

## Complete Updated handleSend Function

Here's the complete updated version of the `handleSend` function:

```typescript
const handleSend = async () => {
  if (!inputValue.trim() || isTyping) return;

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: "user",
    content: inputValue.trim(),
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {
    // Build conversation history
    const conversationHistory = messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    // Get AI response from backend
    const result = await sendChatMessage(
      userMessage.content,
      conversationHistory
    );

    // Add assistant's response
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: result.response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    // After 2-3 user messages, fetch matching stories
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length >= 2) {
      try {
        const stories = await matchStories(
          userMessage.content,
          3,  // top 3 stories
          0.3 // 30% minimum similarity
        );

        if (stories.length > 0) {
          setMatchedStories(stories);
          setShowStoriesPrompt(true);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
        // Continue without stories if matching fails
      }
    }
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content:
        "I'm having trouble connecting right now. Could you try again in a moment?",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};
```

---

## API Reference

### `matchStories(userText, topK, minSimilarity)`

Find mentor stories similar to user's text.

**Parameters**:
- `userText` (string): User's description of their struggle
- `topK` (number): Number of matches to return (default: 3)
- `minSimilarity` (number): Minimum similarity 0-1 (default: 0.3)

**Returns**: `Promise<MatchedStory[]>`

**Example**:
```typescript
const stories = await matchStories("I feel anxious", 3, 0.3);
// Returns array of 3 most similar stories with scores
```

### `sendChatMessage(message, history)`

Send a message to the AI assistant (the owl).

**Parameters**:
- `message` (string): User's message
- `history` (ChatMessage[]): Previous conversation

**Returns**: `Promise<ChatResponse>`
- `response` (string): AI's reply
- `should_show_stories` (boolean): Whether to trigger story matching

**Example**:
```typescript
const result = await sendChatMessage("I'm stressed", conversationHistory);
console.log(result.response); // "I hear you. Can you tell me more about..."
```

### `checkHealth()`

Check if backend is running and models are loaded.

**Returns**: `Promise<HealthResponse>`
- `status` (string): "healthy" or error
- `matcher_loaded` (boolean): Semantic matcher ready
- `moderator_loaded` (boolean): Content moderator ready
- `embeddings_count` (number): Number of mentor posts

**Example**:
```typescript
const health = await checkHealth();
console.log(`${health.embeddings_count} stories ready`);
```

---

## Testing the Integration

### 1. Test Backend Directly

```bash
# Terminal 1: Start backend
cd backend
python -m uvicorn main:app --reload

# Terminal 2: Test API
cd backend
python scripts/test_api.py
```

### 2. Test Frontend Integration

1. Start backend (Terminal 1)
2. Start frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
3. Go to http://localhost:3000/chat
4. Type 2-3 messages about mental health struggles
5. You should see matched stories appear!

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Complete Flow                             │
└─────────────────────────────────────────────────────────────┘

1. User types in chat interface
   ↓
2. Frontend calls sendChatMessage()
   → Backend /api/chat (OpenRouter Gemini)
   → Returns empathetic response
   ↓
3. Frontend displays AI response
   ↓
4. After 2+ messages, frontend calls matchStories()
   → Backend /api/match
   → Generates embedding for user text (all-MiniLM-L6-v2)
   → Computes cosine similarity to 29 mentor posts
   → Returns top 3 matches with scores
   ↓
5. Frontend displays matched stories
   → Shows similarity percentage
   → Shows topic tags
   → Shows full story content
   → User can read stories from people "who've been there"
```

---

## Current Status ✅

### Backend
- ✅ FastAPI server ready
- ✅ Supabase connected (29 real posts)
- ✅ Embeddings generated from database
- ✅ `/api/match` endpoint tested (0.48 avg similarity)
- ✅ `/api/chat` endpoint with OpenRouter Gemini
- ✅ `/api/moderate` content safety check
- ✅ CORS enabled for localhost:3000

### Frontend
- ✅ `lib/api.ts` created with typed functions
- ⚠️ Need to update `components/Chat/index.tsx`
- ⚠️ Need to create `components/Chat/MatchedStories.tsx`
- ⚠️ Need to add `NEXT_PUBLIC_API_URL` to `.env.local`

---

## Troubleshooting

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Should return:
# {"status":"healthy","matcher_loaded":true,"embeddings_count":29}
```

### CORS errors
Make sure backend `.env` has:
```env
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-key
OPENROUTER_API_KEY=your-openrouter-key
```

### No stories returned
- Check similarity threshold (try lowering from 0.3 to 0.2)
- Check backend logs for errors
- Verify embeddings file exists: `data/processed/mentor_embeddings.pkl`

### Type errors
Import types from `lib/api.ts`:
```typescript
import type { MatchedStory, ChatMessage, ChatResponse } from '@/lib/api';
```

---

## Next Steps

1. **Frontend team**: Implement the chat updates above
2. **Test the full flow**: User types → AI responds → Stories appear
3. **Polish the UI**: Style the matched stories component
4. **Add animations**: Make the owl "bring" the stories
5. **Handle edge cases**: No matches, backend down, etc.

---

## The Owl Character 🦉

Remember: The AI is an animated owl who:
- Helps users articulate their feelings through chat
- Finds relevant stories from mentors who've recovered
- Brings hope through real human experiences
- Never generates fake content - only real stories

**UI Suggestions**:
- Show an owl animation when fetching stories
- "The owl is searching for stories..."
- "The owl found 3 stories for you"
- Emphasize the similarity score as "relevance"

---

**Ready to integrate! The backend is waiting for frontend to connect.** 🚀
