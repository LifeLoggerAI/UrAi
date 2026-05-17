"use client";

import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

type LifeMapUniverseProps = {
  initialOverlay?: "mirror" | string;
  initialView?: "focus" | "replay" | string;
};

export default function LifeMapUniverse(_props: LifeMapUniverseProps) {
  return <SpatialLifeMap />;
}
