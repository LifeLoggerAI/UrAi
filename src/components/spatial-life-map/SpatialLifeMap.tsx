"use client";

import {
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useLifeMapData } from "./useLifeMapData";
import { useGalaxyCamera } from "./useGalaxyCamera";
import { useStarSelection } from "./useStarSelection";
import LifeGalaxyScene from "./LifeGalaxyScene";
import type {
  LifeMapStar,
} from "@/lib/spatial-life-map/lifeMap.types";
import "../../styles/NewLifeMap.css";

type LifeMapInteractionMode = "galaxy" | "focus" | "replay";

const FocusCard = ({ star, onReplay, onPassport }) => {
  if (!star) return null;

  return (
    <div className="focus-card">
      <h1>{star.title}</h1>
      <p>{star.narratorReflection}</p>
      <div className="buttons">
        <button className="button" onClick={onReplay}>Enter Replay</button>
        <button className="button" onClick={onPassport}>Open Passport</button>
      </div>
    </div>
  );
};

const TopNav = ({ active }) => {
  const router = useRouter();

  return (
    <div className="top-nav">
      <button className={`nav-button ${active === 'home' ? 'active' : ''}`} onClick={() => router.push('/home')}>HOME</button>
      <button className={`nav-button ${active === 'life-map' ? 'active' : ''}`} onClick={() => router.push('/life-map')}>LIFE MAP</button>
      <button className={`nav-button ${active === 'replay' ? 'active' : ''}`} onClick={() => router.push('/replay')}>REPLAY</button>
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
  const activeLayerIds = useMemo(() => data.layers.map(l => l.id), [data.layers]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
      {mode === 'focus' && (
        <FocusCard
          star={selectedStar}
          onReplay={() => {}}
          onPassport={() => {}}
        />
      )}
    </main>
  );
}
