import { Suspense } from 'react'
import { LoginForm } from '@/components/Auth'

export const metadata = {
  title: 'Login | Village',
  description: 'Sign in to Village',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 pt-16 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-2xl tracking-tight text-black dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Sign in to continue to Village
          </p>
        </div>
        <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
