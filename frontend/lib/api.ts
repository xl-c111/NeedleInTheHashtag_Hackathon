/**
 * API Integration
 *
 * This file handles all communication with backend services.
 * - Chat: Uses Vercel API routes (/api/chat) with OpenRouter
 * - Matching: Uses Hugging Face Space for semantic matching
 */

// Hugging Face Space URL for semantic matching
const HF_SPACE_URL = process.env.NEXT_PUBLIC_HF_SPACE_URL || 'http://localhost:7860';

// ============================================================================
// Types
// ============================================================================

export interface MatchedStory {
  id?: string;
  content: string;
  title?: string;
  topic_tags: string[];
  similarity_score: number;
  user_id: string;
  timestamp: string;
  post_id?: string;
  comment_id?: string;
}

export interface MatchResponse {
  matches: MatchedStory[];
  warning?: string | null;
  user_risk_score?: number | null;
}

export interface MatchRequest {
  user_text: string;
  top_k?: number;
  min_similarity?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  session_id: string;
  suggested_posts?: MatchedStory[] | null;
  ready_for_stories?: boolean;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Find mentor stories similar to user's description
 *
 * @param userText - User's description of their struggle
 * @param topK - Number of matches to return (default: 3)
 * @param minSimilarity - Minimum similarity threshold 0-1 (default: 0.3)
 * @returns Array of matched stories with similarity scores
 *
 * @example
 * ```typescript
 * const matches = await matchStories("I feel anxious and alone", 3, 0.3);
 * matches.forEach(match => {
 *   console.log(`${match.similarity_score}: ${match.content.substring(0, 100)}...`);
 * });
 * ```
 */
export async function matchStories(
  userText: string,
  topK: number = 3,
  minSimilarity: number = 0.3
): Promise<MatchResponse> {
  try {
    // Use Hugging Face Space for semantic matching (both local and production)
    const matchUrl = `${HF_SPACE_URL}/api/match`;

    const response = await fetch(matchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_text: userText,
        top_k: topK,
        min_similarity: minSimilarity,
      } as MatchRequest),
    });

    if (!response.ok) {
      throw new Error(`Match API error: ${response.statusText}`);
    }

    const result = await response.json();
    // Backend returns array directly, not wrapped in { matches: [...] }
    const matches = Array.isArray(result) ? result : (result.matches || []);
    return {
      matches,
      warning: result.warning,
      user_risk_score: result.user_risk_score,
    };
  } catch (error) {
    console.error('Error matching stories:', error);
    throw error;
  }
}

/**
 * Send a chat message to the AI assistant (the owl)
 *
 * @param message - User's message
 * @param conversationHistory - Previous messages in the conversation
 * @returns AI response and whether to show matched stories
 *
 * @example
 * ```typescript
 * const result = await sendChatMessage("I'm feeling really stressed", history);
 * console.log(result.response); // Owl's response
 * if (result.should_show_stories) {
 *   const stories = await matchStories(message);
 *   // Show stories to user
 * }
 * ```
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    // Use Vercel API route for chat (faster, no cold starts)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      response: result.reply,
      session_id: 'vercel-session',
      suggested_posts: null,
      ready_for_stories: conversationHistory.length >= 2
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

// Note: Content moderation and health check functions removed
// These were part of the old backend architecture (Render)
// New architecture uses:
// - Vercel API routes for chat (with OpenRouter)
// - Hugging Face Space for semantic matching
