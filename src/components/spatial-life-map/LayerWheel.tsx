"use client";

import type { LifeMapLayer, LifeMapLayerId } from "@/lib/spatial-life-map/lifeMap.types";

interface LayerWheelProps {
  layers: LifeMapLayer[];
  activeLayerIds: LifeMapLayerId[];
  onToggle: (layerId: LifeMapLayerId) => void;
  onEnableAll: () => void;
}

export default function LayerWheel({ layers, activeLayerIds, onToggle, onEnableAll }: LayerWheelProps) {
  return (
    <aside className="spatial-layer-wheel" aria-label="Life Map layers">
      <button type="button" className="spatial-layer-core" onClick={onEnableAll} aria-label="Enable all Life Map layers">
        <span>Layers</span>
        <strong>{activeLayerIds.length}/{layers.length}</strong>
      </button>
      <div className="spatial-layer-orbit">
        {layers.map((layer, index) => {
          const active = activeLayerIds.includes(layer.id);
          const angle = (index / layers.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 112;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <button
              key={layer.id}
              type="button"
              className="spatial-layer-glyph"
              data-active={active}
              onClick={() => onToggle(layer.id)}
              style={{ transform: `translate(${x}px, ${y}px)`, borderColor: active ? layer.color : undefined, boxShadow: active ? `0 0 22px ${layer.color}55` : undefined }}
              aria-pressed={active}
              aria-label={`${active ? "Hide" : "Show"} ${layer.name}`}
            >
              <span style={{ color: layer.color }}>{layer.icon}</span>
              <em>{layer.name}</em>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
