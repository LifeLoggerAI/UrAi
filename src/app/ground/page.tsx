import type { Metadata } from "next";
import GenesisLaunchShell from "@/components/genesis/GenesisLaunchShell";

export const metadata: Metadata = {
  title: "Ground | URAI Genesis",
  description: "Ground is a launch-safe stabilizing preview surface for URAI Genesis.",
};

export default function GroundPage() {
  return (
    <GenesisLaunchShell
      eyebrow="Ground preview"
      title="A calm base layer for returning to yourself."
      description="Ground is a stabilizing Genesis preview. It uses local visual assets and symbolic language only; it does not infer recovery, health, sleep, device, or biometric data."
      accent="emerald"
      visualLabel="Rooted ground layer"
      visualAsset="/assets/genesis/ground/ground-base.png"
      supportingAssets={["/assets/genesis/ground/ground-bloom.png", "/assets/genesis/ground/root-glow.png"]}
      actions={[
        { href: "/home", label: "Return Home", note: "Genesis entry" },
        { href: "/life-map", label: "Open Life Map", note: "sample galaxy" },
        { href: "/privacy", label: "Review Privacy", note: "consent boundary" },
      ]}
      cards={[
        { title: "Stabilizing, not diagnostic", body: "The page is intentionally embodied and calm without making health, clinical, or recovery claims." },
        { title: "Sample-safe roots", body: "Any roots, blooms, or soil metaphors are launch-demo visuals, not private user-derived intelligence." },
        { title: "Fallback-ready", body: "If richer assets are unavailable, the route still renders as a polished local gradient and card surface." },
      ]}
      safetyNote="Ground remains a Genesis preview. Live sensing, health data, and recovery inference stay gated behind consent, rules, retention, export/delete, and smoke evidence."
    />
  );
}
