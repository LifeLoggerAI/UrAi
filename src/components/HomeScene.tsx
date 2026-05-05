"use client";

import { useEffect, useState } from "react";
import LifeMapScene from "@/components/lifemap/LifeMapScene";

type HomeMode = "home" | "transitioning" | "lifemap";

export default function HomeScene() {
  const [mode, setMode] = useState<HomeMode>("home");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);

    onChange();
    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (mode !== "transitioning") return undefined;

    if (reduceMotion) {
      setMode("lifemap");
      return undefined;
    }

    const timer = window.setTimeout(() => setMode("lifemap"), 1350);
    return () => window.clearTimeout(timer);
  }, [mode, reduceMotion]);

  const openLifeMap = () => {
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setMode("home");
  };

  if (mode === "lifemap") {
    return (
      <div className="relative w-full h-dvh bg-black overflow-hidden">
        <LifeMapScene />
        <button
          type="button"
          onClick={returnHome}
          className="absolute left-4 top-4 z-50 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
          aria-label="Return to home scene"
        >
          Return home
        </button>
      </div>
    );
  }

  const isTransitioning = mode === "transitioning";

  return (
    <div className={`home-scene ${isTransitioning ? "is-transitioning" : ""}`}>
      <button
        type="button"
        onClick={openLifeMap}
        disabled={isTransitioning}
        className="sky-trigger"
        aria-label="Open URAI Life Map from the sky"
      >
        <span className="sr-only">Open URAI Life Map</span>
      </button>

      <video
        src="/assets/sky/sky-demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="scene-layer sky-layer"
      />
      <video
        src="/assets/ground/ground-demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="scene-layer ground-layer"
      />
      <video
        src="/assets/avatar/avatar-demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="scene-layer avatar-layer"
      />

      <div className="star-tunnel" aria-hidden>
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
      </div>

      <div className="transition-vignette" aria-hidden />

      <div className="tap-hint">
        {isTransitioning ? "Opening the Life Map..." : "Tap the sky to open your Life Map"}
      </div>

      <style jsx>{`
        .home-scene {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          background: #000;
          isolation: isolate;
        }

        .sky-trigger {
          position: absolute;
          inset: 0;
          z-index: 20;
          cursor: zoom-in;
          border: 0;
          background: transparent;
        }

        .sky-trigger:disabled {
          cursor: progress;
        }

        .scene-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          will-change: transform, opacity, filter;
        }

        .sky-layer {
          object-fit: cover;
          z-index: 1;
          transition: transform 1350ms cubic-bezier(0.16, 1, 0.3, 1), filter 1350ms ease, opacity 900ms ease;
        }

        .ground-layer {
          object-fit: cover;
          z-index: 2;
          transition: transform 1050ms cubic-bezier(0.16, 1, 0.3, 1), opacity 900ms ease, filter 900ms ease;
        }

        .avatar-layer {
          object-fit: contain;
          z-index: 3;
          transition: transform 1050ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease, filter 800ms ease;
        }

        .star-tunnel {
          position: absolute;
          inset: 0;
          z-index: 8;
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 32%, rgba(205, 225, 255, 0.45), transparent 6%),
            radial-gradient(circle at 42% 44%, rgba(170, 190, 255, 0.22), transparent 12%),
            radial-gradient(circle at 58% 48%, rgba(125, 211, 252, 0.18), transparent 14%);
          transition: opacity 800ms ease, transform 1350ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .star {
          position: absolute;
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 999px;
          background: white;
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.95), 0 0 42px rgba(125, 211, 252, 0.75);
          opacity: 0.85;
        }

        .star-one { left: 30%; top: 24%; }
        .star-two { left: 45%; top: 18%; width: 0.32rem; height: 0.32rem; }
        .star-three { left: 58%; top: 31%; width: 0.5rem; height: 0.5rem; }
        .star-four { left: 66%; top: 43%; width: 0.28rem; height: 0.28rem; }
        .star-five { left: 38%; top: 52%; width: 0.24rem; height: 0.24rem; }

        .transition-vignette {
          position: absolute;
          inset: 0;
          z-index: 9;
          opacity: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 35%, transparent 0%, rgba(5, 8, 22, 0.25) 35%, rgba(0, 0, 0, 0.92) 100%);
          transition: opacity 1200ms ease;
        }

        .tap-hint {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          z-index: 30;
          transform: translateX(-50%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.4);
          color: rgba(255, 255, 255, 0.85);
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          backdrop-filter: blur(8px);
          pointer-events: none;
          transition: opacity 500ms ease, transform 500ms ease;
        }

        .home-scene.is-transitioning .sky-layer {
          transform: scale(2.35) translateY(10%);
          filter: saturate(1.25) brightness(1.12) blur(1px);
        }

        .home-scene.is-transitioning .ground-layer {
          opacity: 0;
          transform: scale(1.2) translateY(18%);
          filter: blur(8px);
        }

        .home-scene.is-transitioning .avatar-layer {
          opacity: 0;
          transform: scale(0.9) translateY(8%);
          filter: blur(10px);
        }

        .home-scene.is-transitioning .star-tunnel {
          opacity: 1;
          transform: scale(1.6);
        }

        .home-scene.is-transitioning .transition-vignette {
          opacity: 1;
        }

        .home-scene.is-transitioning .tap-hint {
          transform: translateX(-50%) translateY(-0.35rem);
          opacity: 0.92;
        }

        @media (prefers-reduced-motion: reduce) {
          .scene-layer,
          .star-tunnel,
          .transition-vignette,
          .tap-hint {
            transition-duration: 0.01ms !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
