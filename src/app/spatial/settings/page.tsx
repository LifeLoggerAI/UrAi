import SpatialShell from "@/components/spatial/SpatialShell";

export const metadata = {
  title: "URAI Spatial Consent",
  description: "Consent and privacy readiness surface for URAI Spatial.",
};

export default function SpatialSettingsPage() {
  return <SpatialShell mode="settings" />;
}
