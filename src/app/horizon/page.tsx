import type { Metadata } from "next";
import GenesisLaunchShell from "@/components/genesis/GenesisLaunchShell";

export const metadata: Metadata = {
  title: "Horizon | URAI Genesis",
  description: "Horizon is a launch-safe future-path preview for URAI Genesis.",
};

export default function HorizonPage() {
  return (
    <GenesisLaunchShell
      eyebrow="Horizon preview"
      title="A future path, clearly marked before it becomes personal."
      description="Horizon frames what URAI may help organize later: chosen memories, future reflections, and possibility. In Genesis, it stays a demo preview until authenticated, owner-scoped systems are proven."
      accent="gold"
      visualLabel="Horizon path"
      visualAsset="/assets/genesis/transitions/sky-to-galaxy-bloom.png"
      supportingAssets={["/assets/genesis/portals/galaxy-portal.png", "/assets/genesis/transitions/portal-flare.png"]}
      actions={[
        { href: "/life-map", label: "Open Life Map", note: "sample memory map" },
        { href: "/replay", label: "Open Replay", note: "cinematic preview" },
        { href: "/waitlist", label: "Join Early Access", note: "real CTA" },
      ]}
      cards={[
        { title: "Forward-looking", body: "Horizon points toward future memory and story paths without claiming autonomous planning or jobs are live." },
        { title: "Evidence-gated", body: "Generated media, exports, and story automation remain gated until real jobs, storage, and smoke proof exist." },
        { title: "Launch-safe CTA", body: "The page directs visitors to real demo routes and the waitlist instead of dead buttons or fake production access." },
      ]}
      safetyNote="Horizon is a roadmap-style Genesis preview. Real generated life movies, autonomous jobs, marketplace flows, and production media generation remain gated."
    />
  );
}
