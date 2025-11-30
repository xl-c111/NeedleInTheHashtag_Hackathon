import { SignupForm } from '@/components/Auth'

export const metadata = {
  title: 'Sign Up | Village',
  description: 'Create your Village account',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 pt-16 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-2xl tracking-tight text-black dark:text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Join Village and connect with others
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
