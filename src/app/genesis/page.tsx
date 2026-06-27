
import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "Genesis",
  description: "URAI Genesis is the launch-safe onboarding film and first quiet entry into the Life Map, orb companion, memory stars, and emotional weather preview.",
};

export default function GenesisPage() {
  return (
    <UraiRouteShell
      eyebrow="Genesis"
      title="The first star in your living galaxy."
      description="Genesis begins with the YOU LIVE film: a symbolic, consent-based trailer for Home, sky, ground, orb, Life Map, Focus, Replay, Passport, accessibility, and legacy. It is a preview path, not a claim that private generated media is live."
      primaryHref="/onboarding"
      primaryLabel="Watch Genesis Film"
      secondaryHref="/passport"
      secondaryLabel="Open Passport"
      sections={[
        { title: "Start quiet", body: "UrAi can open as a calm sky before any profile, journal, or setup ritual is required." },
        { title: "Let one memory bloom", body: "An optional memory can become the first visible star in the life-map experience." },
        { title: "Stay in control", body: "Choose what URAI can use. Genesis should remain symbolic, reversible, and connected to the app privacy route." },
      ]}
    />
  );
}
