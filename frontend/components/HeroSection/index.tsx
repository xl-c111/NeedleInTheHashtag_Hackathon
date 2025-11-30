import { HeroContent } from "./HeroContent";
import { HeroImage } from "./HeroImage";
import { SignInOptions } from "./SignInOptions";
import { TrustIndicators } from "./TrustIndicators";

export default function HeroSection() {
  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pt-20 pb-12 sm:px-6 sm:pt-32 sm:pb-16">
      <div className="grid w-full items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4 sm:space-y-6">
          <HeroContent />
          <SignInOptions />
          <TrustIndicators />
        </div>

        <HeroImage />
      </div>
    </section>
  );
}
