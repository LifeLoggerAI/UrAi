"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";

type Density = "low" | "medium" | "high";

const particleCount: Record<Density, number> = { low: 26, medium: 48, high: 86 };

function deterministicParticle(index: number) {
  const x = (index * 37) % 100;
  const y = (index * 61) % 100;
  const size = 1 + ((index * 13) % 4);
  const delay = (index * 0.37) % 8;
  const duration = 10 + ((index * 7) % 16);
  return { x, y, size, delay, duration };
}

export function AmbientParticleLayer({ scene, density = "medium" }: { scene: UraiScene; density?: Density }) {
  const theme = getSceneTheme(scene);
  const reduceMotion = useReducedMotion();
  const count = reduceMotion ? Math.floor(particleCount[density] / 2) : particleCount[density];

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {Array.from({ length: count }).map((_, index) => {
        const particle = deterministicParticle(index);
        const isAccent = index % 3 === 0;
        return (
          <motion.span
            key={`${scene}-particle-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: isAccent ? theme.accent : "rgba(255,255,255,0.76)",
              boxShadow: `0 0 14px ${isAccent ? theme.glow : "rgba(255,255,255,0.35)"}`,
              opacity: scene === "focus" ? 0.35 : 0.58,
            }}
            animate={reduceMotion ? undefined : { y: [0, -24 - (index % 20), 0], x: [0, index % 2 === 0 ? 8 : -8, 0], opacity: [0.18, 0.72, 0.18] }}
            transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}
