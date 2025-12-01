# Comments & Threads Schema

**Purpose**: Enable forum-like discussions on mentor stories with threaded comments

---

## Database Schema

### Comments Table

```sql
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 5000),
  moderation_score FLOAT DEFAULT 1.0,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comments_updated_at_trigger
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_updated_at();
```

### Row Level Security (RLS)

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view non-deleted comments
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND deleted_at IS NULL);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can soft-delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);
```

---

## TypeScript Types

Add to `frontend/lib/supabase.ts`:

```typescript
comments: {
  Row: {
    id: string
    post_id: string
    user_id: string
    parent_comment_id: string | null
    content: string
    moderation_score: number
    is_flagged: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
  }
  Insert: {
    id?: string
    post_id: string
    user_id: string
    parent_comment_id?: string | null
    content: string
    moderation_score?: number
    is_flagged?: boolean
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
  }
  Update: {
    id?: string
    post_id?: string
    user_id?: string
    parent_comment_id?: string | null
    content?: string
    moderation_score?: number
    is_flagged?: boolean
    updated_at?: string
    deleted_at?: string | null
  }
}
```

---

## Frontend Functions

Add to `frontend/lib/supabase.ts`:

```typescript
export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']

/**
 * Fetch all comments for a post (including replies)
 */
export async function fetchPostComments(postId: string): Promise<Comment[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data || []
}

/**
 * Create a new comment (or reply to another comment)
 */
export async function createComment(
  postId: string,
  userId: string,
  content: string,
  parentCommentId?: string
): Promise<{ data: Comment | null; error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') }
  }

  // TODO: Add content moderation here before saving
  // const isSafe = await moderateContent(content)
  // if (!isSafe) return { data: null, error: new Error('Content violates guidelines') }

  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      user_id: userId,
      content,
      parent_comment_id: parentCommentId || null,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    return { data: null, error: new Error(error.message) }
  }

  return { data, error: null }
}

/**
 * Soft-delete a comment
 */
export async function deleteComment(
  commentId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { error: new Error('Supabase not configured') }
  }

  const { error } = await supabase
    .from('comments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', commentId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting comment:', error)
    return { error: new Error(error.message) }
  }

  return { error: null }
}

/**
 * Update a comment
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

  const { data, error } = await supabase
    .from('comments')
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
```

---

## UI Component

Create `frontend/components/Stories/CommentSection.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/Auth'
import { MessageCircle, Reply, Edit, Trash2 } from 'lucide-react'
import type { Comment } from '@/lib/supabase'

interface CommentSectionProps {
  postId: string
}

interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[]
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [postId])

  async function loadComments() {
    try {
      const { fetchPostComments } = await import('@/lib/supabase')
      const data = await fetchPostComments(postId)

      // Organize into threaded structure
      const threaded = organizeComments(data)
      setComments(threaded)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Organize flat comments into threaded structure
  function organizeComments(flatComments: Comment[]): CommentWithReplies[] {
    const commentMap = new Map<string, CommentWithReplies>()
    const rootComments: CommentWithReplies[] = []

    // First pass: create map of all comments
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: organize into threads
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!

      if (comment.parent_comment_id) {
        // This is a reply
        const parent = commentMap.get(comment.parent_comment_id)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(commentWithReplies)
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies)
      }
    })

    return rootComments
  }

  async function handleSubmitComment(parentId?: string) {
    if (!user || !newComment.trim()) return

    try {
      const { createComment } = await import('@/lib/supabase')
      const { data, error } = await createComment(
        postId,
        user.id,
        newComment.trim(),
        parentId
      )

      if (error) throw error

      // Reload comments
      await loadComments()
      setNewComment('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Failed to create comment:', error)
      alert('Failed to post comment. Please try again.')
    }
  }

  function CommentItem({ comment, depth = 0 }: { comment: CommentWithReplies; depth?: number }) {
    const isOwnComment = user?.id === comment.user_id
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)

    return (
      <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                Anonymous {comment.user_id.slice(-4)}
              </span>
              <span className="text-xs text-black/50 dark:text-white/50">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const { updateComment } = await import('@/lib/supabase')
                      await updateComment(comment.id, user!.id, editContent)
                      await loadComments()
                      setIsEditing(false)
                    }}
                    className="px-3 py-1 bg-black text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-black/80 dark:text-white/80 whitespace-pre-wrap">
                  {comment.content}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  {user && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                  )}

                  {isOwnComment && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this comment?')) {
                            const { deleteComment } = await import('@/lib/supabase')
                            await deleteComment(comment.id, user.id)
                            await loadComments()
                          }
                        }}
                        className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border border-black/10 dark:border-white/10 rounded-lg bg-white/50 dark:bg-black/50 resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmitComment(comment.id)}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null)
                      setNewComment('')
                    }}
                    className="px-4 py-2 border border-black/10 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading comments...</div>
  }

  return (
    <div className="mt-12 scroll-card-thin relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="relative z-10 bg-white/60 backdrop-blur-sm p-6 dark:bg-black/60">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-medium text-lg">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
        </div>

        {/* New comment form */}
        {user ? (
          <div className="mb-8 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-black/10 dark:border-white/10 rounded-lg bg-white/70 dark:bg-black/70 resize-none focus:outline-none focus:ring-2 focus:ring-black/20"
              rows={4}
            />
            <button
              onClick={() => handleSubmitComment()}
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        ) : (
          <div className="mb-8 p-4 border border-black/10 dark:border-white/10 rounded-lg text-center">
            <p className="text-sm text-black/60 dark:text-white/60">
              Sign in to join the discussion
            </p>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-black/60 dark:text-white/60 py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Integration

Add to story page (`frontend/app/stories/[id]/page.tsx`):

```typescript
import { CommentSection } from '@/components/Stories/CommentSection'

// In the main component, after the "More stories" section:
<CommentSection postId={story.id} />
```

---

## Moderation Integration

Update `createComment` function to moderate before saving:

```typescript
// In createComment function, before insert:
const { moderateContent } = await import('@/lib/api')
const isSafe = await moderateContent(content)

if (!isSafe) {
  return {
    data: null,
    error: new Error('Your comment contains content that violates our community guidelines')
  }
}
```

---

## Notes

- **Threaded Comments**: Supports unlimited nesting (though UI limits display depth for readability)
- **Soft Deletes**: Comments are soft-deleted (`deleted_at`) to preserve thread structure
- **Moderation**: Comments should be moderated before saving (integrated with existing `/api/moderate`)
- **Anonymous Display**: Shows "Anonymous XXXX" using last 4 chars of user_id
- **Edit/Delete**: Only own comments, with confirmation for deletes
- **Real-time**: Could add Supabase realtime subscriptions for live updates

---

**Status**: Schema ready to deploy, UI component ready to implement
**Time to implement**: 2-3 hours (deploy schema, add functions, integrate component)
