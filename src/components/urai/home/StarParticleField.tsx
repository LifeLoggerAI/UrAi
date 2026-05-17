"use client";

import { useMemo } from "react";
import { useReducedMotionSafe } from "@/components/urai/hooks/useReducedMotionSafe";

export function StarParticleField({ density = 1, className = "" }: { density?: number; className?: string }) {
  const reduced = useReducedMotionSafe();
  const stars = useMemo(() => {
    const count = reduced ? Math.round(36 * density) : Math.round(110 * density);
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      x: (index * 73) % 100,
      y: (index * 41) % 100,
      size: 1 + ((index * 17) % 28) / 18,
      delay: ((index * 11) % 40) / 10,
      opacity: 0.18 + ((index * 19) % 62) / 100,
    }));
  }, [density, reduced]);

  return (
    <div className={`urai-star-field ${className}`} aria-hidden>
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
