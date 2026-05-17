"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ImmersiveWorld3D from "@/components/urai/world/ImmersiveWorld3D";
import type { LifeMapMode } from "@/lib/life-map/types";
import { lifeMapMockData, selectedBlueFogMemory } from "@/lib/life-map/mock-data";

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
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>("idle");
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

  function replay() {
    setCameraCommand("replay");
    window.setTimeout(() => setCameraCommand("idle"), 1500);
  }

  function mirror() {
    setMode("mirrorOfBecoming");
    setCameraCommand("mirror");
  }

  function recenter() {
    setMode("memoryGalaxy");
    setCameraCommand("recenter");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-cyan-50" aria-label="URAI Life Map immersive spatial world">
      <ImmersiveWorld3D mode="life-map" activeLabel={`${modeLabels[mode]} • ${visibleStars.length} fields`} selectedLabel={selectedStar.title} />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(2,6,23,0.08)_44%,rgba(2,6,23,0.78)_100%)]" />

      <Link href="/" className="fixed left-5 top-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-cyan-100/15 bg-slate-950/60 text-cyan-50 shadow-[0_0_28px_rgba(191,233,255,0.12)] backdrop-blur-xl hover:bg-cyan-100/10" aria-label="Back to URAI home">←</Link>

      <header className="pointer-events-none fixed left-1/2 top-6 z-30 w-[min(430px,86vw)] -translate-x-1/2 rounded-[2rem] border border-cyan-100/10 bg-slate-950/45 px-6 py-4 text-center shadow-[0_0_42px_rgba(2,132,199,0.16)] backdrop-blur-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/55">URAI LIFE MAP</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{modeLabels[mode]}</h1>
        <p className="mt-1 text-xs text-cyan-100/50">Immersive spatial world • {visibleStars.length} memory fields</p>
      </header>

      <section className="fixed inset-x-0 bottom-24 z-30 mx-auto flex w-[min(720px,90vw)] flex-col items-center gap-4 px-4 text-center">
        <div className="rounded-[2rem] border border-cyan-100/15 bg-slate-950/38 px-7 py-5 shadow-[0_0_80px_rgba(125,211,252,0.14)] backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/45">Selected memory field</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-cyan-50">{selectedStar.title}</h2>
          <p className="mt-1 text-sm text-cyan-100/65">{selectedStar.subtitle}</p>
          <p className="mt-3 text-xs text-cyan-100/42">Move your pointer to shift the 3D world. Camera state: {cameraCommand}</p>
        </div>

        <div className="pointer-events-auto flex flex-wrap justify-center gap-2 rounded-full border border-cyan-100/10 bg-slate-950/42 p-2 backdrop-blur-xl">
          <button onClick={() => selectNextStar(-1)} className="rounded-full border border-cyan-100/15 px-4 py-2 text-xs text-cyan-100/75 hover:bg-white/10">Previous</button>
          <button onClick={replay} className="rounded-full bg-cyan-100 px-4 py-2 text-xs font-medium text-slate-950">Replay</button>
          <button onClick={mirror} className="rounded-full border border-cyan-100/15 px-4 py-2 text-xs text-cyan-100/75 hover:bg-white/10">Mirror</button>
          <button onClick={recenter} className="rounded-full border border-cyan-100/15 px-4 py-2 text-xs text-cyan-100/75 hover:bg-white/10">Recenter</button>
          <button onClick={hideSelectedThread} className="rounded-full border border-cyan-100/15 px-4 py-2 text-xs text-cyan-100/75 hover:bg-white/10">Hide thread</button>
          <button onClick={() => selectNextStar(1)} className="rounded-full border border-cyan-100/15 px-4 py-2 text-xs text-cyan-100/75 hover:bg-white/10">Next</button>
        </div>
      </section>

      <div className="fixed right-5 top-5 z-30 hidden w-[min(320px,28vw)] rounded-[1.7rem] border border-cyan-100/12 bg-slate-950/38 p-5 shadow-[0_0_42px_rgba(2,132,199,0.14)] backdrop-blur-2xl lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/45">Companion</p>
        <p className="mt-3 text-sm font-semibold text-cyan-50">Grief-softened companion</p>
        <p className="mt-4 text-sm leading-6 text-cyan-100/75">This memory carried weight, so URAI rendered it softly.</p>
      </div>
    </main>
  );
}
