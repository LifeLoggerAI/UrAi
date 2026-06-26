"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { mockMemoryStars } from "@/lib/urai/mock-memory-stars";
import type { ReplayMode } from "@/lib/urai/replay-modes";
import { replayModes } from "@/lib/urai/replay-modes";
import { CinematicMemoryPlayer } from "@/components/urai/CinematicMemoryPlayer";
import { ConstellationLayer } from "@/components/urai/ConstellationLayer";
import { OrbCore } from "@/components/urai/OrbCore";
import { PortalNav } from "@/components/urai/PortalNav";

type ReplaySceneProps = {
  selectedMemoryId?: string | null;
  onNavigate: (scene: UraiScene) => void;
  onReturnToLifeMap: () => void;
  onReturnHome: () => void;
};

export function ReplayScene({ selectedMemoryId, onNavigate, onReturnToLifeMap, onReturnHome }: ReplaySceneProps) {
  const theme = getSceneTheme("replay");
  const [mode, setMode] = useState<ReplayMode>("memory-star");

  const selectedMemory = useMemo(() => {
    return mockMemoryStars.find((memory) => memory.id === selectedMemoryId) ?? mockMemoryStars[0];
  }, [selectedMemoryId]);

  const relatedMemories = useMemo(() => {
    return mockMemoryStars.filter((memory) => memory.id !== selectedMemory.id).slice(0, 4);
  }, [selectedMemory.id]);

  const hasConnectedMedia = Boolean(selectedMemory.imageUrl || selectedMemory.videoUrl || selectedMemory.audioUrl || selectedMemory.posterUrl);

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[46%] h-[68vh] w-[68vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/15"
          style={{ background: "radial-gradient(circle, rgba(255,210,122,0.16) 0%, rgba(255,159,191,0.09) 34%, transparent 68%)", boxShadow: `0 0 90px ${theme.glow}` }}
          animate={{ scale: [1, 1.04, 1], rotate: 360 }}
          transition={{ scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 90, repeat: Infinity, ease: "linear" } }}
        />
      </div>

      {mode === "constellation" && <ConstellationLayer scene="replay" stars={[selectedMemory, ...relatedMemories]} selectedMemoryId={selectedMemory.id} />}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col">
        <div className="flex flex-col gap-5 pt-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-black/24 p-5 shadow-2xl backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: theme.accent }}>
              {hasConnectedMedia ? "Memory film" : "Preview memory film"}
            </p>
            <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-white sm:text-5xl">
              Replay turns chosen moments into a film only when real media is connected.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/64">
              This launch surface is cinematic and safe by default. Sample stars are labeled as preview, missing video/audio falls back cleanly, and URAI does not claim a personal memory movie until user-owned media or generated metadata exists.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onReturnToLifeMap} className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">Life Map</button>
            <button type="button" onClick={onReturnHome} className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">Home</button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          {mode === "memory-star" ? (
            <CinematicMemoryPlayer memory={selectedMemory} />
          ) : mode === "constellation" ? (
            <div className="relative flex h-[34rem] w-full max-w-4xl items-center justify-center">
              <OrbCore scene="replay" size="medium" intensity={1} />
            </div>
          ) : (
            <div className="relative w-full max-w-5xl rounded-[2rem] border border-white/12 bg-black/20 p-8 text-center shadow-2xl backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: theme.accent }}>Timeline Replay</p>
              <h2 className="mt-3 text-3xl font-light text-white">{selectedMemory.label}</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/64">
                Timeline mode is ready for owner-scoped memory events. No generated timeline movie is shown until real events or render metadata are present.
              </p>
            </div>
          )}
        </div>

        <div className="relative z-20 flex flex-col items-center gap-5 pb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {replayModes.map((replayMode) => {
              const isActive = replayMode.id === mode;
              return (
                <button
                  key={replayMode.id}
                  type="button"
                  onClick={() => setMode(replayMode.id)}
                  className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-white/40"
                  style={{ borderColor: isActive ? theme.accent : "rgba(255,255,255,0.16)", background: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)", color: isActive ? "#fff" : "rgba(255,255,255,0.68)", boxShadow: isActive ? `0 0 24px ${theme.glow}` : undefined }}
                >
                  {replayMode.label}
                </button>
              );
            })}
          </div>
          <PortalNav activeScene="replay" onNavigate={onNavigate} onReturnHome={onReturnHome} />
        </div>
      </div>
    </section>
  );
}
