'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { getUserProfile } from '@/lib/supabase'

export function UserButton() {
  const { user, isLoading, isAnonymous, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const router = useRouter()

  // Load user profile data including avatar
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && !isAnonymous) {
        try {
          const profile = await getUserProfile(user.id)
          setAvatarUrl(profile?.avatar_url || null)
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      }
    }

    loadUserProfile()

    // Listen for window focus to refresh avatar when user returns from profile page
    const handleFocus = () => {
      if (document.hasFocus()) {
        loadUserProfile()
      }
    }

    // Listen for custom avatar update event
    const handleAvatarUpdate = () => {
      loadUserProfile()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('avatarUpdated', handleAvatarUpdate)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('avatarUpdated', handleAvatarUpdate)
    }
  }, [user, isAnonymous])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center rounded-lg px-3 py-1.5 transition-all hover:scale-110"
        >
          <img src="/login.svg" alt="Sign in" className="h-12 w-auto" />
        </Link>
        <Link
          href="/signup"
          className="flex items-center rounded-lg px-3 py-1.5 transition-all hover:scale-110"
        >
          <img src="/signup.svg" alt="Sign up" className="h-12 w-auto" />
        </Link>
      </div>
    )
  }

  // Anonymous user
  if (isAnonymous) {
    return (
      <Link
        href="/signup"
        className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
      >
        create account
      </Link>
    )
  }

  // Authenticated user
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-colors hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 overflow-hidden"
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <User className="h-4 w-4 text-black dark:text-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-black">
            <div className="border-b border-black/10 px-4 py-2 dark:border-white/10">
              <p className="truncate text-sm font-medium text-black dark:text-white">
                {user.email}
              </p>
            </div>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
