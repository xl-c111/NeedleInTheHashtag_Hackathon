'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { user, isAnonymous } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // If user is anonymous, convert to permanent account
    if (user && isAnonymous) {
      const { error } = await supabase.auth.updateUser({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      return
    }

    // Otherwise, create new account
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
        <div className="text-center">
          <h3 className="font-medium text-lg text-black dark:text-white">Check your email</h3>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            We've sent you a confirmation link to <strong>{email}</strong>. Click the link to verify your account.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 text-sm font-medium text-black underline dark:text-white"
          >
            back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
      {isAnonymous && (
        <div className="mb-4 rounded-lg bg-blue-100 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          Create an account to save your progress and access Village from any device.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-black dark:text-white">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-black dark:text-white">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? 'creating account...' : isAnonymous ? 'create account' : 'sign up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-black underline dark:text-white">
          login
        </Link>
      </p>
    </div>
  )
}
