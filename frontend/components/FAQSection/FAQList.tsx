"use client";

import { Suspense, useState } from "react";
import type { FAQ } from "./FAQData";
import { FAQItem } from "./FAQItem";

type FAQListProps = {
  faqs: FAQ[];
};

export function FAQList({ faqs }: FAQListProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<string>("001");

  const handleToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? "" : faqId);
  };

  return (
    <div className="space-y-2">
      <Suspense fallback={<div>Loading...</div>}>
        {faqs.map((faq) => (
          <FAQItem
            faq={faq}
            isExpanded={expandedFAQ === faq.id}
            key={faq.id}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </Suspense>
    </div>
  );
}
