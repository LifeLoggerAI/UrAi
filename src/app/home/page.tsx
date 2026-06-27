import type { Metadata } from "next";
import GenesisLaunchShell from "@/components/genesis/GenesisLaunchShell";

export const metadata: Metadata = {
  title: "Genesis Home | URAI",
  description: "Start the URAI Genesis friend-demo path with a cinematic Home field, sample-only Life Map, Focus, Replay, and Waitlist flow.",
};

export default function HomePage() {
  return (
    <GenesisLaunchShell
      eyebrow="Genesis Home / sample-only demo"
      title="The orb wakes the map before anything private opens."
      description="This is the premium public doorway for URAI Genesis: sky, ground, orb, and horizon as a launch-safe path into Life Map, Focus, Replay, and the waitlist. Private memories and personalized generation remain gated."
      accent="cyan"
      visualLabel="Home Orb / sky field"
      visualAsset="/assets/genesis/hero/urai-genesis-hero-1600x1000.png"
      supportingAssets={["/assets/genesis/orb/orb-core.png", "/assets/genesis/overlays/starfield.png"]}
      actions={[
        { href: "/life-map", label: "Open Life Map", note: "sample memory world" },
        { href: "/focus", label: "Enter Focus", note: "what matters now" },
        { href: "/replay", label: "Open Replay", note: "Genesis preview reel" },
        { href: "/waitlist", label: "Join Waitlist", note: "real early access" },
        { href: "/passport", label: "Open Passport", note: "privacy boundary" },
        { href: "/ground", label: "Touch Ground", note: "calm return" },
        { href: "/orb", label: "Meet Orb", note: "companion preview" },
        { href: "/orb-chat", label: "Open Orb Chat", note: "safe fallback" },
        { href: "/horizon", label: "See Horizon", note: "future path preview" },
      ]}
      cards={[
        { title: "Friend-demo path", body: "Start here, move through Life Map, narrow into Focus, watch Replay, then join the waitlist. Every button goes somewhere real." },
        { title: "Orb-first identity", body: "The orb stays central as URAI's calm guide, while the map and replay show the product's cinematic direction." },
        { title: "No fake private life", body: "All memory stars and replay moments are clearly sample previews. Real generated media stays gated until owner-scoped proof exists." },
      ]}
      safetyNote="Home is a Genesis launch demo. It does not unlock passive sensing, production generated media, autonomous jobs, therapy claims, or private data access."
    />
  );
}
