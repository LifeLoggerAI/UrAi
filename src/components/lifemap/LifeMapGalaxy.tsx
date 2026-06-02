"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import { useUraiLifeMap } from "@/providers/UraiLifeMapProvider";
import { ConstellationLayer } from "./ConstellationLayer";
import { LifeMapChapterRail } from "./LifeMapChapterRail";
import { LifeMapStarDetail } from "./LifeMapStarDetail";
import { LifeMapStarNode } from "./LifeMapStarNode";

type LifeMapGalaxyProps = {
  isOpen: boolean;
  onClose: () => void;
  moodState?: GenesisMoodState;
};

export function LifeMapGalaxy({ isOpen, onClose, moodState = "luminous" }: LifeMapGalaxyProps) {
  const { lifeMapData, selectedStar, selectedChapter, selectStar, clearSelectedStar, regenerateLifeMap } = useUraiLifeMap();

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

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="URAI Life Map" className="fixed inset-0 z-[70] overflow-hidden bg-[#030511] text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(61,84,151,0.42),transparent_34%),linear-gradient(180deg,#071026_0%,#02040d_100%)]" />
          <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 md:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Life Map</p>
              <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">The sky remembers gently.</h2>
              <p className="mt-1 max-w-xl text-sm text-white/58">The map is quiet. Open layers in Passport when you want more to appear.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Life Map" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-md">Close</button>
          </header>
          <div className="absolute inset-0 overflow-auto px-6 py-24 md:overflow-hidden">
            <div className="relative min-h-[760px] w-full md:h-full md:min-h-0">
              <ConstellationLayer stars={lifeMapData.stars} chapters={lifeMapData.chapters} selectedChapterId={selectedChapter?.id} />
              {lifeMapData.stars.map((star) => <LifeMapStarNode key={star.id} star={star} isSelected={selectedStar?.id === star.id} onSelect={selectStar} />)}
            </div>
          </div>
          <LifeMapChapterRail chapters={lifeMapData.chapters} stars={lifeMapData.stars} selectedChapterId={selectedChapter?.id} />
          <LifeMapStarDetail star={selectedStar} onClose={clearSelectedStar} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
