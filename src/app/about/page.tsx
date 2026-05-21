import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "About URAI",
  description: "URAI is a passive, magical life OS for memory, emotional weather, and reflection.",
};

export default function AboutPage() {
  return (
    <UraiRouteShell
      eyebrow="About URAI"
      title="URAI is a magical life OS for memory, mood, and meaning."
      description="URAI V1 brings the Home Orb, Emotional Weather, Memory Stars, Life Map, companion, and privacy-first demo route into one cohesive launch surface."
      primaryHref="/home"
      primaryLabel="Enter Home Orb"
      secondaryHref="/waitlist"
      secondaryLabel="Join Waitlist"
      sections={[
        { title: "Passive by design", body: "URAI is designed to feel calm and low-friction, with optional interaction rather than constant manual tracking." },
        { title: "Symbolic interface", body: "Signals become stars, blooms, scrolls, ground growth, and weather so users can understand patterns visually." },
        { title: "Privacy-first", body: "The public demo uses safe sample data. Private user data must remain owner-only and consent-gated." },
      ]}
    />
  );
}
