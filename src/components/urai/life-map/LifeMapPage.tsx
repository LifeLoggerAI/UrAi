"use client";

import { useMemo, useState } from "react";
import { memoryStars, memoryThreads } from "@/components/urai/data/memoryStars";
import type { MemoryCategory } from "@/components/urai/data/emotionPalette";
import { useGalaxyCamera } from "@/components/urai/hooks/useGalaxyCamera";
import { useReducedMotionSafe } from "@/components/urai/hooks/useReducedMotionSafe";
import { useStarSelection } from "@/components/urai/hooks/useStarSelection";
import { CategoryFilterDock } from "./CategoryFilterDock";
import { CompanionInsightCard } from "./CompanionInsightCard";
import { ConstellationThreadLayer } from "./ConstellationThreadLayer";
import { GalaxyActionDock } from "./GalaxyActionDock";
import { GalaxyBackground } from "./GalaxyBackground";
import { GalaxyCamera } from "./GalaxyCamera";
import { GalaxyViewport } from "./GalaxyViewport";
import { MemoryStarLayer } from "./MemoryStarLayer";
import { NebulaZones } from "./NebulaZones";
import { OrbitRings } from "./OrbitRings";
import { SelectedStarPortal } from "./SelectedStarPortal";
import { ZoomMiniMap } from "./ZoomMiniMap";

function GalaxyParticles() {
  const reduced = useReducedMotionSafe();
  const stars = useMemo(() => {
    const count = reduced ? 70 : 180;
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      x: (index * 83) % 100,
      y: (index * 47) % 100,
      size: 0.7 + ((index * 13) % 26) / 15,
      opacity: 0.14 + ((index * 17) % 72) / 100,
      delay: ((index * 7) % 50) / 10,
    }));
  }, [reduced]);

  return (
    <div className="urai-galaxy-particles" aria-hidden>
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function LifeMapPage() {
  const [activeCategory, setActiveCategory] = useState<MemoryCategory | "all">("all");
  const [mode, setMode] = useState<"default" | "replay" | "mirror">("default");
  const { camera, dragging, zoomByDelta, recenter, focusCameraOn, onPointerDown, onPointerMove, stopDrag } = useGalaxyCamera();
  const { selectedId, selected, relatedIds, selectStar, clearSelection } = useStarSelection(memoryStars, "blue-fog-memory");

  const replay = () => {
    setMode("replay");
    let index = 0;
    const sequence = ["blue-fog-memory", "threshold-flare", "mirror-line", "protected-hour", "morning-return"];
    const timer = window.setInterval(() => {
      const star = memoryStars.find((item) => item.id === sequence[index % sequence.length]);
      if (star) {
        selectStar(star.id);
        focusCameraOn(star, 1.28);
      }
      index += 1;
      if (index > sequence.length) {
        window.clearInterval(timer);
        setMode("default");
      }
    }, 960);
  };

  const toggleMirror = () => setMode((current) => (current === "mirror" ? "default" : "mirror"));

  return (
    <main className={`urai-screen urai-life-map-screen ${mode === "mirror" ? "is-mirror-mode" : ""} ${selected ? "has-selected-star" : ""}`}>
      <GalaxyParticles />
      <GalaxyBackground />
      <header className="urai-life-title">
        <span>URAI LIFE MAP</span>
        <strong>Memory Galaxy</strong>
        <em>{memoryStars.length} Memory Stars · {memoryThreads.length} Timeline Constellations · {mode}</em>
      </header>

      <GalaxyViewport
        onWheel={(event) => {
          event.preventDefault();
          zoomByDelta(event.deltaY);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
      >
        <GalaxyCamera camera={camera} dragging={dragging}>
          <div className="urai-galaxy-world">
            <NebulaZones activeCategory={activeCategory} />
            <OrbitRings mirrorMode={mode === "mirror"} />
            <ConstellationThreadLayer stars={memoryStars} threads={memoryThreads} relatedIds={relatedIds} hasSelection={Boolean(selected)} />
            <MemoryStarLayer
              stars={memoryStars}
              selectedId={selectedId}
              selectedActive={Boolean(selected)}
              relatedIds={relatedIds}
              activeCategory={activeCategory}
              onSelect={selectStar}
            />
            <SelectedStarPortal selected={selected} mode={mode} onClose={clearSelection} onReplay={replay} onToggleMirror={toggleMirror} />
          </div>
        </GalaxyCamera>
      </GalaxyViewport>

      <CompanionInsightCard selected={selected} />
      <GalaxyActionDock onHideThread={clearSelection} onReplay={replay} onMirror={toggleMirror} onRecenter={recenter} />
      <CategoryFilterDock activeCategory={activeCategory} onChange={setActiveCategory} />
      <ZoomMiniMap camera={camera} />
    </main>
  );
}
