"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { UraiRitual } from "@/lib/rituals/ritualTypes";

type RitualFlowProps = {
  ritual: UraiRitual | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (ritualId: string) => void;
  onSkip: (ritualId: string) => void;
};

const doneCopy = ["Done for now.", "That can be enough.", "The root has been marked."];

export function RitualFlow({ ritual, isOpen, onClose, onComplete, onSkip }: RitualFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  if (!ritual) return null;
  const step = ritual.steps[Math.min(stepIndex, ritual.steps.length - 1)];
  const isLast = stepIndex >= ritual.steps.length - 1;
  const complete = () => {
    onComplete(ritual.id);
    setStepIndex(0);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="Ritual flow" className="fixed inset-0 z-[90] grid place-items-end bg-black/34 p-4 text-white backdrop-blur-sm md:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-lg rounded-[2rem] border border-white/12 bg-slate-950/88 p-5 shadow-2xl" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">{ritual.type.replace(/_/g, " ")}</p>
                <h2 className="mt-2 text-xl font-medium text-white">{ritual.title}</h2>
                <p className="mt-1 text-sm text-white/58">{ritual.intensity} ritual · optional</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close ritual" className="rounded-full bg-white/10 px-3 py-1 text-white/70">×</button>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-white/[0.06] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/42">Step {stepIndex + 1} of {ritual.steps.length}</p>
              <p className="mt-3 text-lg leading-7 text-white/86">{step.text}</p>
              {step.durationHint ? <p className="mt-2 text-sm text-white/48">{step.durationHint}</p> : null}
            </div>

            {ritual.status === "completed" ? <p className="mt-4 rounded-2xl bg-emerald-200/10 p-3 text-sm text-white/74">{doneCopy[stepIndex % doneCopy.length]}</p> : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {!isLast ? <button type="button" onClick={() => setStepIndex((value) => value + 1)} className="rounded-full bg-amber-200/16 px-4 py-2 text-sm text-white/88">Next</button> : <button type="button" onClick={complete} className="rounded-full bg-amber-200/16 px-4 py-2 text-sm text-white/88">Complete</button>}
              <button type="button" onClick={() => onSkip(ritual.id)} className="rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/66">Skip</button>
              <button type="button" onClick={onClose} className="rounded-full bg-white/[0.05] px-4 py-2 text-sm text-white/56">Pause</button>
            </div>
          </motion.div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
