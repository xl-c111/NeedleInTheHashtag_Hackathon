// Core types for Village peer support platform

export interface Story {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];  // topic_tags from Supabase (used as categories)
  readTime: number; // minutes
  datePosted: string;
}

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
