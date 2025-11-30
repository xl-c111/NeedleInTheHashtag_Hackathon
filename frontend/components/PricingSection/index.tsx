import { PRICING_TIERS } from "./PricingData";
import { PricingFooter } from "./PricingFooter";
import { PricingGrid } from "./PricingGrid";
import { PricingHeader } from "./PricingHeader";

export default function PricingSection() {
  return (
    <section
      className="relative mx-auto flex w-full max-w-5xl flex-col px-6 pt-12 pb-24 sm:pt-16 sm:pb-32"
      id="pricing"
    >
      <PricingHeader />
      <PricingGrid tiers={PRICING_TIERS} />
      <PricingFooter />
    </section>
  );
}
