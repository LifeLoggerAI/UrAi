"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useUraiHomeState, type UraiHomeViewModel, type UraiLifeMapNode } from "@/lib/use-urai-home-state";
import type { WorldEntryState } from "@/lib/world-entry";

type Mode = "home" | "transitioning" | "lifemap";

type HomeVisuals = {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  aura: string;
  auraSoft: string;
  horizon: string;
  particleOpacity: number;
  auraPulseSeconds: number;
  fogOpacity: number;
  constellationOpacity: number;
  vignetteOpacity: number;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function deriveHomeVisuals(home: UraiHomeViewModel): HomeVisuals {
  const aura = home.auraColor || "#67e8f9";
  const auraSoft = home.auraSecondaryColor || "#3b82f6";

  if (home.visualState === "threshold" || home.thresholdRisk > 0.7) {
    return {
      skyTop: "#01020a",
      skyMid: "#0c1326",
      skyBottom: "#120d22",
      aura: "rgba(203,184,255,0.64)",
      auraSoft: "rgba(126,34,206,0.24)",
      horizon: "rgba(245,158,11,0.24)",
      particleOpacity: 0.2,
      auraPulseSeconds: 7.2,
      fogOpacity: 0.42,
      constellationOpacity: 0.22,
      vignetteOpacity: 0.84,
    };
  }

  if (home.visualState === "recovery" || home.bloomReady) {
    return {
      skyTop: "#010816",
      skyMid: "#062238",
      skyBottom: "#020916",
      aura: "rgba(94,234,212,0.74)",
      auraSoft: "rgba(251,191,36,0.24)",
      horizon: "rgba(251,191,36,0.34)",
      particleOpacity: 0.34,
      auraPulseSeconds: 5.2,
      fogOpacity: 0.2,
      constellationOpacity: 0.32,
      vignetteOpacity: 0.46,
    };
  }

  if (home.visualState === "overstimulated" || home.rhythmState === "overstimulated") {
    return {
      skyTop: "#010411",
      skyMid: "#132352",
      skyBottom: "#020617",
      aura: "rgba(56,189,248,0.74)",
      auraSoft: "rgba(129,140,248,0.36)",
      horizon: "rgba(56,189,248,0.3)",
      particleOpacity: 0.44,
      auraPulseSeconds: 3.1,
      fogOpacity: 0.3,
      constellationOpacity: 0.28,
      vignetteOpacity: 0.54,
    };
  }

  return {
    skyTop: "#01040d",
    skyMid: "#08243f",
    skyBottom: "#01030a",
    aura: `color-mix(in srgb, ${aura} 72%, white 8%)`,
    auraSoft: `color-mix(in srgb, ${auraSoft} 34%, transparent)`,
    horizon: "rgba(125,211,252,0.28)",
    particleOpacity: 0.26,
    auraPulseSeconds: 5.8,
    fogOpacity: 0.22,
    constellationOpacity: 0.24,
    vignetteOpacity: 0.5,
  };
}

export default function UraiResolvedHomeScene({ entryState: _entryState }: { entryState?: WorldEntryState }) {
  const [mode, setMode] = useState<Mode>("home");
  const [reduceMotion, setReduceMotion] = useState(false);
  const home = useUraiHomeState();
  const visuals = useMemo(() => deriveHomeVisuals(home), [home]);
  
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
    const timer = window.setTimeout(() => setMode("lifemap"), 1200);
    return () => window.clearTimeout(timer);
  }, [mode, reduceMotion]);

  const openLifeMap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mode !== "home") return;
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setMode("home");
  };

  const recovery = clamp01(home.recoveryScore / 100);
  const shadow = clamp01(home.shadowLoad);
  const cognitive = clamp01(home.cognitiveLoad);
  const threshold = clamp01(home.thresholdRisk);
  const memory = clamp01(home.memoryNodeCount / 12);
  const confidence = clamp01(home.moodConfidence);

  const sceneStyle = {
    "--sky-top": visuals.skyTop,
    "--sky-mid": visuals.skyMid,
    "--sky-bottom": visuals.skyBottom,
    "--aura": visuals.aura,
    "--aura-soft": visuals.auraSoft,
    "--horizon": visuals.horizon,
    "--aura-pulse": `${visuals.auraPulseSeconds}s`,
    "--fog-opacity": visuals.fogOpacity,
    "--particle-opacity": visuals.particleOpacity,
    "--constellation-opacity": visuals.constellationOpacity,
    "--vignette-opacity": visuals.vignetteOpacity,
    "--presence-confidence": confidence,
    "--presence-recovery": recovery,
    "--presence-threshold": threshold,
    "--ground-recovery": 0.16 + recovery * 0.62,
    "--ground-shadow": 0.1 + shadow * 0.72,
    "--ground-memory": 0.12 + memory * 0.58,
    "--ground-signal": 0.14 + cognitive * 0.5 + confidence * 0.24,
  } as CSSProperties;

  if (mode === "lifemap") {
    return (
      <main className="world-shell lifemap-active">
        <LifeMapScene />
        <button type="button" className="return-home" onClick={returnHome} aria-label="Return home">
          <span className="return-home-glyph" />
        </button>
        <style jsx>{styles}</style>
      </main>
    );
  }

  const transitioning = mode === "transitioning";

  return (
    <main
      className={`world-shell ${transitioning ? "is-transitioning" : ""}`}
      style={sceneStyle}
      data-source={home.source}
      data-rhythm={home.rhythmState}
    >
      <div className="deep-sky" />
      <div className="distant-atmosphere" />
      <div className="light-shafts" />
      <div className="grain-overlay" />
      
      <div className="terrain-silhouette" />
      
      <div className="presence-field" onClick={openLifeMap}>
        <div className="presence-veil" />
        <div className="presence-core" />
        <div className="presence-fragments" />
        <div className="ground-bloom" />
        <div className="presence-reflection" />
      </div>
      
      <div className="foreground-fog" />

      <MinimalOrbitNav onLifeMapClick={openLifeMap} />
      <FieldWhisper home={home} />

      <style jsx>{styles}</style>
    </main>
  );
}

function MinimalOrbitNav({ onLifeMapClick }: { onLifeMapClick: (e: React.MouseEvent) => void }) {
  return (
    <nav className="minimal-orbit-nav">
      <a href="/life-map" onClick={onLifeMapClick} className="nav-item" aria-label="Life Map">
        <span className="nav-glyph">✧</span>
        <span className="nav-label">Life Map</span>
      </a>
      <Link href="/replay" className="nav-item" aria-label="Replay">
        <span className="nav-glyph">⟲</span>
        <span className="nav-label">Replay</span>
      </Link>
      <Link href="/passport" className="nav-item" aria-label="Passport">
        <span className="nav-glyph">☗</span>
        <span className="nav-label">Passport</span>
      </Link>
    </nav>
  );
}

function FieldWhisper({ home }: { home: UraiHomeViewModel }) {
  return (
    <div className="field-whisper">
      <p>{home.moodWeather ?? "Calm"}</p>
      <span>{`Source: ${home.source} / ${home.rhythmState}`}</span>
    </div>
  );
}


const styles = `
  .world-shell {
    position: fixed;
    inset: 0;
    z-index: 1;
    min-height: 100dvh;
    width: 100vw;
    overflow: hidden;
    background-color: var(--sky-bottom);
    color: white;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    isolation: isolate;
  }
  .world-shell.is-transitioning { --scene-transition-progress: 1; }
  .world-shell:not(.is-transitioning) { --scene-transition-progress: 0; }

  .deep-sky {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 50%, var(--sky-bottom) 100%);
    transition: background 1.2s ease;
  }
  
  .distant-atmosphere {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 60%, transparent, var(--sky-bottom) 95%);
    opacity: 0.8;
  }

  .light-shafts {
    position: absolute;
    inset: -50%;
    background: 
      linear-gradient(135deg, rgba(255,255,255,0.05) 20%, transparent 20.1%),
      linear-gradient(135deg, rgba(255,255,255,0.0) 40%, transparent 40.1%);
    transform: rotate(-30deg) scale(2);
    opacity: calc(var(--presence-recovery) * 0.5 + 0.1);
    animation: uraiLightShaft 45s linear infinite;
    transition: opacity 1.2s ease;
  }
  
  .grain-overlay {
    position: absolute;
    inset: -200%;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>');
    background-repeat: repeat;
    opacity: 0.02;
    animation: uraiGrain 8s steps(10) infinite;
    pointer-events: none;
  }

  .terrain-silhouette {
    position: absolute;
    left: -5%;
    right: -5%;
    bottom: 0;
    height: 35%;
    background: 
      linear-gradient(to top, var(--sky-bottom) 0%, transparent 100%),
      radial-gradient(ellipse 100% 150px at 50% 100%, var(--horizon) 0%, transparent 60%);
    border-radius: 50% 50% 0 0 / 20px 20px 0 0;
    transform: translateY(10%);
    opacity: 0.7;
    filter: blur(2px);
  }

  .presence-field {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30vmin;
    height: 60vmin;
    transform: translateX(-50%) translateY(-50%) scale(calc(1 - var(--scene-transition-progress) * 0.6)) translateY(calc(var(--scene-transition-progress) * -150%));
    cursor: pointer;
    transition: transform 1.2s cubic-bezier(0.6, 0, 0.2, 1);
  }
  
  .presence-veil {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 100% at 50% 50%, var(--aura) 0%, transparent 60%);
    opacity: calc(0.3 + var(--presence-confidence) * 0.4);
    filter: blur(5vmin);
    animation: uraiVeilPulse var(--aura-pulse) ease-in-out infinite alternate;
  }

  .presence-core {
    position: absolute;
    left: 45%;
    right: 45%;
    top: 10%;
    bottom: 10%;
    background: 
      linear-gradient(to bottom, transparent, var(--aura-soft), transparent),
      linear-gradient(to bottom, white, var(--aura), white);
    background-blend-mode: screen;
    border-radius: 100%;
    filter: blur(2vmin);
    opacity: 0.9;
    animation: uraiCoreFloat 12s ease-in-out infinite;
  }

  .presence-fragments {
    position: absolute;
    inset: -20%;
  }
  .presence-fragments::before, .presence-fragments::after {
    content: '';
    position: absolute;
    width: 2vmin;
    height: 4vmin;
    background: var(--aura);
    border-radius: 50%;
    filter: blur(1.5vmin);
    animation: uraiFragmentOrbit 15s linear infinite;
  }
  .presence-fragments::after {
    top: 60%;
    left: 10%;
    animation-delay: -7.5s;
    animation-duration: 12s;
  }
  
  .ground-bloom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10%;
    height: 20%;
    background: radial-gradient(ellipse 50% 100% at 50% 100%, var(--aura-soft) 0%, transparent 70%);
    opacity: calc(var(--presence-recovery) * 0.5);
    filter: blur(5vmin);
  }

  .presence-reflection {
    position: absolute;
    left: 10%;
    right: 10%;
    bottom: -15%;
    height: 10%;
    background: var(--aura);
    border-radius: 50%;
    filter: blur(8vmin);
    opacity: 0.2;
    transform: scale(0.6, 0.1);
  }

  .foreground-fog {
    position: absolute;
    left: -50%;
    right: -50%;
    bottom: -30%;
    height: 60%;
    background: linear-gradient(to top, var(--sky-bottom) 30%, transparent);
    pointer-events: none;
    opacity: calc(0.5 + var(--fog-opacity) * 0.5);
    transition: opacity 1.2s ease;
  }

  .minimal-orbit-nav {
    position: absolute;
    top: 24px;
    right: 32px;
    display: flex;
    gap: 8px;
    opacity: calc(1 - var(--scene-transition-progress));
    transform: translateY(calc(var(--scene-transition-progress) * -100px));
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .nav-item {
    padding: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    color: white;
    text-decoration: none;
    position: relative;
  }
  .nav-glyph { 
    font-size: 20px;
    line-height: 1;
    width: 24px;
    height: 24px;
    display: block;
    text-align: center;
  }
  .nav-label {
    position: absolute;
    left: 50%;
    top: calc(100% + 12px);
    transform: translateX(-50%);
    background: rgba(0,0,0,0.7);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }
  .nav-item:hover .nav-label, .nav-item:focus .nav-label {
    opacity: 1;
  }
  
  .field-whisper {
    position: absolute;
    bottom: 24px;
    left: 32px;
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    background: rgba(0,0,0,0.1);
    padding: 6px 12px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    opacity: calc(1 - var(--scene-transition-progress));
    transform: translateY(calc(var(--scene-transition-progress) * 100px));
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .field-whisper p { margin: 0; font-size: 14px; color: rgba(255,255,255,0.6); }
  .field-whisper span { text-transform: uppercase; letter-spacing: 0.05em; font-size: 10px;}

  .return-home {
    position: absolute;
    top: 24px;
    left: 32px;
    z-index: 10;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
    cursor: pointer;
  }
  .return-home-glyph {
    display: block;
    width: 100%;
    height: 100%;
    color: white;
  }
  .return-home-glyph::before {
    content: '←';
    font-size: 20px;
    line-height: 38px;
  }
  
  .lifemap-active {
    background: #020617;
  }

  @keyframes uraiLightShaft {
    from { transform: rotate(-30deg) scale(2) translateX(-10%); }
    to { transform: rotate(-30deg) scale(2) translateX(10%); }
  }
  @keyframes uraiGrain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(7%, 35%); }
    90% { transform: translate(-10%, 10%); }
  }
  @keyframes uraiVeilPulse {
    from { opacity: calc(0.2 + var(--presence-confidence) * 0.3); transform: scale(1); }
    to   { opacity: calc(0.3 + var(--presence-confidence) * 0.4); transform: scale(1.05); }
  }
  @keyframes uraiCoreFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5%); }
  }
  @keyframes uraiFragmentOrbit {
    from { transform: rotate(0deg) translateX(15vmin) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(15vmin) rotate(-360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .light-shafts, .grain-overlay, .presence-veil, .presence-core, .presence-fragments::before, .presence-fragments::after {
      animation: none;
    }
    .world-shell, .presence-field, .minimal-orbit-nav, .field-whisper {
      transition: none !important;
    }
  }
`;
