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
      "You'll chat with an AI companion designed to listen without judgement. It's not a replacement for professional help, but a first step when you need someone to hear you. The stories you read are from real people in our community.",
  },
  {
    id: "003",
    title: "Is this free?",
    description:
      "Yes, Village is completely free. We believe everyone deserves access to support, regardless of their situation. There are no hidden costs, premium tiers, or data selling. Ever.",
  },
  {
    id: "004",
    title: "What if I'm in crisis?",
    description:
      "If you're experiencing a mental health crisis, please reach out to professional services immediately. In Australia: Lifeline (13 11 14), Beyond Blue (1300 22 4636), or call 000 for emergencies. Village is for peer support, not crisis intervention.",
  },
  {
    id: "005",
    title: "Can I share my own story?",
    description:
      "Absolutely. Sharing your experience can help others feel less alone, and many find it therapeutic. All stories are reviewed before publishing to ensure they're supportive and don't contain harmful content.",
  },
  {
    id: "006",
    title: "Why focus on young men?",
    description:
      "Young men often face unique barriers to seeking support—stigma, expectations, and fewer spaces that feel welcoming. Village is designed to meet these challenges with an approach that feels comfortable, not clinical.",
  },
];
