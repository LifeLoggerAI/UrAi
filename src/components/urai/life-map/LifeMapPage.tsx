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

      <div className="mom-showcase-layer" aria-hidden="true">
        <div className="showcase-sunrise" />
        <div className="showcase-memory-path" />
        <div className="showcase-tree tree-a"><span /><span /></div>
        <div className="showcase-tree tree-b"><span /><span /></div>
        <div className="showcase-home"><span /><span /></div>
        <div className="showcase-photo photo-a"><span>Family</span></div>
        <div className="showcase-photo photo-b"><span>Stories</span></div>
        <div className="showcase-photo photo-c"><span>Home</span></div>
        <div className="showcase-fireflies">{Array.from({ length: 18 }, (_, index) => <span key={index} />)}</div>
      </div>

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

      <style jsx>{`
        .mom-showcase-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
          perspective: 900px;
          opacity: 0.78;
        }

        .showcase-sunrise {
          position: absolute;
          left: 50%;
          top: 16%;
          width: min(460px, 58vw);
          height: min(460px, 58vw);
          transform: translateX(-50%);
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.72), rgba(253,224,71,0.22) 28%, rgba(125,211,252,0.1) 52%, transparent 72%);
          filter: blur(6px) drop-shadow(0 0 80px rgba(125,211,252,0.32));
        }

        .showcase-memory-path {
          position: absolute;
          left: 50%;
          bottom: -10%;
          width: min(360px, 48vw);
          height: 58vh;
          transform: translateX(-50%) rotateX(68deg);
          border-radius: 50% 50% 0 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.3), rgba(125,211,252,0.1), transparent);
          box-shadow: 0 0 70px rgba(255,255,255,0.16);
          filter: blur(1px);
        }

        .showcase-tree, .showcase-home, .showcase-photo {
          position: absolute;
          transform-style: preserve-3d;
          filter: drop-shadow(0 24px 30px rgba(0,0,0,0.38));
        }

        .showcase-tree {
          width: 92px;
          height: 118px;
        }

        .showcase-tree span:first-child {
          position: absolute;
          left: 40%;
          bottom: 0;
          width: 18px;
          height: 58px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(120,53,15,0.88), rgba(251,191,36,0.48));
        }

        .showcase-tree span:last-child {
          position: absolute;
          inset: 0 4px 34px;
          border-radius: 46% 54% 50% 50%;
          background: radial-gradient(circle at 38% 28%, rgba(220,252,231,0.92), rgba(34,197,94,0.62) 42%, rgba(6,78,59,0.46));
          box-shadow: 0 0 34px rgba(74,222,128,0.22);
        }

        .tree-a { left: 9%; bottom: 17%; transform: translateZ(-180px) scale(1.04); }
        .tree-b { right: 8%; bottom: 19%; transform: translateZ(-210px) scale(0.94); }

        .showcase-home {
          left: 13%;
          top: 38%;
          width: 116px;
          height: 92px;
          transform: translateZ(-260px) scale(0.86);
        }

        .showcase-home span:first-child {
          position: absolute;
          left: 8px;
          top: 0;
          width: 100px;
          height: 52px;
          transform: skewX(-16deg) rotate(-4deg);
          border-radius: 12px 12px 3px 3px;
          background: linear-gradient(135deg, rgba(253,230,138,0.72), rgba(147,197,253,0.28));
          border: 1px solid rgba(255,255,255,0.22);
        }

        .showcase-home span:last-child {
          position: absolute;
          left: 22px;
          bottom: 0;
          width: 72px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(15,23,42,0.74), rgba(2,6,23,0.88));
          border: 1px solid rgba(186,230,253,0.22);
          box-shadow: inset 0 0 28px rgba(125,211,252,0.12);
        }

        .showcase-photo {
          width: 98px;
          height: 124px;
          display: grid;
          place-items: end center;
          padding-bottom: 12px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.24);
          background: linear-gradient(180deg, rgba(255,255,255,0.24), rgba(125,211,252,0.1)), radial-gradient(circle at 50% 36%, rgba(255,255,255,0.7), rgba(196,181,253,0.18) 34%, rgba(2,6,23,0.44) 70%);
          box-shadow: inset 0 0 30px rgba(255,255,255,0.08), 0 0 32px rgba(125,211,252,0.28);
          backdrop-filter: blur(10px);
        }

        .showcase-photo span {
          border-radius: 999px;
          padding: 4px 9px;
          background: rgba(2,6,23,0.52);
          color: rgba(240,249,255,0.88);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .photo-a { left: 30%; bottom: 17%; transform: translateZ(-80px) rotateY(12deg); }
        .photo-b { right: 30%; bottom: 16%; transform: translateZ(-90px) rotateY(-12deg); }
        .photo-c { left: 50%; bottom: 6%; transform: translateX(-50%) translateZ(-30px); }

        .showcase-fireflies span {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: rgba(254,240,138,0.9);
          box-shadow: 0 0 16px rgba(254,240,138,0.72);
          animation: firefly-drift 5.8s ease-in-out infinite;
        }

        .showcase-fireflies span:nth-child(1) { left: 18%; top: 28%; animation-delay: 0s; }
        .showcase-fireflies span:nth-child(2) { left: 24%; top: 62%; animation-delay: .6s; }
        .showcase-fireflies span:nth-child(3) { left: 32%; top: 34%; animation-delay: 1.1s; }
        .showcase-fireflies span:nth-child(4) { left: 40%; top: 74%; animation-delay: 1.8s; }
        .showcase-fireflies span:nth-child(5) { left: 52%; top: 30%; animation-delay: 2.4s; }
        .showcase-fireflies span:nth-child(6) { left: 60%; top: 66%; animation-delay: .9s; }
        .showcase-fireflies span:nth-child(7) { left: 72%; top: 36%; animation-delay: 1.7s; }
        .showcase-fireflies span:nth-child(8) { left: 82%; top: 58%; animation-delay: 2.9s; }
        .showcase-fireflies span:nth-child(9) { left: 15%; top: 48%; animation-delay: 3.2s; }
        .showcase-fireflies span:nth-child(10) { left: 86%; top: 26%; animation-delay: 4s; }
        .showcase-fireflies span:nth-child(n+11) { left: 50%; top: 52%; opacity: 0.42; }

        @keyframes firefly-drift {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.34; }
          50% { transform: translate3d(14px, -18px, 40px); opacity: 1; }
        }

        @media (max-width: 760px) {
          .mom-showcase-layer { opacity: 0.54; }
          .showcase-photo { width: 72px; height: 94px; }
          .showcase-home, .showcase-tree { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .showcase-fireflies span { animation: none; }
        }
      `}</style>
    </main>
  );
}
