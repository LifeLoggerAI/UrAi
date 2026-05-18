"use client";

import SpatialLifeMap from "@/components/spatial-life-map/SpatialLifeMap";

type LifeMapUniverseProps = {
  initialOverlay?: "mirror" | string;
  initialView?: "focus" | "replay" | "bloom" | string;
};

export default function LifeMapUniverse({ initialOverlay, initialView }: LifeMapUniverseProps) {
  return <SpatialLifeMap initialOverlay={initialOverlay} initialMode={initialView} />;
}
