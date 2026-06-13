import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Shadow",
  description: "Shadow is a private space to safely explore difficult memories and integrate them into your life story.",
};

export default function ShadowPage() {
  return (
    <UraiRouteShell
      eyebrow="Shadow"
      title="Confront and integrate your shadow."
      description="The Shadow is a container for your difficult memories, suppressed emotions, and unresolved conflicts. By bringing them into the light, you can begin to heal and grow."
      primaryHref="/journal"
      primaryLabel="Begin Journaling"
      secondaryHref="/life-map"
      secondaryLabel="View Life Map"
      sections={[
        { title: "Private by design", body: "Your shadow is for your eyes only. It is a sacred space for you to explore your innermost thoughts and feelings without fear of judgment." },
        { title: "A safe container", body: "The Shadow is a safe place to process difficult emotions and experiences. You can write, draw, or record your thoughts and feelings without censorship." },
        { title: "Integration, not erasure", body: "The goal of shadow work is not to erase your difficult memories, but to integrate them into your life story in a healthy way. By accepting and understanding your shadow, you can become more whole." },
      ]}
    />
  );
}
