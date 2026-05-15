"use client";

import { useEffect, useMemo, useState } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { ResolvedVisual } from "@/components/urai/ResolvedVisual";
import { UraiVisualBackdrop } from "@/components/urai/UraiVisualBackdrop";
import { resolveUraiAssets } from "@/lib/urai-assets";

type Mode = "home" | "transitioning" | "lifemap";

const HOME_SLOTS = [
  "home.orb.core",
  "home.silhouette.body",
  "spatial.star.default",
] as const;

const TONE_COPY = {
  home: "A quiet pattern is becoming visible.",
  transitioning: "The sky is opening.",
  lifemap: "The memory field is active.",
};

export default function UraiResolvedHomeScene() {
  const [mode, setMode] = useState<Mode>("home");
  const [reduceMotion, setReduceMotion] = useState(false);
  const assets = useMemo(() => resolveUraiAssets(HOME_SLOTS), []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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
    if (mode !== "home") return;
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => setMode("home");

  if (mode === "lifemap") {
    return (
      <main className="resolved-shell lifemap-shell">
        <UraiVisualBackdrop mode="lifemap" />
        <div className="lifemap-layer">
          <LifeMapScene />
        </div>
        <button type="button" className="return-home" onClick={returnHome}>
          Return home
        </button>
        <style jsx>{shellStyles}</style>
      </main>
    );
  }

  const isTransitioning = mode === "transitioning";

  return (
    <main className={`resolved-shell ${isTransitioning ? "is-transitioning" : ""}`} onClick={openLifeMap}>
      <UraiVisualBackdrop mode={isTransitioning ? "lifemap" : "home"} />
      <button type="button" className="sky-hitbox" onClick={openLifeMap} aria-label="Open URAI Life Map" />

      <section className="home-stage" aria-label="URAI resolved visual home scene">
        <div className="silhouette-wrap" aria-hidden="true">
          <ResolvedVisual asset={assets["home.silhouette.body"]} className="silhouette-asset" />
        </div>

        <button type="button" className="orb-button" onClick={(event) => { event.stopPropagation(); openLifeMap(); }} aria-label="Ascend into Life Map">
          <ResolvedVisual asset={assets["home.orb.core"]} className="orb-asset" />
          <span className="orb-fallback-glow" />
        </button>

        <div className="foreground-stars" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, index) => (
            <ResolvedVisual key={index} asset={assets["spatial.star.default"]} className={`foreground-star foreground-star-${index + 1}`} />
          ))}
        </div>

        <p className="sky-whisper" aria-live="polite">{TONE_COPY[mode]}</p>
        <p className="hint">Click the sky</p>
      </section>

      <style jsx>{shellStyles}</style>
    </main>
  );
}

const shellStyles = `
  .resolved-shell {
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
    isolation: isolate;
    background: #000;
    color: white;
    cursor: zoom-in;
    user-select: none;
  }
  .lifemap-shell {
    cursor: default;
  }
  .lifemap-layer {
    position: relative;
    z-index: 2;
    min-height: 100dvh;
  }
  .return-home {
    position: fixed;
    left: 1rem;
    top: 1rem;
    z-index: 60;
    border: 1px solid rgba(255,255,255,.24);
    border-radius: 999px;
    background: rgba(0,0,0,.42);
    color: rgba(255,255,255,.88);
    padding: .55rem .9rem;
    font-size: .85rem;
    backdrop-filter: blur(12px);
  }
  .sky-hitbox {
    position: fixed;
    inset: 0 0 42% 0;
    z-index: 12;
    border: 0;
    background: transparent;
    cursor: zoom-in;
  }
  .home-stage {
    position: relative;
    z-index: 20;
    min-height: 100dvh;
    display: grid;
    place-items: center;
    pointer-events: none;
  }
  .silhouette-wrap {
    position: fixed;
    left: calc(50% - min(16vw, 230px));
    bottom: 4vh;
    z-index: 22;
    width: clamp(150px, 13vw, 230px);
    height: clamp(360px, 58vh, 610px);
    opacity: .72;
    filter: drop-shadow(0 0 32px rgba(126,231,255,.18));
    transition: transform 1200ms cubic-bezier(.16, 1, .3, 1), opacity 900ms ease, filter 900ms ease;
  }
  .silhouette-wrap :global(img),
  .silhouette-wrap :global(svg) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .orb-button {
    position: fixed;
    left: 50%;
    top: 74%;
    z-index: 30;
    width: clamp(128px, 11vw, 180px);
    height: clamp(128px, 11vw, 180px);
    transform: translate(-50%, -50%);
    border: 0;
    border-radius: 999px;
    background: transparent;
    cursor: zoom-in;
    pointer-events: auto;
    transition: transform 1200ms cubic-bezier(.16, 1, .3, 1), opacity 900ms ease, filter 900ms ease;
  }
  .orb-button :global(img),
  .orb-button :global(svg) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 36px rgba(126,231,255,.72));
  }
  .orb-fallback-glow {
    position: absolute;
    inset: -54%;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255,255,255,.24), rgba(126,231,255,.18) 32%, rgba(123,97,255,.08) 55%, transparent 72%);
    filter: blur(18px);
    animation: orbPulse 5.5s ease-in-out infinite;
  }
  .foreground-stars {
    position: fixed;
    inset: 0;
    z-index: 24;
    pointer-events: none;
    opacity: .82;
    transition: transform 1200ms cubic-bezier(.16, 1, .3, 1), opacity 900ms ease;
  }
  .foreground-star {
    position: absolute;
    width: 20px;
    height: 20px;
    filter: drop-shadow(0 0 18px rgba(255,255,255,.76));
    animation: starFloat 7s ease-in-out infinite;
  }
  .foreground-star :global(img),
  .foreground-star :global(svg) {
    width: 100%;
    height: 100%;
  }
  .foreground-star-1 { left: 28%; top: 24%; width: 16px; height: 16px; animation-delay: -.4s; }
  .foreground-star-2 { left: 42%; top: 17%; width: 12px; height: 12px; animation-delay: -1.2s; }
  .foreground-star-3 { left: 58%; top: 26%; width: 22px; height: 22px; animation-delay: -2.4s; }
  .foreground-star-4 { left: 72%; top: 39%; width: 14px; height: 14px; animation-delay: -3.1s; }
  .foreground-star-5 { left: 35%; top: 50%; width: 13px; height: 13px; animation-delay: -2s; }
  .foreground-star-6 { left: 51%; top: 10%; width: 18px; height: 18px; animation-delay: -1.6s; }
  .foreground-star-7 { left: 66%; top: 56%; width: 11px; height: 11px; animation-delay: -2.8s; }
  .sky-whisper {
    position: fixed;
    left: 50%;
    top: 20%;
    z-index: 40;
    width: min(540px, calc(100vw - 2rem));
    transform: translateX(-50%);
    margin: 0;
    text-align: center;
    color: rgba(255,255,255,.78);
    font-size: clamp(1rem, 1.4vw, 1.28rem);
    line-height: 1.45;
    text-shadow: 0 2px 28px rgba(0,0,0,.9);
  }
  .hint {
    position: fixed;
    left: 50%;
    top: 27%;
    z-index: 40;
    transform: translateX(-50%);
    margin: 0;
    color: rgba(255,255,255,.28);
    font-size: .62rem;
    letter-spacing: .2em;
    text-transform: uppercase;
  }
  .is-transitioning .orb-button {
    transform: translate(-50%, -310%) scale(.62);
    opacity: .74;
    filter: drop-shadow(0 0 100px rgba(255,255,255,.62));
  }
  .is-transitioning .silhouette-wrap {
    transform: translateY(34vh) scale(.74);
    opacity: .14;
    filter: blur(3px);
  }
  .is-transitioning .foreground-stars {
    transform: scale(2.25) translateY(-8vh);
    opacity: 1;
  }
  .is-transitioning .hint {
    opacity: 0;
  }
  @keyframes orbPulse {
    0%, 100% { opacity: .66; transform: scale(.94); }
    50% { opacity: 1; transform: scale(1.08); }
  }
  @keyframes starFloat {
    0%, 100% { opacity: .48; transform: translateY(0) scale(.9); }
    50% { opacity: 1; transform: translateY(-8px) scale(1.12); }
  }
  @media (max-width: 800px) {
    .silhouette-wrap {
      left: calc(50% - 112px);
      width: 140px;
      height: 390px;
    }
    .orb-button {
      top: 74%;
      width: 124px;
      height: 124px;
    }
    .sky-whisper {
      top: 17%;
    }
    .hint {
      top: 24%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .orb-button,
    .silhouette-wrap,
    .foreground-stars,
    .orb-fallback-glow,
    .foreground-star {
      animation: none !important;
      transition-duration: .01ms !important;
    }
  }
`;
