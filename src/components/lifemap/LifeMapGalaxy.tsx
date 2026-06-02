"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { LifeMapStar, LifeMapStarType } from "@/lib/lifemap/lifeMapTypes";
import { useUraiLifeMap } from "@/providers/UraiLifeMapProvider";
import { ConstellationLayer } from "./ConstellationLayer";
import { LifeMapChapterRail } from "./LifeMapChapterRail";
import { LifeMapStarDetail } from "./LifeMapStarDetail";
import { LifeMapStarNode } from "./LifeMapStarNode";

type LifeMapGalaxyProps = {
  isOpen: boolean;
  onClose: () => void;
  moodState?: GenesisMoodState;
  onOpenPassport?: () => void;
  onReflectStar?: (star: LifeMapStar) => void;
};

const FILTERS: Array<{ type: LifeMapStarType | "all"; label: string }> = [
  { type: "all", label: "All" },
  { type: "memory", label: "Memories" },
  { type: "mood", label: "Mood" },
  { type: "ritual", label: "Rituals" },
  { type: "recovery", label: "Recovery" },
  { type: "shadow", label: "Shadow" },
  { type: "legacy", label: "Legacy" },
  { type: "passport", label: "Passport" },
];

export function LifeMapGalaxy({ isOpen, onClose, moodState = "luminous", onOpenPassport, onReflectStar }: LifeMapGalaxyProps) {
  const reduceMotion = useReducedMotion();
  const { lifeMapData, selectedStar, selectedChapter, selectStar, clearSelectedStar, regenerateLifeMap, filterByType, setFilterByType, zoomLevel, setZoomLevel, showPrivateStars } = useUraiLifeMap();

  useEffect(() => {
    if (isOpen) regenerateLifeMap(moodState);
  }, [isOpen, moodState, regenerateLifeMap]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const visibleStars = useMemo(() => {
    return lifeMapData.stars.filter((star) => {
      if (star.visibility === "hidden") return false;
      if (star.visibility === "private" && !showPrivateStars) return false;
      if (filterByType !== "all" && star.type !== filterByType) return false;
      return true;
    });
  }, [filterByType, lifeMapData.stars, showPrivateStars]);

  const availableFilters = useMemo(() => {
    const visibleTypes = new Set(lifeMapData.stars.filter((star) => star.visibility !== "hidden").map((star) => star.type));
    return FILTERS.filter((item) => item.type === "all" || visibleTypes.has(item.type));
  }, [lifeMapData.stars]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="URAI Life Map" className="fixed inset-0 z-[70] overflow-hidden bg-[#030511] text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(61,84,151,0.42),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(141,103,201,0.16),transparent_26%),linear-gradient(180deg,#071026_0%,#02040d_100%)]" />
          <motion.div className="absolute inset-0 opacity-70" animate={reduceMotion ? undefined : { y: [0, -10, 0], x: [0, 5, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}>
            <div className="absolute left-[12%] top-[18%] h-1 w-1 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.8)]" />
            <div className="absolute left-[28%] top-[72%] h-1 w-1 rounded-full bg-white/50" />
            <div className="absolute left-[72%] top-[22%] h-1 w-1 rounded-full bg-white/60" />
            <div className="absolute left-[88%] top-[58%] h-1 w-1 rounded-full bg-white/50" />
          </motion.div>

          <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 md:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Life Map</p>
              <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">The sky remembers gently.</h2>
              <p className="mt-1 max-w-xl text-sm text-white/58">The map is quiet. Open layers in Passport when you want more of your story to appear.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Life Map" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-md">Close</button>
          </header>

          <div className="absolute inset-0 overflow-auto px-6 py-24 md:overflow-hidden">
            <motion.div className="relative min-h-[760px] w-full md:h-full md:min-h-0" style={{ scale: zoomLevel }} transition={{ duration: 0.2 }}>
              <ConstellationLayer stars={visibleStars} chapters={lifeMapData.chapters} selectedChapterId={selectedChapter?.id} />
              {visibleStars.map((star) => <LifeMapStarNode key={star.id} star={star} isSelected={selectedStar?.id === star.id} onSelect={selectStar} />)}
            </motion.div>
          </div>

          <LifeMapChapterRail chapters={lifeMapData.chapters} stars={visibleStars} selectedChapterId={selectedChapter?.id} />

          <div className="pointer-events-auto absolute inset-x-4 top-[6.25rem] z-30 flex gap-2 overflow-x-auto md:left-6 md:right-auto md:top-auto md:bottom-6">
            {availableFilters.map((item) => <button key={item.type} type="button" onClick={() => setFilterByType(item.type)} className={`rounded-full px-3 py-2 text-xs backdrop-blur-md ${filterByType === item.type ? "bg-white/18 text-white" : "bg-white/[0.07] text-white/62"}`}>{item.label}</button>)}
          </div>

          <div className="pointer-events-auto absolute bottom-6 right-6 z-30 hidden gap-2 md:flex">
            <button type="button" onClick={() => setZoomLevel(zoomLevel - 0.1)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/72">−</button>
            <button type="button" onClick={() => setZoomLevel(1)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/72">Reset</button>
            <button type="button" onClick={() => setZoomLevel(zoomLevel + 0.1)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/72">+</button>
          </div>

          <LifeMapStarDetail star={selectedStar} onClose={clearSelectedStar} onOpenPassport={onOpenPassport} onReflect={onReflectStar} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
