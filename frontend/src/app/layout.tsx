import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'eSafety Hackathon',
  description: 'Needle in the Hashtag - Making online spaces safer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  <span className="font-semibold text-lg">eSafety Hackathon</span>
                </div>
                <nav className="flex gap-6">
                  <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                  <a href="/analyze" className="text-gray-600 hover:text-gray-900">Analyze</a>
                  <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                Built at the eSafety Hackathon 2025 🇦🇺
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
