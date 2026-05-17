"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ImmersiveWorld3D from "@/components/urai/world/ImmersiveWorld3D";
import type { LifeMapFilter, LifeMapMode } from "@/lib/life-map/types";
import { lifeMapMockData, selectedBlueFogMemory } from "@/lib/life-map/mock-data";
import CompanionNarratorPanel from "./CompanionNarratorPanel";
import LifeMapControls from "./LifeMapControls";
import LifeMapFilterBar from "./LifeMapFilterBar";
import ReplayControls from "./ReplayControls";

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
  const [activeFilter, setActiveFilter] = useState<LifeMapFilter>("All");
  const [selectedStarId, setSelectedStarId] = useState(selectedBlueFogMemory.id);
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>("idle");
  const [isReplaying, setIsReplaying] = useState(false);
  const [hiddenStarIds, setHiddenStarIds] = useState<string[]>([]);

  const selectedStar = useMemo(
    () => lifeMapMockData.memoryStars.find((star) => star.id === selectedStarId) ?? selectedBlueFogMemory,
    [selectedStarId],
  );

  const visibleStars = useMemo(
    () => lifeMapMockData.memoryStars.filter((star) => !hiddenStarIds.includes(star.id)),
    [hiddenStarIds],
  );

  function selectNextStar(offset: number) {
    const currentIndex = Math.max(0, visibleStars.findIndex((star) => star.id === selectedStarId));
    const nextStar = visibleStars[(currentIndex + offset + visibleStars.length) % visibleStars.length];
    if (!nextStar) return;
    setSelectedStarId(nextStar.id);
    setCameraCommand("focus");
  }

  function hideSelectedThread() {
    const constellation = lifeMapMockData.lifeConstellations.find((thread) => thread.id === selectedStar.constellationId);
    const ids = constellation?.starIds ?? [selectedStar.id];
    setHiddenStarIds((current) => Array.from(new Set([...current, ...ids])));
  }

  function startReplay() {
    setIsReplaying(true);
    setCameraCommand("replay");
    window.setTimeout(() => {
      setIsReplaying(false);
      setCameraCommand("idle");
    }, 1800);
  }

  function startMirror() {
    setMode("mirrorOfBecoming");
    setCameraCommand("mirror");
  }

  function recenter() {
    setMode("memoryGalaxy");
    setCameraCommand("recenter");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-cyan-50" aria-label="URAI Life Map immersive spatial world">
      <ImmersiveWorld3D mode="life-map" activeLabel={`${modeLabels[mode]} • ${activeFilter}`} selectedLabel={selectedStar.title} />

      <header className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex items-start justify-center px-4 pt-5">
        <Link href="/" className="pointer-events-auto fixed left-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-cyan-100/15 bg-slate-950/70 text-cyan-50 shadow-[0_0_28px_rgba(191,233,255,0.12)] backdrop-blur-xl hover:bg-cyan-100/10" aria-label="Back to URAI home">←</Link>
        <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/55 px-6 py-3 text-center shadow-[0_0_42px_rgba(2,132,199,0.16)] backdrop-blur-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/60">URAI LIFE MAP</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{modeLabels[mode]}</h1>
          <p className="mt-1 text-xs text-cyan-100/50">Immersive spatial world • {visibleStars.length} memory fields</p>
        </div>
      </header>

      <div className="pointer-events-auto fixed left-1/2 top-28 z-30 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-cyan-100/10 bg-slate-950/55 px-2 py-2 text-xs backdrop-blur-2xl max-md:top-[8.2rem] max-md:w-[92vw]" role="tablist" aria-label="Life Map modes">
        {(Object.keys(modeLabels) as LifeMapMode[]).map((lifeMode) => (
          <button key={lifeMode} onClick={() => setMode(lifeMode)} role="tab" aria-selected={mode === lifeMode} className={`shrink-0 rounded-full px-3 py-1.5 ${mode === lifeMode ? "bg-cyan-100 text-slate-950" : "text-cyan-100/65 hover:bg-white/10"}`}>
            {modeLabels[lifeMode]}
          </button>
        ))}
      </div>

      <section className="fixed inset-x-0 bottom-28 z-30 mx-auto flex w-[min(960px,92vw)] flex-col items-center gap-4 px-4 text-center">
        <div className="rounded-[2rem] border border-cyan-100/15 bg-slate-950/45 px-7 py-5 shadow-[0_0_80px_rgba(125,211,252,0.14)] backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/45">Selected memory field</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-cyan-50">{selectedStar.title}</h2>
          <p className="mt-1 text-sm text-cyan-100/65">{selectedStar.subtitle}</p>
          <p className="mt-3 text-xs text-cyan-100/45">Move your pointer to shift the 3D world. Camera state: {cameraCommand}</p>
        </div>

        <div className="pointer-events-auto flex max-w-full gap-2 overflow-x-auto rounded-full border border-cyan-100/10 bg-slate-950/45 p-2 backdrop-blur-xl">
          {visibleStars.slice(0, 10).map((star) => (
            <button key={star.id} onClick={() => { setSelectedStarId(star.id); setCameraCommand("focus"); }} className={`shrink-0 rounded-full px-4 py-2 text-xs transition ${star.id === selectedStarId ? "bg-cyan-100 text-slate-950" : "bg-white/[0.04] text-cyan-100/70 hover:bg-white/[0.1]"}`}>
              {star.title}
            </button>
          ))}
        </div>
      </section>

      <CompanionNarratorPanel selectedStar={selectedStar} emotionalSafetyMode={false} />
      <ReplayControls isReplaying={isReplaying} onStop={() => { setIsReplaying(false); setCameraCommand("idle"); }} />
      <LifeMapControls onHideThread={hideSelectedThread} onReplay={startReplay} onCreateScroll={() => undefined} onMirror={startMirror} onRecenter={recenter} />
      <LifeMapFilterBar activeFilter={activeFilter} onChange={setActiveFilter} />

      <button type="button" onClick={() => selectNextStar(-1)} className="sr-only">Previous memory</button>
      <button type="button" onClick={() => selectNextStar(1)} className="sr-only">Next memory</button>
    </main>
  );
}
