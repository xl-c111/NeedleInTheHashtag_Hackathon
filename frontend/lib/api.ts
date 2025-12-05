/**
 * Backend API Integration
 *
 * This file handles all communication with the FastAPI backend.
 * The backend provides AI-powered semantic matching and chat assistance.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// Types
// ============================================================================

export interface MatchedStory {
  content: string;
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

export interface HealthResponse {
  status: string;
  matcher_ready: boolean;
  moderator_ready: boolean;
  version: string;
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
    const response = await fetch(`${API_BASE_URL}/api/match`, {
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
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      } as ChatRequest),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    const result: ChatResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Check if content is safe (no harmful/violent content)
 *
 * @param text - Text to moderate
 * @returns Whether the text is safe
 */
export async function moderateContent(text: string): Promise<{ is_risky: boolean; risk_score: number; confidence: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Moderation API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      is_risky: result.is_risky,
      risk_score: result.risk_score,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error('Error moderating content:', error);
    // Default to safe if moderation fails
    return { is_risky: false, risk_score: 0, confidence: 0 };
  }
}

/**
 * Check backend health status
 *
 * @returns Health status and model loading info
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    const health = await response.json();
    return {
      status: health.status,
      matcher_ready: health.matcher_ready,
      moderator_ready: health.moderator_ready,
      version: health.version,
    };
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
}
