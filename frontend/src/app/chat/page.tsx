'use client'

import Link from 'next/link'
import { MessageCircle, ArrowLeft } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI Chat Coming Soon
        </h1>
        <p className="text-gray-600 mb-8">
          Your teammate is working on the AI chat feature. Check back soon!
        </p>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Read Support Stories
        </Link>
      </div>
    </div>
  )
}
