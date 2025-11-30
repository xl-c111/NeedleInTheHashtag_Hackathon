import { createClientComponentClient, type SupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Story } from './types'

// Check if Supabase is configured
const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Lazy client initialization
let _supabaseClient: SupabaseClient<Database> | null = null

function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) {
    return null
  }
  if (!_supabaseClient) {
    _supabaseClient = createClientComponentClient<Database>()
  }
  return _supabaseClient
}

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          post_id: string | null
          comment_id: string | null
          topic_tags: string[] | null
          timestamp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          post_id?: string | null
          comment_id?: string | null
          topic_tags?: string[] | null
          timestamp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          post_id?: string | null
          comment_id?: string | null
          topic_tags?: string[] | null
          timestamp?: string | null
          created_at?: string
        }
      }
      mentor_stories: {
        Row: {
          id: string
          title: string
          author: string
          excerpt: string
          content: string
          tags: string[] | null
          themes: string[] | null
          read_time: number
          date_posted: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          excerpt: string
          content: string
          tags?: string[] | null
          themes?: string[] | null
          read_time?: number
          date_posted?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          excerpt?: string
          content?: string
          tags?: string[] | null
          themes?: string[] | null
          read_time?: number
          date_posted?: string
          created_at?: string
        }
      }
    }
  }
}

// Export the getter function for components that need direct access
export function getSupabase() {
  return getSupabaseClient()
}

// Generate a title from content
function generateTitle(content: string): string {
  // Take first sentence or first 60 chars
  const firstSentence = content.split(/[.!?]/)[0]?.trim()
  if (firstSentence && firstSentence.length <= 80) {
    return firstSentence
  }
  // Truncate at word boundary
  const truncated = content.substring(0, 60)
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.substring(0, lastSpace > 0 ? lastSpace : 60) + '...'
}

// Generate excerpt from content
function generateExcerpt(content: string): string {
  const maxLength = 200
  if (content.length <= maxLength) return content
  const truncated = content.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...'
}

// Calculate read time (average 200 words per minute)
function calculateReadTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// Helper to convert posts table row to Story type
function postToStory(row: Database['public']['Tables']['posts']['Row']): Story {
  return {
    id: row.id,
    title: generateTitle(row.content),
    author: `Anonymous ${row.user_id.slice(-4)}`, // Use last 4 digits of user_id
    excerpt: generateExcerpt(row.content),
    content: row.content,
    tags: row.topic_tags || [],  // Use topic_tags directly as categories
    readTime: calculateReadTime(row.content),
    datePosted: row.timestamp ? new Date(row.timestamp).toISOString().split('T')[0] : row.created_at.split('T')[0],
  }
}

// Fetch all stories from posts table in Supabase
export async function fetchMentorStories(): Promise<Story[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.log('Supabase not configured, using seed data')
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data.map(postToStory)
}

// Fetch a single story by ID from posts table
export async function fetchMentorStoryById(id: string): Promise<Story | null> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return postToStory(data)
}

// Fetch stories filtered by categories (using topic_tags)
export async function fetchStoriesByCategories(categories: string[]): Promise<Story[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .overlaps('topic_tags', categories)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts by categories:', error)
    return []
  }

  return data.map(postToStory)
}

// Fetch all unique categories (topic_tags) from Supabase
export async function fetchUniqueCategories(): Promise<string[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select('topic_tags')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Collect all unique tags
  const allTags = new Set<string>()
  const postsData = data as Array<{ topic_tags: string[] | null }>
  for (const post of postsData) {
    if (post.topic_tags) {
      for (const tag of post.topic_tags) {
        allTags.add(tag)
      }
    }
  }

  return Array.from(allTags).sort()
}

// Export config check for use in other files
export { isSupabaseConfigured }
