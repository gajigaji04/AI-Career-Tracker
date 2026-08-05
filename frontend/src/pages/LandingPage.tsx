import LandingHeader from "../components/landing/LandingHeader";
import HeroSection from "../components/landing/HeroSection";
import FeatureSection from "../components/landing/FeatureSection";
import ProcessSection from "../components/landing/ProcessSection";
import TrustSection from "../components/landing/TrustSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div>
      <LandingHeader />
      <HeroSection />
      <FeatureSection />
      <ProcessSection />
      <TrustSection />
      <LandingFooter />
    </div>
  );
}
