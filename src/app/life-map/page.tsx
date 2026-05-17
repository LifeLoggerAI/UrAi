import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

export const metadata = {
  title: "URAI Spatial Life Map",
  description: "A draggable, zoomable, living 3D Memory Galaxy for URAI.",
};

export default function Page() {
  return <SpatialLifeMap />;
}
