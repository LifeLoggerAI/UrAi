import { AssetFactoryRoutePanel } from "@/components/urai/assets/AssetFactoryRoutePanel";
import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

export default function LifeMapPage() {
  return (
    <>
      <SpatialLifeMap />
      <AssetFactoryRoutePanel route="/life-map" title="Life Map Launch Asset Pipeline" />
    </>
  );
}
