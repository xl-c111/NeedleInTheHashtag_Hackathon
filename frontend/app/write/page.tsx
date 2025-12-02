'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/Auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Edit3, Save, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function WritePage() {
  const { user, isLoading, signInAnonymously } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<string>('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingEntry, setIsLoadingEntry] = useState(false)

  const moods = [
    { svg: '/owlglad.svg', label: 'happy', value: 'happy' },
    { svg: '/owlcalm.svg', label: 'calm', value: 'calm' },
    { svg: '/owlsad.svg', label: 'sad', value: 'sad' },
    { svg: '/owlanxious.svg', label: 'anxious', value: 'anxious' },
    { svg: '/owlfrustrated.svg', label: 'frustrated', value: 'frustrated' },
    { svg: '/owlreflective.svg', label: 'reflective', value: 'reflective' },
  ]

  // Load entry data if editing
  useEffect(() => {
    const loadEntry = async () => {
      if (!editId || !user) return

      setIsLoadingEntry(true)
      try {
        const { fetchDiaryEntryById } = await import('@/lib/supabase')
        const entry = await fetchDiaryEntryById(editId, user.id)

        if (entry) {
          setTitle(entry.title)
          setContent(entry.content)
          setMood(entry.mood || '')
          setIsPrivate(entry.is_private)
        } else {
          alert('Entry not found')
          router.push('/diary')
        }
      } catch (error) {
        console.error('Failed to load entry:', error)
        alert('Failed to load entry')
      } finally {
        setIsLoadingEntry(false)
      }
    }

    loadEntry()
  }, [editId, user, router])

  const handleSignIn = async () => {
    try {
      await signInAnonymously()
    } catch (error) {
      console.error('failed to sign in:', error)
    }
  }

  const handleSave = async () => {
    if (!user) {
      alert('please sign in to save your entry')
      return
    }

    if (!content.trim()) {
      alert('please write something before saving')
      return
    }

    setIsSaving(true)
    try {
      if (editId) {
        // Update existing entry
        const { updateDiaryEntry } = await import('@/lib/supabase')

        const { data, error } = await updateDiaryEntry(editId, user.id, {
          title: title.trim() || 'Untitled Entry',
          content: content.trim(),
          mood: mood || null,
          is_private: isPrivate,
        })

        if (error) throw error

        alert('Entry updated successfully!')
      } else {
        // Create new entry
        const { saveDiaryEntry } = await import('@/lib/supabase')

        const { data, error } = await saveDiaryEntry({
          user_id: user.id,
          title: title.trim() || 'Untitled Entry',
          content: content.trim(),
          mood: mood || null,
          is_private: isPrivate,
        })

        if (error) throw error

        // Clear form
        setTitle('')
        setContent('')
        setMood('')

        alert('Entry saved successfully!')
      }
      router.push('/diary')
    } catch (error) {
      console.error('failed to save entry:', error)
      alert('failed to save entry. please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">loading...</p>
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
            sign in to start writing your private journal entries.
          </p>
          <button
            onClick={handleSignIn}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            sign in anonymously
          </button>
        </div>
      </div>
    )
  }

  if (isLoadingEntry) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading entry...</p>
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
            how are you feeling?
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
                <img 
                  src={m.svg} 
                  alt={m.label} 
                  className="w-15 h-15"
                />
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-xl font-medium border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white text-white"
            style={{
              backgroundImage: `url('/ribbon.svg')`,
              backgroundSize: '120%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        </div>

        {/* Content Textarea */}
        <div className="mb-6">
          <textarea
            placeholder="so, how have you been?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:text-black text-black leading-relaxed"
            style={{
              backgroundImage: `url('/diaryscrollpost.svg')`,
              backgroundSize: '120%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        </div>

        {/* Privacy Toggle */}
        <div className="mb-6 flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <p className="font-medium text-foreground">private entry</p>
            <p className="text-sm text-muted-foreground">only you can see this entry.</p>
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

        {/* Save/Update Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-none rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Save className="w-5 h-5" />
                Saving...
              </>
            ) : (
              <img 
                src="/submit.svg" 
                alt="Save Entry" 
                className="h-20 opacity-100 transition-transform duration-200 hover:scale-110"
                style={{ background: 'none' }}
              />
            )}
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
