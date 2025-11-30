import { VillageHero } from "@/components/village/VillageHero";
import { HowItWorks } from "@/components/village/HowItWorks";
import { StoriesPreview } from "@/components/village/StoriesPreview";
import { VillageFooter } from "@/components/village/VillageFooter";

export const metadata = {
  title: "Village - You're not alone",
  description:
    "A safe space for young men to share, listen, and find their way forward. Connect with real people who understand what you're going through.",
};

export default function VillagePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <VillageHero />
      <HowItWorks />
      <StoriesPreview />
      <VillageFooter />
    </div>
  );
}
