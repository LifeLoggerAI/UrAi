import type { Metadata } from "next";
import GenesisLaunchShell from "@/components/genesis/GenesisLaunchShell";

export const metadata: Metadata = {
  title: "Home Orb | URAI Genesis",
  description: "URAI Genesis home preview with launch-safe paths into Life Map, Focus, Replay, Ground, Orb, Sky, and Horizon.",
};

export default function HomePage() {
  return (
    <GenesisLaunchShell
      eyebrow="Genesis home preview"
      title="The home field opens before anything private does."
      description="URAI Home is the calm launch doorway: a cinematic public demo that points to the Life Map, Focus, Replay, Ground, Sky, and Horizon surfaces without claiming private data systems are live."
      accent="cyan"
      visualLabel="Home Orb field"
      visualAsset="/assets/genesis/hero/urai-genesis-hero-1600x1000.png"
      supportingAssets={["/assets/genesis/orb/orb-core.png", "/assets/genesis/overlays/starfield.png"]}
      actions={[
        { href: "/life-map", label: "Open Life Map", note: "memory map preview" },
        { href: "/replay", label: "Open Replay", note: "sample preview" },
        { href: "/passport", label: "Open Passport", note: "privacy boundary" },
        { href: "/ground", label: "Touch Ground", note: "calm return" },
        { href: "/orb", label: "Meet Orb", note: "companion preview" },
        { href: "/orb-chat", label: "Open Orb Chat", note: "safe fallback" },
        { href: "/focus", label: "Enter Focus", note: "reflection surface" },
        { href: "/horizon", label: "See Horizon", note: "future path preview" },
      ]}
      cards={[
        { title: "Public demo first", body: "This page shows the Genesis feel while keeping private account data, passive signals, and provider systems closed." },
        { title: "One coherent path", body: "Home, Life Map, Focus, Replay, Ground, Orb, Sky, and Horizon now share the same launch-safe visual language." },
        { title: "No fake memories", body: "Sample surfaces are cinematic previews only. Real generated media stays gated until owner-scoped proof exists." },
      ]}
      safetyNote="Home is a launch demo and does not unlock passive sensing, production generated media, autonomous jobs, or private data access."
    />
  );
}
