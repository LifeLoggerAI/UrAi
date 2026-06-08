"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MemoryStar } from "@/lib/urai/mock-memory-stars";
import { OrbCore } from "@/components/urai/OrbCore";

type CinematicMemoryPlayerProps = {
  memory: MemoryStar;
};

type FilmFrame = {
  id: string;
  kind: "photo" | "video" | "voice" | "generated-scene";
  title: string;
  caption: string;
  timestamp: string;
  durationSeconds: number;
  fallbackGradient: string;
};

const buildFilmFrames = (memory: MemoryStar): FilmFrame[] => [
  {
    id: `${memory.id}-asset`,
    kind: "photo",
    title: "Real memory asset",
    caption: "Photo, screenshot, clip, or imported media opens inside the clicked star.",
    timestamp: "00:00",
    durationSeconds: 8,
    fallbackGradient: `radial-gradient(circle at 34% 28%, white 0%, ${memory.color} 14%, rgba(255,255,255,0.16) 30%, rgba(8,12,28,0.9) 68%, black 100%)`,
  },
  {
    id: `${memory.id}-bridge`,
    kind: "generated-scene",
    title: "AI reconstructed scene",
    caption: "URAI fills missing motion between media using context, messages, audio tone, time, place, and relationship signals.",
    timestamp: "00:08",
    durationSeconds: 12,
    fallbackGradient: `linear-gradient(135deg, rgba(255,255,255,0.18), ${memory.color}55 34%, rgba(17,22,48,0.94) 64%, black)`,
  },
  {
    id: `${memory.id}-voice`,
    kind: "voice",
    title: "Narrator beat",
    caption: memory.narratorLine,
    timestamp: "00:20",
    durationSeconds: 10,
    fallbackGradient: `radial-gradient(circle at 50% 52%, ${memory.color} 0%, rgba(255,255,255,0.22) 18%, rgba(5,8,22,0.96) 58%, black 100%)`,
  },
  {
    id: `${memory.id}-movie`,
    kind: "video",
    title: "Life movie chapter",
    caption: "The star becomes a playable chapter film that can be stitched into the full life movie.",
    timestamp: "00:30",
    durationSeconds: 12,
    fallbackGradient: `conic-gradient(from 140deg at 50% 50%, rgba(255,255,255,0.26), ${memory.color}, rgba(120,90,255,0.34), black, ${memory.color})`,
  },
];

export function CinematicMemoryPlayer({ memory }: CinematicMemoryPlayerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const frames = useMemo(() => buildFilmFrames(memory), [memory]);
  const activeFrame = frames[activeFrameIndex] ?? frames[0];

  return (
    <div className="relative grid w-full max-w-6xl gap-5 lg:grid-cols-[1fr_22rem]">
      <motion.div
        key={activeFrame.id}
        className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/12 bg-black shadow-2xl"
        style={{ boxShadow: `0 0 80px ${memory.color}44` }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: activeFrame.fallbackGradient }}
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1.03], x: [0, -10, 6], y: [0, 8, -4] }}
          transition={{ duration: activeFrame.durationSeconds, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.16)_48%,rgba(0,0,0,0.68)_100%)]" />
        <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl">
          {activeFrame.kind} / {activeFrame.timestamp}
        </div>
        <div className="absolute right-6 top-6 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl">
          {activeFrame.durationSeconds}s scene
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            <OrbCore scene="replay" size="large" intensity={1.15} />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/72 to-transparent p-8">
          <p className="text-xs uppercase tracking-[0.28em]" style={{ color: memory.color }}>Star movie generator</p>
          <h2 className="mt-3 text-4xl font-light text-white">{activeFrame.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{activeFrame.caption}</p>
        </div>
      </motion.div>

      <aside className="rounded-[2rem] border border-white/12 bg-black/30 p-5 shadow-2xl backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: memory.color }}>Now playing</p>
        <h3 className="mt-3 text-2xl font-light text-white">{memory.label}</h3>
        <p className="mt-2 text-sm leading-6 text-white/62">{memory.subtitle}</p>
        <div className="mt-5 space-y-2">
          {frames.map((frame, index) => {
            const isActive = frame.id === activeFrame.id;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => setActiveFrameIndex(index)}
                className="w-full rounded-2xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-white/40"
                style={{ borderColor: isActive ? memory.color : "rgba(255,255,255,0.12)", background: isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)" }}
              >
                <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-white/42">{frame.timestamp} / {frame.kind}</span>
                <span className="mt-1 block text-sm text-white/82">{frame.title}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
