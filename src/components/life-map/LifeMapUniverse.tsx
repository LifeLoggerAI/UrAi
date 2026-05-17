"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { LifeMapFilter, LifeMapMode, MemoryStar, QualityMode } from "@/lib/life-map/types";
import { lifeMapMockData, selectedBlueFogMemory, spatialARVRScaffold } from "@/lib/life-map/mock-data";
import { companionLineFor, formatMemoryMeta, modeLabels } from "@/lib/life-map/production-copy";
import CompanionNarratorPanel from "./CompanionNarratorPanel";
import FocusMemoryView from "./FocusMemoryView";
import HomeAuraScene from "./HomeAuraScene";
import LifeMapControls from "./LifeMapControls";
import LifeMapFilterBar from "./LifeMapFilterBar";
import QualitySettingsPanel from "./QualitySettingsPanel";
import ReplayThreadView from "./ReplayThreadView";
import SpatialMemoryCard from "./SpatialMemoryCard";

const MemoryGalaxyCanvas = dynamic(() => import("./MemoryGalaxyCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-slate-950 text-cyan-100">
      <div className="rounded-3xl border border-cyan-100/15 bg-slate-950/70 px-6 py-5 text-center shadow-[0_0_70px_rgba(14,165,233,0.18)] backdrop-blur-2xl">
        <p className="text-sm font-medium">URAI is arranging your memory sky…</p>
      </div>
    </div>
  ),
});

type CameraCommand = "idle" | "homeToGalaxy" | "replay" | "mirror" | "ritual" | "privacy" | "recenter" | "focus" | "returnHome";
type LifeMapViewState = "home" | "galaxy" | "focus" | "replay" | "mirror" | "ritual" | "privacy";

export default function LifeMapUniverse() {
  const [viewState, setViewState] = useState<LifeMapViewState>("home");
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
  const [exportOpen, setExportOpen] = useState(false);

  const selectedStar = useMemo(() => lifeMapMockData.memoryStars.find((star) => star.id === selectedStarId) ?? selectedBlueFogMemory, [selectedStarId]);
  const visibleStarCount = lifeMapMockData.memoryStars.filter((star) => !hiddenStarIds.includes(star.id)).length;

  function enterGalaxy() {
    setViewState("galaxy");
    setCameraCommand("homeToGalaxy");
  }

  function selectStar(star: MemoryStar) {
    setSelectedStarId(star.id);
    setMode("memoryGalaxy");
    setViewState("focus");
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
      if (viewState === "home" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        enterGalaxy();
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        selectStarByOffset(1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        selectStarByOffset(-1);
      }
      if (event.key === "Enter" && viewState !== "home") {
        event.preventDefault();
        setOpenCardStar(selectedStar);
      }
      if (event.key.toLowerCase() === "r" && viewState !== "home") startReplay();
      if (event.key.toLowerCase() === "m" && viewState !== "home") startMirror();
      if (event.key.toLowerCase() === "c" && viewState !== "home") openScrollExport();
      if (event.key === "Escape") {
        setOpenCardStar(undefined);
        setExportOpen(false);
        if (viewState === "replay" || viewState === "mirror" || viewState === "ritual" || viewState === "privacy") returnToFocus();
        else if (viewState === "focus") recenter();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hiddenStarIds, selectedStar, selectedStarId, viewState]);

  function hideSelectedThread() {
    const threadId = selectedStar.constellationId;
    const constellation = lifeMapMockData.lifeConstellations.find((thread) => thread.id === threadId);
    if (!constellation) return setHiddenStarIds((ids) => Array.from(new Set([...ids, selectedStar.id])));
    setHiddenStarIds((ids) => Array.from(new Set([...ids, ...constellation.starIds])));
  }

  function startReplay() {
    setViewState("replay");
    setCameraCommand("replay");
  }

  function startMirror() {
    setMode("mirrorOfBecoming");
    setViewState("mirror");
    setCameraCommand("mirror");
  }

  function startRitual() {
    setViewState("ritual");
    setCameraCommand("ritual");
  }

  function startPrivacy() {
    setViewState("privacy");
    setCameraCommand("privacy");
  }

  function returnToFocus() {
    setViewState("focus");
    setCameraCommand("focus");
  }

  function recenter() {
    setMode("memoryGalaxy");
    setViewState("galaxy");
    setCameraCommand("recenter");
  }

  function returnHome() {
    setCameraCommand("returnHome");
    window.setTimeout(() => setViewState("home"), reducedMotion ? 0 : 520);
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

  const overlayState = viewState === "mirror" || viewState === "ritual" || viewState === "privacy";
  const isReplaying = viewState === "replay";
  const showGalaxy = viewState !== "home";

  return (
    <main className={`relative min-h-screen overflow-hidden bg-slate-950 text-cyan-50 ${highContrast ? "contrast-125" : ""}`} aria-label="URAI Life Map emotional planetarium">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(191,233,255,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.3),#020617)]" />

      {viewState === "home" && <HomeAuraScene onEnter={enterGalaxy} reducedMotion={reducedMotion} />}

      {showGalaxy && (
        <>
          <header className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex items-start justify-center px-4 pt-5 max-md:justify-start max-md:pl-20">
            <div className="pointer-events-auto fixed left-4 top-4 grid h-[72px] w-[72px] place-items-start" aria-hidden={false}>
              <button onClick={returnHome} className="grid h-11 w-11 place-items-center rounded-full border border-cyan-100/20 bg-slate-950/72 text-cyan-50 shadow-[0_0_28px_rgba(191,233,255,0.12)] backdrop-blur-xl transition hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70" aria-label="Return to URAI home aura">←</button>
            </div>
            <div className="max-w-[min(34rem,calc(100vw-10rem))] rounded-3xl border border-cyan-100/10 bg-slate-950/55 px-6 py-3 text-center shadow-[0_0_42px_rgba(2,132,199,0.16)] backdrop-blur-2xl max-md:px-4 max-md:py-2 max-sm:max-w-[calc(100vw-6rem)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-100/60">URAI LIFE MAP</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight max-md:text-xl">{isReplaying ? "Memory Replay" : overlayState ? selectedStar.title : modeLabels[mode]}</h1>
              <p className="mt-1 text-xs text-cyan-100/55">{visibleStarCount} memory stars · {lifeMapMockData.lifeConstellations.length} constellations</p>
            </div>
          </header>

          <div className="pointer-events-auto fixed left-1/2 top-28 z-30 flex max-w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-cyan-100/10 bg-slate-950/55 px-2 py-2 text-xs backdrop-blur-2xl max-lg:hidden" role="tablist" aria-label="Life Map modes">
            {(Object.keys(modeLabels) as LifeMapMode[]).map((lifeMode) => (
              <button key={lifeMode} onClick={() => { setMode(lifeMode); setViewState(lifeMode === "mirrorOfBecoming" ? "mirror" : "galaxy"); }} role="tab" aria-selected={mode === lifeMode} className={`min-h-9 shrink-0 rounded-full px-3 py-1.5 transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70 ${mode === lifeMode ? "bg-cyan-100 text-slate-950" : "text-cyan-100/65 hover:bg-white/10"}`}>
                {modeLabels[lifeMode]}
              </button>
            ))}
          </div>

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

          <CompanionNarratorPanel selectedStar={selectedStar} emotionalSafetyMode={emotionalSafetyMode} state={viewState} />
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
          <FocusMemoryView visible={viewState === "focus"} memory={selectedStar} onReplay={startReplay} onWhyThis={startPrivacy} onRitual={startRitual} onPrivacy={startPrivacy} onReturn={recenter} reducedMotion={reducedMotion} />
          <ReplayThreadView visible={isReplaying} selectedStar={selectedStar} stars={lifeMapMockData.memoryStars} onExit={returnToFocus} onFocus={selectStar} reducedMotion={reducedMotion} />
          <LifeMapControls hidden={viewState !== "galaxy"} onHideThread={hideSelectedThread} onReplay={startReplay} onCreateScroll={openScrollExport} onMirror={startMirror} onRecenter={recenter} />
          <LifeMapFilterBar activeFilter={activeFilter} onChange={(filter) => { setActiveFilter(filter); setViewState("galaxy"); }} />
          <SpatialMemoryCard star={openCardStar} onClose={() => setOpenCardStar(undefined)} onBlur={() => setBlurredStarIds((ids) => Array.from(new Set([...ids, selectedStar.id])))} onHide={() => setHiddenStarIds((ids) => Array.from(new Set([...ids, selectedStar.id])))} onDelete={() => { setHiddenStarIds((ids) => Array.from(new Set([...ids, selectedStar.id]))); setOpenCardStar(undefined); }} />
        </>
      )}

      {overlayState && (
        <div className="pointer-events-auto fixed inset-0 z-50 grid place-items-center bg-slate-950/62 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${viewState} panel`}>
          <section className="w-[min(560px,100%)] rounded-[2rem] border border-cyan-100/18 bg-slate-950/88 p-6 text-cyan-50 shadow-[0_0_80px_rgba(14,165,233,0.2)] backdrop-blur-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/50">{viewState === "privacy" ? "Privacy-safe explanation" : viewState === "ritual" ? "Ritual" : "Mirror"}</p>
            <h2 className="mt-2 text-2xl font-semibold">{viewState === "privacy" ? "Why this appeared" : viewState === "ritual" ? "Let the thread settle" : "Mirror of Becoming"}</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-100/74">{companionLineFor(selectedStar, viewState === "privacy" ? "privacy" : viewState === "ritual" ? "ritual" : "mirror")}</p>
            <div className="mt-5 rounded-2xl border border-cyan-100/10 bg-white/[0.045] p-4 text-xs leading-6 text-cyan-100/66">
              <p>Memory: {selectedStar.title}</p>
              <p>{formatMemoryMeta(selectedStar)}</p>
              <p>Private sources stay private. URAI renders the pattern, not the raw record.</p>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button onClick={returnToFocus} className="min-h-11 rounded-full border border-cyan-100/18 px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70">Return to memory</button>
              {viewState === "ritual" && <button onClick={returnToFocus} className="min-h-11 rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-slate-950">Complete ritual</button>}
            </div>
          </section>
        </div>
      )}

      {exportOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Create Life Map scroll export">
          <section className="w-[min(480px,100%)] rounded-3xl border border-cyan-100/15 bg-slate-950 p-6 text-cyan-50 shadow-[0_0_70px_rgba(14,165,233,0.22)]">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/50">Make scroll</p>
            <h2 className="mt-2 text-2xl font-semibold">Life Map Scroll Export</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-100/70">URAI will keep private signals softened and anonymize shareable constellation moments by default.</p>
            <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-xs text-cyan-100/65">
              <p>Source: {selectedStar.title}</p>
              <p>Privacy: anonymized export</p>
              <p>Spatial layer: {spatialARVRScaffold.spatialPortals}</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setExportOpen(false)} className="min-h-11 rounded-full border border-cyan-100/15 px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70">Close</button>
              <button onClick={() => setExportOpen(false)} className="min-h-11 rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-slate-950">Save draft</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
