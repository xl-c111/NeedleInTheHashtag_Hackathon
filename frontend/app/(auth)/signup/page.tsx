import { SignupForm } from '@/components/Auth'

export const metadata = {
  title: 'Sign Up | Village',
  description: 'Create your Village account',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/welcome.svg" alt="Create your account" className="mx-auto h-12 sm:h-16 lg:h-20" />
          <p className="mt-2 text-sm text-muted-foreground">
            Join been there and connect with others
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
