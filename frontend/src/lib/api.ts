/**
 * API Client
 * 
 * Handles all communication with the backend.
 * Set USE_MOCK = true to use mock data (for frontend-only development)
 * Set USE_MOCK = false to use the real backend
 */

// Toggle this to switch between mock and real API
const USE_MOCK = true  // Set to false when backend is running

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============== Types ==============

export interface ClassifyResponse {
  text: string
  category: string
  confidence: number
  indicators: string[]
  scores: Record<string, number>
}

export interface BatchClassifyResponse {
  results: Array<{
    text: string
    category: string
    confidence: number
  }>
  summary: {
    total: number
    by_category: Record<string, number>
  }
}

export interface UserAnalyzeResponse {
  user_id: string
  primary_persona: string
  confidence: number
  message_count: number
  persona_breakdown: Record<string, number>
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  indicators: string[]
}

// ============== Mock Data ==============

const mockClassify = (text: string): ClassifyResponse => {
  // Simple mock classification based on keywords
  const textLower = text.toLowerCase()
  
  let category = 'normal'
  let confidence = 0.85
  const indicators: string[] = []
  const scores: Record<string, number> = {
    linkedin_lunatic: 0.05,
    body_dysmorphia: 0.05,
    incel: 0.05,
    toxic: 0.05,
    normal: 0.80,
  }
  
  if (textLower.includes('humbled') || textLower.includes('agree?')) {
    category = 'linkedin_lunatic'
    confidence = 0.82
    indicators.push('humbled', 'agree?')
    scores.linkedin_lunatic = 0.82
    scores.normal = 0.10
  } else if (textLower.includes('hate my body') || textLower.includes('skipped')) {
    category = 'body_dysmorphia'
    confidence = 0.78
    indicators.push('negative body talk')
    scores.body_dysmorphia = 0.78
    scores.normal = 0.15
  } else if (textLower.includes('rigged') || textLower.includes("it's over")) {
    category = 'incel'
    confidence = 0.72
    indicators.push('system rigged')
    scores.incel = 0.72
    scores.normal = 0.20
  }
  
  return {
    text,
    category,
    confidence,
    indicators,
    scores,
  }
}

// ============== API Functions ==============

export async function classifyText(text: string): Promise<ClassifyResponse> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockClassify(text)
  }
  
  const response = await fetch(`${API_BASE_URL}/api/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  
  return response.json()
}

export async function classifyBatch(texts: string[]): Promise<BatchClassifyResponse> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800))
    const results = texts.map(text => {
      const r = mockClassify(text)
      return { text: r.text, category: r.category, confidence: r.confidence }
    })
    
    const by_category: Record<string, number> = {}
    results.forEach(r => {
      by_category[r.category] = (by_category[r.category] || 0) + 1
    })
    
    return {
      results,
      summary: { total: results.length, by_category }
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/api/classify/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  })
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  
  return response.json()
}

export async function analyzeUser(
  userId: string, 
  messages: string[]
): Promise<UserAnalyzeResponse> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock user analysis
    const results = messages.map(mockClassify)
    const categories = results.map(r => r.category)
    const primaryPersona = categories.sort((a, b) =>
      categories.filter(v => v === a).length - categories.filter(v => v === b).length
    ).pop() || 'normal'
    
    return {
      user_id: userId,
      primary_persona: primaryPersona,
      confidence: 0.72,
      message_count: messages.length,
      persona_breakdown: {
        normal: 0.60,
        linkedin_lunatic: 0.20,
        body_dysmorphia: 0.10,
        incel: 0.05,
        toxic: 0.05,
      },
      risk_level: 'low',
      indicators: ['sample indicator 1', 'sample indicator 2'],
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/api/analyze/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, messages }),
  })
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  
  return response.json()
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    return response.ok
  } catch {
    return false
  }
}
