'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import { Search, Filter } from 'lucide-react'

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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('All')
  const [allTags, setAllTags] = useState<string[]>([])

  // Fetch posts from Supabase
  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = getSupabase()
        if (!supabase) {
          console.log('Supabase not configured')
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('timestamp', { ascending: false })

        if (error) throw error

        const postsData = (data || []) as Post[]
        setPosts(postsData)
        setFilteredPosts(postsData)

        // Extract unique tags
        const tags = new Set<string>()
        postsData.forEach(post => {
          post.topic_tags?.forEach(tag => tags.add(tag))
        })
        setAllTags(['All', ...Array.from(tags).sort()])

      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Filter posts based on search query and selected tag
  useEffect(() => {
    let filtered = posts

    // Filter by tag
    if (selectedTag !== 'All') {
      filtered = filtered.filter(post =>
        post.topic_tags?.includes(selectedTag)
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedTag, posts])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support Stories
          </h1>
          <p className="text-gray-600">
            Real experiences from people who overcame similar struggles
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Topic Tags Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-700">Filter by Topic</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredPosts.length} of {posts.length} posts
          {selectedTag !== 'All' && ` in "${selectedTag}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag('All')
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
