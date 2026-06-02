"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { mockMemoryStars } from "@/lib/urai/mock-memory-stars";
import { ConstellationLayer } from "@/components/urai/ConstellationLayer";
import { OrbCore } from "@/components/urai/OrbCore";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneCopy } from "@/components/urai/SceneCopy";

type LifeMapSceneProps = {
  selectedMemoryId?: string | null;
  onSelectMemory: (memoryId: string) => void;
  onNavigate: (scene: UraiScene) => void;
  onReturnHome: () => void;
};

export function LifeMapScene({ selectedMemoryId, onSelectMemory, onNavigate, onReturnHome }: LifeMapSceneProps) {
  const theme = getSceneTheme("life-map");
  const shouldReduceMotion = useReducedMotion();
  const selectedMemory = mockMemoryStars.find((memory) => memory.id === selectedMemoryId) ?? mockMemoryStars[0];

  const handleMemoryClick = (memoryId: string) => {
    onSelectMemory(memoryId);
    onNavigate("replay");
  };

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[48%] h-[72vh] w-[72vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/10"
          style={{ boxShadow: `0 0 80px ${theme.glow}` }}
          animate={shouldReduceMotion ? undefined : { rotate: 360, scale: [1, 1.025, 1] }}
          transition={{ rotate: { duration: 80, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div
          className="absolute left-1/2 top-[48%] h-[48vh] w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-violet-200/10"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 96, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-[48%] h-[38vh] w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-amber-200/10"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        <div
          className="absolute left-1/2 top-[48%] h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 72%)`, opacity: 0.5 }}
        />
      </div>

      <ConstellationLayer scene="life-map" stars={mockMemoryStars} interactive selectedMemoryId={selectedMemoryId ?? selectedMemory.id} onSelectMemory={handleMemoryClick} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col">
        <div className="flex items-start justify-between gap-6 pt-6">
          <div className="max-w-xl">
            <SceneCopy scene="life-map" />
          </div>
          <button
            type="button"
            onClick={onReturnHome}
            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Home
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <motion.div className="relative flex items-center justify-center" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
            <OrbCore scene="life-map" size="medium" intensity={0.75} />
            <div className="pointer-events-none absolute h-[34rem] w-[34rem] rounded-full border border-amber-100/10" style={{ boxShadow: `inset 0 0 60px rgba(255,255,255,0.04), 0 0 40px ${theme.glow}` }} />
          </motion.div>

          <motion.aside
            className="absolute bottom-8 right-0 w-full max-w-sm rounded-3xl border border-white/12 bg-black/25 p-5 text-left shadow-2xl backdrop-blur-2xl md:right-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: theme.accent }}>Selected Star</p>
            <h2 className="mt-3 text-2xl font-light text-white">{selectedMemory.label}</h2>
            <p className="mt-2 text-sm leading-6 text-white/62">{selectedMemory.subtitle}</p>
            <button
              type="button"
              onClick={() => handleMemoryClick(selectedMemory.id)}
              className="mt-5 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Enter Replay
            </button>
          </motion.aside>
        </div>

        <PortalNav activeScene="life-map" onNavigate={onNavigate} onReturnHome={onReturnHome} />
      </div>
    </section>
  );
}
