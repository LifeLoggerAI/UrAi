"use client";

import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

interface SpatialControlsProps {
  selectedStar: LifeMapStar | null;
  onReset: () => void;
  onBloom: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function SpatialControls({ selectedStar, onReset, onBloom, onZoomIn, onZoomOut }: SpatialControlsProps) {
  return (
    <div className="spatial-controls" aria-label="Spatial Life Map controls">
      <button type="button" onClick={onZoomOut}>Zoom out</button>
      <button type="button" onClick={onReset}>Full galaxy</button>
      <button type="button" onClick={onZoomIn}>Zoom in</button>
      <button type="button" onClick={onBloom} disabled={!selectedStar}>Open bloom</button>
    </div>
  );
}
