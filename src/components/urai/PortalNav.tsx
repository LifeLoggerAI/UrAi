"use client";

import { motion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";

type PortalNavProps = {
  activeScene: UraiScene;
  onNavigate: (scene: UraiScene) => void;
  onReturnHome: () => void;
};

const portals: Array<{ id: UraiScene; label: string; glyph: string }> = [
  { id: "life-map", label: "Life Map", glyph: "*" },
  { id: "ground", label: "Ground", glyph: "o" },
  { id: "focus", label: "Focus", glyph: "<>" },
  { id: "replay", label: "Replay", glyph: "@" },
];

export function PortalNav({ activeScene, onNavigate, onReturnHome }: PortalNavProps) {
  const theme = getSceneTheme(activeScene);

  return (
    <nav aria-label="URAI scene portals" className="relative z-20 mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-5">
      {activeScene !== "home" && (
        <motion.button
          type="button"
          onClick={onReturnHome}
          className="group rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 shadow-2xl backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Home
        </motion.button>
      )}

      {portals.map((portal) => {
        const isActive = portal.id === activeScene;
        return (
          <motion.button
            key={portal.id}
            type="button"
            aria-label={`Enter ${portal.label}`}
            onClick={() => onNavigate(portal.id)}
            className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.055] px-4 py-2 text-sm text-white/80 shadow-2xl backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60"
            disabled={isActive}
            style={{ boxShadow: isActive ? `0 0 28px ${theme.glow}` : undefined }}
            whileHover={!isActive ? { y: -2, scale: 1.02 } : undefined}
            whileTap={!isActive ? { scale: 0.98 } : undefined}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-xs" style={{ color: isActive ? theme.accent : "rgba(255,255,255,0.72)", background: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)" }}>
              {portal.glyph}
            </span>
            <span className="hidden text-xs uppercase tracking-[0.18em] md:inline">{portal.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
