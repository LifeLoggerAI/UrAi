import { AssetFactoryRoutePanel } from "@/components/urai/assets/AssetFactoryRoutePanel";
import { NewHomeScene } from "@/components/urai/home/NewHomeScene";

export default function HomePage() {
  return (
    <>
      <NewHomeScene />
      <AssetFactoryRoutePanel route="/home" title="Home Asset Factory" />
    </>
  );
}
