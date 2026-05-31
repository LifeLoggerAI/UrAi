import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "About URAI",
  description: "URAI turns one memory into the first scene of a living world.",
};

export default function AboutPage() {
  return (
    <UraiRouteShell
      eyebrow="About URAI"
      title="URAI turns memory into a living world."
      description="URAI V1 starts with one memory, then turns it into a cinematic scene users can share, revisit, and expand through the deeper home experience."
      primaryHref="/"
      primaryLabel="Create a Scene"
      secondaryHref="/app/home"
      secondaryLabel="Enter Existing World"
      sections={[
        { title: "One memory first", body: "The public entry is intentionally simple: add a memory, choose a vibe, and see the first scene form without setup." },
        { title: "World, not dashboard", body: "URAI presents memories as scenes, companion reflections, symbolic ground, and atmosphere instead of another tracking dashboard." },
        { title: "Privacy-first V1", body: "The public demo uses safe sample data. Any future passive or personal data layers must remain opt-in, owner-only, and consent-gated." },
      ]}
    />
  );
}
