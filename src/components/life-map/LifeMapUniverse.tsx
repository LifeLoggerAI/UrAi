"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LifeMapFilter, LifeMapMode, MemoryStar, QualityMode } from "@/lib/life-map/types";
import { lifeMapMockData, selectedBlueFogMemory, spatialARVRScaffold } from "@/lib/life-map/mock-data";
import { formatMemoryConfidence } from "@/lib/life-map/formatters";
import CanonButton from "./CanonButton";
import CanonOverlayPanel from "./CanonOverlayPanel";
import CompanionNarratorPanel from "./CompanionNarratorPanel";
import FocusMemoryView from "./FocusMemoryView";
import LifeMapControls from "./LifeMapControls";
import LifeMapFilterBar from "./LifeMapFilterBar";
import QualitySettingsPanel from "./QualitySettingsPanel";
import ReplayControls from "./ReplayControls";
import SpatialMemoryCard from "./SpatialMemoryCard";

const MemoryGalaxyCanvas = dynamic(() => import("./MemoryGalaxyCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-slate-950 text-cyan-100">
      <div className="rounded-[2rem] border border-cyan-100/15 bg-slate-950/80 p-6 text-center shadow-[0_0_60px_rgba(14,165,233,.18)] backdrop-blur-2xl">
        <p className="text-sm">URAI is arranging your memory sky...</p>
      </div>
    </div>
  ),
});

type CameraCommand = "idle" | "replay" | "mirror" | "recenter" | "focus" | "home" | "ritual" | "privacy";
type OverlayKind = "privacy" | "ritual" | "mirror" | "error" | "empty" | "loading" | null;
type LifeMapView = "galaxy" | "focus" | "replay";

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
  const [view, setView] = useState<LifeMapView>("galaxy");
  const [overlay, setOverlay] = useState<OverlayKind>(null);
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
  const [showDemoHint, setShowDemoHint] = useState(true);

  const selectedStar = useMemo(() => lifeMapMockData.memoryStars.find((star) => star.id === selectedStarId) ?? selectedBlueFogMemory, [selectedStarId]);
  const visibleStars = useMemo(() => lifeMapMockData.memoryStars.filter((star) => !hiddenStarIds.includes(star.id)), [hiddenStarIds]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowDemoHint(false), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  function selectStar(star: MemoryStar) {
    setSelectedStarId(star.id);
    setOpenCardStar(undefined);
    setView("focus");
    setCameraCommand("focus");
  }

  function selectStarByOffset(offset: number) {
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
        setOverlay(null);
        if (view !== "galaxy") returnToGalaxy();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedStar, selectedStarId, view, visibleStars]);

  function hideSelectedThread() {
    const threadId = selectedStar.constellationId;
    const constellation = lifeMapMockData.lifeConstellations.find((thread) => thread.id === threadId);
    if (!constellation) return setHiddenStarIds((ids) => Array.from(new Set([...ids, selectedStar.id])));
    setHiddenStarIds((ids) => Array.from(new Set([...ids, ...constellation.starIds])));
    setView("galaxy");
  }

  function startReplay() {
    setIsReplaying(true);
    setView("replay");
    setOverlay(null);
    setCameraCommand("replay");
  }

  function stopReplay() {
    setIsReplaying(false);
    setView("focus");
    setCameraCommand("focus");
  }

  function startMirror() {
    setMode("mirrorOfBecoming");
    setOverlay("mirror");
    setCameraCommand("mirror");
  }

  function openRitual() {
    setOverlay("ritual");
    setCameraCommand("ritual");
  }

  function openPrivacy() {
    setOverlay("privacy");
    setCameraCommand("privacy");
  }

  function returnToGalaxy() {
    setIsReplaying(false);
    setView("galaxy");
    setOverlay(null);
    setCameraCommand("recenter");
  }

  function recenter() {
    setMode("memoryGalaxy");
    returnToGalaxy();
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
                <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-cyan-100/45">{formatMemoryConfidence(star)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const companionState = overlay === "privacy" ? "privacy" : overlay === "ritual" ? "ritual" : overlay === "mirror" ? "mirror" : view === "replay" ? "replay" : view === "focus" ? "focus" : "idle";

  return (
    <main className={`relative min-h-screen overflow-hidden bg-slate-950 text-cyan-50 ${highContrast ? "contrast-125" : ""}`} aria-label="URAI Life Map emotional planetarium">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(191,233,255,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.3),#020617)]" />

      <header className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex items-start justify-center px-4 pt-5">
        <div className="pointer-events-auto fixed left-4 top-4 z-50 h-[72px] w-[72px]">
          <Link href="/" className="grid h-11 w-11 place-items-center rounded-full border border-cyan-100/20 bg-slate-950/70 text-cyan-50 shadow-[0_0_28px_rgba(191,233,255,0.12)] backdrop-blur-xl hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70" aria-label="Return to URAI home">←</Link>
        </div>
        <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/55 px-6 py-3 text-center shadow-[0_0_42px_rgba(2,132,199,0.16)] backdrop-blur-2xl max-md:max-w-[68vw]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/60">URAI LIFE MAP</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight max-md:text-xl">{view === "replay" ? "Memory Replay" : modeLabels[mode]}</h1>
          <p className="mt-1 text-xs text-cyan-100/50">15 memory stars · 8 constellations</p>
        </div>
      </header>

      <div className="pointer-events-auto fixed left-1/2 top-28 z-30 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-cyan-100/10 bg-slate-950/55 px-2 py-2 text-xs backdrop-blur-2xl max-md:top-[8.2rem] max-md:w-[92vw]" role="tablist" aria-label="Life Map modes">
        {(Object.keys(modeLabels) as LifeMapMode[]).map((lifeMode) => (
          <button key={lifeMode} onClick={() => setMode(lifeMode)} role="tab" aria-selected={mode === lifeMode} className={`min-h-9 shrink-0 rounded-full px-3 py-1.5 ${mode === lifeMode ? "bg-cyan-100 text-slate-950" : "text-cyan-100/65 hover:bg-white/10"}`}>
            {modeLabels[lifeMode]}
          </button>
        ))}
      </div>

      {showDemoHint && !textOnlyFallback && (
        <div className="pointer-events-none fixed left-1/2 top-[10.7rem] z-20 -translate-x-1/2 rounded-full bg-slate-950/55 px-4 py-2 text-xs text-cyan-50/72 backdrop-blur-xl max-md:hidden">
          Your passive signals become memory stars, threads, and reflections.
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
          onCameraCommandComplete={() => setCameraCommand("idle")}
        />
      )}

      <CompanionNarratorPanel selectedStar={selectedStar} emotionalSafetyMode={emotionalSafetyMode} state={companionState} />
      <QualitySettingsPanel
        qualityMode={qualityMode}
        reducedMotion={reducedMotion}
        highContrast={highContrast}
        textOnlyFallback={textOnlyFallback}
        emotionalSafetyMode={emotionalSafetyMode}
        localOnlyMode={localOnlyMode}
        onQualityChange={setQualityMode}
        onToggleReducedMotion={() => setReducedMotion((value) => !value)}
        onToggleHighContrast={() => setHighContrast((value) => !value)}
        onToggleTextOnly={() => setTextOnlyFallback((value) => !value)}
        onToggleEmotionalSafety={() => setEmotionalSafetyMode((value) => !value)}
        onToggleLocalOnly={() => setLocalOnlyMode((value) => !value)}
      />
      <ReplayControls isReplaying={isReplaying} selectedStar={selectedStar} onStop={stopReplay} />
      {view === "focus" && !isReplaying && (
        <FocusMemoryView memory={selectedStar} onReplay={startReplay} onWhyThis={openPrivacy} onRitual={openRitual} onPrivacy={openPrivacy} onReturn={returnToGalaxy} reducedMotion={reducedMotion} />
      )}
      {view === "galaxy" && <LifeMapControls onHideThread={hideSelectedThread} onReplay={startReplay} onCreateScroll={openScrollExport} onMirror={startMirror} onRecenter={recenter} />}
      {view !== "replay" && <LifeMapFilterBar activeFilter={activeFilter} onChange={(filter) => { setActiveFilter(filter); setView("galaxy"); setCameraCommand("recenter"); }} />}
      <SpatialMemoryCard star={openCardStar} onClose={() => setOpenCardStar(undefined)} onBlur={() => setBlurredStarIds((ids) => Array.from(new Set([...ids, selectedStar.id])))} onHide={() => setHiddenStarIds((ids) => Array.from(new Set([...ids, selectedStar.id])))} onDelete={() => { setHiddenStarIds((ids) => Array.from(new Set([...ids, selectedStar.id]))); setOpenCardStar(undefined); }} />

      {overlay && <CanonOverlayPanel kind={overlay} memory={selectedStar} onClose={() => setOverlay(null)} onPrimary={() => { if (overlay === "mirror") returnToGalaxy(); else setOverlay(null); }} />}

      {visibleStars.length === 0 && <CanonOverlayPanel kind="empty" onPrimary={() => setHiddenStarIds([])} />}

      {exportOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Create Life Map scroll export">
          <section className="w-[min(480px,100%)] rounded-3xl border border-cyan-100/15 bg-slate-950 p-6 text-cyan-50 shadow-[0_0_70px_rgba(14,165,233,0.22)]">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/50">Make scroll</p>
            <h2 className="mt-2 text-2xl font-semibold">Life Map Scroll Export</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-100/70">Export scaffold is ready. It will anonymize shareable constellation moments by default and keep private/local-only stars protected.</p>
            <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-xs text-cyan-100/65">
              <p>Source: {selectedStar.title}</p>
              <p>Privacy: anonymized export</p>
              <p>AR/VR future: {spatialARVRScaffold.spatialPortals}</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <CanonButton variant="ghost" onClick={() => setExportOpen(false)}>Close</CanonButton>
              <CanonButton variant="primary" onClick={() => setExportOpen(false)}>Save draft</CanonButton>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
