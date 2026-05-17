import SpatialShell from "@/components/spatial/SpatialShell";

export const metadata = {
  title: "URAI Spatial Assets",
  description: "Generated asset readiness surface for URAI Spatial.",
};

export default function SpatialAssetsPage() {
  return <SpatialShell mode="assets" />;
}
