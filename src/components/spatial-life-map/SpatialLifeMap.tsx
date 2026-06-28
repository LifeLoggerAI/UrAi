"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLifeMapData } from "./useLifeMapData";
import { useGalaxyCamera } from "./useGalaxyCamera";
import { useStarSelection } from "./useStarSelection";
import LifeGalaxyScene from "./LifeGalaxyScene";
import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";
import "../../styles/NewLifeMap.css";

type LifeMapInteractionMode = "galaxy" | "focus" | "replay";

type FocusCardProps = {
  star: LifeMapStar | null;
  onReplay: () => void;
  onPassport: () => void;
};

const FocusCard = ({ star, onReplay, onPassport }: FocusCardProps) => {
  if (!star) return null;

  return (
    <div className="focus-card" aria-label="Selected memory focus chamber">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/70">
        Selected memory chamber
      </p>
      <h1>{star.title}</h1>
      <p>{star.narratorReflection}</p>
      <div className="buttons">
        <button className="button" onClick={onReplay}>
          Enter Replay
        </button>
        <button className="button" onClick={onPassport}>
          Open Passport
        </button>
      </div>
    </div>
  );
};

type TopNavProps = {
  active: "home" | "ground" | "life-map" | "focus" | "replay" | "passport";
};

const navItems = [
  ["HOME", "/home", "home"],
  ["GROUND", "/ground", "ground"],
  ["LIFE MAP", "/life-map", "life-map"],
  ["FOCUS", "/focus", "focus"],
  ["REPLAY", "/replay", "replay"],
  ["PASSPORT", "/passport", "passport"],
] as const;

const TopNav = ({ active }: TopNavProps) => {
  const router = useRouter();

  return (
    <div className="top-nav" aria-label="URAI spatial route navigation">
      {navItems.map(([label, href, key]) => (
        <button
          key={href}
          className={`nav-button ${active === key ? "active" : ""}`}
          onClick={() => router.push(href)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default function SpatialLifeMap({
  userId = "demo-user",
  initialMode = "galaxy",
}: {
  userId?: string;
  initialMode?: LifeMapInteractionMode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<LifeMapInteractionMode>(initialMode);
  const { data, loading, error } = useLifeMapData(userId);

  const visibleStars = useMemo(() => data.stars, [data.stars]);
  const activeLayerIds = useMemo(
    () => data.layers.map((layer) => layer.id),
    [data.layers],
  );

  const selection = useStarSelection(visibleStars);
  const camera = useGalaxyCamera(
    data.spatialSettings.cameraTarget,
    data.spatialSettings.zoom,
  );

  const selectedStar = selection.selectedStar ?? visibleStars[0] ?? null;

  const handleSelectStar = (star: LifeMapStar) => {
    selection.selectStar(star);
    setMode("focus");
  };

  const handleReplay = () => {
    router.push("/replay");
  };

  const handlePassport = () => {
    router.push("/passport");
  };

  const handleCloseStarPanel = () => {
    selection.setHoveredStarId(null);
    selection.setSelectedStarId(null);
    setMode("galaxy");
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const activeNav = mode === "focus" ? "focus" : mode === "replay" ? "replay" : "life-map";

  return (
    <main className={`spatial-life-map is-${mode}`}>
      <TopNav active={activeNav} />

      {(loading || error) && (
        <div className="fixed left-1/2 top-20 z-[80] w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-cyan-100/15 bg-black/55 px-5 py-3 text-center text-xs font-bold leading-5 text-cyan-50/74 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          {loading
            ? "Loading latest owner-safe demo data. The local Life Map fallback is already visible."
            : error}
        </div>
      )}

      <div className="spatial-stage" {...camera.bind}>
        <LifeGalaxyScene
          stars={visibleStars}
          constellations={data.constellations}
          activeLayerIds={activeLayerIds}
          cameraState={camera.cameraState}
          selectedStarId={selection.selectedStarId ?? selectedStar?.id ?? null}
          hoveredStarId={selection.hoveredStarId}
          xrPanelStar={selection.selectedStar}
          activePath="/life-map"
          reducedMotion={false}
          onHoverStar={selection.setHoveredStarId}
          onSelectStar={handleSelectStar}
          onOpenStar={() => setMode("focus")}
          onCloseStarPanel={handleCloseStarPanel}
          onNavigate={handleNavigate}
          onSceneReady={() => {}}
        />
      </div>

      <section className="pointer-events-none fixed bottom-6 left-6 z-[70] max-w-sm rounded-[1.6rem] border border-cyan-100/14 bg-black/42 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/56">Life Map galaxy</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">{visibleStars.length} stars awake</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Select a star to grow it into Focus. Replay and Passport stay explicitly owner-gated on the public surface.
        </p>
      </section>

      {(mode === "focus" || initialMode === "focus") && (
        <FocusCard
          star={selectedStar}
          onReplay={handleReplay}
          onPassport={handlePassport}
        />
      )}
    </main>
  );
}
