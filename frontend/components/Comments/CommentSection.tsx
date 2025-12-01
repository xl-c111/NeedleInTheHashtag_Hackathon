"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Reply, Trash2, Edit2, X, Check } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { toast } from "sonner";
import {
  fetchPostComments,
  fetchCommentReplies,
  createComment,
  deleteComment,
  updateComment,
  type Comment,
} from "@/lib/supabase";

interface CommentSectionProps {
  postId: string;
}

interface CommentWithReplies extends Comment {
  replies?: Comment[];
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    setIsLoading(true);
    const topLevelComments = await fetchPostComments(postId);

    // Load replies for each comment
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await fetchCommentReplies(comment.id);
        return { ...comment, replies };
      })
    );

    setComments(commentsWithReplies);
    setIsLoading(false);
  }

  async function handleSubmitComment() {
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    const { error } = await createComment(user.id, postId, newComment.trim());

    if (error) {
      toast.error("Failed to post comment. Please try again.");
    } else {
      toast.success("Comment posted successfully!");
      setNewComment("");
      await loadComments();
    }
    setIsSubmitting(false);
  }

  async function handleSubmitReply(parentCommentId: string) {
    if (!user || !replyContent.trim()) return;

    setIsSubmitting(true);
    const { error } = await createComment(
      user.id,
      postId,
      replyContent.trim(),
      parentCommentId
    );

    if (error) {
      toast.error("Failed to post reply. Please try again.");
    } else {
      toast.success("Reply posted successfully!");
      setReplyTo(null);
      setReplyContent("");
      await loadComments();
    }
    setIsSubmitting(false);
  }

  async function handleDelete(commentId: string) {
    if (!user || !confirm("Delete this comment?")) return;

    const { error } = await deleteComment(commentId, user.id);

    if (error) {
      toast.error("Failed to delete comment. You can only delete your own comments.");
    } else {
      toast.success("Comment deleted successfully!");
      await loadComments();
    }
  }

  async function handleUpdate(commentId: string) {
    if (!user || !editContent.trim()) return;

    setIsSubmitting(true);
    const { error } = await updateComment(commentId, user.id, editContent.trim());

    if (error) {
      toast.error("Failed to update comment. You can only edit your own comments.");
    } else {
      toast.success("Comment updated successfully!");
      setEditingId(null);
      setEditContent("");
      await loadComments();
    }
    setIsSubmitting(false);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  function renderComment(comment: CommentWithReplies, isReply = false) {
    const isOwner = user?.id === comment.user_id;
    const isEditing = editingId === comment.id;

    return (
      <div
        key={comment.id}
        className={`${isReply ? "ml-6 mt-3" : "mt-4"} border-l-2 border-black/20 pl-4`}
      >
        {/* Comment Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-sm font-medium text-black">
              Anonymous {comment.user_id.slice(-4)}
            </span>
            <span className="ml-2 text-xs text-black/50">
              {formatDate(comment.created_at)}
            </span>
          </div>

          {/* Actions */}
          {isOwner && !isEditing && (
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setEditingId(comment.id);
                  setEditContent(comment.content);
                }}
                className="rounded p-1 text-black/60 transition-colors hover:bg-black/10 hover:text-black"
                aria-label="Edit comment"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(comment.id)}
                className="rounded p-1 text-black/60 transition-colors hover:bg-black/10 hover:text-red-600"
                aria-label="Delete comment"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-lg border border-black/20 bg-white/50 px-3 py-2 text-sm text-black placeholder-black/40 focus:border-black focus:outline-none"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleUpdate(comment.id)}
                disabled={isSubmitting || !editContent.trim()}
                className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditContent("");
                }}
                disabled={isSubmitting}
                className="flex items-center gap-1 rounded-lg border border-black/20 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black/5 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-black/80">
            {comment.content}
          </p>
        )}

        {/* Reply Button */}
        {!isEditing && user && (
          <button
            onClick={() => {
              setReplyTo(replyTo === comment.id ? null : comment.id);
              setReplyContent("");
            }}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-black/60 transition-colors hover:text-black"
          >
            <Reply className="h-3 w-3" />
            Reply
          </button>
        )}

        {/* Reply Form */}
        {replyTo === comment.id && (
          <div className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full rounded-lg border border-black/20 bg-white/50 px-3 py-2 text-sm text-black placeholder-black/40 focus:border-black focus:outline-none"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleSubmitReply(comment.id)}
                disabled={isSubmitting || !replyContent.trim()}
                className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post Reply"}
              </button>
              <button
                onClick={() => {
                  setReplyTo(null);
                  setReplyContent("");
                }}
                disabled={isSubmitting}
                className="rounded-lg border border-black/20 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black/5 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-black/10 bg-white/30 p-6 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-black/40" />
        <p className="mt-2 text-sm text-black/60">
          Sign in to join the conversation
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-black/60" />
        <h3 className="font-semibold text-xl tracking-tight text-black">
          Discussion
        </h3>
        <span className="text-sm text-black/50">
          ({comments.length})
        </span>
      </div>

      {/* New Comment Form */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full rounded-lg border border-black/20 bg-white/50 px-4 py-3 text-sm text-black placeholder-black/40 focus:border-black focus:outline-none"
          rows={4}
          disabled={isSubmitting}
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="mt-8 text-center text-sm text-black/50">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="mt-8 text-center text-sm text-black/50">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="mt-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
