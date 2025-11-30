export interface FAQ {
  id: string;
  title: string;
  description: string;
}

export const FAQS: FAQ[] = [
  {
    id: "001",
    title: "Is this really anonymous?",
    description:
      "Yes, completely. We don't require any sign-up, email, or personal information. Your conversations and stories are never linked to your identity. We believe anonymity creates a safer space for honest sharing.",
  },
  {
    id: "002",
    title: "Who am I talking to?",
    description:
      "You'll start by chatting with an AI listener that helps you articulate what you're going through. It's not a companion or therapist—it's designed to understand your situation and match you with real stories from people who've been there. The stories you'll read are from real people in our community who've overcome similar challenges.",
  },
  {
    id: "003",
    title: "Is this free?",
    description:
      "Yes, been there is completely free. We believe everyone deserves access to support, regardless of their situation. There are no hidden costs, premium tiers, or data selling. Ever.",
  },
  {
    id: "004",
    title: "What if I'm in crisis?",
    description:
      "If you're experiencing a mental health crisis, please reach out to professional services immediately. In Australia: Lifeline (13 11 14), Beyond Blue (1300 22 4636), or call 000 for emergencies. been there is for peer support and finding relatable stories, not crisis intervention.",
  },
  {
    id: "005",
    title: "Can I share my own story?",
    description:
      "Absolutely. Sharing your experience can help others feel less alone, and many find it therapeutic. All stories are reviewed before publishing to ensure they're supportive and don't contain harmful content.",
  },
  {
    id: "006",
    title: "Who is this for?",
    description:
      "been there is for everyone facing challenges with loneliness, relationships, or finding their place in the world. While we see the biggest impact with young men—who often face unique barriers to seeking support—our platform welcomes anyone looking for real stories from people who understand what they're going through.",
  },
];
