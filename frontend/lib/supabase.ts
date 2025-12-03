import { type SupabaseClient } from '@supabase/supabase-js'
import { createClient } from './supabase/client'
import type { Story, Theme } from './types'

// Check if Supabase is configured
const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Simple UUID validator to avoid PostgREST 406s when seed data uses non-UUID IDs
const isValidUUID = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )

// Create a singleton client instance that's shared across all function calls
// This ensures the authenticated session is consistent
let supabaseInstance: SupabaseClient<Database> | null = null

function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return null
  }

  // Reuse the same client instance to maintain session
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }

  return supabaseInstance
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string | null
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
          title?: string | null
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
          title?: string | null
          content?: string
          post_id?: string | null
          comment_id?: string | null
          topic_tags?: string[] | null
          timestamp?: string | null
          created_at?: string
        }
      }
      diary_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: string | null
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content: string
          mood?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mood?: string | null
          is_private?: boolean
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          post_id?: string
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

// Map topic_tags to our Theme type
function mapTopicTagsToThemes(topicTags: string[] | null): Theme[] {
  if (!topicTags) return []

  const tagToTheme: Record<string, Theme> = {
    'Mental health history': 'therapy',
    'Views on women': 'relationships',
    'Views on men/masculinity': 'self-improvement',
    'Dating history': 'rejection',
    'Sexuality': 'relationships',
    'Friendship history': 'loneliness',
    'Online spaces': 'toxic-communities',
    'Social isolation': 'loneliness',
    'Self-improvement': 'self-improvement',
    'Career': 'career',
    'Fitness': 'fitness',
    'Purpose': 'finding-purpose',
  }

  const themes = new Set<Theme>()
  for (const tag of topicTags) {
    const theme = tagToTheme[tag]
    if (theme) themes.add(theme)
  }

  // Default theme if no mapping found
  if (themes.size === 0) themes.add('self-improvement')

  return Array.from(themes)
}

// Generate a title from content (fallback if database title is not available)
function generateTitle(content: string, dbTitle?: string | null): string {
  // Use database title if available
  if (dbTitle && dbTitle.trim()) {
    return dbTitle
  }

  // Fallback: Take first sentence or first 60 chars
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
    title: generateTitle(row.content, row.title), // Use DB title if available, fallback to generated
    author: `Anonymous ${row.user_id.slice(-4)}`, // Use last 4 digits of user_id
    excerpt: generateExcerpt(row.content),
    content: row.content,
    tags: row.topic_tags || [],
    themes: mapTopicTagsToThemes(row.topic_tags),
    readTime: calculateReadTime(row.content),
    datePosted: row.timestamp ? new Date(row.timestamp).toISOString().split('T')[0] : row.created_at.split('T')[0],
  }
}

// Get comment count for a specific post
async function getCommentCount(postId: string): Promise<number> {
  const supabase = getSupabaseClient()
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (error) {
    console.error('Error fetching comment count:', error)
    return 0
  }

  return count || 0
}

// Fetch all stories from posts table in Supabase with comment counts
export async function fetchMentorStories(): Promise<Story[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.log('Supabase not configured, using seed data')
    return []
  }

  // Fetch only main posts (where post_id is null)
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .is('post_id', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  // Get comment counts for each post
  const storiesWithComments = await Promise.all(
    data.map(async (post: any) => {
      const story = postToStory(post)
      const commentCount = await getCommentCount(post.id)
      return { ...story, commentCount }
    })
  )

  return storiesWithComments
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

// Fetch stories filtered by themes (using topic_tags)
export async function fetchStoriesByThemes(themes: string[]): Promise<Story[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .overlaps('topic_tags', themes)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts by themes:', error)
    return []
  }

  return data.map(postToStory)
}

// ============================================================================
// DIARY ENTRIES FUNCTIONS
// ============================================================================

export type DiaryEntry = Database['public']['Tables']['diary_entries']['Row']
export type DiaryEntryInsert = Database['public']['Tables']['diary_entries']['Insert']

/**
 * Save a new diary entry to Supabase
 */
export async function saveDiaryEntry(entry: DiaryEntryInsert): Promise<{ data: DiaryEntry | null; error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') }
  }

  const { data, error } = await (supabase as any)
    .from('diary_entries')
    .insert([entry])
    .select()
    .single()

  if (error) {
    console.error('Error saving diary entry:', error)
    return { data: null, error: new Error(error.message) }
  }

  return { data, error: null }
}

/**
 * Fetch all diary entries for a specific user
 */
export async function fetchUserDiaryEntries(userId: string): Promise<DiaryEntry[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.log('Supabase not configured')
    return []
  }

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching diary entries:', error)
    return []
  }

  return data || []
}

/**
 * Delete a diary entry by ID
 */
export async function deleteDiaryEntry(entryId: string, userId: string): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { error: new Error('Supabase not configured') }
  }

  const { error } = await supabase
    .from('diary_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting diary entry:', error)
    return { error: new Error(error.message) }
  }

  return { error: null }
}

/**
 * Update an existing diary entry
 */
export async function updateDiaryEntry(
  entryId: string,
  userId: string,
  updates: Partial<DiaryEntryInsert>
): Promise<{ data: DiaryEntry | null; error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') }
  }

  const { data, error } = await (supabase as any)
    .from('diary_entries')
    .update(updates)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating diary entry:', error)
    return { data: null, error: new Error(error.message) }
  }

  return { data, error: null }
}

/**
 * Fetch a single diary entry by ID
 */
export async function fetchDiaryEntryById(entryId: string, userId: string): Promise<DiaryEntry | null> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching diary entry:', error)
    return null
  }

  return data
}

// ============================================================================
// COMMENTS FUNCTIONS (using posts table with post_id/comment_id)
// ============================================================================

export type Comment = Database['public']['Tables']['posts']['Row']

/**
 * Fetch all comments for a specific post
 * Comments are posts where post_id matches the story ID
 */
export async function fetchPostComments(postId: string): Promise<Comment[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.log('Supabase not configured')
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('post_id', postId)
    .is('comment_id', null) // Top-level comments only (not nested replies)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data || []
}

/**
 * Fetch nested replies for a specific comment
 */
export async function fetchCommentReplies(commentId: string): Promise<Comment[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('comment_id', commentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching replies:', error)
    return []
  }

  return data || []
}

/**
 * Create a new comment on a post
 */
export async function createComment(
  userId: string,
  postId: string,
  content: string,
  parentCommentId?: string
): Promise<{ data: Comment | null; error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') }
  }

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Session check:', {
    hasSession: !!session,
    sessionUserId: session?.user?.id,
    providedUserId: userId,
    match: session?.user?.id === userId
  })

  if (!session) {
    return { data: null, error: new Error('Not authenticated. Please sign in.') }
  }

  if (session.user.id !== userId) {
    return { data: null, error: new Error('User ID mismatch. Please refresh and try again.') }
  }

  const commentData = {
    user_id: userId,
    content,
    post_id: postId,
    comment_id: parentCommentId || null,
  }

  const { data, error } = await (supabase as any)
    .from('posts')
    .insert([commentData])
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    console.error('Comment data:', commentData)
    return { data: null, error: new Error(error.message) }
  }

  return { data, error: null }
}

/**
 * Delete a comment (user must own it)
 */
export async function deleteComment(commentId: string, userId: string): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { error: new Error('Supabase not configured') }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting comment:', error)
    return { error: new Error(error.message) }
  }

  return { error: null }
}

/**
 * Update a comment (user must own it)
 */
export async function updateComment(
  commentId: string,
  userId: string,
  content: string
): Promise<{ data: Comment | null; error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') }
  }

  const { data, error } = await (supabase as any)
    .from('posts')
    .update({ content })
    .eq('id', commentId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating comment:', error)
    return { data: null, error: new Error(error.message) }
  }

  return { data, error: null }
}

// ============================================================================
// FAVORITES FUNCTIONS
// ============================================================================

/**
 * Toggle favorite status for a story (post)
 */
export async function toggleFavorite(userId: string, postId: string): Promise<{ isFavorited: boolean; error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { isFavorited: false, error: new Error('Supabase not configured') }
  }

  if (!isValidUUID(postId)) {
    return { isFavorited: false, error: new Error('Invalid post ID') }
  }

  const { data: existing, error: checkError } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .limit(1)
    .maybeSingle()

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking favorite:', checkError)
    return { isFavorited: false, error: new Error(checkError.message) }
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)

    if (deleteError) {
      console.error('Error removing favorite:', deleteError)
      return { isFavorited: true, error: new Error(deleteError.message) }
    }

    return { isFavorited: false, error: null }
  } else {
    const { error: insertError } = await (supabase as any)
      .from('user_favorites')
      .insert([{ user_id: userId, post_id: postId }])

    if (insertError) {
      console.error('Error adding favorite:', insertError)
      return { isFavorited: false, error: new Error(insertError.message) }
    }

    return { isFavorited: true, error: null }
  }
}

/**
 * Get all favorited post IDs for a user
 */
export async function getUserFavorites(userId: string): Promise<string[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('post_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user favorites:', error)
    return []
  }

  return (data as any[]).map(fav => fav.post_id)
}

/**
 * Get favorite count for a specific post
 */
export async function getFavoriteCount(postId: string): Promise<number> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return 0
  }

  if (!isValidUUID(postId)) {
    return 0
  }

  const { count, error } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (error) {
    console.error('Error fetching favorite count:', error)
    return 0
  }

  return count || 0
}

/**
 * Check if user has favorited a specific post
 */
export async function isPostFavorited(userId: string, postId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return false
  }

  if (!isValidUUID(postId)) {
    return false
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking if favorited:', error)
    return false
  }

  return !!data
}

// ============================================================================
// PROFILE FUNCTIONS
// ============================================================================

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

/**
 * Update user profile (username, avatar_url)
 */
export async function updateUserProfile(
  userId: string,
  updates: { username?: string; avatar_url?: string }
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { error: new Error('Supabase not configured') }
  }

  const { error } = await (supabase as any)
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: new Error(error.message) }
  }

  return { error: null }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { url: null, error: new Error('Supabase not configured') }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError)
    return { url: null, error: new Error(uploadError.message) }
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}

/**
 * Get user statistics (diary entries, favorites)
 */
export async function getUserStats(userId: string): Promise<{
  diaryCount: number
  favoriteCount: number
  moodBreakdown: Record<string, number>
}> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { diaryCount: 0, favoriteCount: 0, moodBreakdown: {} }
  }

  const { data: diaryData } = await supabase
    .from('diary_entries')
    .select('mood')
    .eq('user_id', userId)

  const diaryCount = diaryData?.length || 0
  const moodBreakdown: Record<string, number> = {}

  if (diaryData) {
    diaryData.forEach((entry: any) => {
      const mood = entry.mood || 'unknown'
      moodBreakdown[mood] = (moodBreakdown[mood] || 0) + 1
    })
  }

  const { count: favoriteCount } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    diaryCount,
    favoriteCount: favoriteCount || 0,
    moodBreakdown,
  }
}

/**
 * Get user's favorited stories with comment counts
 */
export async function getUserFavoritedStories(userId: string): Promise<Story[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return []
  }

  const { data: favorites } = await supabase
    .from('user_favorites')
    .select('post_id')
    .eq('user_id', userId)

  if (!favorites || favorites.length === 0) {
    return []
  }

  const postIds = favorites.map((f: any) => f.post_id)

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .in('id', postIds)

  if (!posts) {
    return []
  }

  // Get comment counts for each post (same as fetchMentorStories)
  const storiesWithComments = await Promise.all(
    (posts as any[]).map(async (post) => {
      const story = postToStory(post)
      const commentCount = await getCommentCount(post.id)
      return { ...story, commentCount }
    })
  )

  return storiesWithComments
}

// Export config check for use in other files
export { isSupabaseConfigured }
