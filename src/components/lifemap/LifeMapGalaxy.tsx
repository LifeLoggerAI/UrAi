"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { LifeMapStar, LifeMapStarType } from "@/lib/lifemap/lifeMapTypes";
import { useUraiLifeMap } from "@/providers/UraiLifeMapProvider";
import { ConstellationLayer } from "./ConstellationLayer";
import { LifeMapChapterRail } from "./LifeMapChapterRail";
import { LifeMapStarDetail } from "./LifeMapStarDetail";
import { LifeMapStarNode } from "./LifeMapStarNode";
import "@/app/lifemap-polish.css"; // Import the new polish styles

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
  // ... other filters
];

export function LifeMapGalaxy({ isOpen, onClose, moodState = "luminous", onOpenPassport, onReflectStar }: LifeMapGalaxyProps) {
  const reduceMotion = useReducedMotion();
  const {
    lifeMapData,
    selectedStar,
    selectStar,
    selectedChapter,
    clearSelectedStar,
  } = useUraiLifeMap();

  const [zoomLevel, setZoomLevel] = useState(1);

  // ... useEffect hooks

  const visibleStars = useMemo(() => {
    // ... filtering logic
    return lifeMapData.stars;
  }, [lifeMapData.stars]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section
          // ... animation props
          className="urai-map fixed inset-0 z-[70] overflow-hidden bg-[#02040d] text-white"
        >
          {/* ... background elements */}

          <header className="map-header pointer-events-auto z-30 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">URAI Life Map</p>
              <h2 className="mt-1 text-xl font-semibold text-white md:text-2xl">The sky remembers gently.</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Life Map" className="glass-button h-12 min-w-[7rem] text-sm font-medium">
              Home
            </button>
          </header>

          <div className="galaxy-container absolute inset-0 overflow-auto pt-32 md:overflow-hidden md:pt-24">
            <motion.div
              className="relative min-h-[760px] w-full origin-center md:h-full md:min-h-0"
              style={{ scale: zoomLevel }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ConstellationLayer stars={visibleStars} chapters={lifeMapData.chapters} selectedChapterId={selectedChapter?.id} />
              {visibleStars.map((star) => (
                <LifeMapStarNode key={star.id} star={star} isSelected={selectedStar?.id === star.id} onSelect={selectStar} />
              ))}
            </motion.div>
          </div>

          {/* ... chapter rail, filters, and zoom controls ... */}

          <LifeMapStarDetail star={selectedStar} onClose={clearSelectedStar} onOpenPassport={onOpenPassport} onReflect={onReflectStar} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
