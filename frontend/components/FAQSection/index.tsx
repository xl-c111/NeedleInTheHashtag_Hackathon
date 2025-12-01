import Accordion from "./Accordion";

const faqItems = [
  {
    question: "Is this really anonymous?",
    answer:
      "Yes. You can make a profile without using your real name. We believe anonymity creates a safer space for honest sharing.",
  },
  {
    question: "Who am I talking to?",
    answer:
      "You'll chat with an AI companion (a friendly owl!) designed to listen to your story, then match you with mentor stories that match yours. The stories you read are from real people in our community.",
  },
  {
    question: "Is this free?",
    answer:
      "Yes, been there is completely free. We believe everyone deserves access to support, regardless of their situation. There are no hidden costs, premium tiers, or data selling. Ever.",
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
];

export default function FAQSection() {
  return (
    <section
      className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-12 pb-24 sm:pt-16 sm:pb-32"
      id="faq"
    >
      {/* Header outside scroll background */}
      <div className="text-center -mb-100">
        <img src="/questions.svg" alt="questions?" className="mx-auto mb-0 h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36" />
        <img src="/readfaqribbon.svg" alt="read our faq below" className="mx-auto mb-0 h-8 sm:h-10 md:h-12" />
      </div>
      
      {/* FAQ items with larger scroll background */}
      <div
        className="w-full max-w-4xl min-h-[1500px] flex items-center justify-center px-8 py-24"
        style={{
          backgroundImage: "url('/scrollpostthicc.svg')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full max-w-2xl">
          <Accordion
            title=""
            description=""
            items={faqItems}
          />
        </div>
      </div>
    </section>
  );
}
