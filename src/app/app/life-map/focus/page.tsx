import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

export const metadata = {
  title: "URAI Focus",
  description: "Focus mode inside the URAI life-map field.",
};

export default function AppLifeMapFocusPage() {
  return <SpatialLifeMap initialMode="focus" />;
}
