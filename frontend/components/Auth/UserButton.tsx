'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import { useAuth } from './AuthProvider'

export function UserButton() {
  const { user, isLoading, isAnonymous, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

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
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
        >
          login
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          sign up
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
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-colors hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
      >
        <User className="h-4 w-4 text-black dark:text-white" />
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
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
