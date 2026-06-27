import type { Metadata } from "next";
import GenesisLaunchShell from "@/components/genesis/GenesisLaunchShell";

export const metadata: Metadata = {
  title: "Orb | URAI Genesis",
  description: "The URAI Orb identity and companion doorway for the Genesis public demo.",
};

export default function OrbPage() {
  return (
    <GenesisLaunchShell
      eyebrow="Orb identity preview"
      title="The companion presence stays gentle, visible, and bounded."
      description="The Orb is URAI's visual companion identity in the Genesis demo. It can guide navigation and explain boundaries, but provider-backed intelligence and private memory access remain gated until proven."
      accent="violet"
      visualLabel="Companion Orb"
      visualAsset="/assets/genesis/orb/orb-core.png"
      supportingAssets={["/assets/genesis/orb/orb-glow.png", "/assets/genesis/orb/orb-particles.png"]}
      actions={[
        { href: "/orb-chat", label: "Open Orb Chat", note: "companion chamber" },
        { href: "/home", label: "Return Home", note: "safe entry" },
        { href: "/privacy", label: "Check Boundaries", note: "claim safety" },
      ]}
      cards={[
        { title: "Companion chamber", body: "Orb Chat opens a polished, demo-safe companion surface instead of a raw fallback or provider error state." },
        { title: "Companion, not therapist", body: "Public copy avoids therapy, diagnosis, or hidden private analysis claims." },
        { title: "Provider-gated", body: "Private memory access and provider-backed intelligence remain gated unless server-only credentials, tests, and smoke evidence prove them." },
      ]}
      safetyNote="Orb is a companion preview. It does not prove live therapy, autonomous agents, passive sensing, or production private-memory intelligence."
    />
  );
}
