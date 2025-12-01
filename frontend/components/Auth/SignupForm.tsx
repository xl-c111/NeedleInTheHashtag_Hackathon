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
      setError('passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('password must be at least 6 characters')
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
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="text-center">
          <h3 className="font-medium text-lg text-foreground">check your email</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            we've sent you a confirmation link to <strong>{email}</strong>. click the link to verify your account.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 text-sm font-medium text-foreground underline"
          >
            back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      {isAnonymous && (
        <div className="mb-4 rounded-lg bg-blue-100 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          create an account to save your progress and access been there from any device.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            password
          </label>
          <input
            id="password"
            type="password"
            placeholder="create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
            confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg px-4 py-3 flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <span className="text-sm font-medium text-foreground">creating account...</span>
          ) : (
            <img src="/signup.svg" alt={isAnonymous ? 'create account' : 'sign up'} className="h-20 w-full" />
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        already have an account?{' '}
        <Link href="/login" className="font-medium text-foreground underline">
          sign in
        </Link>
      </p>
    </div>
  )
}
