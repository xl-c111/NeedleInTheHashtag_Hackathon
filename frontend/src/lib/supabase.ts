import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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

export const supabase = createClientComponentClient<Database>()
