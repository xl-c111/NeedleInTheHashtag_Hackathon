'use client'

import { Clock, Tag } from 'lucide-react'

type Post = {
  id: string
  user_id: string
  content: string
  post_id: string | null
  comment_id: string | null
  topic_tags: string[] | null
  timestamp: string | null
  created_at: string
}

export default function PostCard({ post }: { post: Post }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    // Use UTC methods to ensure consistent rendering between server and client
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Post Content */}
      <p className="text-gray-800 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Tags */}
      {post.topic_tags && post.topic_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.topic_tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(post.timestamp)}
          </span>
          <span className="text-gray-400">•</span>
          <span>User {post.user_id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  )
}
