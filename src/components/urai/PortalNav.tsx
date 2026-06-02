"use client";

import { motion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { getAssetPath, type UraiAssetKey } from "@/lib/assets/uraiAssetManifest";
import { SafeLayerImage } from "@/components/common/SafeLayerImage";

type PortalNavProps = {
  activeScene: UraiScene;
  onNavigate: (scene: UraiScene) => void;
  onReturnHome: () => void;
};

const portals: Array<{ id: UraiScene; label: string; glyph: string; assetKey?: UraiAssetKey }> = [
  { id: "life-map", label: "Life Map", glyph: "*", assetKey: "galaxyPortal" },
  { id: "ground", label: "Ground", glyph: "o" },
  { id: "focus", label: "Focus", glyph: "<>" },
  { id: "replay", label: "Replay", glyph: "@", assetKey: "legacyPortal" },
];

export function PortalNav({ activeScene, onNavigate, onReturnHome }: PortalNavProps) {
  const theme = getSceneTheme(activeScene);

  return (
    <nav aria-label="URAI scene portals" className="relative z-20 mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-5">
      {activeScene !== "home" && (
        <motion.button
          type="button"
          onClick={onReturnHome}
          className="group rounded-full border border-white/12 bg-white/[0.045] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 shadow-2xl backdrop-blur-xl transition hover:border-white/28 hover:bg-white/[0.075] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
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
            className="group relative flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.045] px-3 py-2 text-sm text-white/80 shadow-2xl backdrop-blur-xl transition hover:border-white/28 hover:bg-white/[0.075] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-70"
            disabled={isActive}
            style={{ boxShadow: isActive ? `0 0 28px ${theme.glow}` : undefined }}
            whileHover={!isActive ? { y: -2, scale: 1.02 } : undefined}
            whileTap={!isActive ? { scale: 0.98 } : undefined}
          >
            <span
              className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/15 text-xs"
              style={{ color: isActive ? theme.accent : "rgba(255,255,255,0.72)", background: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)" }}
            >
              {portal.assetKey ? (
                <SafeLayerImage src={getAssetPath(portal.assetKey)} alt="" className="absolute inset-0 h-full w-full object-contain opacity-80 mix-blend-screen" />
              ) : null}
              <span className="relative z-10">{portal.glyph}</span>
            </span>
            <span className="hidden text-xs uppercase tracking-[0.18em] md:inline">{portal.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
