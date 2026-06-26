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
    <div className="focus-card">
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
  active: "home" | "life-map" | "replay";
};

const TopNav = ({ active }: TopNavProps) => {
  const router = useRouter();

  return (
    <div className="top-nav">
      <button
        className={`nav-button ${active === "home" ? "active" : ""}`}
        onClick={() => router.push("/home")}
      >
        HOME
      </button>
      <button
        className={`nav-button ${active === "life-map" ? "active" : ""}`}
        onClick={() => router.push("/life-map")}
      >
        LIFE MAP
      </button>
      <button
        className={`nav-button ${active === "replay" ? "active" : ""}`}
        onClick={() => router.push("/replay")}
      >
        REPLAY
      </button>
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

  const selectedStar = selection.selectedStar;

  const handleSelectStar = (star: LifeMapStar) => {
    selection.selectStar(star);
    setMode("focus");
  };

  const handleReplay = () => {
    setMode("replay");
  };

  const handlePassport = () => {
    // Passport route can be wired here when the production route is finalized.
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className={`spatial-life-map is-${mode}`}>
      <TopNav active="life-map" />

      <div className="spatial-stage" {...camera.bind}>
        <LifeGalaxyScene
          stars={visibleStars}
          constellations={data.constellations}
          activeLayerIds={activeLayerIds}
          cameraState={camera.cameraState}
          selectedStarId={selection.selectedStarId}
          hoveredStarId={selection.hoveredStarId}
          reducedMotion={false}
          onHoverStar={selection.setHoveredStarId}
          onSelectStar={handleSelectStar}
          onOpenStar={() => {}}
          onSceneReady={() => {}}
        />
      </div>

      {mode === "focus" && (
        <FocusCard
          star={selectedStar}
          onReplay={handleReplay}
          onPassport={handlePassport}
        />
      )}
    </main>
  );
}