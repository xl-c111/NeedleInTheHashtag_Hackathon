import { Suspense } from 'react'
import { LoginForm } from '@/components/Auth'

export const metadata = {
  title: 'Login | been there',
  description: 'Sign in to been there',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/welcomeback.svg" alt="welcome back" className="mx-auto h-12 sm:h-16 lg:h-20" />
          <p className="mt-2 text-sm text-muted-foreground">
            sign in to continue
          </p>
        </div>
        <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
