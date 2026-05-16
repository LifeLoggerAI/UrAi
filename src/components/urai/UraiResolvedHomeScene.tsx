"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useUraiHomeState, type UraiHomeViewModel, type UraiLifeMapNode } from "@/lib/use-urai-home-state";

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

export default function UraiResolvedHomeScene() {
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
      <button type="button" className="sky-layer" aria-label="Open symbolic life map" onClick={openLifeMap}>
        <span className="sky-gradient" />
        <span className="distant-aurora" />
        <span className="sky-fog sky-fog-one" />
        <span className="sky-fog sky-fog-two" />
        <span className="horizon-glow" />
        <Constellation nodes={home.nodes} onNodeOpen={(node) => { setFocusSurface("node"); setActiveGround(null); setActiveNode(node); }} />
        <span className="sky-vignette" />
      </button>

      <section className="body-field" aria-label="Interactive URAI home field">
        <button type="button" className="silhouette-button" aria-label="Tune body field" onClick={() => { setFocusSurface("ground"); setActiveGround("signal"); setActiveNode(null); }}>
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

        <button type="button" className="companion-dot" aria-label="Wake companion" onClick={() => { setFocusSurface("companion"); setActiveGround(null); setActiveNode(null); }}>
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
            : focusSurface === "companion" ? home.companionMode
              : topNode?.title ?? home.moodWeather);

  return (
    <aside className="scene-pulse" aria-live="polite">
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
  .lifemap-shell{background:#020617}.return-home{position:fixed;left:calc(env(safe-area-inset-left) + 1rem);top:calc(env(safe-area-inset-top) + 1rem);z-index:70;width:44px;height:44px;border:1px solid rgba(186,230,253,.22);border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.16),rgba(1,6,18,.72));backdrop-filter:blur(18px);cursor:pointer}.return-home:before{content:"";position:absolute;left:17px;top:13px;width:12px;height:12px;border-left:2px solid rgba(255,255,255,.8);border-bottom:2px solid rgba(255,255,255,.8);transform:rotate(45deg)}
  .sky-layer{position:absolute;inset:0;z-index:0;border:0;padding:0;text-align:left;background:transparent;cursor:zoom-in;overflow:hidden}.sky-gradient{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 57%,var(--aura-soft),transparent 31%),radial-gradient(ellipse at 50% 82%,rgba(125,211,252,.12),transparent 31%),linear-gradient(180deg,var(--sky-top),var(--sky-mid) 48%,var(--sky-bottom))}.distant-aurora{position:absolute;left:22%;right:18%;top:11%;height:22vh;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(125,211,252,.1),transparent 66%);filter:blur(34px);opacity:.56;animation:auroraDrift 18s ease-in-out infinite alternate}.sky-fog{position:absolute;border-radius:999px;filter:blur(64px);opacity:var(--fog-opacity);mix-blend-mode:screen}.sky-fog-one{left:8%;top:31%;width:48vw;height:34vh;background:radial-gradient(circle,rgba(125,211,252,.18),transparent 68%);animation:fogDrift 16s ease-in-out infinite alternate}.sky-fog-two{right:2%;top:20%;width:44vw;height:40vh;background:radial-gradient(circle,rgba(167,139,250,.16),transparent 72%);animation:fogDrift 20s ease-in-out infinite alternate-reverse}.horizon-glow{position:absolute;left:50%;bottom:22%;width:min(980px,82vw);height:25vh;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at 50% 38%,var(--horizon),rgba(125,211,252,.1) 36%,transparent 72%);filter:blur(26px);opacity:.92}.sky-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 52%,transparent 0%,transparent 42%,rgba(0,0,0,.2) 72%,rgba(0,0,0,var(--vignette-opacity)) 100%),linear-gradient(180deg,rgba(0,0,0,.55),transparent 31%,rgba(0,0,0,.38));pointer-events:none}
  .constellation-layer{position:absolute;inset:0;opacity:var(--constellation-opacity);pointer-events:none;transition:opacity .4s ease}.constellation-layer svg{position:absolute;inset:8% 16% auto 16%;height:38%;width:68%;overflow:visible}.constellation-layer path{fill:none;stroke:rgba(186,230,253,.55);stroke-width:.12;stroke-dasharray:1.4 2.6;filter:drop-shadow(0 0 5px rgba(186,230,253,.62));animation:pathReveal 2.6s ease-out both}.memory-star{position:absolute;z-index:3;transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;animation:starFloat 7s ease-in-out infinite}.memory-star span{position:absolute;inset:-70%;border-radius:999px;background:radial-gradient(circle,#fff 0 7%,var(--node-color) 16%,rgba(186,230,253,.3) 38%,transparent 70%);filter:drop-shadow(0 0 14px rgba(255,255,255,.65))}.node-ritual span,.node-breakthrough span{background:radial-gradient(circle,#fff 0 7%,#fbbf24 16%,rgba(251,191,36,.25) 42%,transparent 70%)}.node-relationship span,.node-mirror span{background:radial-gradient(circle,#fff 0 7%,#c084fc 16%,rgba(192,132,252,.22) 42%,transparent 70%)}.node-forecast span,.node-becoming span{background:radial-gradient(circle,#fff 0 7%,#67e8f9 16%,rgba(103,232,249,.26) 42%,transparent 70%)}.node-recovery span{background:radial-gradient(circle,#fff 0 7%,#5eead4 16%,rgba(94,234,212,.26) 42%,transparent 70%)}.node-threshold span,.node-warning span{background:radial-gradient(circle,#fff 0 7%,#d8b4fe 16%,rgba(216,180,254,.3) 42%,transparent 70%)}.ambient-star{position:absolute;display:block;width:4px;height:4px;border-radius:999px;background:white;filter:drop-shadow(0 0 12px rgba(255,255,255,.72));opacity:.36;animation:twinkle 5.5s ease-in-out infinite}.a1{left:12%;top:66%}.a2{right:18%;top:52%;animation-delay:-2s}.a3{left:52%;top:76%;animation-delay:-4s}.a4{left:30%;top:32%;animation-delay:-1s}.a5{left:61%;top:18%;animation-delay:-3s}.a6{left:82%;top:58%;animation-delay:-5s}
  .body-field{position:absolute;inset:0;z-index:18;pointer-events:none}.silhouette-button{position:absolute;left:calc(50% - min(9.4vw,118px));top:58%;z-index:20;width:118px;height:320px;transform:translate(-50%,-24%);border:0;background:transparent;pointer-events:auto;cursor:pointer;opacity:.48;filter:drop-shadow(0 0 34px rgba(103,232,249,.14));transition:opacity .2s ease,transform .2s ease}.silhouette-button:hover,.silhouette-button:focus-visible{opacity:.82;transform:translate(-50%,-25%)}.body-halo{position:absolute;inset:-2% -45%;border-radius:50%;background:radial-gradient(ellipse at 50% 42%,rgba(186,230,253,.14),transparent 64%);filter:blur(18px)}.body-head{position:absolute;left:50%;top:1%;width:54px;height:70px;transform:translateX(-50%);border-radius:999px;background:linear-gradient(180deg,rgba(207,250,254,.25),rgba(125,211,252,.1));box-shadow:0 0 28px rgba(125,211,252,.12)}.body-core{position:absolute;left:50%;top:20%;width:76px;height:238px;transform:translateX(-50%);border-radius:52% 52% 38% 38%;background:linear-gradient(180deg,rgba(188,235,255,.2),rgba(96,165,250,.11) 42%,rgba(2,6,23,.07) 82%,transparent);clip-path:polygon(42% 0,58% 0,82% 22%,92% 72%,70% 100%,30% 100%,8% 72%,18% 22%);box-shadow:inset 10px 0 20px rgba(255,255,255,.045),inset -14px -18px 30px rgba(2,6,23,.16)}.body-ground-glow{position:absolute;left:50%;bottom:12%;width:150px;height:80px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(125,211,252,.12),transparent 70%);filter:blur(14px)}
  .aura-orb-button{position:absolute;left:50%;top:57%;z-index:24;width:420px;height:420px;transform:translate(-50%,-38%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;transition:transform .24s ease;outline:0}.aura-orb-button:hover,.aura-orb-button:focus-visible{transform:translate(-50%,-39%) scale(1.025)}.aura-field{position:absolute;inset:-34%;border-radius:999px;background:radial-gradient(circle,var(--aura),var(--aura-soft) 34%,rgba(14,165,233,.06) 52%,transparent 70%);filter:blur(30px);animation:auraPulse var(--aura-pulse) ease-in-out infinite}.aura-backlight{position:absolute;inset:12%;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,calc(.12 + var(--orb-confidence) * .18)),rgba(103,232,249,calc(.08 + var(--orb-recovery) * .16)) 30%,transparent 68%);filter:blur(22px)}.aura-ring{position:absolute;border-radius:999px;border:1px solid rgba(255,255,255,.14);box-shadow:0 0 34px rgba(125,211,252,.13);animation:ringRotate 14s linear infinite}.aura-ring-one{inset:16%;transform:rotate(-12deg) scaleX(1.12) scaleY(.9)}.aura-ring-two{inset:7%;opacity:.42;animation-duration:20s;animation-direction:reverse;transform:rotate(22deg) scaleX(1.15) scaleY(.88)}.aura-ring-three{inset:25%;opacity:.24;animation-duration:26s;transform:rotate(54deg) scaleX(1.2) scaleY(.84)}.orb-shadow{position:absolute;left:50%;top:64%;width:164px;height:44px;transform:translateX(-50%);border-radius:50%;background:rgba(0,0,0,.48);filter:blur(8px);opacity:.78}.orb-core{position:absolute;left:50%;top:50%;width:158px;height:158px;transform:translate(-50%,-50%);border-radius:999px;background:radial-gradient(circle at 29% 23%,#ffffff 0 9%,#d9fbff 17%,#7cf4ff 34%,#1fb7c9 50%,#0e627a 68%,#061728 92%);box-shadow:inset -28px -32px 42px rgba(1,5,14,.72),inset 18px 13px 23px rgba(255,255,255,.25),0 0 calc(34px + var(--orb-confidence) * 28px) rgba(255,255,255,.4),0 0 calc(100px + var(--orb-recovery) * 70px) rgba(103,232,249,.48),0 0 calc(150px + var(--orb-threshold) * 80px) rgba(192,132,252,.28)}.orb-glass{position:absolute;left:calc(50% - 32px);top:calc(50% - 50px);width:64px;height:54px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.92),rgba(255,255,255,.2) 52%,transparent 72%);filter:blur(3px);transform:rotate(-18deg)}.orb-reflection{position:absolute;left:50%;top:69%;width:132px;height:36px;transform:translateX(-50%);border-radius:50%;background:rgba(2,6,23,.34);filter:blur(6px)}.orb-charge{position:absolute;left:50%;top:50%;width:12px;height:12px;border-radius:999px;background:#fff;box-shadow:0 0 22px rgba(255,255,255,.8);opacity:.16;transform-origin:0 0}.charge-one{transform:rotate(20deg) translate(112px)}.charge-two{transform:rotate(142deg) translate(124px)}.charge-three{transform:rotate(262deg) translate(111px)}[data-orb-charge="1"] .charge-one,[data-orb-charge="2"] .charge-one,[data-orb-charge="2"] .charge-two,[data-orb-charge="3"] .orb-charge{opacity:1;animation:twinkle 1.6s ease-in-out infinite}.companion-dot{position:absolute;right:calc(50% - 140px);top:60%;z-index:30;width:52px;height:52px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:transparent;box-shadow:0 0 36px rgba(103,232,249,.34);pointer-events:auto;cursor:pointer;animation:companionBreath 5.6s ease-in-out infinite}.companion-dot span{position:absolute;inset:9px;border-radius:999px;background:radial-gradient(circle,#e0f2fe,rgba(103,232,249,.34),rgba(255,255,255,.04))}
  .emotional-biome{position:absolute;left:50%;bottom:-8vh;z-index:19;width:min(1320px,96vw);height:43vh;transform:translateX(-50%);pointer-events:none}.biome-atmosphere{position:absolute;left:3%;right:3%;top:-31%;height:38%;border-radius:50%;background:radial-gradient(ellipse at 50% 78%,rgba(125,211,252,.18),transparent 70%);filter:blur(21px);opacity:.92}.biome-terrain{position:absolute;inset:19% 0 0;border-radius:44% 44% 0 0;background:radial-gradient(ellipse at 50% 0%,rgba(226,249,255,.2),rgba(125,211,252,.08) 24%,transparent 48%),radial-gradient(ellipse at 22% 25%,rgba(168,85,247,.08),transparent 40%),radial-gradient(ellipse at 78% 28%,rgba(251,191,36,.08),transparent 40%),linear-gradient(180deg,rgba(18,58,91,.32),rgba(4,18,38,.76) 58%,rgba(0,0,0,.96));clip-path:polygon(0 42%,7% 35%,15% 39%,25% 24%,34% 31%,43% 13%,52% 24%,62% 16%,74% 31%,84% 21%,94% 38%,100% 34%,100% 100%,0 100%);box-shadow:0 -36px 120px rgba(125,211,252,.16),inset 0 1px 0 rgba(255,255,255,.19);animation:terrainBreath var(--ground-pulse) ease-in-out infinite}.biome-back-ridge,.biome-mid-ridge,.biome-front-ridge{position:absolute;left:50%;bottom:12%;transform:translateX(-50%);border-radius:50% 50% 0 0;filter:blur(.2px);pointer-events:none}.biome-back-ridge{width:93%;height:28%;bottom:19%;background:linear-gradient(180deg,rgba(125,211,252,.12),rgba(2,6,23,.12));clip-path:polygon(0 70%,10% 48%,20% 55%,32% 34%,44% 48%,55% 28%,66% 46%,78% 31%,91% 55%,100% 45%,100% 100%,0 100%);opacity:.68}.biome-mid-ridge{width:98%;height:31%;bottom:12%;background:linear-gradient(180deg,rgba(56,189,248,.15),rgba(2,6,23,.36));clip-path:polygon(0 62%,8% 43%,18% 50%,29% 26%,41% 44%,52% 19%,64% 39%,75% 23%,88% 49%,100% 36%,100% 100%,0 100%);opacity:.8}.biome-front-ridge{width:105%;height:30%;bottom:0;background:linear-gradient(180deg,rgba(15,23,42,.28),rgba(0,0,0,.82));clip-path:polygon(0 47%,12% 36%,24% 42%,38% 29%,48% 41%,58% 31%,69% 44%,82% 31%,94% 45%,100% 38%,100% 100%,0 100%);opacity:.88}.biome-rim{position:absolute;left:5%;right:5%;top:28%;height:2px;background:linear-gradient(90deg,transparent,rgba(226,242,255,.44),rgba(125,211,252,.27),transparent);filter:blur(.3px)}.biome-horizon{position:absolute;left:12%;right:12%;top:37%;height:1px;background:linear-gradient(90deg,transparent,rgba(226,242,255,.28),transparent);filter:blur(.5px)}.biome-river{position:absolute;left:40%;top:36%;width:22%;height:51%;background:linear-gradient(180deg,rgba(125,211,252,.2),rgba(94,234,212,.12),transparent);clip-path:polygon(42% 0,58% 0,68% 34%,54% 60%,64% 100%,35% 100%,45% 63%,31% 37%);filter:blur(6px);opacity:calc(.22 + var(--ground-signal) * .44);animation:riverMove 6s ease-in-out infinite}.biome-recovery,.biome-shadow,.biome-memory,.biome-signal{position:absolute;border-radius:999px;filter:blur(23px);transition:opacity .2s ease,transform .2s ease}.biome-recovery{left:37%;top:23%;width:27%;height:34%;background:radial-gradient(ellipse,rgba(94,234,212,var(--ground-recovery)),transparent 72%)}.biome-shadow{left:13%;top:33%;width:28%;height:34%;background:radial-gradient(ellipse,rgba(168,85,247,var(--ground-shadow)),transparent 72%)}.biome-memory{right:12%;top:33%;width:28%;height:34%;background:radial-gradient(ellipse,rgba(251,191,36,var(--ground-memory)),transparent 72%)}.biome-signal{left:41%;top:56%;width:20%;height:28%;background:radial-gradient(ellipse,rgba(125,211,252,var(--ground-signal)),transparent 72%)}.terrain-spark{position:absolute;width:6px;height:6px;border-radius:999px;background:rgba(255,255,255,.8);filter:drop-shadow(0 0 12px rgba(125,211,252,.75));opacity:.34;animation:sparkRise 7s ease-in-out infinite}.spark-one{left:34%;top:51%}.spark-two{left:58%;top:45%;animation-delay:-2s}.spark-three{left:76%;top:58%;animation-delay:-4s}.spark-four{left:21%;top:60%;animation-delay:-5s}.ground-hotspot{position:absolute;z-index:3;transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer}.ground-hotspot:after{content:"";position:absolute;inset:35%;border-radius:999px;background:rgba(255,255,255,.18);box-shadow:0 0 26px rgba(255,255,255,.24);opacity:.08;transition:opacity .2s ease,transform .2s ease}.ground-hotspot:hover:after,.ground-hotspot:focus-visible:after{opacity:.72;transform:scale(1.2)}[data-ground="recovery"] .biome-recovery,[data-ground="shadow"] .biome-shadow,[data-ground="memory"] .biome-memory,[data-ground="signal"] .biome-signal{opacity:1;transform:scale(1.22)}
  .scene-pulse{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom) + 1.15rem);z-index:62;display:grid;grid-template-columns:42px minmax(0,1fr) 42px;align-items:center;gap:10px;width:min(360px,calc(100vw - 2rem));transform:translateX(-50%);border:1px solid rgba(186,230,253,.18);border-radius:999px;background:rgba(1,7,20,.58);padding:8px;box-shadow:0 22px 80px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px)}.scene-pulse strong{overflow:hidden;color:rgba(255,255,255,.9);font-size:.78rem;text-align:center;text-overflow:ellipsis;white-space:nowrap;text-transform:capitalize}.pulse-close,.pulse-map{position:relative;width:38px;height:38px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.06);cursor:pointer}.pulse-close:before,.pulse-close:after{content:"";position:absolute;left:50%;top:50%;width:14px;height:2px;background:rgba(255,255,255,.7);transform:translate(-50%,-50%) rotate(45deg)}.pulse-close:after{transform:translate(-50%,-50%) rotate(-45deg)}.pulse-map:before{content:"";position:absolute;left:50%;top:50%;width:14px;height:14px;border:2px solid rgba(255,255,255,.76);border-radius:50%;transform:translate(-50%,-50%)}.pulse-map:after{content:"";position:absolute;left:51%;top:50%;width:6px;height:6px;border-right:2px solid rgba(255,255,255,.76);border-bottom:2px solid rgba(255,255,255,.76);transform:translate(-20%,-20%) rotate(-45deg)}
  [data-live="true"] .orb-core{outline:1px solid rgba(94,234,212,.26);outline-offset:9px}[data-source="demo"] .orb-core{filter:saturate(.86)}.is-transitioning .sky-layer{transform:scale(1.12);opacity:.42;transition:transform .78s cubic-bezier(.22,1,.36,1),opacity .78s ease}.is-transitioning .silhouette-button,.is-transitioning .companion-dot,.is-transitioning .emotional-biome,.is-transitioning .scene-pulse{opacity:0;transition:opacity .32s ease}.is-transitioning .aura-orb-button{transform:translate(-50%,-190%) scale(.72);transition:transform .78s cubic-bezier(.22,1,.36,1)}.is-transitioning .constellation-layer{opacity:.78;transform:scale(2) translateY(-6vh);transition:transform .78s cubic-bezier(.22,1,.36,1),opacity .78s ease}
  @keyframes auraPulse{0%,100%{transform:scale(.96);opacity:.62}50%{transform:scale(1.06);opacity:.94}}@keyframes ringRotate{0%{rotate:0deg}100%{rotate:360deg}}@keyframes companionBreath{0%,100%{transform:scale(.94);opacity:.72}50%{transform:scale(1.06);opacity:1}}@keyframes fogDrift{0%{transform:translate(-2vw,1vh) scale(1)}100%{transform:translate(2vw,-1vh) scale(1.06)}}@keyframes auroraDrift{0%{transform:translateX(-2vw) scaleX(.95);opacity:.32}100%{transform:translateX(2vw) scaleX(1.08);opacity:.62}}@keyframes starFloat{0%,100%{opacity:.62;transform:translate(-50%,-50%) translateY(0) scale(.9)}50%{opacity:1;transform:translate(-50%,-50%) translateY(-7px) scale(1.08)}}@keyframes twinkle{0%,100%{opacity:.24;transform:scale(.84)}50%{opacity:.72;transform:scale(1.2)}}@keyframes pathReveal{from{stroke-dashoffset:18;opacity:0}to{stroke-dashoffset:0;opacity:1}}@keyframes terrainBreath{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(var(--terrain-rise) * -1))}}@keyframes riverMove{0%,100%{opacity:.22;transform:translateY(0) scaleX(.9)}50%{opacity:.72;transform:translateY(-8px) scaleX(1.06)}}@keyframes sparkRise{0%,100%{opacity:.1;transform:translateY(8px) scale(.75)}50%{opacity:.7;transform:translateY(-18px) scale(1.1)}}
  @media(min-width:760px){.urai-home-shell:after{content:"";position:absolute;left:50%;bottom:0;width:min(940px,82vw);height:52vh;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 28%,rgba(125,211,252,.055),transparent 62%);pointer-events:none;z-index:1}}
  @media(max-width:760px){.aura-orb-button{top:54%;width:310px;height:310px}.orb-core{width:116px;height:116px}.silhouette-button{left:calc(50% - 82px);height:270px;opacity:.45}.companion-dot{right:calc(50% - 100px)}.emotional-biome{width:118vw;height:36vh;bottom:-9vh}.scene-pulse{bottom:1rem}.constellation-layer{opacity:calc(var(--constellation-opacity) * .72)}}
`;
