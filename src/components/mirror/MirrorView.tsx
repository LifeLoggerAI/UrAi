"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { MirrorPatternType, MirrorReflection } from "@/lib/mirror/mirrorTypes";
import { useUraiMirror } from "@/providers/UraiMirrorProvider";
import { MirrorReflectionCard } from "./MirrorReflectionCard";
import { MirrorReflectionDetail } from "./MirrorReflectionDetail";

type MirrorViewProps = {
  isOpen: boolean;
  onClose: () => void;
  moodState?: GenesisMoodState;
  onOpenGround?: () => void;
  onOpenLifeMap?: () => void;
  onOpenPassport?: () => void;
  onTalkToCompanion?: () => void;
};

const FILTERS: Array<{ type: MirrorPatternType | "all"; label: string }> = [
  { type: "all", label: "All" },
  { type: "rhythm", label: "Rhythm" },
  { type: "mood_shift", label: "Mood" },
  { type: "recovery", label: "Recovery" },
  { type: "overload", label: "Load" },
  { type: "focus", label: "Focus" },
  { type: "relationship", label: "Relationship" },
  { type: "threshold", label: "Threshold" },
  { type: "shadow", label: "Shadow" },
  { type: "legacy", label: "Legacy" },
  { type: "system", label: "System" },
];

const tintByMood: Record<GenesisMoodState, string> = {
  calm: "from-slate-950 via-blue-950 to-black",
  heavy: "from-neutral-950 via-slate-950 to-black",
  focused: "from-slate-950 via-cyan-950 to-black",
  anxious: "from-slate-950 via-indigo-950 to-black",
  hopeful: "from-slate-950 via-sky-900 to-black",
  recovering: "from-slate-950 via-teal-950 to-black",
  shadow: "from-indigo-950 via-slate-950 to-black",
  threshold: "from-slate-950 via-violet-950 to-black",
  luminous: "from-slate-950 via-blue-900 to-black",
};

export function MirrorView({ isOpen, onClose, moodState = "luminous", onOpenGround, onOpenLifeMap, onOpenPassport, onTalkToCompanion }: MirrorViewProps) {
  const reduceMotion = useReducedMotion();
  const mirror = useUraiMirror();

  useEffect(() => {
    if (isOpen) mirror.regenerateMirror(moodState);
  }, [isOpen, mirror, moodState]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const reflections = useMemo(() => {
    return mirror.mirrorSession.reflections.filter((reflection) => reflection.visible && (mirror.filterByPatternType === "all" || reflection.patternType === mirror.filterByPatternType));
  }, [mirror.filterByPatternType, mirror.mirrorSession.reflections]);

  const availableFilters = useMemo(() => {
    const types = new Set(mirror.mirrorSession.reflections.filter((reflection) => reflection.visible).map((reflection) => reflection.patternType));
    return FILTERS.filter((item) => item.type === "all" || types.has(item.type));
  }, [mirror.mirrorSession.reflections]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="URAI Mirror" className={`fixed inset-0 z-[70] overflow-hidden bg-gradient-to-b ${tintByMood[moodState]} text-white`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(190,220,255,0.2),transparent_34%),linear-gradient(180deg,rgba(8,12,26,0.64)_0%,rgba(3,5,13,0.98)_100%)]" />
          <motion.div className="absolute inset-0 opacity-50" animate={reduceMotion ? undefined : { scale: [1, 1.025, 1], opacity: [0.42, 0.58, 0.42] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}>
            <div className="absolute left-1/2 top-[38%] h-[34vh] w-[68vw] -translate-x-1/2 rounded-[50%] border border-white/10 bg-white/[0.035] blur-[1px]" />
          </motion.div>

          <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 md:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Mirror</p>
              <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">Here’s the pattern, not the judgment.</h2>
              <p className="mt-1 max-w-xl text-sm text-white/58">Reflections stay gentle, permission-aware, and uncertain when the signal is early.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Mirror" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-md">Close</button>
          </header>

          <div className="pointer-events-auto absolute inset-x-4 top-[6.25rem] z-30 flex gap-2 overflow-x-auto md:left-6 md:right-auto md:top-auto md:bottom-6">
            {availableFilters.map((item) => <button key={item.type} type="button" onClick={() => mirror.setFilterByPatternType(item.type)} className={`rounded-full px-3 py-2 text-xs backdrop-blur-md ${mirror.filterByPatternType === item.type ? "bg-white/18 text-white" : "bg-white/[0.07] text-white/62"}`}>{item.label}</button>)}
          </div>

          <main className="absolute inset-0 overflow-auto px-4 pb-40 pt-40 md:px-8 md:pb-24 md:pt-32">
            <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2 lg:grid-cols-3">
              {reflections.map((reflection: MirrorReflection) => <MirrorReflectionCard key={reflection.id} reflection={reflection} isSelected={mirror.selectedReflection?.id === reflection.id} onSelect={mirror.selectReflection} />)}
            </div>
          </main>

          <MirrorReflectionDetail reflection={mirror.selectedReflection} onClose={mirror.clearSelectedReflection} onOpenGround={onOpenGround} onOpenLifeMap={onOpenLifeMap} onOpenPassport={onOpenPassport} onTalkToCompanion={onTalkToCompanion} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
