import { isDemoModeEnabled } from "@/src/lib/env";
import { PremiumLanding } from "@/components/marketing/premium-landing";

export function LandingPage() {
  return <PremiumLanding demoEnabled={isDemoModeEnabled()} />;
}
