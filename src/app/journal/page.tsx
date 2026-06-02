import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Journal / Scribe",
  description: "The URAI Scribe turns private reflections and passive signals into gentle narrative threads.",
};

export default function JournalPage() {
  return (
    <UraiRouteShell
      eyebrow="Journal / Scribe"
      title="Your private Scribe is ready for the first real chapter."
      description="URAI V1 keeps journaling calm and optional: reflections, companion notes, and Memory Star context can become private narrative threads without requiring constant manual input."
      primaryHref="/app/home"
      primaryLabel="Return to Home Orb"
      secondaryHref="/app/settings/privacy"
      secondaryLabel="Review Privacy Controls"
      sections={[
        { title: "Private by default", body: "Journal content belongs to the signed-in user and should never be exposed through the public demo route." },
        { title: "Memory-aware", body: "The Scribe can connect entries to Memory Stars, Recovery Arcs, rituals, and replay eras when those signals exist." },
        { title: "No medical claims", body: "V1 language stays reflective and supportive, avoiding diagnosis or therapy claims." },
      ]}
    />
  );
}
