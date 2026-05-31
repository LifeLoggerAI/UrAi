import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Scrolls",
  description: "Scrolls are private narrative exports from URAI Memory Stars, rituals, and replay eras.",
};

export default function ScrollsPage() {
  return (
    <UraiRouteShell
      eyebrow="Scrolls"
      title="Your life can become a scroll when you choose to export it."
      description="URAI V1 keeps scrolls as user-controlled narrative artifacts: seasonal reflections, replay summaries, and Memory Bloom recaps that can be generated privately before any sharing."
      primaryHref="/app/life-map"
      primaryLabel="Open Life Map"
      secondaryHref="/app/settings/privacy"
      secondaryLabel="Privacy Controls"
      sections={[
        { title: "User-controlled", body: "A scroll should never be public by default. Export and sharing must be intentional." },
        { title: "Narrative", body: "Scrolls can summarize Memory Stars, rituals, narrator cues, and recovery arcs into a readable chapter." },
        { title: "Launch-safe", body: "V1 can show the scroll surface while deeper export automation remains gated until verified." },
      ]}
    />
  );
}
