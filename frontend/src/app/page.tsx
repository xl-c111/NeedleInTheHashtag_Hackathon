'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Users, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            You're Not Alone
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A supportive community for people struggling with loneliness and isolation.
            Find hope, connect with others who've been there, and discover a better path forward.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/posts"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Read Support Stories
            </Link>
            <Link
              href="/chat"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-blue-600"
            >
              Talk to AI Support
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real Stories
            </h3>
            <p className="text-gray-600">
              Read experiences from people who overcame similar struggles and found their way out.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Support
            </h3>
            <p className="text-gray-600">
              Talk through your feelings with a supportive AI that listens without judgment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Matched Resources
            </h3>
            <p className="text-gray-600">
              Find posts that relate to your specific situation and see how others handled it.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <Heart className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            You Deserve Support
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Thousands of people have felt the same way you do now. Many of them found a way forward,
            and so can you. Take the first step.
          </p>
          <Link
            href="/posts"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Exploring Stories
          </Link>
        </div>
      </div>
    </div>
  )
}
