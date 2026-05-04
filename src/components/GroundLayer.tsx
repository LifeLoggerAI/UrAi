"use client";

import React from "react";
import { GroundSignalState, GroundTier, resolveGroundTier, coerceGroundTier } from "@/lib/ground-system";

type Props = {
  state?: GroundSignalState;
  forcedTier?: GroundTier | number | null;
  className?: string;
};

const TIER_CLASSES: Record<GroundTier, string> = {
  1: "opacity-80",
  2: "opacity-90",
  3: "opacity-100",
  4: "opacity-100",
  5: "opacity-100"
};

export default function GroundLayer({ state, forcedTier, className }: Props) {
  const coerced = coerceGroundTier(forcedTier);
  const tier: GroundTier = coerced ?? resolveGroundTier(state);

  return (
    <div
      aria-hidden
      className={[
        "absolute inset-0 pointer-events-none",
        "flex items-end justify-center",
        TIER_CLASSES[tier],
        className ?? ""
      ].join(" ")}
      data-ground-tier={tier}
    >
      <div className="w-full h-1/3 relative">
        {/* Base soil gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              tier === 1
                ? "radial-gradient(ellipse at bottom, #1a1a1a 0%, #000 70%)"
                : tier === 2
                ? "radial-gradient(ellipse at bottom, #1f2a1f 0%, #000 70%)"
                : tier === 3
                ? "radial-gradient(ellipse at bottom, #243824 0%, #000 70%)"
                : tier === 4
                ? "radial-gradient(ellipse at bottom, #2d4d2d 0%, #000 70%)"
                : "radial-gradient(ellipse at bottom, #355f35 0%, #000 70%)"
          }}
        />

        {/* Glow / vitality layer */}
        <div
          className="absolute inset-0"
          style={{
            background:
              tier >= 3
                ? "radial-gradient(ellipse at center, rgba(120,255,160,0.15), transparent 70%)"
                : "none"
          }}
        />

        {/* Bloom layer */}
        {tier >= 4 && (
          <div className="absolute inset-0 flex items-end justify-center pb-6">
            <div className="flex gap-3">
              {Array.from({ length: tier === 5 ? 7 : 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-6 rounded-full"
                  style={{
                    background: tier === 5 ? "#baffc9" : "#7cff9e",
                    boxShadow: tier === 5 ? "0 0 10px rgba(186,255,201,0.8)" : "0 0 6px rgba(124,255,158,0.6)",
                    transform: `scaleY(${0.6 + Math.random() * 0.6})`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mythic particles */}
        {tier === 5 && (
          <div className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: "#e6fff2",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
