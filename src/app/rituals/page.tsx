import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Rituals",
  description: "Rituals turn URAI insights into gentle recovery and reflection actions.",
};

export default function RitualsPage() {
  return (
    <UraiRouteShell
      eyebrow="Rituals"
      title="Small rituals turn signals into recovery."
      description="URAI V1 treats rituals as optional, lightweight reflections connected to Memory Stars, Recovery Arcs, and narrator cues. They are not medical interventions or required tasks."
      primaryHref="/home"
      primaryLabel="Return to Home Orb"
      secondaryHref="/journal"
      secondaryLabel="Open Scribe"
      sections={[
        { title: "Optional", body: "Rituals should never block the user or create pressure. They are gentle suggestions." },
        { title: "Contextual", body: "A ritual can connect to a Memory Bloom, Replay Era, or Recovery Arc when the data supports it." },
        { title: "Private", body: "Ritual activity belongs to the user and must remain owner-only unless explicitly exported." },
      ]}
    />
  );
}
