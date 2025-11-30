'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, Users, BarChart3 } from 'lucide-react'
import { classifyText, ClassifyResponse } from '@/lib/api'
import { CategoryBadge } from '@/components/CategoryBadge'
import { ConfidenceBar } from '@/components/ConfidenceBar'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<ClassifyResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!inputText.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await classifyText(inputText)
      setResult(response)
    } catch (err) {
      setError('Failed to analyze text. Is the backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Needle in the Hashtag
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Helping identify concerning patterns in online communication 
          to make digital spaces safer for everyone.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="card text-center">
          <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-500">Messages Analyzed</div>
        </div>
        <div className="card text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-500">Flagged</div>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-500">Users Analyzed</div>
        </div>
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">--</div>
          <div className="text-sm text-gray-500">Accuracy</div>
        </div>
      </div>

      {/* Analysis Input */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">Try it out</h2>
        <textarea
          className="input min-h-[120px] mb-4"
          placeholder="Paste a message to analyze..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button 
          className="btn-primary w-full"
          onClick={handleAnalyze}
          disabled={loading || !inputText.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze Message'}
        </button>
        
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Analysis Result</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <CategoryBadge category={result.category} />
            <ConfidenceBar confidence={result.confidence} />
          </div>

          {result.indicators.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Indicators Found</h3>
              <div className="flex flex-wrap gap-2">
                {result.indicators.map((indicator, i) => (
                  <span key={i} className="badge bg-gray-100 text-gray-700">
                    {indicator}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Category Scores</h3>
            <div className="space-y-2">
              {Object.entries(result.scores)
                .sort(([, a], [, b]) => b - a)
                .map(([category, score]) => (
                  <div key={category} className="flex items-center gap-3">
                    <span className="w-32 text-sm text-gray-600">{category}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Example messages to try */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Try these examples:</h3>
        <div className="space-y-2">
          {[
            "I'm HUMBLED to announce I've been promoted to VP! Hard work pays off. Agree? 🚀",
            "I hate my body so much. Skipped lunch again today.",
            "Had a great coffee this morning! ☕",
            "Society is rigged against people like us. It's over.",
          ].map((example, i) => (
            <button
              key={i}
              className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 
                         rounded-lg text-sm text-gray-700 transition-colors"
              onClick={() => setInputText(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
