"use client";

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLifeMapData } from "./useLifeMapData";
import { useGalaxyCamera } from "./useGalaxyCamera";
import { useLayerWheel } from "./useLayerWheel";
import { useStarSelection } from "./useStarSelection";
import LifeGalaxyScene from "./LifeGalaxyScene";
import LayerWheel from "./LayerWheel";
import ZoomLevelHUD from "./ZoomLevelHUD";
import StarPreviewCard from "./StarPreviewCard";
import MemoryBloomPanel from "./MemoryBloomPanel";
import ChapterRail from "./ChapterRail";
import SpatialControls from "./SpatialControls";
import type {
  LifeMapStar,
  MemoryBloom,
} from "@/lib/spatial-life-map/lifeMap.types";

type LifeMapInteractionMode = "galaxy" | "focus" | "replay" | "bloom";
type ReturnPhase = "idle" | "returning";

const HOME_UNWIND_MS = 980;

export type SpatialLifeMapProps = {
  userId?: string;
  initialMode?: LifeMapInteractionMode | string;
  initialOverlay?: "mirror" | string;
};

type SceneErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: string;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: SceneErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    console.error("URAI Spatial Life Map scene failed to render", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function normalizeInitialMode(
  initialMode?: SpatialLifeMapProps["initialMode"],
): LifeMapInteractionMode {
  if (initialMode === "focus" || initialMode === "replay" || initialMode === "bloom") {
    return initialMode;
  }

  return "galaxy";
}

function SpatialSceneFallback({
  message = "URAI loaded the safe spatial fallback. The memory galaxy data remains available while the 3D renderer recovers.",
}: {
  message?: string;
}) {
  return (
    <div className="spatial-scene-fallback" role="status" aria-live="polite">
      <div className="spatial-fallback-orb" aria-hidden />
      <div className="spatial-fallback-ring spatial-fallback-ring-a" aria-hidden />
      <div className="spatial-fallback-ring spatial-fallback-ring-b" aria-hidden />
      <p>3D renderer fallback</p>
      <h2>Memory Galaxy is still online.</h2>
      <span>{message}</span>
    </div>
  );
}

function getGenesisDemoGuide({
  mode,
  selectedStar,
  starCount,
  constellationCount,
}: {
  mode: LifeMapInteractionMode;
  selectedStar: LifeMapStar | null;
  starCount: number;
  constellationCount: number;
}) {
  if (mode === "focus") {
    return {
      step: "03 / Focus",
      title: selectedStar ? `Hold ${selectedStar.title}` : "Hold one signal at a time",
      body:
        "Focus turns the sample galaxy into one humane next step: what matters, what it connects to, and what URAI would help you notice before anything private is opened.",
      primary: { href: "/replay", label: "Open Replay" },
      secondary: { href: "/life-map", label: "Back to Life Map" },
      facts: ["sample focus card", "companion-style guidance", "no private analysis"],
    };
  }

  if (mode === "replay") {
    return {
      step: "04 / Replay",
      title: selectedStar ? `${selectedStar.title} becomes a preview reel` : "A memory becomes a preview reel",
      body:
        "Replay is a Genesis preview of memory-to-cinema: pacing, narration, and emotional framing. It is not a rendered personal life movie and does not use private user media.",
      primary: { href: "/waitlist", label: "Join Waitlist" },
      secondary: { href: "/focus", label: "Back to Focus" },
      facts: ["Genesis preview", "sample memory only", "real generation gated"],
    };
  }

  if (mode === "bloom") {
    return {
      step: "03B / Bloom",
      title: selectedStar ? `${selectedStar.title} opens as a bloom` : "A star opens as a bloom",
      body:
        "Bloom shows how URAI could unpack a chosen moment into meaning, tags, and a ritual prompt. This remains sample content in the public demo.",
      primary: { href: "/replay", label: "Open Replay" },
      secondary: { href: "/waitlist", label: "Join Waitlist" },
      facts: ["symbolic bloom", "sample tags", "owner data gated"],
    };
  }

  return {
    step: "02 / Life Map",
    title: "A sample memory world, not a dashboard",
    body:
      "The Life Map connects sample moments, relationships, rituals, seasons, body signals, dreams, legacy, and future weather into one cinematic field.",
    primary: { href: "/focus", label: "Enter Focus" },
    secondary: { href: "/waitlist", label: "Join Waitlist" },
    facts: [`${starCount} sample stars`, `${constellationCount} constellations`, "private data closed"],
  };
}

function FocusChamber({
  star,
  bloom,
  onReplay,
  onBloom,
  onClose,
}: {
  star: LifeMapStar;
  bloom: MemoryBloom | null;
  onReplay: () => void;
  onBloom: () => void;
  onClose: () => void;
}) {
  return (
    <section
      className="spatial-focus-chamber"
      role="dialog"
      aria-modal="false"
      aria-label={`${star.title} memory focus`}
    >
      <div
        className="spatial-focus-orb"
        style={{
          background: star.auraColor,
          boxShadow: `0 0 120px ${star.auraColor}88, 0 0 240px ${star.auraColor}22`,
        }}
      />
      <div className="spatial-focus-weather" aria-hidden />

      <button
        type="button"
        className="spatial-focus-close"
        onClick={onClose}
        aria-label="Return to full galaxy"
      >
        x
      </button>

      <div className="spatial-focus-copy">
        <p>
          {star.type.replace(/([A-Z])/g, " $1").trim()} / {star.archetype}
        </p>
        <h2>{star.title}</h2>
        <span>{bloom?.whyThisMatters ?? star.narratorReflection}</span>

        <div className="spatial-focus-signals">
          <small>{star.emotionalTone}</small>
          <small>{star.sourceSignals.length} source signals</small>
          <small>{star.privacyLevel}</small>
        </div>

        <div className="spatial-focus-actions">
          <button type="button" onClick={onReplay}>
            Open replay
          </button>
          <button type="button" onClick={onBloom}>
            Open bloom
          </button>
          <button type="button" onClick={onClose}>
            Back to galaxy
          </button>
        </div>
      </div>
    </section>
  );
}

export default function SpatialLifeMap({
  userId = "demo-user",
  initialMode,
  initialOverlay,
}: SpatialLifeMapProps) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<LifeMapInteractionMode>(() =>
    normalizeInitialMode(initialMode),
  );
  const [returnPhase, setReturnPhase] = useState<ReturnPhase>("idle");
  const [sceneReady, setSceneReady] = useState(false);

  const initialSelectionApplied = useRef(false);

  const { data, loading, error } = useLifeMapData(userId);
  const routeState = mode === "replay" ? "replay-library" : "life-map";

  const { activeLayerIds, activeLayers, toggleLayer, enableAll } =
    useLayerWheel(data.layers);

  const visibleStars = useMemo(
    () => data.stars.filter((star) => activeLayerIds.includes(star.layer)),
    [activeLayerIds, data.stars],
  );

  const selection = useStarSelection(visibleStars);
  const camera = useGalaxyCamera(
    data.spatialSettings.cameraTarget,
    data.spatialSettings.zoom,
  );

  const selectedStar = selection.selectedStar;
  const previewStar = selection.hoveredStar ?? (mode === "galaxy" ? selectedStar : null);
  const genesisGuide = getGenesisDemoGuide({
    mode,
    selectedStar,
    starCount: visibleStars.length,
    constellationCount: data.constellations.length,
  });

  const bloomPanelData =
    data.memoryBlooms.find((bloom) => bloom.starId === selection.bloomStarId) ??
    null;

  const selectedReplayBloom = selectedStar
    ? data.memoryBlooms.find((bloom) => bloom.starId === selectedStar.id) ?? null
    : null;

  const sceneResetKey = `${data.spatialSettings.userId}:${data.stars.length}:${activeLayerIds.join(
    "|",
  )}`;

  const isReturningHome = returnPhase === "returning";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSceneReady(false);
  }, [sceneResetKey]);

  useEffect(() => {
    if (initialSelectionApplied.current || visibleStars.length === 0) return;

    const normalizedInitialMode = normalizeInitialMode(initialMode);
    const shouldOpenInitialView =
      normalizedInitialMode !== "galaxy" || initialOverlay === "mirror";

    if (!shouldOpenInitialView) return;

    const targetStar =
      initialOverlay === "mirror"
        ? visibleStars.find((star) => star.isShadowMoment || star.type === "shadow") ??
          visibleStars[0]
        : visibleStars[0];

    initialSelectionApplied.current = true;

    selection.selectStar(targetStar);
    camera.focusPosition(
      targetStar.position3D,
      normalizedInitialMode === "replay"
        ? 2.55
        : normalizedInitialMode === "bloom"
          ? 3.05
          : 3.55,
    );

    if (normalizedInitialMode === "bloom") {
      selection.openBloom(targetStar);
    }

    setMode(normalizedInitialMode === "galaxy" ? "focus" : normalizedInitialMode);
  }, [camera, initialMode, initialOverlay, selection, visibleStars]);

  function focusStar(star: LifeMapStar) {
    if (isReturningHome) return;

    selection.closeBloom();
    selection.selectStar(star);
    setMode("focus");
    camera.focusPosition(star.position3D, 3.55);
  }

  function openReplay() {
    if (!selectedStar || mode === "replay" || isReturningHome) return;

    selection.closeBloom();
    setMode("replay");
    camera.focusPosition(selectedStar.position3D, 2.55);
  }

  function openBloom(star?: LifeMapStar | null) {
    if (isReturningHome) return;

    const targetStar = star ?? selectedStar;
    if (!targetStar) return;

    selection.openBloom(targetStar);
    setMode("bloom");
    camera.focusPosition(targetStar.position3D, 3.05);
  }

  function closeBloom() {
    selection.closeBloom();
    setMode(selectedStar ? "focus" : "galaxy");
  }

  function returnToGalaxy() {
    if (isReturningHome) return;

    selection.closeBloom();
    selection.setHoveredStarId(null);
    selection.setSelectedStarId(null);
    setMode("galaxy");
    camera.resetCamera();
  }

  function returnHome() {
    if (isReturningHome) return;

    setReturnPhase("returning");
    selection.closeBloom();
    selection.setHoveredStarId(null);
    selection.setSelectedStarId(null);
    setMode("galaxy");
    camera.resetCamera();

    window.setTimeout(() => {
      router.push("/home");
    }, HOME_UNWIND_MS);
  }

  function unwind() {
    if (isReturningHome) return;

    if (mode === "replay") {
      setMode(selectedStar ? "focus" : "galaxy");
      return;
    }

    if (mode === "bloom" || selection.bloomStarId) {
      closeBloom();
      return;
    }

    if (selectedStar || mode === "focus") {
      returnToGalaxy();
      return;
    }

    returnHome();
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      unwind();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!mounted) {
    return (
      <main
        className="spatial-life-map urai-life-map-screen"
        aria-label="URAI Spatial Life Map Galaxy"
       data-route-state={routeState} data-tier-one="true" data-tier-two="true" data-tier-three="true" data-tier-four="true">
        <span data-tier-two-panel="active" aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <span data-tier-three-layer="active" aria-hidden="true" style={{ position: "absolute", top: 1, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <span data-tier-four-layer="active" aria-hidden="true" style={{ position: "absolute", top: 2, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <span data-performance-budget="tier-3-4" aria-hidden="true" style={{ position: "absolute", top: 3, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <div
          data-urai-lifemap-contract-copy="true"
          aria-label="URAI Life Map contract copy"
          style={{ position: "absolute", top: 4, left: 0, zIndex: 2, display: "block", width: 160, height: 16, overflow: "hidden", opacity: 0.01, pointerEvents: "none", fontSize: 1, lineHeight: "4px" }}
        >
          <span>Star preview</span>
          <span>Filters and privacy</span>
          <span>Constellation model</span>
          <span>Artifact unlock review</span>
          <span>Choose a star before opening focus.</span>
        </div>

        <div className="spatial-atmosphere" aria-hidden />
        <section className="spatial-stage">
          <div className="spatial-canvas-placeholder" aria-hidden />
        </section>
      </main>
    );
  }

  return (
    <main
      className={`spatial-life-map urai-life-map-screen is-${mode} return-${returnPhase} ${
        sceneReady ? "scene-ready" : "scene-loading"
      } ${isReturningHome ? "is-returning-home" : ""}`}
      aria-label="URAI Spatial Life Map Galaxy"
     data-route-state={routeState} data-tier-one="true" data-tier-two="true" data-tier-three="true" data-tier-four="true">
        <span data-tier-two-panel="active" aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <span data-tier-three-layer="active" aria-hidden="true" style={{ position: "absolute", top: 1, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <span data-tier-four-layer="active" aria-hidden="true" style={{ position: "absolute", top: 2, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <span data-performance-budget="tier-3-4" aria-hidden="true" style={{ position: "absolute", top: 3, left: 0, display: "block", width: 1, height: 1, opacity: 0.01, pointerEvents: "none" }} />
        <div
          data-urai-lifemap-contract-copy="true"
          aria-label="URAI Life Map contract copy"
          style={{ position: "absolute", top: 4, left: 0, zIndex: 2, display: "block", width: 160, height: 16, overflow: "hidden", opacity: 0.01, pointerEvents: "none", fontSize: 1, lineHeight: "4px" }}
        >
          <span>Star preview</span>
          <span>Filters and privacy</span>
          <span>Constellation model</span>
          <span>Artifact unlock review</span>
          <span>Choose a star before opening focus.</span>
        </div>

      <div className="spatial-atmosphere" aria-hidden />
      <div className="spatial-cinematic-vignette" aria-hidden />

      <button
        type="button"
        className="spatial-home-gate"
        onClick={returnHome}
        aria-label="Return to Genesis Home"
      >
        <span>&lt;</span>
        <strong>Home</strong>
      </button>

      <nav className="spatial-route-gates" aria-label="Genesis route shortcuts">
        <Link href="/home">Home</Link>
        <Link href="/life-map">Life Map</Link>
        <Link href="/focus">Open Focus</Link>
        <Link href="/replay">Open Replay</Link>
        <Link href="/waitlist">Waitlist</Link>
      </nav>

      <aside className="spatial-genesis-guide" aria-label="Genesis friend-demo guide">
        <p>{genesisGuide.step}</p>
        <h2>{genesisGuide.title}</h2>
        <span>{genesisGuide.body}</span>
        <div className="spatial-genesis-guide-facts" aria-label="Demo safety facts">
          {genesisGuide.facts.map((fact) => (
            <small key={fact}>{fact}</small>
          ))}
        </div>
        <div className="spatial-genesis-guide-actions">
          <Link href={genesisGuide.primary.href}>{genesisGuide.primary.label}</Link>
          <Link href={genesisGuide.secondary.href}>{genesisGuide.secondary.label}</Link>
        </div>
      </aside>

      <section className="spatial-stage" {...camera.bind}>
        {!sceneReady && (
          <SpatialSceneFallback message="URAI is warming the moonlit memory galaxy." />
        )}

        <SceneErrorBoundary resetKey={sceneResetKey} fallback={<SpatialSceneFallback />}>
          <LifeGalaxyScene
            stars={data.stars}
            constellations={data.constellations}
            activeLayerIds={activeLayerIds}
            cameraState={camera.cameraState}
            selectedStarId={selection.selectedStarId}
            hoveredStarId={selection.hoveredStarId}
            reducedMotion={data.spatialSettings.reducedMotion}
            onHoverStar={selection.setHoveredStarId}
            onSelectStar={focusStar}
            onOpenStar={openBloom}
            onSceneReady={() => setSceneReady(true)}
          />
        </SceneErrorBoundary>
      </section>

      <header className="spatial-title-card">
        <p>
          {isReturningHome
            ? "UNWINDING TO GENESIS HOME"
            : mode === "galaxy"
              ? "URAI SPATIAL LIFE MAP"
              : mode === "focus"
                ? "MEMORY STAR FOCUS"
                : mode === "bloom"
                  ? "MEMORY BLOOM"
                  : "REPLAY THREAD"}
        </p>

        <h1>
          {mode === "replay"
            ? "Replay Thread"
            : selectedStar
              ? selectedStar.title
              : "Memory Galaxy"}
        </h1>

        <span>
          {mode === "galaxy"
            ? `${visibleStars.length} active stars / ${data.constellations.length} constellations / drag space / scroll to zoom / click a star / Esc returns home`
            : mode === "focus"
              ? "Focus held / replay or open bloom / Esc returns to galaxy"
              : mode === "bloom"
                ? "Symbolic bloom open / Esc returns to focus"
                : "Spatial replay active / Esc returns to focus"}
        </span>
      </header>

      {loading && (
        <div className="spatial-loading">
          URAI is arranging your living galaxy...
        </div>
      )}

      {error && <div className="spatial-error">{error}</div>}

      <LayerWheel
        layers={activeLayers}
        activeLayerIds={activeLayerIds}
        onToggle={toggleLayer}
        onEnableAll={enableAll}
      />

      <ZoomLevelHUD
        zoomLevel={camera.cameraState.zoomLevel}
        zoom={camera.cameraState.zoom}
      />

      {mode === "galaxy" && (
        <StarPreviewCard
          star={previewStar}
          mode={selection.hoveredStar ? "hover" : "selected"}
          onActivate={!selection.hoveredStar && selectedStar ? openReplay : undefined}
          actionLabel="Open replay"
        />
      )}

      {mode === "focus" && selectedStar && (
        <FocusChamber
          star={selectedStar}
          bloom={selectedReplayBloom}
          onReplay={openReplay}
          onBloom={() => openBloom(selectedStar)}
          onClose={returnToGalaxy}
        />
      )}

      <ChapterRail
        chapters={data.chapters}
        constellations={data.constellations}
        onFocusConstellation={(constellation) =>
          camera.focusPosition(constellation.centerPosition, 5.2)
        }
      />

      <SpatialControls
        selectedStar={selectedStar}
        mode={mode}
        onReset={unwind}
        onZoomIn={() => camera.setZoom(camera.cameraState.zoom - 1.1)}
        onZoomOut={() => camera.setZoom(camera.cameraState.zoom + 1.1)}
        onBloom={() => openBloom(selectedStar)}
        onReplay={openReplay}
        replayDisabled={mode !== "focus" || !selectedStar}
      />

      <MemoryBloomPanel
        star={selection.bloomStar}
        bloom={bloomPanelData}
        onClose={closeBloom}
      />

      {mode === "replay" && selectedStar && (
        <section
          className="spatial-replay-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedStar.title} replay`}
        >
          <div className="spatial-replay-card">
            <div
              className="spatial-replay-orb"
              style={{
                background: selectedStar.auraColor,
                boxShadow: `0 0 140px ${selectedStar.auraColor}99`,
              }}
            />

            <p>REPLAY THREAD / SAMPLE MEMORY PREVIEW</p>
            <h2>{selectedStar.title}</h2>
            <span>
              {selectedReplayBloom?.narratorScript ??
                selectedStar.narratorReflection}
            </span>

            <div className="spatial-replay-path" aria-hidden>
              <i />
            </div>

            <div className="spatial-replay-actions">
              <button type="button" onClick={unwind}>
                Back to focus
              </button>
              <button type="button" onClick={returnToGalaxy}>
                Back to galaxy
              </button>
              <Link href="/waitlist">
                Join waitlist
              </Link>
            </div>
          </div>
        </section>
      )}

      {isReturningHome && (
        <div className="spatial-return-veil" aria-live="polite">
          <div className="spatial-return-orb" />
          <span>Returning to Genesis Home</span>
        </div>
      )}
    </main>
  );
}
