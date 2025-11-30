'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/Auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Edit3, Calendar, Trash2, Lock } from 'lucide-react'

type DiaryEntry = {
  id: string
  user_id: string
  title: string
  content: string
  mood?: string
  is_private: boolean
  created_at: string
}

export default function DiaryPage() {
  const { user, isLoading, signInAnonymously } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isLoadingEntries, setIsLoadingEntries] = useState(true)
  const [selectedMood, setSelectedMood] = useState<string>('all')

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🤔', label: 'Reflective', value: 'reflective' },
  ]

  const getMoodEmoji = (mood?: string) => {
    if (!mood) return '📝'
    const foundMood = moods.find(m => m.value === mood)
    return foundMood?.emoji || '📝'
  }

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) {
        setIsLoadingEntries(false)
        return
      }

      try {
        // TODO: Fetch from Supabase
        // Simulated data for now
        await new Promise(resolve => setTimeout(resolve, 500))

        const mockEntries: DiaryEntry[] = [
          {
            id: '1',
            user_id: user.id,
            title: 'First Day',
            content: 'Today was a good day. I finally decided to start journaling...',
            mood: 'happy',
            is_private: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            user_id: user.id,
            title: 'Reflections',
            content: 'Been thinking a lot about my journey and where I want to go...',
            mood: 'reflective',
            is_private: true,
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ]

        setEntries(mockEntries)
      } catch (error) {
        console.error('Failed to load entries:', error)
      } finally {
        setIsLoadingEntries(false)
      }
    }

    loadEntries()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      // TODO: Delete from Supabase
      setEntries(entries.filter(e => e.id !== id))
    } catch (error) {
      console.error('Failed to delete entry:', error)
      alert('Failed to delete entry')
    }
  }

  const filteredEntries = selectedMood === 'all'
    ? entries
    : entries.filter(e => e.mood === selectedMood)

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-semibold mb-2">Your Journal</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to view and manage your journal entries
          </p>
          <button
            onClick={signInAnonymously}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Sign In Anonymously
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-semibold text-foreground">My Journal</h1>
            </div>
            <p className="text-muted-foreground">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </p>
          </div>
          <Link
            href="/write"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Edit3 className="w-4 h-4" />
            New Entry
          </Link>
        </div>

        {/* Mood Filter */}
        {entries.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMood('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMood === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                }`}
              >
                All
              </button>
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMood(m.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedMood === m.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingEntries && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading entries...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingEntries && filteredEntries.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {selectedMood === 'all' ? 'No entries yet' : 'No entries with this mood'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {selectedMood === 'all'
                ? 'Start writing to capture your thoughts and feelings'
                : 'Try selecting a different mood filter'}
            </p>
            {selectedMood === 'all' && (
              <Link
                href="/write"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Edit3 className="w-5 h-5" />
                Write Your First Entry
              </Link>
            )}
          </div>
        )}

        {/* Entries List */}
        {!isLoadingEntries && filteredEntries.length > 0 && (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {entry.is_private && (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-foreground/80 line-clamp-3 leading-relaxed">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
