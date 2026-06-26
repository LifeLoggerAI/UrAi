import type { Metadata } from "next";
import GenesisLaunchShell from "@/components/genesis/GenesisLaunchShell";

export const metadata: Metadata = {
  title: "Sky | URAI Genesis",
  description: "Sky is an expansive launch-safe reflection surface for URAI Genesis.",
};

export default function SkyPage() {
  return (
    <GenesisLaunchShell
      eyebrow="Sky preview"
      title="An expansive field for reflection without surveillance."
      description="Sky gives the Genesis demo its spacious, horizon-like atmosphere. It is a visual and emotional frame, not a live passive-sensing layer or inferred emotional weather system."
      accent="cyan"
      visualLabel="Reflective sky field"
      visualAsset="/assets/genesis/sky/sky-background.png"
      supportingAssets={["/assets/genesis/sky/cloud-mid.png", "/assets/genesis/sky/sky-depth-haze.png"]}
      actions={[
        { href: "/horizon", label: "Open Horizon", note: "future preview" },
        { href: "/ground", label: "Touch Ground", note: "stabilizing layer" },
        { href: "/home", label: "Return Home", note: "Genesis entry" },
      ]}
      cards={[
        { title: "Expansive, not empty", body: "The route uses Genesis sky assets and dimensional atmosphere so it does not feel like a blank prototype page." },
        { title: "No hidden sensing", body: "Sky copy does not imply live mood detection, location, audio, device, or biometric capture." },
        { title: "Public-safe preview", body: "The route is safe as a visual demo surface while richer emotional-weather systems stay gated." },
      ]}
      safetyNote="Sky is a visual preview only. Emotional weather, passive signals, and derived intelligence are gated until explicit proof exists."
    />
  );
}
