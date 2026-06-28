import type { Metadata } from "next";
import SystemRoutePage from "@/components/SystemRoutePage";

export const metadata: Metadata = {
  title: "XR | URAI Genesis",
  description: "URAI XR memory worlds are gated beyond the Genesis preview until device, provider, privacy, and smoke evidence exist.",
};

export default function XrPage() {
  return (
    <SystemRoutePage
      eyebrow="Spatial boundary"
      title="XR memory worlds are gated."
      description="Genesis can preview the idea of spatial memory worlds without claiming live AR, VR, or XR production support. Device-specific worlds, generated 3D assets, and provider-backed rendering stay disabled until evidence unlocks them."
      status="guarded"
    />
  );
}
