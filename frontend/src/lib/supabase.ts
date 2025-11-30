import { createClient } from '@supabase/supabase-js'

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
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug: Check if env vars are loaded
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present (length: ' + supabaseAnonKey.length + ')' : 'MISSING')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables not loaded!')
  console.error('Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
