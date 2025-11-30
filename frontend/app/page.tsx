import HeroSection from "@/components/HeroSection";
import Feature from "@/components/Feature";
import FAQSection from "@/components/FAQSection";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Feature />
      <FAQSection />
      <Footer />
    </div>
  );
}
