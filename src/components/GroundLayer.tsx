"use client";

import React from "react";
import { coerceGroundTier, resolveGroundTier, type GroundSignalState, type GroundTier } from "@/lib/ground-system";

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

const BLOOM_SCALES = [0.72, 0.95, 0.82, 1.12, 0.68, 1.04, 0.88];
const ROOT_ARCS = [
  { left: "12%", width: "28%", delay: "0s", opacity: 0.34 },
  { left: "32%", width: "36%", delay: "0.8s", opacity: 0.42 },
  { left: "58%", width: "30%", delay: "1.4s", opacity: 0.3 },
];
const PARTICLES = Array.from({ length: 16 }).map((_, index) => ({
  top: `${(index * 23) % 100}%`,
  left: `${(index * 37) % 100}%`,
  opacity: 0.35 + (index % 5) * 0.1,
  delay: `${(index % 6) * 0.4}s`,
}));

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
      <div className="ground-system w-full h-[42%] relative overflow-hidden">
        <div
          className="ground-base absolute inset-0"
          style={{
            background:
              tier === 1
                ? "radial-gradient(ellipse at bottom, #1a1a1a 0%, #050505 58%, transparent 82%)"
                : tier === 2
                ? "radial-gradient(ellipse at bottom, #1f2a1f 0%, #050705 58%, transparent 82%)"
                : tier === 3
                ? "radial-gradient(ellipse at bottom, #243824 0%, #061006 58%, transparent 82%)"
                : tier === 4
                ? "radial-gradient(ellipse at bottom, #2d4d2d 0%, #071407 58%, transparent 82%)"
                : "radial-gradient(ellipse at bottom, #355f35 0%, #071607 58%, transparent 82%)"
          }}
        />

        <div
          className="ground-aura absolute inset-0"
          style={{
            background:
              tier >= 3
                ? "radial-gradient(ellipse at 50% 72%, rgba(120,255,160,0.22), transparent 54%), radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.08), transparent 32%)"
                : "radial-gradient(ellipse at 50% 88%, rgba(255,255,255,0.05), transparent 40%)"
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-24 opacity-70">
          {ROOT_ARCS.map((arc, index) => (
            <span
              key={index}
              className="ground-root absolute bottom-3 h-10 rounded-[999px] border-t border-emerald-200/30"
              style={{
                left: arc.left,
                width: arc.width,
                opacity: tier >= 2 ? arc.opacity : arc.opacity * 0.45,
                animationDelay: arc.delay,
              }}
            />
          ))}
        </div>

        {tier >= 4 && (
          <div className="absolute inset-0 flex items-end justify-center pb-7">
            <div className="flex gap-3">
              {BLOOM_SCALES.slice(0, tier === 5 ? 7 : 4).map((scale, index) => (
                <div
                  key={index}
                  className="ground-bloom w-2 rounded-full"
                  style={{
                    height: tier === 5 ? "2.1rem" : "1.65rem",
                    background: tier === 5 ? "#baffc9" : "#7cff9e",
                    boxShadow: tier === 5 ? "0 0 10px rgba(186,255,201,0.8), 0 0 26px rgba(120,255,160,0.3)" : "0 0 6px rgba(124,255,158,0.6)",
                    transform: `scaleY(${scale})`,
                    animationDelay: `${index * 0.22}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {tier === 5 && (
          <div className="absolute inset-0">
            {PARTICLES.map((particle, index) => (
              <div
                key={index}
                className="ground-particle absolute w-1 h-1 rounded-full"
                style={{
                  background: "#e6fff2",
                  top: particle.top,
                  left: particle.left,
                  opacity: particle.opacity,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .ground-system {
          mask-image: linear-gradient(to top, black 0%, black 66%, transparent 100%);
        }

        .ground-base,
        .ground-aura {
          transition: opacity 800ms ease, transform 1200ms ease;
        }

        .ground-aura {
          animation: groundBreath 7s ease-in-out infinite;
        }

        .ground-root {
          transform-origin: center bottom;
          animation: rootPulse 5.5s ease-in-out infinite;
        }

        .ground-bloom {
          transform-origin: bottom center;
          animation: bloomSway 4.8s ease-in-out infinite;
        }

        .ground-particle {
          box-shadow: 0 0 10px rgba(230,255,242,0.85), 0 0 20px rgba(120,255,160,0.35);
          animation: particleLift 6s ease-in-out infinite;
        }

        @keyframes groundBreath {
          0%, 100% { opacity: 0.72; transform: scaleY(0.96); }
          50% { opacity: 1; transform: scaleY(1.04); }
        }

        @keyframes rootPulse {
          0%, 100% { transform: scaleX(0.92); filter: drop-shadow(0 0 0 rgba(120,255,160,0)); }
          50% { transform: scaleX(1.06); filter: drop-shadow(0 0 8px rgba(120,255,160,0.28)); }
        }

        @keyframes bloomSway {
          0%, 100% { translate: 0 0; opacity: 0.78; }
          50% { translate: 0 -0.22rem; opacity: 1; }
        }

        @keyframes particleLift {
          0%, 100% { transform: translateY(0) scale(0.9); opacity: 0.28; }
          50% { transform: translateY(-1.5rem) scale(1.1); opacity: 0.9; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ground-aura,
          .ground-root,
          .ground-bloom,
          .ground-particle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
