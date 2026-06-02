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
  .sky-layer{position:absolute;inset:0;border:0;background:transparent;cursor:pointer;overflow:hidden;color:inherit}
  .sky-gradient{position:absolute;inset:0;background:linear-gradient(180deg,var(--sky-top),var(--sky-mid) 45%,var(--sky-bottom));transition:transform .78s ease,filter .78s ease,opacity .78s ease}
  .distant-aurora{position:absolute;left:18%;top:8%;width:64%;height:34%;border-radius:999px;background:radial-gradient(ellipse at center,var(--aura-soft),transparent 70%);filter:blur(28px);opacity:.74;animation:uraiAurora var(--aura-pulse) ease-in-out infinite alternate}
  .sky-fog{position:absolute;border-radius:999px;filter:blur(24px);opacity:var(--fog-opacity);background:rgba(255,255,255,.14)}
  .sky-fog-one{left:6%;top:36%;width:42%;height:12%}.sky-fog-two{right:8%;top:24%;width:36%;height:10%}
  .horizon-glow{position:absolute;left:18%;right:18%;bottom:31%;height:18%;border-radius:999px;background:radial-gradient(ellipse at center,var(--horizon),transparent 68%);filter:blur(26px)}
  .sky-vignette{position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,transparent 0 44%,rgba(0,0,0,var(--vignette-opacity)) 100%)}
  .constellation-layer{position:absolute;inset:0;opacity:var(--constellation-opacity)}
  .constellation-layer svg{position:absolute;inset:0;width:100%;height:100%}.constellation-layer path{fill:none;stroke:rgba(186,230,253,.34);stroke-width:.24}
  .memory-star,.ambient-star{position:absolute;border:0;border-radius:999px;background:var(--node-color,rgba(186,230,253,.9));box-shadow:0 0 18px var(--node-color,rgba(125,211,252,.62));padding:0}.memory-star span{display:block;width:100%;height:100%;border-radius:999px;background:white;opacity:.54}.ambient-star{width:3px;height:3px;background:white;opacity:.65}.a1{left:12%;top:18%}.a2{left:36%;top:27%}.a3{left:63%;top:16%}.a4{left:82%;top:38%}.a5{left:48%;top:50%}.a6{left:72%;top:57%}
  .body-field{position:absolute;inset:0;pointer-events:none}.body-field button{pointer-events:auto}
  .silhouette-button{position:absolute;left:50%;top:57%;width:clamp(190px,15vw,260px);height:clamp(290px,31vw,440px);transform:translate(-50%,-50%);border:0;background:transparent;padding:0;cursor:pointer}
  .body-halo,.body-head,.body-core,.body-ground-glow{position:absolute;left:50%;transform:translateX(-50%);border-radius:999px}.body-halo{top:8%;width:78%;height:72%;background:radial-gradient(ellipse at center,rgba(255,255,255,.16),transparent 70%);filter:blur(18px)}.body-head{top:10%;width:26%;height:15%;background:rgba(255,255,255,.2)}.body-core{top:27%;width:46%;height:52%;background:linear-gradient(180deg,rgba(255,255,255,.2),rgba(255,255,255,.035));border-radius:45% 45% 32% 32%}.body-ground-glow{bottom:4%;width:120%;height:18%;background:radial-gradient(ellipse at center,var(--horizon),transparent 70%);filter:blur(12px)}
  .aura-orb-button{position:absolute;left:53.5%;top:69%;width:clamp(132px,10vw,190px);height:clamp(132px,10vw,190px);transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;cursor:pointer;transition:transform .78s cubic-bezier(.2,.8,.2,1),filter .78s ease,opacity .78s ease}
  .aura-field,.aura-backlight,.orb-shadow,.orb-core,.orb-glass,.orb-reflection,.orb-charge{position:absolute;border-radius:999px}.aura-field{inset:-38%;background:radial-gradient(circle,var(--aura-soft),transparent 72%);filter:blur(20px);animation:uraiOrbPulse var(--aura-pulse) ease-in-out infinite}.aura-backlight{inset:-14%;background:radial-gradient(circle,var(--aura),transparent 65%);filter:blur(12px);opacity:.62}.aura-ring{position:absolute;inset:2%;border:1px solid rgba(255,255,255,.16);border-radius:999px}.aura-ring-two{inset:-12%;opacity:.4}.aura-ring-three{inset:-26%;opacity:.22}.orb-shadow{left:14%;right:14%;bottom:-8%;height:16%;background:rgba(0,0,0,.55);filter:blur(10px)}.orb-core{inset:18%;background:radial-gradient(circle at 35% 28%,white 0 8%,rgba(186,230,253,.9) 24%,rgba(14,165,233,.46) 58%,rgba(2,6,23,.7) 100%);box-shadow:0 0 30px rgba(125,211,252,.6)}.orb-glass{inset:12%;border:1px solid rgba(255,255,255,.38);background:linear-gradient(135deg,rgba(255,255,255,.2),transparent 46%)}.orb-reflection{left:32%;top:22%;width:18%;height:10%;background:white;opacity:.7}.orb-charge{width:9%;height:9%;background:white;opacity:0;box-shadow:0 0 10px white}.charge-one{left:17%;top:48%}.charge-two{right:18%;top:36%}.charge-three{left:48%;bottom:15%}[data-orb-charge="1"] .charge-one,[data-orb-charge="2"] .charge-one,[data-orb-charge="2"] .charge-two,[data-orb-charge="3"] .charge-one,[data-orb-charge="3"] .charge-two,[data-orb-charge="3"] .charge-three{opacity:.9}
  .companion-dot{position:absolute;right:9%;bottom:12%;width:48px;height:48px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(255,255,255,.08);backdrop-filter:blur(18px)}.companion-dot span{display:block;margin:auto;width:14px;height:14px;border-radius:999px;background:var(--aura);box-shadow:0 0 18px var(--aura)}
  .emotional-biome{position:absolute;left:0;right:0;bottom:0;height:35%;pointer-events:none}.emotional-biome span,.ground-hotspot{position:absolute}.biome-atmosphere{inset:0;background:linear-gradient(180deg,transparent,rgba(0,0,0,.74))}.biome-back-ridge,.biome-mid-ridge,.biome-front-ridge{left:-10%;right:-10%;bottom:26%;height:34%;border-radius:50% 50% 0 0;background:rgba(16,185,129,var(--ground-recovery));filter:blur(6px)}.biome-mid-ridge{bottom:15%;background:rgba(59,130,246,var(--ground-signal));opacity:.72}.biome-front-ridge{bottom:-2%;height:45%;background:rgba(2,6,23,.92);opacity:1}.biome-terrain{left:20%;right:20%;bottom:10%;height:24%;border-radius:999px;background:radial-gradient(ellipse at center,rgba(125,211,252,.15),transparent 68%);transform:translateY(var(--terrain-rise))}.biome-rim{left:28%;right:28%;bottom:29%;height:1px;background:rgba(255,255,255,.14)}.biome-horizon{left:0;right:0;bottom:36%;height:20%;background:radial-gradient(ellipse at center,var(--horizon),transparent 70%);filter:blur(16px)}.biome-river{left:44%;bottom:0;width:12%;height:34%;background:linear-gradient(180deg,rgba(125,211,252,.2),transparent);filter:blur(5px)}.biome-recovery{left:42%;bottom:18%;width:18%;height:10%;background:rgba(94,234,212,var(--ground-recovery));filter:blur(18px)}.biome-shadow{left:16%;bottom:22%;width:20%;height:12%;background:rgba(124,58,237,var(--ground-shadow));filter:blur(20px)}.biome-memory{right:16%;bottom:24%;width:18%;height:10%;background:rgba(251,191,36,var(--ground-memory));filter:blur(18px)}.biome-signal{left:48%;bottom:32%;width:10%;height:10%;background:rgba(56,189,248,var(--ground-signal));filter:blur(12px)}.terrain-spark{width:4px;height:4px;border-radius:999px;background:white;opacity:.45}.spark-one{left:36%;bottom:36%}.spark-two{left:58%;bottom:31%}.spark-three{left:70%;bottom:26%}.spark-four{left:23%;bottom:28%}.ground-hotspot{border:0;border-radius:999px;background:transparent;pointer-events:auto;transform:translate(-50%,-50%);cursor:pointer}
  .scene-pulse{position:absolute;left:50%;bottom:7%;z-index:4;display:flex;align-items:center;gap:12px;transform:translateX(-50%);min-width:min(520px,calc(100vw - 32px));padding:14px 18px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(2,6,23,.72);backdrop-filter:blur(18px);box-shadow:0 18px 60px rgba(0,0,0,.34)}.scene-pulse strong{flex:1;font-size:14px;letter-spacing:.04em;text-transform:uppercase}.pulse-close,.pulse-map,.return-home{width:36px;height:36px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.08);cursor:pointer}.pulse-map::before{content:"↗";color:white}.pulse-close::before{content:"×";color:white}.return-home{position:absolute;left:18px;top:18px;z-index:4}.return-home::before{content:"←";color:white}
  .lifemap-shell{position:fixed;background:#020617}.is-transitioning .sky-gradient{transform:scale(1.18) translateY(-8%);filter:brightness(1.34) saturate(1.24)}.is-transitioning .aura-orb-button{transform:translate(-50%,-300%) scale(.42);filter:blur(2px) brightness(1.55);opacity:.74}.is-transitioning .silhouette-button,.is-transitioning .emotional-biome,.is-transitioning .scene-pulse{opacity:0;transition:opacity .42s ease}.is-transitioning .constellation-layer{opacity:.9;transition:opacity .52s ease}.is-transitioning .horizon-glow{filter:blur(42px);opacity:.9}
  @keyframes uraiAurora{from{transform:translate3d(-2%,-1%,0) scale(1)}to{transform:translate3d(2%,1%,0) scale(1.06)}}@keyframes uraiOrbPulse{from{transform:scale(.94);opacity:.52}to{transform:scale(1.08);opacity:.82}}
  @media (prefers-reduced-motion:reduce){.distant-aurora,.aura-field{animation:none}.aura-orb-button,.sky-gradient,.scene-pulse{transition:none!important}}
`;
