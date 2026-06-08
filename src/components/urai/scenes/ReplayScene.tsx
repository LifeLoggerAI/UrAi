"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { mockMemoryStars } from "@/lib/urai/mock-memory-stars";
import type { ReplayMode } from "@/lib/urai/replay-modes";
import { replayModes } from "@/lib/urai/replay-modes";
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
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<ReplayMode>("memory-star");

  const selectedMemory = useMemo(() => {
    return mockMemoryStars.find((memory) => memory.id === selectedMemoryId) ?? mockMemoryStars[0];
  }, [selectedMemoryId]);

  const relatedMemories = useMemo(() => {
    return mockMemoryStars.filter((memory) => memory.id !== selectedMemory.id).slice(0, 4);
  }, [selectedMemory.id]);

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[46%] h-[68vh] w-[68vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/15"
          style={{ background: "radial-gradient(circle, rgba(255,210,122,0.16) 0%, rgba(255,159,191,0.09) 34%, transparent 68%)", boxShadow: `0 0 90px ${theme.glow}` }}
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.04, 1], rotate: 360 }}
          transition={{ scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 90, repeat: Infinity, ease: "linear" } }}
        />
        <motion.div
          className="absolute left-1/2 top-[46%] h-[44vh] w-[44vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {mode === "constellation" && <ConstellationLayer scene="replay" stars={[selectedMemory, ...relatedMemories]} selectedMemoryId={selectedMemory.id} />}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col">
        <div className="flex items-start justify-between gap-6 pt-6">
          <div className="max-w-xl">
            <div></div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onReturnToLifeMap} className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">Life Map</button>
            <button type="button" onClick={onReturnHome} className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">Home</button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          {mode === "memory-star" && (
            <motion.div className="relative flex flex-col items-center justify-center text-center" initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="absolute h-[34rem] w-[34rem] rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${selectedMemory.color}44 0%, transparent 68%)` }} />
              <OrbCore scene="replay" size="large" intensity={1.1} />
              <div className="relative mt-8 max-w-xl rounded-3xl border border-white/12 bg-black/25 p-6 shadow-2xl backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.28em]" style={{ color: selectedMemory.color }}>{selectedMemory.type}</p>
                <h2 className="mt-3 text-3xl font-light text-white">{selectedMemory.label}</h2>
                <p className="mt-3 text-sm leading-6 text-white/64">{selectedMemory.narratorLine}</p>
              </div>
            </motion.div>
          )}

          {mode === "constellation" && (
            <motion.div className="relative flex h-[34rem] w-full max-w-4xl items-center justify-center" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <div className="relative z-10"><OrbCore scene="replay" size="medium" intensity={1} /></div>
              {relatedMemories.map((memory, index) => {
                const positions = ["left-[12%] top-[22%]", "right-[14%] top-[18%]", "left-[18%] bottom-[18%]", "right-[18%] bottom-[20%]"];
                return (
                  <motion.div
                    key={memory.id}
                    className={`absolute ${positions[index]} rounded-full`}
                    style={{ width: 58, height: 58, background: `radial-gradient(circle, white 0%, ${memory.color} 34%, transparent 72%)`, boxShadow: `0 0 34px ${memory.color}` }}
                    animate={shouldReduceMotion ? undefined : { y: [0, -8, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                  />
                );
              })}
            </motion.div>
          )}

          {mode === "timeline" && (
            <motion.div className="relative w-full max-w-5xl rounded-[2rem] border border-white/12 bg-black/20 p-8 shadow-2xl backdrop-blur-2xl" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="relative h-64">
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2" style={{ background: "linear-gradient(90deg, transparent, rgba(255,210,122,0.7), rgba(255,159,191,0.45), transparent)" }} />
                {mockMemoryStars.slice(0, 6).map((memory, index) => {
                  const left = 8 + index * 17;
                  const isSelected = memory.id === selectedMemory.id;
                  return (
                    <motion.button
                      key={memory.id}
                      type="button"
                      aria-label={memory.label}
                      className="absolute top-1/2 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                      style={{ left: `${left}%`, width: isSelected ? 48 : 30, height: isSelected ? 48 : 30, transform: "translate(-50%, -50%)", background: `radial-gradient(circle, white 0%, ${memory.color} 38%, transparent 72%)`, boxShadow: `0 0 ${isSelected ? 42 : 24}px ${memory.color}` }}
                      animate={shouldReduceMotion ? undefined : { scale: isSelected ? [1, 1.12, 1] : [1, 1.04, 1] }}
                      transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                    />
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.28em]" style={{ color: theme.accent }}>Timeline Replay</p>
                <h2 className="mt-3 text-3xl font-light text-white">{selectedMemory.label}</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/64">{selectedMemory.subtitle}</p>
              </div>
            </motion.div>
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
