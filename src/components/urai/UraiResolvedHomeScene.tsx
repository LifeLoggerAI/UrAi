"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { ResolvedVisual } from "@/components/urai/ResolvedVisual";
import { resolveUraiAssets } from "@/lib/urai-assets";
import { useUraiHomeState, type UraiHomeViewModel, type UraiLifeMapNode } from "@/lib/use-urai-home-state";
import { useUraiRemoteAssets } from "@/lib/use-urai-remote-assets";

type Mode = "home" | "transitioning" | "lifemap";
type HomePanel = "companion" | "self" | "biome" | "weather" | null;

const HOME_SLOTS = [
  "home.sky.background",
  "home.sky.clouds",
  "home.ground.base",
  "home.orb.core",
  "spatial.star.default",
  "spatial.star.memory",
  "spatial.star.ritual",
] as const;

const AMBIENT_STARS = [
  ["12%", "64%", 3, "-0.2s"],
  ["29%", "25%", 5, "-1.1s"],
  ["43%", "18%", 3, "-2.1s"],
  ["81%", "53%", 4, "-3.1s"],
  ["66%", "56%", 2, "-4.1s"],
  ["15%", "67%", 2, "-5.1s"],
] as const;

const RHYTHM_THEME = {
  stable: { sky: 0.82, fog: 0.42, star: 0.68, speed: "8.4s", ground: 0.58, warmth: 0.18 },
  focused: { sky: 0.94, fog: 0.48, star: 0.86, speed: "6.8s", ground: 0.68, warmth: 0.22 },
  overstimulated: { sky: 1.08, fog: 0.76, star: 1, speed: "4.8s", ground: 0.5, warmth: 0.08 },
  offRhythm: { sky: 0.62, fog: 0.82, star: 0.46, speed: "9.6s", ground: 0.42, warmth: 0.05 },
  recovering: { sky: 0.88, fog: 0.54, star: 0.74, speed: "8s", ground: 0.92, warmth: 0.42 },
} as const;

function nodeSize(node: UraiLifeMapNode) {
  return Math.round(12 + node.emotionalWeight * 18);
}

function constellationPath(nodes: UraiLifeMapNode[]) {
  if (nodes.length < 2) return "";
  return nodes.slice(0, 8).map((node, index) => `${index === 0 ? "M" : "L"} ${node.x} ${node.y}`).join(" ");
}

function companionLabel(home: UraiHomeViewModel) {
  if (home.companionMode === "quiet") return "Quiet";
  if (home.companionMode === "reflecting") return "Reflecting";
  if (home.companionMode === "forecasting") return "Forecasting";
  if (home.companionMode === "ritual") return "Ritual";
  if (home.companionMode === "protective") return "Protective";
  return "Listening";
}

export default function UraiResolvedHomeScene() {
  const [mode, setMode] = useState<Mode>("home");
  const [activePanel, setActivePanel] = useState<HomePanel>(null);
  const [activeNode, setActiveNode] = useState<UraiLifeMapNode | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const remoteAssets = useUraiRemoteAssets();
  const home = useUraiHomeState();
  const assets = useMemo(() => resolveUraiAssets(HOME_SLOTS, remoteAssets.assets), [remoteAssets.assets]);
  const theme = RHYTHM_THEME[home.rhythmState] ?? RHYTHM_THEME.focused;

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
    const timer = window.setTimeout(() => setMode("lifemap"), 1080);
    return () => window.clearTimeout(timer);
  }, [mode, reduceMotion]);

  const openLifeMap = () => {
    if (mode !== "home") return;
    setActivePanel(null);
    setActiveNode(null);
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setActivePanel(null);
    setActiveNode(null);
    setMode("home");
  };

  const showPanel = (panel: Exclude<HomePanel, null>) => {
    setActiveNode(null);
    setActivePanel(panel);
  };

  const sceneStyle = {
    "--aura-color": home.auraColor,
    "--aura-secondary": home.auraSecondaryColor,
    "--sky-intensity": theme.sky,
    "--fog-opacity": theme.fog,
    "--star-intensity": theme.star,
    "--orb-speed": theme.speed,
    "--ground-glow": theme.ground,
    "--horizon-warmth": theme.warmth + Math.min(home.recoveryScore / 260, 0.35),
  } as CSSProperties;

  if (mode === "lifemap") {
    return (
      <main className="urai-home-shell lifemap-shell">
        <div className="lifemap-backdrop" aria-hidden="true" />
        <LifeMapScene />
        <button type="button" className="return-home" onClick={returnHome}>Return home</button>
        <style jsx>{styles}</style>
      </main>
    );
  }

  const transitioning = mode === "transitioning";
  const whisper = home.narratorWhisper || "Your day is forming a quiet pattern.";

  return (
    <main className={`urai-home-shell rhythm-${home.rhythmState} companion-${home.companionMode} ${transitioning ? "is-transitioning" : ""}`} style={sceneStyle}>
      <button type="button" className="sky-layer" aria-label="Open URAI Life Map" onClick={openLifeMap}>
        <ResolvedVisual asset={assets["home.sky.background"]} className="asset-layer asset-sky" />
        <ResolvedVisual asset={assets["home.sky.clouds"]} className="asset-layer asset-clouds" />
        <span className="sky-gradient" />
        <span className="deep-atmosphere" />
        <span className="sky-fog sky-fog-one" />
        <span className="sky-fog sky-fog-two" />
        <span className="sky-vignette" />
      </button>

      <ConstellationLayer nodes={home.nodes} assets={assets} onNodeOpen={(node) => { setActivePanel(null); setActiveNode(node); }} />

      <section className="home-copy" aria-label="URAI narrator">
        <p className="sky-whisper">{whisper}</p>
        <p className="product-line">URAI is quietly reading the shape of your day.</p>
        <button type="button" className="life-map-cta" onClick={openLifeMap}>Enter Life Map</button>
      </section>

      <section className="body-field" aria-label="URAI body aura and companion field">
        <button type="button" className="body-aura-button" onClick={() => showPanel("self")} aria-label="Open Self State">
          <span className="body-aura-glow" />
          <span className="body-head" />
          <span className="body-rim" />
          <span className="body-core" />
          <span className="body-base-fade" />
          <span className="hotspot-label body-label">Self State</span>
        </button>

        <button type="button" className="companion-orb" onClick={() => showPanel("companion")} onDoubleClick={openLifeMap} aria-label="Open URAI Companion">
          <span className="orb-halo" />
          <span className="orb-wave orb-wave-one" />
          <span className="orb-wave orb-wave-two" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
          <span className="orb-core-fallback" />
          <ResolvedVisual asset={assets["home.orb.core"]} className="orb-asset" />
          <span className="orb-reflection" />
          <span className="hotspot-label orb-label">{companionLabel(home)}</span>
        </button>
      </section>

      <button type="button" className="ground-biome" aria-label="Open Emotional Biome" onClick={() => showPanel("biome")}>
        <ResolvedVisual asset={assets["home.ground.base"]} className="asset-ground" />
        <span className="terrain-depth" />
        <span className="horizon-line" />
        <span className="orb-ground-reflection" />
        <span className="biome-pill">Emotional Biome</span>
      </button>

      <button type="button" className="state-strip" aria-label="Open mood weather" onClick={() => showPanel("weather")}>
        <strong>{home.moodWeather}</strong>
        <span>{Math.round(home.recoveryScore)}% Recovery</span>
        <span>{home.memoryNodeCount} Memory Nodes</span>
        <span>{home.forecastSummary}</span>
      </button>

      {(activePanel || activeNode) && (
        <div className="sheet-backdrop" onClick={() => { setActivePanel(null); setActiveNode(null); }}>
          <aside className="home-sheet" onClick={(event) => event.stopPropagation()}>
            <span className="sheet-handle" />
            {activeNode ? (
              <>
                <span className="sheet-eyebrow">{activeNode.type} node</span>
                <h2>{activeNode.title}</h2>
                <p>{activeNode.subtitle}</p>
                <button type="button" onClick={openLifeMap}>Open Life Map</button>
              </>
            ) : null}
            {activePanel === "self" ? (
              <>
                <span className="sheet-eyebrow">Self State</span>
                <h2>{home.moodWeather}</h2>
                <p>Rhythm: {home.rhythmState}. Recovery: {Math.round(home.recoveryScore)}%. Cognitive load: {Math.round(home.cognitiveLoad * 100)}%.</p>
                <button type="button" onClick={() => setActivePanel(null)}>Hold Here</button>
              </>
            ) : null}
            {activePanel === "companion" ? (
              <>
                <span className="sheet-eyebrow">Companion</span>
                <h2>The orb is {companionLabel(home).toLowerCase()}.</h2>
                <p>{whisper}</p>
                <button type="button" onClick={openLifeMap}>Enter Life Map</button>
              </>
            ) : null}
            {activePanel === "biome" ? (
              <>
                <span className="sheet-eyebrow">Emotional Biome</span>
                <h2>{home.forecastSummary}</h2>
                <p>The ground glow, fog, and reflection are driven by rhythm, recovery, and aura state.</p>
                <button type="button" onClick={() => setActivePanel(null)}>Close Biome</button>
              </>
            ) : null}
            {activePanel === "weather" ? (
              <>
                <span className="sheet-eyebrow">Mood Weather</span>
                <h2>{home.moodWeather}</h2>
                <p>{home.forecastMessage || home.forecastSummary} Confidence: {Math.round(home.moodConfidence * 100)}%.</p>
                <button type="button" onClick={() => setActivePanel(null)}>Close Weather</button>
              </>
            ) : null}
          </aside>
        </div>
      )}

      <style jsx>{styles}</style>
    </main>
  );
}

function ConstellationLayer({ nodes, assets, onNodeOpen }: { nodes: UraiLifeMapNode[]; assets: ReturnType<typeof resolveUraiAssets>; onNodeOpen: (node: UraiLifeMapNode) => void }) {
  const visibleNodes = nodes.slice(0, 10);
  const path = constellationPath(visibleNodes);
  return (
    <div className="constellation-layer" aria-label="Memory constellation">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {path ? <path d={path} /> : null}
      </svg>
      {visibleNodes.map((node) => {
        const slot = node.type === "ritual" ? "spatial.star.ritual" : node.type === "memory" ? "spatial.star.memory" : "spatial.star.default";
        return (
          <button
            key={node.id}
            type="button"
            className={`memory-node node-${node.type}`}
            style={{ left: `${node.x}%`, top: `${node.y}%`, width: nodeSize(node), height: nodeSize(node), "--node-color": node.auraColor } as CSSProperties}
            onClick={(event) => { event.stopPropagation(); onNodeOpen(node); }}
            aria-label={`Open ${node.title}`}
          >
            <span className="node-glow" />
            <ResolvedVisual asset={assets[slot]} className="node-asset" />
            <span className="node-label">{node.title}</span>
          </button>
        );
      })}
      {AMBIENT_STARS.map(([left, top, size, delay], index) => (
        <span key={`${left}-${top}-${index}`} className="ambient-star" style={{ left, top, width: size, height: size, animationDelay: delay }} />
      ))}
    </div>
  );
}

const styles = `
  .urai-home-shell{position:fixed;inset:0;z-index:2147483647;width:100vw;height:100dvh;overflow:hidden;isolation:isolate;background:#020617;color:white;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--aura-color:#7ee7ff;--aura-secondary:#8b5cf6;--sky-intensity:.9;--fog-opacity:.48;--star-intensity:.86;--orb-speed:6.8s;--ground-glow:.68;--horizon-warmth:.22}.lifemap-shell{background:#020617}.lifemap-backdrop{position:fixed;inset:0;background:radial-gradient(circle at 50% 40%,rgba(103,232,249,.12),transparent 38%),#020617}.return-home{position:fixed;left:1rem;top:1rem;z-index:80;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:rgba(2,6,23,.58);color:rgba(255,255,255,.88);padding:.58rem .88rem;font-size:.82rem;backdrop-filter:blur(18px)}.sky-layer{position:absolute;inset:0;z-index:0;border:0;padding:0;background:transparent;overflow:hidden;cursor:zoom-in}.asset-layer{position:absolute;inset:0;pointer-events:none}.asset-layer :global(img),.asset-layer :global(svg){width:100%;height:100%;object-fit:cover}.asset-sky{z-index:1;opacity:calc(.46 * var(--sky-intensity));filter:saturate(1.05) brightness(.72)}.asset-clouds{z-index:4;opacity:calc(.14 * var(--fog-opacity));filter:blur(2px);mix-blend-mode:screen}.sky-gradient{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse at 50% 57%,color-mix(in srgb,var(--aura-color) 30%,transparent),transparent 35%),radial-gradient(ellipse at 50% 82%,rgba(2,6,23,.35),transparent 28%),linear-gradient(180deg,#020716 0%,#07173a 42%,#10295b 68%,#020617 100%);opacity:var(--sky-intensity)}.deep-atmosphere{position:absolute;inset:0;z-index:3;background:radial-gradient(ellipse at 27% 31%,rgba(96,165,250,.12),transparent 25%),radial-gradient(ellipse at 72% 34%,rgba(139,92,246,.12),transparent 28%)}.sky-fog{position:absolute;z-index:5;border-radius:999px;filter:blur(58px);opacity:var(--fog-opacity);mix-blend-mode:screen;pointer-events:none}.sky-fog-one{left:18%;top:30%;width:42vw;height:36vh;background:radial-gradient(circle,rgba(125,211,252,.22),transparent 68%);animation:fogDrift 18s ease-in-out infinite alternate}.sky-fog-two{right:9%;top:32%;width:40vw;height:38vh;background:radial-gradient(circle,color-mix(in srgb,var(--aura-secondary) 22%,transparent),transparent 72%);animation:fogDrift 22s ease-in-out infinite alternate-reverse}.sky-vignette{position:absolute;inset:0;z-index:8;background:radial-gradient(ellipse at 50% 50%,transparent 0%,transparent 43%,rgba(0,0,0,.28) 74%,rgba(0,0,0,.72) 100%),linear-gradient(180deg,rgba(0,0,0,.28),transparent 38%,rgba(0,0,0,.42));pointer-events:none}.home-copy{position:absolute;left:50%;top:17%;z-index:36;width:min(640px,calc(100vw - 2rem));transform:translateX(-50%);text-align:center;pointer-events:none}.sky-whisper{margin:0;color:rgba(255,255,255,.92);font-size:clamp(1.12rem,1.65vw,1.52rem);line-height:1.38;letter-spacing:-.02em;text-shadow:0 2px 32px rgba(0,0,0,.85)}.product-line{margin:.56rem 0 0;color:rgba(226,242,255,.64);font-size:clamp(.78rem,1vw,.94rem)}.life-map-cta{pointer-events:auto;margin-top:1rem;border:1px solid rgba(186,230,253,.42);border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.06));color:rgba(255,255,255,.94);padding:.72rem 1.14rem;font-size:.68rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase;box-shadow:0 18px 64px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.2);backdrop-filter:blur(16px);cursor:zoom-in}.life-map-cta:hover{transform:translateY(-1px);border-color:rgba(125,211,252,.72)}.constellation-layer{position:absolute;inset:0;z-index:20;pointer-events:none;opacity:calc(.76 * var(--star-intensity));animation:constellationReveal 1.4s ease-out both}.constellation-layer svg{position:absolute;inset:4% 5% auto 5%;width:90%;height:44%;overflow:visible}.constellation-layer path{fill:none;stroke:rgba(186,230,253,.48);stroke-width:.12;stroke-dasharray:1.4 2.8;filter:drop-shadow(0 0 6px rgba(186,230,253,.55));animation:pathDraw 2.8s ease-out both}.memory-node{position:absolute;z-index:3;transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;animation:starFloat 7s ease-in-out infinite}.node-glow{position:absolute;inset:-80%;border-radius:999px;background:radial-gradient(circle,var(--node-color),transparent 68%);opacity:.25;filter:blur(9px)}.node-asset{position:absolute;inset:0}.node-asset :global(img),.node-asset :global(svg){width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 12px rgba(255,255,255,.7))}.node-ritual .node-glow{opacity:.36}.node-relationship .node-glow{opacity:.2}.node-forecast .node-glow{opacity:.32}.node-recovery .node-glow{opacity:.34}.node-label{position:absolute;left:50%;top:calc(100% + .42rem);transform:translateX(-50%) translateY(5px);border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(2,6,23,.58);color:rgba(255,255,255,.78);padding:.3rem .5rem;font-size:.55rem;font-weight:750;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;opacity:0;transition:opacity .18s ease,transform .18s ease;backdrop-filter:blur(12px)}.memory-node:hover .node-label{opacity:1;transform:translateX(-50%) translateY(0)}.ambient-star{position:absolute;display:block;border-radius:999px;background:white;filter:drop-shadow(0 0 14px rgba(255,255,255,.72));opacity:.34;animation:twinkle 6s ease-in-out infinite}.body-field{position:absolute;inset:0;z-index:25;pointer-events:none}.body-aura-button{position:absolute;left:calc(50% - min(14vw,188px));top:58%;z-index:24;width:150px;height:390px;transform:translate(-50%,-50%);border:0;background:transparent;pointer-events:auto;cursor:pointer;opacity:.72;transition:opacity .25s ease,transform .25s ease}.body-aura-button:hover{opacity:.95;transform:translate(-50%,-51%)}.body-aura-glow{position:absolute;inset:0 -38%;border-radius:50%;background:radial-gradient(ellipse at 50% 38%,color-mix(in srgb,var(--aura-color) 20%,transparent),transparent 67%);filter:blur(18px)}.body-head{position:absolute;left:50%;top:5%;width:54px;height:72px;transform:translateX(-50%);border-radius:50%;background:linear-gradient(180deg,rgba(207,250,254,.34),rgba(125,211,252,.12));box-shadow:0 0 28px color-mix(in srgb,var(--aura-color) 20%,transparent)}.body-rim{position:absolute;left:50%;top:24%;width:82px;height:230px;transform:translateX(-50%);border-radius:48% 48% 36% 36%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);filter:blur(5px)}.body-core{position:absolute;left:50%;top:21%;width:78px;height:268px;transform:translateX(-50%);border-radius:52% 52% 38% 38%;background:linear-gradient(180deg,rgba(188,235,255,.22),rgba(96,165,250,.13) 36%,rgba(2,6,23,.1) 82%,transparent);clip-path:polygon(42% 0,58% 0,82% 22%,92% 72%,70% 100%,30% 100%,8% 72%,18% 22%);box-shadow:inset 12px 0 22px rgba(255,255,255,.06),inset -16px -24px 34px rgba(2,6,23,.18)}.body-base-fade{position:absolute;left:50%;bottom:5%;width:118px;height:78px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(125,211,252,.12),transparent 68%);filter:blur(14px)}.hotspot-label{position:absolute;left:50%;transform:translateX(-50%);border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(2,6,23,.55);color:rgba(226,242,255,.7);padding:.34rem .55rem;font-size:.58rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;backdrop-filter:blur(12px)}.body-label{top:45%;opacity:0;transition:opacity .18s ease}.body-aura-button:hover .body-label{opacity:1}.companion-orb{position:absolute;left:50%;top:59%;z-index:32;width:clamp(286px,23vw,390px);height:clamp(286px,23vw,390px);transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;animation:orbBreath var(--orb-speed) ease-in-out infinite}.companion-orb:hover{transform:translate(-50%,-50%) scale(1.035)}.orb-halo{position:absolute;inset:-28%;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.18),color-mix(in srgb,var(--aura-color) 28%,transparent) 34%,transparent 70%);filter:blur(28px);animation:haloBreath var(--orb-speed) ease-in-out infinite}.orb-wave{position:absolute;inset:12%;border-radius:999px;border:1px solid rgba(255,255,255,.12);opacity:.5}.orb-wave-one{animation:orbWave calc(var(--orb-speed) * 1.2) ease-out infinite}.orb-wave-two{animation:orbWave calc(var(--orb-speed) * 1.2) ease-out infinite .9s}.orb-ring{position:absolute;border-radius:999px;border:1px solid rgba(255,255,255,.18);box-shadow:0 0 34px color-mix(in srgb,var(--aura-color) 18%,transparent);animation:ringRotate 12s linear infinite}.orb-ring-one{inset:22%}.orb-ring-two{inset:13%;opacity:.38;animation-duration:18s;animation-direction:reverse}.orb-core-fallback{position:absolute;left:50%;top:50%;z-index:3;width:118px;height:118px;transform:translate(-50%,-50%);border-radius:999px;background:radial-gradient(circle at 34% 25%,#fff 0 8%,#cffafe 18%,#67e8f9 42%,#0e7490 64%,#082f49 86%);box-shadow:inset -16px -22px 34px rgba(2,6,23,.58),inset 14px 10px 20px rgba(255,255,255,.2),0 0 42px rgba(255,255,255,.46),0 0 112px color-mix(in srgb,var(--aura-color) 48%,transparent)}.orb-asset{position:absolute;left:50%;top:50%;z-index:4;width:128px;height:128px;transform:translate(-50%,-50%);border-radius:999px}.orb-asset :global(img),.orb-asset :global(svg){width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 44px color-mix(in srgb,var(--aura-color) 65%,transparent))}.orb-reflection{position:absolute;left:50%;top:67%;width:98px;height:28px;transform:translateX(-50%);border-radius:50%;background:rgba(2,6,23,.34);filter:blur(5px);z-index:2}.orb-label{bottom:17%;opacity:.84}.companion-quiet{--orb-speed:9.4s}.companion-listening .orb-halo{opacity:1}.companion-reflecting .orb-halo{background:radial-gradient(circle,rgba(255,255,255,.16),color-mix(in srgb,var(--aura-secondary) 34%,transparent) 34%,transparent 70%)}.companion-forecasting .orb-wave{opacity:.68}.companion-ritual .orb-halo{background:radial-gradient(circle,rgba(255,248,220,.24),rgba(251,191,36,.22) 32%,color-mix(in srgb,var(--aura-color) 18%,transparent) 62%,transparent 75%)}.ground-biome{position:absolute;left:50%;bottom:-5vh;z-index:22;width:min(1260px,96vw);height:34vh;transform:translateX(-50%);border:0;background:transparent;pointer-events:auto;cursor:pointer}.asset-ground{position:absolute;inset:0;opacity:calc(.36 * var(--ground-glow));mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.6) 20%,#000 100%)}.asset-ground :global(img),.asset-ground :global(svg){width:100%;height:100%;object-fit:cover}.terrain-depth{position:absolute;inset:0;border-radius:50% 50% 0 0;background:radial-gradient(ellipse at 50% 8%,rgba(226,249,255,calc(.2 * var(--ground-glow))),rgba(125,211,252,.1) 27%,transparent 58%),linear-gradient(180deg,rgba(24,56,103,.24),rgba(2,6,23,.92) 72%);box-shadow:0 -26px 120px color-mix(in srgb,var(--aura-color) 20%,transparent)}.horizon-line{position:absolute;left:10%;right:10%;top:12%;height:1px;background:linear-gradient(90deg,transparent,rgba(226,242,255,.35),transparent);filter:blur(.5px)}.orb-ground-reflection{position:absolute;left:50%;top:9%;width:min(480px,48vw);height:80px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,color-mix(in srgb,var(--aura-color) 22%,transparent),rgba(255,255,255,.06) 34%,transparent 72%);filter:blur(14px);opacity:calc(.8 * var(--ground-glow))}.biome-pill{position:absolute;left:50%;top:25%;transform:translateX(-50%);border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(2,6,23,.5);color:rgba(226,242,255,.68);padding:.54rem .88rem;font-size:.62rem;font-weight:850;letter-spacing:.2em;text-transform:uppercase;backdrop-filter:blur(16px)}.state-strip{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom) + 1.05rem);z-index:50;display:flex;align-items:center;justify-content:center;gap:.62rem;max-width:min(760px,calc(100vw - 2rem));transform:translateX(-50%);border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(2,6,23,.52);color:rgba(226,242,255,.7);padding:.68rem .92rem;box-shadow:0 22px 80px rgba(0,0,0,.34);backdrop-filter:blur(22px);cursor:pointer}.state-strip strong{color:rgba(255,255,255,.92);font-size:.82rem}.state-strip span{font-size:.75rem;white-space:nowrap}.state-strip span:before{content:"·";margin-right:.62rem;color:rgba(186,230,253,.38)}.sheet-backdrop{position:absolute;inset:0;z-index:70;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.36);padding:1rem;backdrop-filter:blur(2px)}.home-sheet{width:min(430px,100%);border:1px solid rgba(255,255,255,.14);border-radius:1.7rem;background:rgba(2,6,23,.9);padding:1rem;box-shadow:0 30px 100px rgba(0,0,0,.55);backdrop-filter:blur(24px)}.sheet-handle{display:block;width:42px;height:4px;margin:0 auto .9rem;border-radius:999px;background:rgba(255,255,255,.18)}.sheet-eyebrow{color:rgba(125,211,252,.76);font-size:.62rem;font-weight:850;letter-spacing:.2em;text-transform:uppercase}.home-sheet h2{margin:.45rem 0;color:rgba(255,255,255,.94);font-size:1.12rem;line-height:1.25}.home-sheet p{margin:.45rem 0 0;color:rgba(226,242,255,.68);font-size:.9rem;line-height:1.55}.home-sheet button{margin-top:.9rem;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.88);padding:.62rem .86rem;font-size:.84rem;font-weight:750}.is-transitioning .sky-layer{transform:scale(1.1);opacity:.42;transition:transform 1s cubic-bezier(.22,1,.36,1),opacity 1s ease}.is-transitioning .home-copy,.is-transitioning .state-strip,.is-transitioning .ground-biome,.is-transitioning .body-aura-button{opacity:0;transition:opacity .36s ease}.is-transitioning .companion-orb{transform:translate(-50%,-185%) scale(.72);transition:transform 1s cubic-bezier(.22,1,.36,1)}.is-transitioning .constellation-layer{transform:scale(2.1) translateY(-6vh);opacity:1;transition:transform 1s cubic-bezier(.22,1,.36,1),opacity 1s ease}@keyframes haloBreath{0%,100%{opacity:.62;transform:scale(.96)}50%{opacity:1;transform:scale(1.06)}}@keyframes orbBreath{0%,100%{filter:drop-shadow(0 0 38px color-mix(in srgb,var(--aura-color) 26%,transparent))}50%{filter:drop-shadow(0 0 94px color-mix(in srgb,var(--aura-color) 68%,transparent))}}@keyframes orbWave{0%{opacity:.58;transform:scale(.72)}100%{opacity:0;transform:scale(1.35)}}@keyframes ringRotate{0%{transform:rotate(0deg) scaleX(1.06) scaleY(.94)}100%{transform:rotate(360deg) scaleX(1.06) scaleY(.94)}}@keyframes fogDrift{0%{transform:translate(-2vw,1vh) scale(1)}100%{transform:translate(2vw,-1vh) scale(1.06)}}@keyframes starFloat{0%,100%{opacity:.66;transform:translate(-50%,-50%) translateY(0) scale(.92)}50%{opacity:1;transform:translate(-50%,-50%) translateY(-7px) scale(1.08)}}@keyframes twinkle{0%,100%{opacity:.22;transform:scale(.84)}50%{opacity:.64;transform:scale(1.18)}}@keyframes constellationReveal{from{opacity:0}to{opacity:calc(.76 * var(--star-intensity))}}@keyframes pathDraw{from{stroke-dashoffset:18;opacity:0}to{stroke-dashoffset:0;opacity:1}}@media(max-width:760px){.home-copy{top:12%;width:calc(100vw - 1.5rem)}.product-line{font-size:.78rem}.constellation-layer svg{height:38%;inset-top:7%}.body-aura-button{left:calc(50% - 86px);top:59%;width:112px;height:310px;opacity:.52}.companion-orb{top:58%;width:230px;height:230px}.orb-core-fallback{width:90px;height:90px}.orb-asset{width:98px;height:98px}.orb-label{bottom:12%}.ground-biome{height:30vh;bottom:-4vh}.biome-pill{top:27%;font-size:.56rem;padding:.5rem .76rem}.state-strip{left:.75rem;right:.75rem;bottom:calc(env(safe-area-inset-bottom) + .75rem);width:auto;max-width:none;transform:none;display:grid;grid-template-columns:1fr;gap:.18rem;border-radius:1.1rem;align-items:start;text-align:left;padding:.72rem .86rem}.state-strip span{font-size:.72rem}.state-strip span:before{content:"";margin:0}.state-strip strong{font-size:.82rem}.node-label{display:none}.sheet-backdrop{padding:.75rem}.home-sheet{border-radius:1.45rem}.ambient-star{opacity:.25}}@media(max-width:420px){.sky-whisper{font-size:1.06rem}.life-map-cta{padding:.64rem .92rem}.body-aura-button{left:calc(50% - 72px);width:96px;height:278px}.companion-orb{width:210px;height:210px}.ground-biome{height:28vh}.constellation-layer{opacity:.58}.memory-node{min-width:44px;min-height:44px}.node-asset{inset:12px}.node-glow{inset:0}.biome-pill{top:29%}}@media(prefers-reduced-motion:reduce){.sky-fog,.memory-node,.ambient-star,.orb-halo,.orb-wave,.orb-ring,.companion-orb,.constellation-layer path{animation:none!important}.is-transitioning .sky-layer,.is-transitioning .companion-orb,.is-transitioning .constellation-layer{transition-duration:.01ms!important}}
`;