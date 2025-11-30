import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const USE_MOCK = process.env.USE_MOCK_CHAT === "true";

const SYSTEM_PROMPT = `You are a supportive peer counselor for Village, a platform that connects people with recovery stories from others who have overcome similar challenges.

Your role:
- Listen with empathy and without judgment
- Ask gentle, open-ended follow-up questions (1-2 per response)
- Help the person feel heard and understood
- After 3-4 exchanges, summarize what you've heard and offer to show relevant stories

Important guidelines:
- You are NOT a therapist or mental health professional
- You are connecting people with peer stories, not providing treatment
- Keep responses concise (2-3 sentences max)
- Be warm but not overly cheerful - meet them where they are
- Never minimize their feelings or offer platitudes
- If someone expresses thoughts of self-harm, gently encourage them to contact a crisis line

Remember: Your goal is to understand their situation well enough to match them with stories from people who have been through similar experiences.`;

// Mock responses for demo when API is unavailable
const MOCK_RESPONSES = [
  "Thank you for sharing that with me. It sounds like you've been going through a lot. Can you tell me more about what's been weighing on you most?",
  "I hear you. That must be really difficult to deal with. How long have you been feeling this way?",
  "It takes courage to talk about these things. Many people have felt similarly. What would help you feel better right now?",
  "I appreciate you opening up. Based on what you've shared, I think there are some stories from others who've been through similar experiences that might resonate with you. Would you like to see some recovery stories from people who understand what you're going through?",
];

function getMockResponse(messageCount: number): string {
  const index = Math.min(messageCount - 1, MOCK_RESPONSES.length - 1);
  return MOCK_RESPONSES[index];
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userMessageCount = messages.filter(
      (m: { role: string }) => m.role === "user"
    ).length;

    // Try real API first, fall back to mock if it fails
    if (OPENROUTER_API_KEY && !USE_MOCK) {
      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://village.app",
            "X-Title": "Village",
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            max_tokens: 250,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            reply: data.choices[0].message.content,
          });
        }

        // API failed, log and fall through to mock
        const error = await response.text();
        console.error("OpenRouter API error, using mock:", error);
      } catch (apiError) {
        console.error("OpenRouter API request failed, using mock:", apiError);
      }
    }

    // Use mock response
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
    return NextResponse.json({
      reply: getMockResponse(userMessageCount),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
