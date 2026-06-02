"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { GroundElement, GroundElementType } from "@/lib/ground/groundTypes";
import { getGroundingActionsForMood } from "@/lib/ground/groundingActions";
import { getRitualSeedsForMood } from "@/lib/ground/ritualSeeds";
import { useUraiGround } from "@/providers/UraiGroundProvider";
import { GroundElementDetail } from "./GroundElementDetail";
import { GroundElementNode } from "./GroundElementNode";
import { RootNetworkLayer } from "./RootNetworkLayer";

type GroundGardenProps = {
  isOpen: boolean;
  onClose: () => void;
  moodState?: GenesisMoodState;
  onOpenPassport?: () => void;
  onReflectElement?: (element: GroundElement) => void;
};

const FILTERS: Array<{ type: GroundElementType | "all"; label: string }> = [
  { type: "all", label: "All" },
  { type: "root", label: "Roots" },
  { type: "bloom", label: "Blooms" },
  { type: "ritualSeed", label: "Rituals" },
  { type: "recoveryBloom", label: "Recovery" },
  { type: "habitPlant", label: "Habits" },
  { type: "shadowMoss", label: "Shadow" },
  { type: "legacyTree", label: "Legacy" },
];

const moodTint: Record<GenesisMoodState, string> = {
  calm: "from-emerald-950 via-stone-950 to-black",
  heavy: "from-stone-950 via-neutral-950 to-black",
  focused: "from-teal-950 via-stone-950 to-black",
  anxious: "from-slate-950 via-stone-950 to-black",
  hopeful: "from-emerald-900 via-stone-950 to-black",
  recovering: "from-teal-900 via-stone-950 to-black",
  shadow: "from-indigo-950 via-stone-950 to-black",
  threshold: "from-amber-950 via-stone-950 to-black",
  luminous: "from-emerald-900 via-stone-950 to-black",
};

export function GroundGarden({ isOpen, onClose, moodState = "luminous", onOpenPassport, onReflectElement }: GroundGardenProps) {
  const reduceMotion = useReducedMotion();
  const ground = useUraiGround();
  const actions = useMemo(() => getGroundingActionsForMood(moodState), [moodState]);
  const seeds = useMemo(() => getRitualSeedsForMood(moodState), [moodState]);

  useEffect(() => {
    if (isOpen) ground.regenerateGround(moodState);
  }, [ground, isOpen, moodState]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const visibleElements = useMemo(() => {
    return ground.groundData.elements.filter((element) => element.state !== "hidden" && (ground.filterByType === "all" || element.type === ground.filterByType));
  }, [ground.filterByType, ground.groundData.elements]);

  const availableFilters = useMemo(() => {
    const types = new Set(ground.groundData.elements.filter((element) => element.state !== "hidden").map((element) => element.type));
    return FILTERS.filter((item) => item.type === "all" || types.has(item.type));
  }, [ground.groundData.elements]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="URAI Ground" className={`fixed inset-0 z-[70] overflow-hidden bg-gradient-to-b ${moodTint[moodState]} text-white`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_74%,rgba(237,186,118,0.18),transparent_38%),linear-gradient(180deg,rgba(5,8,18,0.65)_0%,rgba(22,16,10,0.92)_56%,rgba(5,3,2,1)_100%)]" />
          <motion.div className="absolute inset-0 opacity-60" animate={reduceMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}>
            <div className="absolute left-[18%] top-[70%] h-1 w-1 rounded-full bg-amber-100/60" />
            <div className="absolute left-[44%] top-[58%] h-1 w-1 rounded-full bg-emerald-100/50" />
            <div className="absolute left-[76%] top-[66%] h-1 w-1 rounded-full bg-yellow-100/60" />
          </motion.div>

          <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 md:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Ground</p>
              <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">A quiet garden below the sky.</h2>
              <p className="mt-1 max-w-xl text-sm text-white/58">The soil is quiet. You can open layers in Passport when you want more to grow here.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Ground" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-md">Close</button>
          </header>

          <div className="absolute inset-0 overflow-auto px-6 py-24 md:overflow-hidden">
            <motion.div className="relative min-h-[760px] w-full md:h-full md:min-h-0" style={{ scale: ground.zoomLevel }}>
              <RootNetworkLayer elements={visibleElements} selectedElementId={ground.selectedElement?.id} />
              {visibleElements.map((element) => <GroundElementNode key={element.id} element={element} isSelected={ground.selectedElement?.id === element.id} onSelect={ground.selectElement} />)}
            </motion.div>
          </div>

          <div className="pointer-events-auto absolute inset-x-4 top-[6.25rem] z-30 flex gap-2 overflow-x-auto md:left-6 md:right-auto md:top-auto md:bottom-6">
            {availableFilters.map((item) => <button key={item.type} type="button" onClick={() => ground.setFilterByType(item.type)} className={`rounded-full px-3 py-2 text-xs backdrop-blur-md ${ground.filterByType === item.type ? "bg-white/18 text-white" : "bg-white/[0.07] text-white/62"}`}>{item.label}</button>)}
          </div>

          <aside className="pointer-events-auto absolute left-4 top-40 z-20 hidden max-w-[250px] rounded-3xl border border-white/10 bg-black/24 p-3 text-white/76 backdrop-blur-xl md:block">
            <p className="text-xs uppercase tracking-[0.2em] text-white/42">Grounding</p>
            <div className="mt-2 space-y-2">
              {actions.slice(0, 2).map((action) => <p key={action.id} className="rounded-2xl bg-white/[0.05] p-2 text-xs leading-5">{action.title}</p>)}
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/42">Seeds</p>
            <div className="mt-2 space-y-2">
              {seeds.slice(0, 2).map((seed) => <p key={seed.id} className="rounded-2xl bg-white/[0.05] p-2 text-xs leading-5">{seed.title}</p>)}
            </div>
          </aside>

          <div className="pointer-events-auto absolute bottom-6 right-6 z-30 hidden gap-2 md:flex">
            <button type="button" onClick={() => ground.setZoomLevel(ground.zoomLevel - 0.1)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/72">−</button>
            <button type="button" onClick={() => ground.setZoomLevel(1)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/72">Reset</button>
            <button type="button" onClick={() => ground.setZoomLevel(ground.zoomLevel + 0.1)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/72">+</button>
          </div>

          <GroundElementDetail element={ground.selectedElement} onClose={ground.clearSelectedElement} onOpenPassport={onOpenPassport} onReflect={onReflectElement} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
