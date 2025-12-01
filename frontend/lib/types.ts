// Core types for Village peer support platform

export interface Story {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];  // topic_tags from Supabase (used as categories)
  themes: Theme[]; // mapped themes for filtering
  readTime: number; // minutes
  datePosted: string;
  commentCount?: number; // number of comments/responses
}

// Theme types for story filtering
export type Theme =
  | 'therapy'
  | 'relationships'
  | 'self-improvement'
  | 'rejection'
  | 'loneliness'
  | 'toxic-communities'
  | 'career'
  | 'fitness'
  | 'finding-purpose';

// Categories are now dynamic from Supabase topic_tags
export type Category = string;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  categories: Category[];
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
  detectedCategories?: Category[];
}

export interface StoriesFilters {
  categories?: Category[];
  search?: string;
}
