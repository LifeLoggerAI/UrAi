"use client";

import { useMemo } from "react";

import { ResolvedVisual } from "@/components/urai/ResolvedVisual";
import { resolveUraiAssets } from "@/lib/urai-assets";

const BACKDROP_SLOTS = [
  "home.sky.background",
  "home.sky.clouds",
  "home.aura.blob",
  "home.ground.base",
  "spatial.star.default",
  "spatial.bloom.memory",
] as const;

type Props = {
  mode?: "home" | "lifemap" | "bloom";
};

export function UraiVisualBackdrop({ mode = "home" }: Props) {
  const assets = useMemo(() => resolveUraiAssets(BACKDROP_SLOTS), []);

  return (
    <div className={`urai-visual-backdrop ${mode}`} aria-hidden="true">
      <ResolvedVisual asset={assets["home.sky.background"]} className="layer sky" />
      <ResolvedVisual asset={assets["home.sky.clouds"]} className="layer clouds" />
      <ResolvedVisual asset={assets["home.aura.blob"]} className="layer aura" />
      <ResolvedVisual asset={assets["home.ground.base"]} className="layer ground" />
      <div className="starfield">
        {Array.from({ length: 18 }).map((_, index) => (
          <ResolvedVisual key={index} asset={assets["spatial.star.default"]} className={`resolved-star star-${index + 1}`} />
        ))}
      </div>
      {mode === "bloom" || mode === "lifemap" ? (
        <ResolvedVisual asset={assets["spatial.bloom.memory"]} className="layer bloom" />
      ) : null}

      <style jsx>{`
        .urai-visual-backdrop {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          background: #000;
        }
        .layer {
          position: absolute;
          inset: 0;
        }
        .layer :global(img),
        .layer :global(svg),
        .resolved-star :global(img),
        .resolved-star :global(svg) {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sky {
          opacity: 1;
        }
        .clouds {
          opacity: 0.22;
          mix-blend-mode: screen;
          filter: blur(1.2px);
          transform: scale(1.05);
        }
        .aura {
          inset: 6% 18% 8%;
          opacity: 0.34;
          filter: blur(10px) saturate(1.2);
          mix-blend-mode: screen;
        }
        .ground {
          top: auto;
          height: 42%;
          bottom: 0;
          opacity: 0.54;
          filter: saturate(1.1);
        }
        .bloom {
          inset: 12% 18%;
          opacity: 0.32;
          filter: blur(12px) saturate(1.35);
          mix-blend-mode: screen;
          animation: bloomPulse 7s ease-in-out infinite;
        }
        .starfield {
          position: absolute;
          inset: 0;
          opacity: 0.74;
          transition: opacity 600ms ease, transform 1200ms cubic-bezier(.16, 1, .3, 1);
        }
        .resolved-star {
          position: absolute;
          width: 18px;
          height: 18px;
          filter: drop-shadow(0 0 16px rgba(255,255,255,.62));
          opacity: 0.74;
          animation: starTwinkle 5s ease-in-out infinite;
        }
        .lifemap .starfield,
        .bloom .starfield {
          opacity: 0.92;
          transform: scale(1.35);
        }
        .star-1 { left: 12%; top: 16%; width: 10px; height: 10px; animation-delay: -0.4s; }
        .star-2 { left: 24%; top: 28%; width: 16px; height: 16px; animation-delay: -1.3s; }
        .star-3 { left: 36%; top: 18%; width: 13px; height: 13px; animation-delay: -2.2s; }
        .star-4 { left: 48%; top: 12%; width: 21px; height: 21px; animation-delay: -3s; }
        .star-5 { left: 62%; top: 25%; width: 15px; height: 15px; animation-delay: -0.8s; }
        .star-6 { left: 76%; top: 18%; width: 11px; height: 11px; animation-delay: -2.9s; }
        .star-7 { left: 84%; top: 37%; width: 19px; height: 19px; animation-delay: -1.7s; }
        .star-8 { left: 18%; top: 48%; width: 14px; height: 14px; animation-delay: -2.4s; }
        .star-9 { left: 33%; top: 58%; width: 22px; height: 22px; animation-delay: -0.2s; }
        .star-10 { left: 52%; top: 48%; width: 12px; height: 12px; animation-delay: -3.6s; }
        .star-11 { left: 66%; top: 57%; width: 18px; height: 18px; animation-delay: -1.1s; }
        .star-12 { left: 80%; top: 62%; width: 10px; height: 10px; animation-delay: -2.1s; }
        .star-13 { left: 10%; top: 72%; width: 12px; height: 12px; animation-delay: -3.1s; }
        .star-14 { left: 27%; top: 76%; width: 17px; height: 17px; animation-delay: -0.9s; }
        .star-15 { left: 43%; top: 82%; width: 11px; height: 11px; animation-delay: -1.8s; }
        .star-16 { left: 59%; top: 76%; width: 20px; height: 20px; animation-delay: -2.8s; }
        .star-17 { left: 72%; top: 83%; width: 13px; height: 13px; animation-delay: -3.8s; }
        .star-18 { left: 90%; top: 78%; width: 16px; height: 16px; animation-delay: -1.5s; }
        @keyframes starTwinkle {
          0%, 100% { opacity: .42; transform: scale(.86); }
          50% { opacity: .96; transform: scale(1.15); }
        }
        @keyframes bloomPulse {
          0%, 100% { opacity: .18; transform: scale(.94); }
          50% { opacity: .4; transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .resolved-star,
          .bloom {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
