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

const categoryObjectLabel: Record<MemoryStar["category"], string> = {
  threshold: "Threshold flare",
  becoming: "Becoming comet",
  recovery: "Recovery lantern",
  relationship: "Relationship constellation",
  dream: "Dream nebula",
  mirror: "Mirror crystal",
};

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
            className={`urai-memory-portal-anchor is-${selected.category}`}
            style={{ left: `calc(50% + ${selected.x}px)`, top: `calc(50% + ${selected.y}px)` }}
            initial={{ scale: 0.12, opacity: 0, x: "-50%", y: "-50%", rotate: -8 }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%", rotate: 0 }}
            exit={{ scale: 0.28, opacity: 0, x: "-50%", y: "-50%", rotate: 8 }}
            transition={{ duration: 0.64, ease: cinematicEase }}
          >
            <div className="urai-portal-thread-tether" />
            <div className="urai-memory-portal-orbit orbit-one" />
            <div className="urai-memory-portal-orbit orbit-two" />
            <div className="urai-memory-portal-object" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div className="urai-memory-portal" style={{ borderColor: emotionPalette[selected.category].border }}>
              <div
                className="urai-portal-image"
                style={selected.memoryImageUrl || selected.symbolicImageUrl ? { backgroundImage: `url(${selected.memoryImageUrl ?? selected.symbolicImageUrl})` } : fallbackStyle(selected)}
              />
              <div className="urai-portal-ring" />
              <div className="urai-confidence-ring" style={{ background: `conic-gradient(${emotionPalette[selected.category].core} ${selected.confidence * 3.6}deg, rgba(255,255,255,.08) 0deg)` }} />
            </div>
            <div className="urai-portal-caption">
              <strong>{categoryObjectLabel[selected.category]}</strong>
              <span>{selected.confidence}% signal clarity</span>
            </div>
          </motion.div>
          <motion.aside className="urai-memory-detail glass-panel" initial={{ opacity: 0, y: 18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.38, delay: 0.24, ease: cinematicEase }}>
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
              <button type="button" onClick={onReplay}>Replay</button>
              <button type="button" onClick={onToggleMirror}>Mirror</button>
              <button type="button">Recount</button>
              <button type="button">Create Ritual</button>
              <button type="button">Private</button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
