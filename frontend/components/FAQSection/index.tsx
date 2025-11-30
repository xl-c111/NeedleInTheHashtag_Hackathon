import Accordion from "./Accordion";

const faqItems = [
  {
    question: "Is this really anonymous?",
    answer:
      "Yes, completely. We don't require any sign-up, email, or personal information. Your conversations and stories are never linked to your identity. We believe anonymity creates a safer space for honest sharing.",
  },
  {
    question: "Who am I talking to?",
    answer:
      "You'll chat with an AI companion designed to listen without judgement. It's not a replacement for professional help, but a first step when you need someone to hear you. The stories you read are from real people in our community.",
  },
  {
    question: "Is this free?",
    answer:
      "Yes, Village is completely free. We believe everyone deserves access to support, regardless of their situation. There are no hidden costs, premium tiers, or data selling. Ever.",
  },
  {
    question: "What if I'm in crisis?",
    answer:
      "If you're experiencing a mental health crisis, please reach out to professional services immediately. In Australia: Lifeline (13 11 14), Beyond Blue (1300 22 4636), or call 000 for emergencies. Village is for peer support, not crisis intervention.",
  },
  {
    question: "Can I share my own story?",
    answer:
      "Absolutely. Sharing your experience can help others feel less alone, and many find it therapeutic. All stories are reviewed before publishing to ensure they're supportive and don't contain harmful content.",
  },
  {
    question: "Why focus on young men?",
    answer:
      "Young men often face unique barriers to seeking support—stigma, expectations, and fewer spaces that feel welcoming. Village is designed to meet these challenges with an approach that feels comfortable, not clinical.",
  },
];

export default function FAQSection() {
  return (
    <section
      className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-12 pb-24 sm:pt-16 sm:pb-32"
      id="faq"
    >
      <Accordion
        title="Questions you might have"
        description="We get it. Here's what you need to know."
        items={faqItems}
      />
    </section>
  );
}
