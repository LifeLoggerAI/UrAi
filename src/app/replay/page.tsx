import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

export const metadata = {
  title: "URAI Replay",
  description: "A cinematic Genesis replay preview using sample memory-map state, not production generated user media.",
};

export default function ReplayPage() {
  return <SpatialLifeMap initialMode="replay" />;
}
