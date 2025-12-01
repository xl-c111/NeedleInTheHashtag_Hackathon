'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/Auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Calendar, Heart, BookOpen, Edit2, LogOut, Smile } from 'lucide-react'
import { StoryCard } from '@/components/Stories/StoryCard'
import type { Story } from '@/lib/types'

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ diaryCount: 0, favoriteCount: 0, moodBreakdown: {} as Record<string, number> })
  const [favorites, setFavorites] = useState<Story[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isSavingUsername, setIsSavingUsername] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Preset avatar options (add your custom avatars to /public/avatars/)
  const avatarOptions = [
    '/avatars/ppic1.png',
    '/avatars/ppic2.png',
    '/avatars/ppic3.png',
    '/avatars/ppic4.png',
    '/avatars/ppic5.png',
    '/avatars/ppic6.png',
    '/avatars/ppic7.png',
    '/avatars/ppic8.png',
  ]

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoadingProfile(false)
        return
      }

      try {
        const { getUserProfile, getUserStats, getUserFavoritedStories } = await import('@/lib/supabase')

        // Load profile
        const profileData = await getUserProfile(user.id)
        setProfile(profileData)
        setNewUsername(profileData?.username || '')

        // Load stats
        const statsData = await getUserStats(user.id)
        setStats(statsData)

        // Load favorites
        const favoritesData = await getUserFavoritedStories(user.id)
        setFavorites(favoritesData)
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [user])

  const handleSelectAvatar = async (avatarUrl: string) => {
    if (!user) return

    setIsUploadingAvatar(true)

    try {
      const { updateUserProfile } = await import('@/lib/supabase')

      // Update profile with selected avatar URL
      const { error } = await updateUserProfile(user.id, { avatar_url: avatarUrl })
      if (error) throw error

      // Update local state
      setProfile({ ...profile, avatar_url: avatarUrl })
      setShowAvatarPicker(false)
      alert('Avatar updated successfully!')
    } catch (error) {
      console.error('Failed to update avatar:', error)
      alert('Failed to update avatar. Please try again.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSaveUsername = async () => {
    if (!user || !newUsername.trim()) return

    setIsSavingUsername(true)

    try {
      const { updateUserProfile } = await import('@/lib/supabase')

      const { error } = await updateUserProfile(user.id, { username: newUsername.trim() })
      if (error) throw error

      // Update local state
      setProfile({ ...profile, username: newUsername.trim() })
      setIsEditingUsername(false)
      alert('Username updated successfully!')
    } catch (error) {
      console.error('Failed to update username:', error)
      alert('Failed to update username. Please try again.')
    } finally {
      setIsSavingUsername(false)
    }
  }

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut()
      router.push('/')
    }
  }

  const handleFavoriteChange = (storyId: string, isFavorited: boolean) => {
    // If unfavorited, remove from the favorites list
    if (!isFavorited) {
      setFavorites(prev => prev.filter(story => story.id !== storyId))
      // Also update the stats count
      setStats(prev => ({ ...prev, favoriteCount: Math.max(0, prev.favoriteCount - 1) }))
    }
  }

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    calm: '😌',
    sad: '😔',
    anxious: '😰',
    frustrated: '😤',
    reflective: '🤔',
  }

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          <User className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-semibold mb-2">Sign in Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your profile
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar & Basic Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  disabled={isUploadingAvatar}
                  className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Choose Avatar
                </button>
                {isUploadingAvatar && (
                  <p className="mt-2 text-sm text-muted-foreground">Updating...</p>
                )}
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                {isEditingUsername ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="Enter username"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveUsername}
                        disabled={isSavingUsername || !newUsername.trim()}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isSavingUsername ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingUsername(false)
                          setNewUsername(profile?.username || '')
                        }}
                        className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">{profile?.username || 'Not set'}</span>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Edit username"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email || 'Anonymous'}</span>
                </div>
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Member Since
                </label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(user.created_at!).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Activity Stats</h2>

              <div className="space-y-4">
                {/* Diary Entries */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Diary Entries</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{stats.diaryCount}</span>
                </div>

                {/* Favorites */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-foreground">Favorites</span>
                  </div>
                  <span className="text-2xl font-bold text-red-500">{stats.favoriteCount}</span>
                </div>
              </div>

              {/* Mood Breakdown */}
              {Object.keys(stats.moodBreakdown).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Smile className="w-4 h-4" />
                    Mood Breakdown
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.moodBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([mood, count]) => (
                        <div key={mood} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>{moodEmojis[mood] || '😐'}</span>
                            <span className="text-foreground capitalize">{mood}</span>
                          </div>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          {/* Right Column - Favorites */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">My Favorites</h2>
                <span className="text-sm text-muted-foreground">{favorites.length} stories</span>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No favorites yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Click the heart icon on stories to save them here
                  </p>
                  <Link
                    href="/stories"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Browse Stories
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((story, index) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      index={index}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Picker Modal */}
        {showAvatarPicker && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setShowAvatarPicker(false)}
            />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="bg-card border border-border rounded-lg p-6 mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Choose Your Avatar</h2>
                  <button
                    onClick={() => setShowAvatarPicker(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {avatarOptions.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAvatar(avatar)}
                      className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all hover:scale-105 ${
                        profile?.avatar_url === avatar
                          ? 'border-primary shadow-lg'
                          : 'border-transparent hover:border-primary/50'
                      }`}
                      disabled={isUploadingAvatar}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          e.currentTarget.src = '/placeholder-avatar.png'
                        }}
                      />
                      {profile?.avatar_url === avatar && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✓</span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Click an avatar to select it
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
