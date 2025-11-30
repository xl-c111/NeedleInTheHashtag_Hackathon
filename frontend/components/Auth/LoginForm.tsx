'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  const handleAnonymousSignIn = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInAnonymously()

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? 'signing in...' : 'login'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/10 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-black/40 dark:bg-black dark:text-white/40">Or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAnonymousSignIn}
        disabled={loading}
        className="w-full rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
      >
        Continue anonymously
      </button>

      <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-black underline dark:text-white">
          sign up
        </Link>
      </p>
    </div>
  )
}
