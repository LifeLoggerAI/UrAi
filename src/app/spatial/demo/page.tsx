import SpatialShell from "@/components/spatial/SpatialShell";

export const metadata = {
  title: "URAI Spatial Demo",
  description: "Public demo surface for URAI Spatial. Does not claim production live status.",
};

export default function SpatialDemoPage() {
  return <SpatialShell mode="demo" />;
}
