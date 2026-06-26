import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

export const metadata = {
  title: "URAI Focus",
  description: "A launch-safe Genesis focus preview inside the URAI Life Map field.",
};

export default function FocusPage() {
  return <SpatialLifeMap initialMode="focus" />;
}
