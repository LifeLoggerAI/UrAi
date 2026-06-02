import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

export const metadata = {
  title: "URAI Replay",
  description: "Replay mode inside the URAI life-map field.",
};

export default function AppLifeMapReplayPage() {
  return <SpatialLifeMap initialMode="replay" />;
}