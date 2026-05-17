"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cinematicEase } from "@/components/urai/motion/ascentMotion";
import { emotionPalette } from "@/components/urai/data/emotionPalette";
import type { MemoryStar } from "@/components/urai/data/memoryStars";

function fallbackStyle(star: MemoryStar) {
  const palette = emotionPalette[star.category];
  return {
    background:
      `radial-gradient(circle at 38% 32%, rgba(255,255,255,.72), transparent 7%), ` +
      `radial-gradient(circle at 50% 48%, ${palette.halo}, transparent 32%), ` +
      `radial-gradient(circle at 50% 80%, ${palette.nebula}, transparent 44%), ` +
      "linear-gradient(145deg, rgba(3,10,25,.88), rgba(8,20,45,.62))",
  };
}

export function SelectedStarPortal({
  selected,
  mode,
  onClose,
  onReplay,
  onToggleMirror,
}: {
  selected: MemoryStar | null;
  mode: "default" | "replay" | "mirror";
  onClose: () => void;
  onReplay: () => void;
  onToggleMirror: () => void;
}) {
  return (
    <AnimatePresence>
      {selected && (
        <motion.div className="urai-selected-star-focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="urai-focus-scrim" onClick={onClose} aria-label="Close memory focus" />
          <motion.div
            className="urai-memory-portal-anchor"
            style={{ left: `calc(50% + ${selected.x}px)`, top: `calc(50% + ${selected.y}px)` }}
            initial={{ scale: 0.18, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0.28, opacity: 0, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.52, ease: cinematicEase }}
          >
            <div className="urai-portal-thread-tether" />
            <div className="urai-memory-portal" style={{ borderColor: emotionPalette[selected.category].border }}>
              <div
                className="urai-portal-image"
                style={selected.memoryImageUrl || selected.symbolicImageUrl ? { backgroundImage: `url(${selected.memoryImageUrl ?? selected.symbolicImageUrl})` } : fallbackStyle(selected)}
              />
              <div className="urai-portal-ring" />
              <div className="urai-confidence-ring" style={{ background: `conic-gradient(${emotionPalette[selected.category].core} ${selected.confidence * 3.6}deg, rgba(255,255,255,.08) 0deg)` }} />
            </div>
          </motion.div>
          <motion.aside className="urai-memory-detail glass-panel" initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.34, delay: 0.2, ease: cinematicEase }}>
            <div className="urai-detail-kicker">{emotionPalette[selected.category].label} · {selected.dateLabel}</div>
            <h2>{selected.title}</h2>
            <p>{selected.narratorText}</p>
            <div className="urai-detail-meta">
              <span>Confidence {selected.confidence}%</span>
              <span>{selected.signalCount} passive signals</span>
              <span>{selected.privacy}</span>
            </div>
            {mode === "mirror" && <div className="urai-mirror-note">What this reflects: this memory is acting as a pattern mirror, not a diagnosis.</div>}
            <div className="urai-detail-actions">
              <button onClick={onReplay}>Replay</button>
              <button onClick={onToggleMirror}>Mirror</button>
              <button>Recount</button>
              <button>Create Ritual</button>
              <button>Private</button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
