export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  ctaText: string;
  color: string;
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    subtitle: "Perfect for individuals exploring AI",
    price: 0,
    ctaText: "Get Started",
    color: "blue",
    features: [
      "1 AI Agent",
      "5K API calls/mo",
      "Community support",
      "Basic templates",
      "Email notifications",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    subtitle: "For teams scaling AI workflows",
    price: 49,
    ctaText: "Start Free Trial",
    color: "purple",
    features: [
      "5 AI Agents",
      "Unlimited API calls",
      "Priority support 24/7",
      "Advanced analytics",
      "Custom workflows",
      "Team collaboration",
      "Premium templates",
      "Webhook integrations",
    ],
  },
  {
    id: "sales",
    name: "Sales",
    subtitle: "Custom solutions for enterprises",
    price: 299,
    ctaText: "Contact Sales",
    color: "pink",
    features: [
      "Unlimited Agents",
      "Dedicated support",
      "Custom AI training",
      "99.9% SLA guarantee",
      "Advanced security",
      "White-label options",
      "On-premise deployment",
      "Custom integrations",
    ],
  },
];
