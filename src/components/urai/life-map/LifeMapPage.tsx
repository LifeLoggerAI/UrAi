"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useCallback } from "react";
import { memoryStars, memoryThreads } from "@/components/urai/data/memoryStars";
import type { MemoryCategory } from "@/components/urai/data/emotionPalette";
import { useGalaxyCamera } from "@/components/urai/hooks/useGalaxyCamera";
import { useStarSelection } from "@/components/urai/hooks/useStarSelection";
import ImmersiveWorld3D from "@/components/urai/world/ImmersiveWorld3D";
import { ConstellationThreadLayer } from "./ConstellationThreadLayer";
import { GalaxyBackground } from "./GalaxyBackground";
import { GalaxyCamera } from "./GalaxyCamera";
import { GalaxyHUD } from "./GalaxyHUD";
import { MemoryStarLayer } from "./MemoryStarLayer";
import { NebulaZones } from "./NebulaZones";
import { OrbitRings } from "./OrbitRings";
import { SelectedStarPortal } from "./SelectedStarPortal";
import { MapControls } from "@react-three/drei";

export default function LifeMapPage() {
  const [activeCategory, setActiveCategory] =
    useState<MemoryCategory | "all">("all");
  const [mode, setMode] = useState<"default" | "replay" | "mirror">("default");
  const [showImage, setShowImage] = useState(false);

  const {
    camera,
    dragging,
    recenter,
    focusCameraOn,
  } = useGalaxyCamera();

  const {
    selectedId,
    selected,
    relatedIds,
    selectStar,
    clearSelection,
  } = useStarSelection(memoryStars, "blue-fog-memory");

  const handleClose = useCallback(() => {
    clearSelection();
    setShowImage(false);
    setMode("default");
  }, [clearSelection]);

  const replay = useCallback(() => {
    setShowImage(false);
    setMode("replay");

    let index = 0;
    const sequence = [
      "blue-fog-memory",
      "threshold-flare",
      "mirror-line",
      "protected-hour",
      "morning-return",
    ];

    const timer = window.setInterval(() => {
      const star = memoryStars.find(
        (item) => item.id === sequence[index % sequence.length],
      );

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
  }, [focusCameraOn, selectStar]);

  const handleSelect = useCallback(
    (id: string) => {
      if (id === selectedId && !showImage) {
        setShowImage(true);
        return;
      }

      if (id === selectedId && showImage) {
        replay();
        return;
      }

      setShowImage(false);
      selectStar(id);
    },
    [replay, selectStar, selectedId, showImage],
  );

  const toggleMirror = useCallback(() => {
    setMode((current) => (current === "mirror" ? "default" : "mirror"));
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <main
      className={`urai-screen urai-life-map-screen ${
        mode === "mirror" ? "is-mirror-mode" : ""
      } ${selected ? "has-selected-star" : ""}`}
      data-route-state="life-map"
      data-tier-one="true"
      data-tier-two="true"
      data-tier-three="true"
    >
      <ImmersiveWorld3D
        mode="life-map"
        activeLabel={
          activeCategory === "all"
            ? `All fields · ${mode}`
            : `${activeCategory} · ${mode}`
        }
        selectedLabel={selected?.title}
      />

      <GalaxyBackground />

      <header className="urai-life-title">
        <span>URAI LIFE MAP</span>
        <strong>Memory Galaxy</strong>
        <em>
          {memoryStars.length} Memory Stars · {memoryThreads.length} Timeline
          Constellations · {mode}
        </em>
      </header>

      <Canvas>
        <GalaxyCamera camera={camera} dragging={dragging}>
          <MemoryStarLayer
            stars={memoryStars}
            selectedId={selectedId}
            selectedActive={Boolean(selected)}
            relatedIds={relatedIds}
            activeCategory={activeCategory}
            onSelect={handleSelect}
          />

          <ConstellationThreadLayer
            stars={memoryStars}
            threads={memoryThreads}
            relatedIds={relatedIds}
            hasSelection={Boolean(selected)}
          />

          <NebulaZones activeCategory={activeCategory} />
          <OrbitRings mirrorMode={mode === "mirror"} />
          <MapControls />
        </GalaxyCamera>
      </Canvas>

      <GalaxyHUD
        selected={selected}
        camera={camera}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onCloseLine={handleClose}
        onReplay={replay}
        onReflect={toggleMirror}
        onCenter={recenter}
      />

      <SelectedStarPortal
        selected={selected}
        mode={mode}
        onClose={handleClose}
        onReplay={replay}
        onToggleMirror={toggleMirror}
      />

      {showImage && selected && (
        <div className="star-image-container">
          <img src={`/images/stars/${selected.id}.png`} alt={selected.title} />
          <button type="button" onClick={() => setShowImage(false)}>
            Close
          </button>
        </div>
      )}
    </main>
  );
}