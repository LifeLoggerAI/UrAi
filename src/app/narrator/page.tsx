import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Narrator",
  description: "The URAI narrator explains emotional weather, Memory Stars, and replay moments without overclaiming.",
};

export default function NarratorPage() {
  return (
    <UraiRouteShell
      eyebrow="Narrator"
      title="The narrator speaks only when the signal is useful."
      description="URAI V1 uses a safe companion/narrator layer for reflections, Life Map context, and replay cues. It stays explainable, private, and grounded in visible user-owned signals."
      primaryHref="/app/home"
      primaryLabel="Return to Home Orb"
      secondaryHref="/app/life-map"
      secondaryLabel="Open Life Map"
      sections={[
        { title: "Context-aware", body: "Narrator cues can attach to Memory Stars, replay beats, emotional weather, and recovery arcs." },
        { title: "Fallback-safe", body: "The companion API has deterministic fallback behavior so the route does not pretend an AI provider is configured when it is not." },
        { title: "Explainable", body: "V1 should always make it clear why a narrator insight appeared and how to adjust privacy controls." },
      ]}
    />
  );
}
