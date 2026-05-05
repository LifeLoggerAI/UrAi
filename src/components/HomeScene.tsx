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

    const timer = window.setTimeout(() => setMode("lifemap"), 1450);
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

      <div className="ambient-drift" aria-hidden />
      <div className="sky-breath" aria-hidden />

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

      <div className="parallax-field parallax-near" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="parallax-field parallax-far" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>

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

        .ambient-drift,
        .sky-breath {
          position: absolute;
          inset: -8%;
          z-index: 4;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .ambient-drift {
          background:
            radial-gradient(circle at 18% 22%, rgba(125, 211, 252, 0.12), transparent 18%),
            radial-gradient(circle at 78% 30%, rgba(196, 181, 253, 0.1), transparent 22%),
            radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.06), transparent 26%);
          mix-blend-mode: screen;
          opacity: 0.75;
          animation: ambientDrift 18s ease-in-out infinite alternate;
        }

        .sky-breath {
          z-index: 5;
          background: radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.13), transparent 18%);
          mix-blend-mode: screen;
          opacity: 0.32;
          animation: skyBreath 6.5s ease-in-out infinite;
        }

        .sky-layer {
          object-fit: cover;
          z-index: 1;
          animation: skyIdle 16s ease-in-out infinite alternate;
          transition: transform 1450ms cubic-bezier(0.16, 1, 0.3, 1), filter 1450ms ease, opacity 900ms ease;
        }

        .ground-layer {
          object-fit: cover;
          z-index: 2;
          animation: groundIdle 18s ease-in-out infinite alternate;
          transition: transform 1100ms cubic-bezier(0.16, 1, 0.3, 1), opacity 900ms ease, filter 900ms ease;
        }

        .avatar-layer {
          object-fit: contain;
          z-index: 3;
          animation: avatarFloat 7.5s ease-in-out infinite;
          transition: transform 1100ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease, filter 800ms ease;
        }

        .parallax-field {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          opacity: 0.65;
          overflow: hidden;
        }

        .parallax-field span {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.7), 0 0 32px rgba(125, 211, 252, 0.35);
        }

        .parallax-near span:nth-child(1) { left: 18%; top: 26%; width: 0.22rem; height: 0.22rem; animation: nearDrift 11s ease-in-out infinite alternate; }
        .parallax-near span:nth-child(2) { left: 72%; top: 38%; width: 0.18rem; height: 0.18rem; animation: nearDrift 13s ease-in-out infinite alternate-reverse; }
        .parallax-near span:nth-child(3) { left: 52%; top: 16%; width: 0.16rem; height: 0.16rem; animation: nearDrift 10s ease-in-out infinite alternate; }
        .parallax-far span:nth-child(1) { left: 28%; top: 14%; width: 0.12rem; height: 0.12rem; animation: farDrift 18s ease-in-out infinite alternate; }
        .parallax-far span:nth-child(2) { left: 80%; top: 22%; width: 0.1rem; height: 0.1rem; animation: farDrift 20s ease-in-out infinite alternate-reverse; }
        .parallax-far span:nth-child(3) { left: 64%; top: 62%; width: 0.11rem; height: 0.11rem; animation: farDrift 17s ease-in-out infinite alternate; }
        .parallax-far span:nth-child(4) { left: 12%; top: 58%; width: 0.09rem; height: 0.09rem; animation: farDrift 21s ease-in-out infinite alternate-reverse; }

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
          transition: opacity 800ms ease, transform 1450ms cubic-bezier(0.16, 1, 0.3, 1);
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
          animation-play-state: paused;
          transform: scale(2.42) translateY(10%);
          filter: saturate(1.25) brightness(1.12) blur(1px);
        }

        .home-scene.is-transitioning .ground-layer {
          animation-play-state: paused;
          opacity: 0;
          transform: scale(1.2) translateY(18%);
          filter: blur(8px);
        }

        .home-scene.is-transitioning .avatar-layer {
          animation-play-state: paused;
          opacity: 0;
          transform: scale(0.9) translateY(8%);
          filter: blur(10px);
        }

        .home-scene.is-transitioning .ambient-drift,
        .home-scene.is-transitioning .sky-breath {
          opacity: 1;
          transform: scale(1.18);
        }

        .home-scene.is-transitioning .parallax-near {
          opacity: 1;
          transform: scale(1.5) translateY(-5%);
          transition: transform 1450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease;
        }

        .home-scene.is-transitioning .parallax-far {
          opacity: 1;
          transform: scale(1.25) translateY(-2%);
          transition: transform 1450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease;
        }

        .home-scene.is-transitioning .star-tunnel {
          opacity: 1;
          transform: scale(1.7);
        }

        .home-scene.is-transitioning .transition-vignette {
          opacity: 1;
        }

        .home-scene.is-transitioning .tap-hint {
          transform: translateX(-50%) translateY(-0.35rem);
          opacity: 0.92;
        }

        @keyframes skyIdle {
          from { transform: scale(1.015) translate3d(-0.35%, -0.25%, 0); }
          to { transform: scale(1.045) translate3d(0.45%, 0.35%, 0); }
        }

        @keyframes groundIdle {
          from { transform: scale(1.01) translate3d(0.2%, 0.1%, 0); }
          to { transform: scale(1.025) translate3d(-0.25%, 0.35%, 0); }
        }

        @keyframes avatarFloat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -0.65%, 0) scale(1.006); }
        }

        @keyframes ambientDrift {
          from { transform: translate3d(-1.5%, -0.8%, 0) scale(1); opacity: 0.52; }
          to { transform: translate3d(1.2%, 0.9%, 0) scale(1.08); opacity: 0.78; }
        }

        @keyframes skyBreath {
          0%, 100% { transform: scale(0.92); opacity: 0.22; }
          50% { transform: scale(1.08); opacity: 0.38; }
        }

        @keyframes nearDrift {
          from { transform: translate3d(-0.35rem, -0.25rem, 0); opacity: 0.55; }
          to { transform: translate3d(0.45rem, 0.3rem, 0); opacity: 0.95; }
        }

        @keyframes farDrift {
          from { transform: translate3d(0.2rem, -0.18rem, 0); opacity: 0.35; }
          to { transform: translate3d(-0.18rem, 0.22rem, 0); opacity: 0.7; }
        }

        @media (prefers-reduced-motion: reduce) {
          .scene-layer,
          .ambient-drift,
          .sky-breath,
          .parallax-field,
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
