import { PricingCard } from "./PricingCard";
import type { PricingTier } from "./PricingData";

type PricingGridProps = {
  tiers: PricingTier[];
};

export function PricingGrid({ tiers }: PricingGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {tiers.map((tier, index) => (
        <PricingCard index={index} key={tier.id} tier={tier} />
      ))}
    </div>
  );
}
