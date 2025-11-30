// Core types for Village peer support platform

export interface Story {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];
  themes: Theme[];
  readTime: number; // minutes
  datePosted: string;
}

export type Theme =
  | "loneliness"
  | "social-anxiety"
  | "rejection"
  | "self-improvement"
  | "toxic-communities"
  | "finding-purpose"
  | "therapy"
  | "fitness"
  | "career"
  | "relationships";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  themes: Theme[];
  concerns: string[];
  readyForStories: boolean;
  messageCount: number;
}

// API types
export interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface ChatResponse {
  reply: string;
  detectedThemes?: Theme[];
}

export interface StoriesFilters {
  themes?: Theme[];
  search?: string;
}
