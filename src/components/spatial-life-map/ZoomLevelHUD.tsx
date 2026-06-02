"use client";

import type { LifeMapZoomLevel } from "@/lib/spatial-life-map/lifeMap.types";

const labels: Record<LifeMapZoomLevel, { title: string; description: string }> = {
  0: { title: "Universal View", description: "Full symbolic life galaxy" },
  1: { title: "Galaxy Cluster View", description: "Major eras and life chapters" },
  2: { title: "Constellation View", description: "Thread lines and emotional arcs" },
  3: { title: "Star View", description: "Individual memory portals" },
  4: { title: "Memory Bloom View", description: "Immersive detail layer" },
};

export default function ZoomLevelHUD({ zoomLevel, zoom }: { zoomLevel: LifeMapZoomLevel; zoom: number }) {
  const copy = labels[zoomLevel];
  return (
    <div className="spatial-zoom-hud" aria-label="Spatial zoom level">
      <span>Level {zoomLevel}</span>
      <strong>{copy.title}</strong>
      <em>{copy.description}</em>
      <small>{Math.round((14 - zoom) * 10)}% depth</small>
    </div>
  );
}
