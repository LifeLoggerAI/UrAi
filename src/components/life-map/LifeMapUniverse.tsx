"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  LifeMapFilter,
  LifeMapMode,
  MemoryStar,
  QualityMode,
} from "@/lib/life-map/types";
import {
  lifeMapMockData,
  selectedBlueFogMemory,
  spatialARVRScaffold,
} from "@/lib/life-map/mock-data";
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

type LifeMapUniverseProps = {
  initialOverlay?: LifeMapMode;
};

export default function LifeMapUniverse({ initialOverlay = "map" }: LifeMapUniverseProps) {
  const [mode, setMode] = useState<LifeMapMode>(initialOverlay);
  const [filter, setFilter] = useState<LifeMapFilter>("all");
  const [qualityMode, setQualityMode] = useState<QualityMode>("cinematic");
  const [selectedMemoryId, setSelectedMemoryId] = useState<string>(selectedBlueFogMemory.id);
  const [canonOpen, setCanonOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);

  useEffect(() => {
    setMode(initialOverlay);
  }, [initialOverlay]);

  const memories = lifeMapMockData.memories;

  const filteredMemories = useMemo(() => {
    if (filter === "all") return memories;
    return memories.filter((memory) => memory.type === filter || memory.tags.includes(filter));
  }, [filter, memories]);

  const selectedMemory = useMemo<MemoryStar>(() => {
    return memories.find((memory) => memory.id === selectedMemoryId) ?? selectedBlueFogMemory;
  }, [memories, selectedMemoryId]);

  const handleSelectMemory = useCallback((memory: MemoryStar) => {
    setSelectedMemoryId(memory.id);
  }, []);

  const modeCopy = {
    map: "Spatial life map",
    mirror: "Cognitive mirror",
    focus: "Focus bloom",
    replay: "Memory replay",
  } satisfies Record<LifeMapMode, string>;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#020617_48%,#000_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(125,211,252,.12),transparent_36%,rgba(168,85,247,.1)_72%,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-18rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl">
          <Link href="/" className="rounded-full border border-cyan-100/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100">
            URAI Life Map
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <CanonButton active={canonOpen} onClick={() => setCanonOpen((value) => !value)} />
            <button
              type="button"
              onClick={() => setQualityOpen((value) => !value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-cyan-200/40 hover:text-white"
            >
              {qualityMode}
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[18rem_minmax(0,1fr)_22rem]">
          <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/55 p-4 shadow-2xl backdrop-blur-2xl">
            <LifeMapControls mode={mode} onModeChange={setMode} />
            <LifeMapFilterBar filter={filter} onFilterChange={setFilter} />
            <div className="rounded-[1.5rem] border border-cyan-100/10 bg-cyan-100/[0.04] p-4 text-sm text-cyan-50/80">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Current layer</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">{modeCopy[mode]}</h1>
              <p className="mt-3 leading-6">
                {spatialARVRScaffold.description} This interface remains symbolic, consent-gated, and demo-safe.
              </p>
            </div>
          </aside>

          <section className="relative min-h-[42rem] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 shadow-[0_0_90px_rgba(14,165,233,.18)]">
            <MemoryGalaxyCanvas
              memories={filteredMemories}
              selectedMemoryId={selectedMemory.id}
              qualityMode={qualityMode}
              onSelectMemory={handleSelectMemory}
            />
            <div className="pointer-events-none absolute left-5 top-5 max-w-sm rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Selected memory</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{selectedMemory.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">{selectedMemory.summary}</p>
              <p className="mt-3 text-xs text-cyan-100/70">Confidence: {formatMemoryConfidence(selectedMemory.confidence)}</p>
            </div>
          </section>

          <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/55 p-4 shadow-2xl backdrop-blur-2xl">
            {mode === "focus" ? (
              <FocusMemoryView memory={selectedMemory} />
            ) : mode === "replay" ? (
              <ReplayControls memory={selectedMemory} />
            ) : (
              <SpatialMemoryCard memory={selectedMemory} />
            )}
            <CompanionNarratorPanel memory={selectedMemory} mode={mode} />
          </aside>
        </div>
      </section>

      {canonOpen ? <CanonOverlayPanel onClose={() => setCanonOpen(false)} /> : null}
      {qualityOpen ? (
        <QualitySettingsPanel
          qualityMode={qualityMode}
          onChange={setQualityMode}
          onClose={() => setQualityOpen(false)}
        />
      ) : null}
    </main>
  );
}
