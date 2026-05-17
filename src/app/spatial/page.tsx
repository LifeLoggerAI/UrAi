import SpatialShell from "@/components/spatial/SpatialShell";

export const metadata = {
  title: "URAI Spatial",
  description: "Feature-gated URAI Spatial production shell and readiness surface.",
};

export default function SpatialPage() {
  return <SpatialShell mode="landing" />;
}
