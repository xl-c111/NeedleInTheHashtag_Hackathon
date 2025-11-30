'use client'

import { useState } from 'react'
import { useAuth } from '@/components/Auth'
import { useRouter } from 'next/navigation'
import { Edit3, Save, Calendar } from 'lucide-react'

export default function WritePage() {
  const { user, isLoading, signInAnonymously } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<string>('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🤔', label: 'Reflective', value: 'reflective' },
  ]

  const handleSignIn = async () => {
    try {
      await signInAnonymously()
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  const handleSave = async () => {
    if (!user) {
      alert('Please sign in to save your entry')
      return
    }

    if (!content.trim()) {
      alert('Please write something before saving')
      return
    }

    setIsSaving(true)
    try {
      // TODO: Save to Supabase
      const entry = {
        user_id: user.id,
        title: title.trim() || 'Untitled Entry',
        content: content.trim(),
        mood,
        is_private: isPrivate,
        created_at: new Date().toISOString(),
      }

      console.log('Saving entry:', entry)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Clear form
      setTitle('')
      setContent('')
      setMood('')

      alert('Entry saved successfully!')
      router.push('/diary')
    } catch (error) {
      console.error('Failed to save entry:', error)
      alert('Failed to save entry. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

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
          <Edit3 className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-semibold mb-2">Start Your Journal</h1>
          <p className="text-muted-foreground mb-6">
            Sign in anonymously to start writing your private journal entries
          </p>
          <button
            onClick={handleSignIn}
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Edit3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Write</h1>
          </div>
          <p className="text-muted-foreground">
            Express yourself freely. Your thoughts are safe here.
          </p>
        </div>

        {/* Today's Date */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Mood Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            How are you feeling?
          </label>
          <div className="flex flex-wrap gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  mood === m.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-foreground'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-xl font-medium bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground text-foreground"
          />
        </div>

        {/* Content Textarea */}
        <div className="mb-6">
          <textarea
            placeholder="What's on your mind? Write freely..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:text-muted-foreground text-foreground leading-relaxed"
          />
        </div>

        {/* Privacy Toggle */}
        <div className="mb-6 flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <p className="font-medium text-foreground">Private Entry</p>
            <p className="text-sm text-muted-foreground">Only you can see this entry</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>

        {/* Character Count */}
        <div className="mt-4 text-right text-sm text-muted-foreground">
          {content.length} characters
        </div>
      </div>
    </div>
  )
}
