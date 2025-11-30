"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "Is this really anonymous?",
    answer:
      "Yes, completely. We don't require any sign-up, email, or personal information. Your conversations and stories are never linked to your identity. We believe anonymity creates a safer space for honest sharing.",
  },
  {
    id: "2",
    question: "Who am I talking to?",
    answer:
      "You'll chat with an AI companion designed to listen without judgement. It's not a replacement for professional help, but a first step when you need someone to hear you. The stories you read are from real people in our community.",
  },
  {
    id: "3",
    question: "Is this free?",
    answer:
      "Yes, Village is completely free. We believe everyone deserves access to support, regardless of their situation. There are no hidden costs, premium tiers, or data selling. Ever.",
  },
  {
    id: "4",
    question: "What if I'm in crisis?",
    answer:
      "If you're experiencing a mental health crisis, please reach out to professional services immediately. In Australia: Lifeline (13 11 14), Beyond Blue (1300 22 4636), or call 000 for emergencies. Village is for peer support, not crisis intervention.",
  },
  {
    id: "5",
    question: "Can I share my own story?",
    answer:
      "Absolutely. Sharing your experience can help others feel less alone, and many find it therapeutic. All stories are reviewed before publishing to ensure they're supportive and don't contain harmful content.",
  },
  {
    id: "6",
    question: "Why focus on young men?",
    answer:
      "Young men often face unique barriers to seeking support—stigma, expectations, and fewer spaces that feel welcoming. Village is designed to meet these challenges with an approach that feels comfortable, not clinical.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-800">
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={onToggle}
        type="button"
      >
        <span
          className={`font-medium text-base tracking-tight transition-colors duration-200 sm:text-lg ${
            isOpen ? "text-white" : "text-slate-300 hover:text-white"
          }`}
        >
          {item.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-teal-400" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="pb-5 text-slate-400 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function VillageFAQ() {
  const [openId, setOpenId] = useState<string | null>("1");

  return (
    <section className="relative bg-slate-950 py-24 sm:py-32">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-4 font-semibold text-2xl text-white tracking-tight sm:text-3xl md:text-4xl">
            Questions you might have
          </h2>
          <p className="text-slate-400 tracking-tight">
            We get it. Here's what you need to know.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              isOpen={openId === faq.id}
              item={faq}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
