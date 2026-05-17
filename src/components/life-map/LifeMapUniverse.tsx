"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LifeMapFilter, LifeMapMode, MemoryStar, QualityMode } from "@/lib/life-map/types";
import { lifeMapMockData, selectedBlueFogMemory, spatialARVRScaffold } from "@/lib/life-map/mock-data";
import CompanionNarratorPanel from "./CompanionNarratorPanel";
import LifeMapControls from "./LifeMapControls";
import LifeMapFilterBar from "./LifeMapFilterBar";
import QualitySettingsPanel from "./QualitySettingsPanel";
import ReplayControls from "./ReplayControls";
import SpatialMemoryCard from "./SpatialMemoryCard";

const MemoryGalaxyCanvas = dynamic(() => import("./MemoryGalaxyCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 grid place-items-center bg-slate-950 text-cyan-100">Opening URAI Life Map...</div>,
});

type CameraCommand = "idle" | "replay" | "mirror" | "recenter" | "focus";

const modeLabels: Record<LifeMapMode, string> = {
  memoryGalaxy: "Memory Galaxy",
  fullLifeUniverse: "Full Life Universe",
  emotionalCosmos: "Emotional Cosmos",
  relationshipGalaxy: "Relationship Galaxy",
  dreamPlanetarium: "Dream Planetarium",
  shadowRealm: "Shadow Realm",
  mirrorOfBecoming: "Mirror of Becoming",
  legacyUniverse: "Legacy Universe",
  spatialARVR: "Spatial AR/VR",
};

export default function LifeMapUniverse() {
  const [mode, setMode] = useState<LifeMapMode>("memoryGalaxy");
  const [selectedStarId, setSelectedStarId] = useState(selectedBlueFogMemory.id);
  const [openCardStar, setOpenCardStar] = useState<MemoryStar | undefined>();
  const [activeFilter, setActiveFilter] = useState<LifeMapFilter>("All");
  const [qualityMode, setQualityMode] = useState<QualityMode>(lifeMapMockData.userLifeMapSettings.qualityMode);
  const [reducedMotion, setReducedMotion] = useState(lifeMapMockData.userLifeMapSettings.reducedMotion);
  const [textOnlyFallback, setTextOnlyFallback] = useState(lifeMapMockData.userLifeMapSettings.textOnlyFallback);
  const [highContrast, setHighContrast] = useState(lifeMapMockData.userLifeMapSettings.highContrast);
  const [emotionalSafetyMode, setEmotionalSafetyMode] = useState(lifeMapMockData.userLifeMapSettings.emotionalSafetyMode);
  const [localOnlyMode, setLocalOnlyMode] = useState(lifeMapMockData.userLifeMapSettings.localOnlyMode);
  const [hiddenStarIds, setHiddenStarIds] = useState<string[]>(lifeMapMockData.userLifeMapSettings.hiddenStarIds);
  const [blurredStarIds, setBlurredStarIds] = useState<string[]>(lifeMapMockData.userLifeMapSettings.blurredStarIds);
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>("idle");
  const [isReplaying, setIsReplaying] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const selectedStar = useMemo(() => lifeMapMockData.memoryStars.find((star) => star.id === selectedStarId) ?? selectedBlueFogMemory, [selectedStarId]);

  function selectStar(star: MemoryStar) {
    setSelectedStarId(star.id);
    setCameraCommand("focus");
  }

  function selectStarByOffset(offset: number) {
    const visibleStars = lifeMapMockData.memoryStars.filter((star) => !hiddenStarIds.includes(star.id));
    const currentIndex = Math.max(0, visibleStars.findIndex((star) => star.id === selectedStarId));
    const nextStar = visibleStars[(currentIndex + offset + visibleStars.length) % visibleStars.length];
    if (nextStar) selectStar(nextStar);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        selectStarByOffset(1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        selectStarByOffset(-1);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        setOpenCardStar(selectedStar);
      }
      if (event.key.toLowerCase() === "r") startReplay();
      if (event.key.toLowerCase() === "m") startMirror();
      if (event.key.toLowerCase() === "c") openScrollExport();
      if (event.key === "Escape") {
        setOpenCardStar(undefined);
        setExportOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hiddenStarIds, selectedStar, selectedStarId]);

  function hideSelectedThread() {
    const threadId = selectedStar.constellationId;
    const constellation = lifeMapMockData.lifeConstellations.find((thread) => thread.id === threadId);
    if (!constellation) return setHiddenStarIds((ids) => Array.from(new Set([...ids, selectedStar.id])));
    setHiddenStarIds((ids) => Array.from(new Set([...ids, ...constellation.starIds])));
  }

  function startReplay() {
    setIsReplaying(true);
    setCameraCommand("replay");
  }

  function startMirror() {
    setMode("mirrorOfBecoming");
    setCameraCommand("mirror");
  }

  function recenter() {
    setMode("memoryGalaxy");
    setCameraCommand("recenter");
  }

  function openScrollExport() {
    setExportOpen(true);
  }

  function textOnlyStars() {
    return (
      <div className="mx-auto mt-32 max-w-4xl px-5 text-cyan-50">
        <div className="rounded-3xl border border-cyan-100/15 bg-slate-950/80 p-6 backdrop-blur-2xl">
          <h2 className="text-xl font-semibold">Text-only Life Map</h2>
          <p className="mt-2 text-sm text-cyan-100/65">Reduced visual load is active. URAI is showing the emotional planetarium as accessible memory records.</p>
          <div className="mt-3 rounded-2xl bg-cyan-100/10 p-3 text-xs text-cyan-50/75">
            Keyboard: arrow keys move between stars, Enter opens details, R replays, M mirrors, C creates scroll, Escape closes overlays.
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {lifeMapMockData.memoryStars.map((star) => (
              <button key={star.id} onClick={() => selectStar(star)} onDoubleClick={() => setOpenCardStar(star)} className={`rounded-2xl border p-4 text-left transition ${star.id === selectedStarId ? "border-cyan-100/45 bg-cyan-100/10" : "border-cyan-100/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                <div className="text-sm font-semibold">{star.title}</div>
                <div className="text-xs text-cyan-100/60">{star.subtitle}</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-cyan-100/45">{star.type}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={`relative min-h-screen overflow-hidden bg-slate-950 text-cyan-50 ${highContrast ? "contrast-125" : ""}`} aria-label="URAI Life Map emotional planetarium">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(191,233,255,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.3),#020617)]" />

      <header className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex items-start justify-center px-4 pt-5">
        <Link href="/" className="pointer-events-auto fixed left-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-cyan-100/15 bg-slate-950/70 text-cyan-50 shadow-[0_0_28px_rgba(191,233,255,0.12)] backdrop-blur-xl hover:bg-cyan-100/10" aria-label="Back to URAI home">←</Link>
        <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/55 px-6 py-3 text-center shadow-[0_0_42px_rgba(2,132,199,0.16)] backdrop-blur-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/60">URAI LIFE MAP</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{modeLabels[mode]}</h1>
          <p className="mt-1 text-xs text-cyan-100/50">15 Memory Stars • 8 Timeline Constellations • map</p>
        </div>
      </header>

      <div className="pointer-events-auto fixed left-1/2 top-28 z-30 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-cyan-100/10 bg-slate-950/55 px-2 py-2 text-xs backdrop-blur-2xl max-md:top-[8.2rem] max-md:w-[92vw]" role="tablist" aria-label="Life Map modes">
        {(Object.keys(modeLabels) as LifeMapMode[]).map((lifeMode) => (
          <button key={lifeMode} onClick={() => setMode(lifeMode)} role="tab" aria-selected={mode === lifeMode} className={`shrink-0 rounded-full px-3 py-1.5 ${mode === lifeMode ? "bg-cyan-100 text-slate-950" : "text-cyan-100/65 hover:bg-white/10"}`}>
            {modeLabels[lifeMode]}
          </button>
        ))}
      </div>

      {!textOnlyFallback && (
        <div className="pointer-events-none fixed left-1/2 top-[10.7rem] z-20 -translate-x-1/2 rounded-full bg-slate-950/45 px-3 py-1 text-[11px] text-cyan-100/55 backdrop-blur-xl max-md:hidden">
          Keyboard: arrows select stars • Enter details • R replay • M mirror • C scroll
        </div>
      )}

      {textOnlyFallback ? (
        textOnlyStars()
      ) : (
        <MemoryGalaxyCanvas
          mode={mode}
          qualityMode={qualityMode}
          activeFilter={activeFilter}
          selectedStarId={selectedStarId}
          reducedMotion={reducedMotion}
          highContrast={highContrast}
          hiddenStarIds={hiddenStarIds}
          blurredStarIds={blurredStarIds}
          onSelectStar={selectStar}
          onOpenStar={setOpenCardStar}
          cameraCommand={cameraCommand}
          onCameraCommandComplete={() => {
            setCameraCommand("idle");
            setIsReplaying(false);
          }}
        />
      )}

      <CompanionNarratorPanel selectedStar={selectedStar} emotionalSafetyMode={emotionalSafetyMode} />
      <LifeMapFilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
      <LifeMapControls
        selectedStar={selectedStar}
        mode={mode}
        onRecenter={recenter}
        onReplay={startReplay}
        onMirror={startMirror}
        onOpenCard={() => setOpenCardStar(selectedStar)}
        onHideThread={hideSelectedThread}
        onExport={openScrollExport}
        isReplaying={isReplaying}
      />
      <QualitySettingsPanel
        qualityMode={qualityMode}
        setQualityMode={setQualityMode}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        textOnlyFallback={textOnlyFallback}
        setTextOnlyFallback={setTextOnlyFallback}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        emotionalSafetyMode={emotionalSafetyMode}
        setEmotionalSafetyMode={setEmotionalSafetyMode}
        localOnlyMode={localOnlyMode}
        setLocalOnlyMode={setLocalOnlyMode}
      />
      <ReplayControls isReplaying={isReplaying} onReplay={startReplay} onStop={() => setIsReplaying(false)} />
      <SpatialMemoryCard star={openCardStar} onClose={() => setOpenCardStar(undefined)} onBlur={() => setBlurredStarIds((ids) => Array.from(new Set([...ids, openCardStar?.id ?? ""])).filter(Boolean))} />

      {mode === "spatialARVR" && (
        <section className="pointer-events-auto fixed bottom-5 left-1/2 z-30 w-[min(92vw,760px)] -translate-x-1/2 rounded-3xl border border-cyan-100/15 bg-slate-950/80 p-5 text-sm text-cyan-50 shadow-2xl backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-100/45">Spatial AR/VR scaffold</div>
          <p className="mt-2 text-cyan-100/75">{spatialARVRScaffold.webXR}</p>
          <p className="mt-1 text-cyan-100/55">{spatialARVRScaffold.mobileAR}</p>
        </section>
      )}

      {exportOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5 backdrop-blur-xl">
          <div className="max-w-lg rounded-3xl border border-cyan-100/15 bg-slate-950 p-6 text-cyan-50 shadow-2xl">
            <h2 className="text-xl font-semibold">Create symbolic scroll</h2>
            <p className="mt-2 text-sm text-cyan-100/65">URAI will eventually export an anonymized mythic PDF or video scroll. For now, this is a local-only preview gate.</p>
            <button className="mt-5 rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-slate-950" onClick={() => setExportOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
