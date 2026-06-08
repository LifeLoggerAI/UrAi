"use client";

import { motion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { useInteractionSound } from "@/hooks/useInteractionSound";
import { useState } from "react";

// ... (SVG icon components remain the same)
// SVG Icons for portals
const LifeMapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const GroundIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const FocusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ReplayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
  </svg>
);

type PortalNavProps = {
  activeScene: UraiScene;
  onNavigate: (scene: UraiScene) => void;
  onReturnHome: () => void;
};

type PortalSoundScene = "life-map" | "ground" | "focus" | "replay";

const portals: Array<{ id: UraiScene; label: string; icon: React.ComponentType }> = [
  { id: "life-map", label: "Life Map", icon: LifeMapIcon },
  { id: "ground", label: "Ground", icon: GroundIcon },
  { id: "focus", label: "Focus", icon: FocusIcon },
  { id: "replay", label: "Replay", icon: ReplayIcon },
];

function toPortalSoundScene(scene: UraiScene): PortalSoundScene | null {
  if (scene === "life-map" || scene === "ground" || scene === "focus" || scene === "replay") return scene;
  return null;
}

export function PortalNav({ activeScene, onNavigate, onReturnHome }: PortalNavProps) {
  const theme = getSceneTheme(activeScene);
  const sound = useInteractionSound();
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);

  const returnHomeWithSound = async () => {
    await sound.playSoftTap();
    onReturnHome();
  };

  const navigateWithSound = async (scene: UraiScene) => {
    const portalScene = toPortalSoundScene(scene);
    if (portalScene) await sound.playPortalOpen(portalScene);
    else await sound.playSoftTap();
    onNavigate(scene);
  };

  return (
    <nav aria-label="URAI scene portals" className="relative z-20 mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-5 opacity-50 hover:opacity-100 transition-opacity duration-300">
      {activeScene !== "home" && (
        <motion.button type="button" onClick={returnHomeWithSound} className="group rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60 shadow-lg backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          Home
        </motion.button>
      )}
      {portals.map((portal) => {
        const isActive = portal.id === activeScene;
        const Icon = portal.icon;
        return (
          <motion.button 
            key={portal.id} 
            type="button" 
            aria-label={`Enter ${portal.label}`}
            onClick={() => navigateWithSound(portal.id)} 
            onMouseEnter={() => setHoveredPortal(portal.id)}
            onMouseLeave={() => setHoveredPortal(null)}
            className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-3 text-white/60 shadow-lg backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
            disabled={isActive} 
            style={{ boxShadow: isActive ? `0 0 20px ${theme.glow}` : undefined }} 
            whileHover={!isActive ? { y: -2, scale: 1.02 } : undefined} 
            whileTap={!isActive ? { scale: 0.98 } : undefined}
          >
            <Icon />
            {hoveredPortal === portal.id && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/50 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
                {portal.label}
              </span>
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
