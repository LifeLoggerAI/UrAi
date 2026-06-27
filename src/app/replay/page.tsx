import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";
import { Suspense } from "react";
import LifeMovieReplayGateway from "@/components/replay/LifeMovieReplayGateway";

export const metadata = {
  title: "URAI Replay",
  description: "A cinematic Genesis replay preview using sample memory-map state, not production generated user media.",
};

export default function ReplayPage() {
  return (
    <>
      <Suspense fallback={null}>
        <LifeMovieReplayGateway />
      </Suspense>
      <SpatialLifeMap initialMode="replay" />
    </>
  );
}
