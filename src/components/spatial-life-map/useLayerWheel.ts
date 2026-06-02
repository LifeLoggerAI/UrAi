"use client";

import { useMemo, useState } from "react";
import type { LifeMapLayer, LifeMapLayerId } from "@/lib/spatial-life-map/lifeMap.types";

export function useLayerWheel(layers: LifeMapLayer[]) {
  const [activeLayerIds, setActiveLayerIds] = useState<LifeMapLayerId[]>(() => layers.filter((layer) => layer.enabled).map((layer) => layer.id));

  const activeLayers = useMemo(() => layers.map((layer) => ({ ...layer, enabled: activeLayerIds.includes(layer.id) })), [activeLayerIds, layers]);

  function toggleLayer(layerId: LifeMapLayerId) {
    setActiveLayerIds((current) => current.includes(layerId) ? current.filter((id) => id !== layerId) : [...current, layerId]);
  }

  function enableAll() {
    setActiveLayerIds(layers.map((layer) => layer.id));
  }

  return { activeLayerIds, activeLayers, toggleLayer, enableAll };
}
