"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useUraiHomeState, type UraiHomeViewModel, type UraiLifeMapNode } from "@/lib/use-urai-home-state";
import type { WorldEntryState } from "@/lib/world-entry";

type Mode = "home" | "transitioning" | "lifemap";
type FocusSurface = "orb" | "ground" | "companion" | "node" | null;
type GroundZone = "recovery" | "shadow" | "memory" | "signal";

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

const GROUND_ZONES: Array<{ id: GroundZone; x: number; y: number; size: number; aria: string }> = [
  { id: "shadow", x: 24, y: 56, size: 150, aria: "Open shadow terrain" },
  { id: "recovery", x: 50, y: 39, size: 210, aria: "Open recovery bloom terrain" },
  { id: "memory", x: 75, y: 55, size: 160, aria: "Open memory terrain" },
  { id: "signal", x: 51, y: 74, size: 132, aria: "Open signal pool" },
];

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

function nodeSize(node: UraiLifeMapNode) {
  return Math.round(8 + node.emotionalWeight * 13);
}

function constellationPath(nodes: UraiLifeMapNode[]) {
  if (nodes.length < 2) return "";
  return nodes.slice(0, 7).map((node, index) => `${index === 0 ? "M" : "L"} ${node.x} ${node.y}`).join(" ");
}

function firestoreOrbCharge(home: UraiHomeViewModel) {
  if (home.loading) return 0;
  const confidence = clamp01(home.moodConfidence);
  const recovery = clamp01(home.recoveryScore / 100);
  const pressure = clamp01(home.thresholdRisk + home.shadowLoad + home.cognitiveLoad);
  const companionBoost = home.companionMode === "listening" || home.companionMode === "reflecting" ? 0.25 : 0;
  const signal = confidence * 0.35 + recovery * 0.35 + pressure * 0.2 + companionBoost;
  return Math.max(0, Math.min(3, Math.ceil(signal * 3)));
}

export default function UraiResolvedHomeScene({ entryState: _entryState }: { entryState?: WorldEntryState }) {
  const [mode, setMode] = useState<Mode>("home");
  const [focusSurface, setFocusSurface] = useState<FocusSurface>(null);
  const [activeGround, setActiveGround] = useState<GroundZone | null>(null);
  const [activeNode, setActiveNode] = useState<UraiLifeMapNode | null>(null);
  const [orbCharge, setOrbCharge] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const home = useUraiHomeState();
  const visuals = useMemo(() => deriveHomeVisuals(home), [home]);
  const topNode = useMemo(() => [...home.nodes].sort((a, b) => b.emotionalWeight - a.emotionalWeight)[0] ?? null, [home.nodes]);
  const liveOrbCharge = firestoreOrbCharge(home);
  const displayOrbCharge = Math.max(orbCharge, liveOrbCharge);

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
    const timer = window.setTimeout(() => setMode("lifemap"), 780);
    return () => window.clearTimeout(timer);
  }, [mode, reduceMotion]);

  const openLifeMap = () => {
    if (mode !== "home") return;
    setFocusSurface(null);
    setActiveGround(null);
    setActiveNode(null);
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setFocusSurface(null);
    setActiveGround(null);
    setActiveNode(null);
    setOrbCharge(0);
    setMode("home");
  };

  const pulseOrb = () => {
    setFocusSurface("orb");
    setActiveGround(null);
    setActiveNode(null);
    setOrbCharge((charge) => {
      const next = Math.min(3, Math.max(charge, liveOrbCharge) + 1);
      if (next >= 3) window.setTimeout(openLifeMap, reduceMotion ? 0 : 180);
      return next;
    });
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
    "--orb-confidence": confidence,
    "--orb-recovery": recovery,
    "--orb-threshold": threshold,
    "--ground-recovery": 0.16 + recovery * 0.62,
    "--ground-shadow": 0.1 + shadow * 0.72,
    "--ground-memory": 0.12 + memory * 0.58,
    "--ground-signal": 0.14 + cognitive * 0.5 + confidence * 0.24,
    "--ground-pulse": `${8 - Math.min(4.5, cognitive * 3 + threshold * 3)}s`,
    "--terrain-rise": `${8 + recovery * 22 - threshold * 12}px`,
  } as CSSProperties;

  if (mode === "lifemap") {
    return (
      <main className="urai-home-shell lifemap-shell">
        <LifeMapScene />
        <button type="button" className="return-home" onClick={returnHome} aria-label="Return home" />
        <style jsx>{styles}</style>
      </main>
    );
  }

  const transitioning = mode === "transitioning";
  const surfaceOpen = Boolean(focusSurface || activeNode || activeGround);

  return (
    <main
      className={`urai-home-shell ${transitioning ? "is-transitioning" : ""} ${surfaceOpen ? "has-focus-surface" : ""}`}
      style={sceneStyle}
      data-source={home.source}
      data-live={home.source === "firestore" ? "true" : "false"}
      data-orb-charge={displayOrbCharge}
      data-ground={activeGround ?? "none"}
      data-rhythm={home.rhythmState}
    >
      <button type="button" className="sky-layer" aria-label="Ascend through the sky into the Memory Galaxy" onClick={openLifeMap}>
        <span className="sky-gradient" />
        <span className="distant-aurora" />
        <span className="sky-fog sky-fog-one" />
        <span className="sky-fog sky-fog-two" />
        <span className="horizon-glow" />
        <Constellation nodes={home.nodes} onNodeOpen={(node) => { setFocusSurface("node"); setActiveGround(null); setActiveNode(node); }} />
        <span className="sky-vignette" />
      </button>

      <section className="body-field" aria-label="Interactive URAI home field">
        <button type="button" className="silhouette-button" aria-label="Enter URAI ground foundation" onClick={() => { setFocusSurface("ground"); setActiveGround("signal"); setActiveNode(null); }}>
          <span className="body-halo" />
          <span className="body-head" />
          <span className="body-core" />
          <span className="body-ground-glow" />
        </button>

        <button type="button" className="aura-orb-button" aria-label="Charge orb" onClick={pulseOrb}>
          <span className="aura-field" />
          <span className="aura-backlight" />
          <span className="aura-ring aura-ring-one" />
          <span className="aura-ring aura-ring-two" />
          <span className="aura-ring aura-ring-three" />
          <span className="orb-shadow" />
          <span className="orb-core" />
          <span className="orb-glass" />
          <span className="orb-reflection" />
          <span className="orb-charge charge-one" />
          <span className="orb-charge charge-two" />
          <span className="orb-charge charge-three" />
        </button>

        <button type="button" className="companion-dot" aria-label="Open URAI orb companion" onClick={() => { setFocusSurface("companion"); setActiveGround(null); setActiveNode(null); }}>
          <span />
        </button>
      </section>

      <section className="emotional-biome" aria-label="Interactive emotional biome">
        <span className="biome-atmosphere" />
        <span className="biome-back-ridge" />
        <span className="biome-mid-ridge" />
        <span className="biome-front-ridge" />
        <span className="biome-terrain" />
        <span className="biome-rim" />
        <span className="biome-horizon" />
        <span className="biome-river" />
        <span className="biome-recovery" />
        <span className="biome-shadow" />
        <span className="biome-memory" />
        <span className="biome-signal" />
        <span className="terrain-spark spark-one" />
        <span className="terrain-spark spark-two" />
        <span className="terrain-spark spark-three" />
        <span className="terrain-spark spark-four" />
        {GROUND_ZONES.map((zone) => (
          <button
            key={zone.id}
            type="button"
            className={`ground-hotspot ground-hotspot-${zone.id}`}
            aria-label={zone.aria}
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: zone.size, height: zone.size } as CSSProperties}
            onClick={() => { setFocusSurface("ground"); setActiveGround(zone.id); setActiveNode(null); }}
          />
        ))}
      </section>

      <ScenePulse
        home={home}
        topNode={topNode}
        activeNode={activeNode}
        focusSurface={focusSurface}
        activeGround={activeGround}
        onClose={() => { setFocusSurface(null); setActiveGround(null); setActiveNode(null); }}
        onOpenLifeMap={openLifeMap}
      />

      <style jsx>{styles}</style>
    </main>
  );
}

function ScenePulse({
  home,
  topNode,
  activeNode,
  focusSurface,
  activeGround,
  onClose,
  onOpenLifeMap,
}: {
  home: UraiHomeViewModel;
  topNode: UraiLifeMapNode | null;
  activeNode: UraiLifeMapNode | null;
  focusSurface: FocusSurface;
  activeGround: GroundZone | null;
  onClose: () => void;
  onOpenLifeMap: () => void;
}) {
  if (!focusSurface && !activeGround && !activeNode) return null;

  const title = activeNode?.title
    ?? (activeGround === "recovery" ? `${Math.round(home.recoveryScore)}%`
      : activeGround === "shadow" ? `${Math.round(home.shadowLoad * 100)}%`
        : activeGround === "memory" ? `${home.memoryNodeCount}`
          : activeGround === "signal" ? home.rhythmState
            : focusSurface === "companion" ? "URAI is listening."
              : topNode?.title ?? home.moodWeather);

  return (
    <aside className="scene-pulse" aria-live="polite" role={focusSurface === "companion" ? "dialog" : undefined} aria-label={focusSurface === "companion" ? "URAI orb companion chat" : undefined}>
      <button type="button" className="pulse-close" aria-label="Close field pulse" onClick={onClose} />
      <strong>{title}</strong>
      <button type="button" className="pulse-map" aria-label="Open life map" onClick={onOpenLifeMap} />
    </aside>
  );
}

function Constellation({ nodes, onNodeOpen }: { nodes: UraiLifeMapNode[]; onNodeOpen: (node: UraiLifeMapNode) => void }) {
  const visibleNodes = nodes.slice(0, 8);
  const path = constellationPath(visibleNodes);
  return (
    <span className="constellation-layer" aria-label="Memory constellation">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {path ? <path d={path} /> : null}
      </svg>
      {visibleNodes.map((node) => (
        <button
          key={node.id}
          type="button"
          className={`memory-star node-${node.type}`}
          style={{ left: `${node.x}%`, top: `${node.y}%`, width: nodeSize(node), height: nodeSize(node), "--node-color": node.auraColor } as CSSProperties}
          onClick={(event) => { event.stopPropagation(); onNodeOpen(node); }}
          aria-label={`Open ${node.title}`}
        >
          <span />
        </button>
      ))}
      <i className="ambient-star a1" />
      <i className="ambient-star a2" />
      <i className="ambient-star a3" />
      <i className="ambient-star a4" />
      <i className="ambient-star a5" />
      <i className="ambient-star a6" />
    </span>
  );
}

const styles = `
  .urai-home-shell{position:fixed;inset:0;z-index:2147483647;min-height:100dvh;width:100vw;overflow:hidden;background:#01030a;color:white;isolation:isolate;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;touch-action:manipulation}
`;
