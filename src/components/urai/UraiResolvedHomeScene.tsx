"use client";

import { useEffect, useMemo, useState } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { ResolvedVisual } from "@/components/urai/ResolvedVisual";
import { resolveUraiAssets } from "@/lib/urai-assets";
import { useUraiRemoteAssets } from "@/lib/use-urai-remote-assets";

type Mode = "home" | "transitioning" | "lifemap";
type HomePanel = "companion" | "self" | "biome" | null;

type MemoryNode = {
  id: string;
  label: string;
  detail: string;
  x: string;
  y: string;
  size: number;
  delay: string;
};

const HOME_SLOTS = [
  "home.sky.background",
  "home.sky.clouds",
  "home.ground.base",
  "home.orb.core",
  "home.silhouette.body",
  "spatial.star.default",
] as const;

const TONE_COPY = {
  home: "A quiet pattern is becoming visible.",
  transitioning: "The sky is opening.",
  lifemap: "The memory field is active.",
};

const HOME_STATE_CHIPS = [
  { label: "Mood Weather", value: "Clouded Focus" },
  { label: "Memory Nodes", value: "12" },
  { label: "Recovery", value: "67%" },
  { label: "Forecast", value: "Soft shift ahead" },
];

const MEMORY_NODES: MemoryNode[] = [
  { id: "recovery-signal", label: "Recovery Signal", detail: "A calmer pattern appeared after the late-night loop.", x: "28%", y: "25%", size: 18, delay: "-.4s" },
  { id: "forecast-shift", label: "Forecast Shift", detail: "The next state is trending softer, not solved yet.", x: "52%", y: "11%", size: 21, delay: "-1.2s" },
  { id: "focus-thread", label: "Focus Thread", detail: "Attention returned around one repeated proof action.", x: "59%", y: "27%", size: 24, delay: "-1.7s" },
  { id: "relationship-echo", label: "Relationship Echo", detail: "A silence pattern is asking to be seen without judgment.", x: "72%", y: "40%", size: 18, delay: "-2.6s" },
];

const AMBIENT_STARS = [
  ["12%", "64%", 4, "-0.2s"],
  ["36%", "50%", 6, "-1.1s"],
  ["42%", "17%", 6, "-2.1s"],
  ["66%", "56%", 5, "-3.1s"],
  ["82%", "55%", 5, "-4.1s"],
] as const;

export default function UraiResolvedHomeScene() {
  const [mode, setMode] = useState<Mode>("home");
  const [activePanel, setActivePanel] = useState<HomePanel>(null);
  const [activeNode, setActiveNode] = useState<MemoryNode | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const remoteAssets = useUraiRemoteAssets();
  const assets = useMemo(() => resolveUraiAssets(HOME_SLOTS, remoteAssets.assets), [remoteAssets.assets]);

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
    const timer = window.setTimeout(() => setMode("lifemap"), 1100);
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

  const openPanel = (panel: Exclude<HomePanel, null>) => {
    setActiveNode(null);
    setActivePanel(panel);
  };

  if (mode === "lifemap") {
    return (
      <main className="resolved-shell lifemap-shell">
        <div className="lifemap-backdrop" aria-hidden="true" />
        <div className="lifemap-layer">
          <LifeMapScene />
        </div>
        <button type="button" className="return-home" onClick={returnHome}>Return home</button>
        <style jsx>{shellStyles}</style>
      </main>
    );
  }

  const isTransitioning = mode === "transitioning";
  const isWired = remoteAssets.state === "ready" && remoteAssets.assets.length > 0;

  return (
    <main className={`resolved-shell ${isTransitioning ? "is-transitioning" : ""}`} onClick={openLifeMap}>
      <div className="cinematic-backdrop" aria-hidden="true">
        <ResolvedVisual asset={assets["home.sky.background"]} className="asset-layer asset-sky" />
        <ResolvedVisual asset={assets["home.sky.clouds"]} className="asset-layer asset-clouds" />
        <div className="sky-gradient" />
        <div className="sky-vignette" />
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="orb-bloom-field" />
        <ResolvedVisual asset={assets["home.ground.base"]} className="asset-layer asset-ground" />
        <div className="terrain" />
      </div>
      <button type="button" className="sky-hitbox" onClick={openLifeMap} aria-label="Open URAI Life Map" />

      <section className="home-stage" aria-label="URAI resolved visual home scene">
        <div className="asset-status" aria-label="Visual asset status">{isWired ? "Live visuals" : remoteAssets.state === "loading" ? "Loading visuals" : "Demo fallback visuals"}</div>

        <button type="button" className="biome-hitbox" onClick={(event) => { event.stopPropagation(); openPanel("biome"); }} aria-label="Open Emotional Biome">
          Emotional Biome
        </button>

        <button type="button" className="silhouette-wrap" onClick={(event) => { event.stopPropagation(); openPanel("self"); }} aria-label="Open Self State">
          <ResolvedVisual asset={assets["home.silhouette.body"]} className="silhouette-asset" />
          <span className="hotspot-label silhouette-label">Self State</span>
        </button>

        <button type="button" className="orb-button" onClick={(event) => { event.stopPropagation(); openPanel("companion"); }} onDoubleClick={(event) => { event.stopPropagation(); openLifeMap(); }} aria-label="Open URAI companion">
          <span className="orb-fallback-glow" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
          <ResolvedVisual asset={assets["home.orb.core"]} className="orb-asset" />
          <span className="hotspot-label orb-label">Companion</span>
        </button>

        <div className="foreground-stars" aria-label="Memory nodes">
          {MEMORY_NODES.map((node) => (
            <button key={node.id} type="button" className="memory-star" style={{ left: node.x, top: node.y, width: node.size, height: node.size, animationDelay: node.delay }} onClick={(event) => { event.stopPropagation(); setActivePanel(null); setActiveNode(node); }} aria-label={`Open ${node.label} memory node`}>
              <ResolvedVisual asset={assets["spatial.star.default"]} className="memory-star-asset" />
              <span className="star-label">{node.label}</span>
            </button>
          ))}
          {AMBIENT_STARS.map(([left, top, size, delay], index) => (
            <span key={`${left}-${top}-${index}`} className="ambient-star" style={{ left, top, width: size, height: size, animationDelay: delay }} />
          ))}
        </div>

        <div className="home-copy">
          <p className="sky-whisper" aria-live="polite">{TONE_COPY[mode]}</p>
          <p className="product-line">URAI turns passive signals into a living map of memory, mood, and reflection.</p>
          <button type="button" className="life-map-cta" onClick={(event) => { event.stopPropagation(); openLifeMap(); }}>Enter Life Map</button>
        </div>

        <div className="state-hud" aria-label="Current URAI state">
          {HOME_STATE_CHIPS.map((chip) => (
            <div className="state-chip" key={chip.label}>
              <span>{chip.label}</span>
              <strong>{chip.value}</strong>
            </div>
          ))}
        </div>

        {(activePanel || activeNode) && (
          <aside className="context-card" onClick={(event) => event.stopPropagation()} aria-live="polite">
            {activeNode ? <><span className="context-eyebrow">Memory Node</span><h2>{activeNode.label}</h2><p>{activeNode.detail}</p><button type="button" onClick={openLifeMap}>Open Memory Field</button></> : null}
            {activePanel === "companion" ? <><span className="context-eyebrow">Companion</span><h2>The orb is listening.</h2><p>The orb now resolves from the URAI visual asset registry when assets are present, with demo fallback only when none are available.</p><button type="button" onClick={openLifeMap}>Enter Life Map</button></> : null}
            {activePanel === "self" ? <><span className="context-eyebrow">Self State</span><h2>Clouded focus, stabilizing.</h2><p>The avatar is wired through the same asset resolver as the rest of the home scene.</p><button type="button" onClick={() => setActivePanel(null)}>Hold Here</button></> : null}
            {activePanel === "biome" ? <><span className="context-eyebrow">Emotional Biome</span><h2>The ground is the horizon layer.</h2><p>Ground imagery is loaded from the asset registry when present. The fallback is now a soft horizon, not a hard placeholder wedge.</p><button type="button" onClick={() => setActivePanel(null)}>Close Biome</button></> : null}
          </aside>
        )}
      </section>

      <style jsx>{shellStyles}</style>
    </main>
  );
}

const shellStyles = `
  .resolved-shell{position:fixed;inset:0;z-index:2147483647;height:100dvh;width:100vw;overflow:hidden;isolation:isolate;background:#020617;color:white;cursor:zoom-in;user-select:none;contain:paint}.lifemap-shell{cursor:default}.lifemap-backdrop,.cinematic-backdrop{position:fixed;inset:0;z-index:0;overflow:hidden;background:linear-gradient(180deg,#020718 0%,#07163a 42%,#0d2551 69%,#030816 100%)}.asset-layer{position:fixed;inset:0;z-index:1;pointer-events:none}.asset-layer :global(img),.asset-layer :global(svg){width:100%;height:100%;object-fit:cover}.asset-sky{opacity:.5;filter:saturate(1.08) contrast(1.05) brightness(.72)}.asset-clouds{opacity:.16;filter:blur(1.5px) brightness(.85);mix-blend-mode:screen}.asset-ground{top:auto;bottom:0;height:38vh;opacity:.18;filter:saturate(.92) brightness(.7);mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.55) 30%,#000 100%)}.sky-gradient{position:fixed;inset:0;z-index:2;background:radial-gradient(ellipse at 50% 55%,rgba(76,137,215,.36),transparent 34%),radial-gradient(ellipse at 50% 76%,rgba(125,211,252,.18),transparent 24%),radial-gradient(ellipse at 28% 31%,rgba(96,165,250,.14),transparent 26%)}.sky-vignette{position:fixed;inset:0;z-index:10;background:radial-gradient(ellipse at 50% 48%,transparent 0%,transparent 46%,rgba(0,0,0,.28) 78%,rgba(0,0,0,.72) 100%),linear-gradient(180deg,rgba(0,0,0,.28) 0%,transparent 38%,rgba(0,0,0,.34) 100%)}.cinematic-backdrop:after{content:"";position:fixed;inset:0;z-index:9;background:radial-gradient(circle at 15% 64%,rgba(221,244,255,.56) 0 1.2px,transparent 3px),radial-gradient(circle at 28% 25%,rgba(221,244,255,.62) 0 1.1px,transparent 3px),radial-gradient(circle at 43% 19%,rgba(221,244,255,.5) 0 1px,transparent 3px),radial-gradient(circle at 52% 10%,rgba(255,255,255,.68) 0 1.4px,transparent 4px),radial-gradient(circle at 59% 27%,rgba(255,255,255,.62) 0 1.6px,transparent 5px),radial-gradient(circle at 72% 40%,rgba(221,244,255,.58) 0 1.3px,transparent 4px),radial-gradient(circle at 81% 55%,rgba(221,244,255,.45) 0 1px,transparent 4px);filter:drop-shadow(0 0 10px rgba(191,234,255,.38));opacity:.64}.aurora{position:fixed;z-index:3;border-radius:999px;filter:blur(56px);opacity:.58;animation:auraDrift 15s ease-in-out infinite alternate}.aurora-one{left:16vw;top:26vh;width:44vw;height:36vh;background:radial-gradient(circle,rgba(96,165,250,.23),transparent 70%)}.aurora-two{right:8vw;top:32vh;width:42vw;height:42vh;background:radial-gradient(circle,rgba(167,139,250,.16),transparent 72%);animation-delay:-4s}.orb-bloom-field{position:fixed;left:50%;top:64%;z-index:4;width:min(620px,52vw);height:min(420px,42vh);transform:translate(-50%,-50%);border-radius:999px;background:radial-gradient(circle,rgba(207,250,254,.3),rgba(125,211,252,.18) 31%,rgba(59,130,246,.07) 58%,transparent 74%);filter:blur(28px);opacity:.95;mix-blend-mode:screen}.terrain{position:fixed;left:50%;bottom:-19vh;z-index:6;width:min(1240px,95vw);height:36vh;transform:translateX(-50%);border-radius:50% 50% 0 0;background:radial-gradient(ellipse at 50% 6%,rgba(219,245,255,.28),rgba(125,211,252,.1) 28%,transparent 58%),linear-gradient(180deg,rgba(153,214,244,.08) 0%,rgba(9,31,63,.28) 36%,rgba(2,6,23,.96) 78%);box-shadow:0 -22px 100px rgba(125,211,252,.16);animation:horizonBreathe 8s ease-in-out infinite}.terrain:before{content:"";position:absolute;left:-6%;right:-6%;top:-6%;height:42%;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(232,249,255,.2),rgba(125,211,252,.07) 40%,transparent 72%);filter:blur(12px)}.terrain:after{content:"";position:absolute;left:10%;right:10%;top:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(226,242,255,.32),transparent);filter:blur(.5px)}.lifemap-layer{position:relative;z-index:5;min-height:100dvh}.return-home{position:fixed;left:1rem;top:1rem;z-index:60;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(0,0,0,.42);color:rgba(255,255,255,.88);padding:.55rem .9rem;font-size:.85rem;backdrop-filter:blur(12px)}.sky-hitbox{position:fixed;inset:0 0 40% 0;z-index:12;border:0;background:transparent;cursor:zoom-in}.home-stage{position:relative;z-index:20;min-height:100dvh;display:grid;place-items:center;pointer-events:none}.asset-status{position:fixed;right:1rem;top:1rem;z-index:49;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(2,6,23,.38);color:rgba(226,242,255,.58);padding:.38rem .62rem;font-size:.56rem;letter-spacing:.18em;text-transform:uppercase;backdrop-filter:blur(14px)}.biome-hitbox{position:fixed;left:50%;bottom:5.5vh;z-index:42;transform:translateX(-50%);border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(15,23,42,.42);color:rgba(255,255,255,.62);padding:.5rem .85rem;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;backdrop-filter:blur(14px);cursor:pointer;pointer-events:auto}.biome-hitbox:hover{color:white;border-color:rgba(125,211,252,.56);transform:translateX(-50%) translateY(-2px)}.silhouette-wrap{position:fixed;left:calc(50% - min(15vw,210px));bottom:12vh;z-index:25;width:clamp(108px,9vw,154px);height:clamp(285px,42vh,450px);border:0;padding:0;background:transparent;cursor:pointer;pointer-events:auto;opacity:.76;filter:drop-shadow(0 0 40px rgba(126,231,255,.28))}.silhouette-wrap :global(img),.silhouette-wrap :global(svg){width:100%;height:100%;object-fit:contain}.silhouette-wrap:hover{opacity:.96;transform:translateY(-4px);filter:drop-shadow(0 0 58px rgba(186,230,253,.42))}.orb-button{position:fixed;left:50%;top:65%;z-index:34;width:clamp(170px,13vw,224px);height:clamp(170px,13vw,224px);transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;cursor:pointer;pointer-events:auto;animation:orbBreath 6.4s ease-in-out infinite}.orb-button:hover{transform:translate(-50%,-50%) scale(1.08);filter:drop-shadow(0 0 72px rgba(125,211,252,.7))}.orb-asset{position:absolute;inset:22%;z-index:3;border-radius:999px}.orb-asset :global(img),.orb-asset :global(svg){width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 28px rgba(255,255,255,.72)) drop-shadow(0 0 76px rgba(103,232,249,.58))}.orb-fallback-glow{position:absolute;inset:-70%;z-index:1;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.34),rgba(103,232,249,.24) 30%,rgba(139,92,246,.1) 57%,transparent 76%);filter:blur(22px);animation:orbPulse 5.5s ease-in-out infinite}.orb-ring{position:absolute;inset:4%;z-index:2;border-radius:999px;border:1px solid rgba(255,255,255,.22);box-shadow:0 0 30px rgba(125,211,252,.16);animation:orbitRing 8s linear infinite}.orb-ring-two{inset:-7%;opacity:.44;animation-duration:12s;animation-direction:reverse}.hotspot-label,.star-label{position:absolute;left:50%;transform:translateX(-50%) translateY(8px);border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(2,6,23,.5);color:rgba(255,255,255,.72);padding:.35rem .55rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;opacity:0;backdrop-filter:blur(12px);transition:opacity 220ms ease,transform 220ms ease;pointer-events:none}.silhouette-label{top:38%}.orb-label{bottom:-10%;opacity:.8;transform:translateX(-50%) translateY(0)}.silhouette-wrap:hover .hotspot-label,.orb-button:hover .hotspot-label,.memory-star:hover .star-label{opacity:1;transform:translateX(-50%) translateY(0)}.foreground-stars{position:fixed;inset:0;z-index:30;pointer-events:none;opacity:.88}.memory-star{position:absolute;z-index:2;border:0;padding:0;background:transparent;cursor:pointer;pointer-events:auto;transform:translate(-50%,-50%);animation:starFloat 7s ease-in-out infinite}.memory-star-asset,.ambient-star{position:absolute;inset:0;display:block}.memory-star-asset :global(img),.memory-star-asset :global(svg){width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 14px rgba(255,255,255,.68))}.star-label{top:calc(100% + .42rem)}.ambient-star{z-index:1;opacity:.46;border-radius:999px;background:radial-gradient(circle,white 0 14%,#b9e8ff 26%,rgba(138,108,255,.32) 58%,transparent 72%);filter:drop-shadow(0 0 14px rgba(255,255,255,.68));animation:ambientTwinkle 6s ease-in-out infinite}.home-copy{position:fixed;left:50%;top:18.5%;z-index:44;width:min(640px,calc(100vw - 2rem));transform:translateX(-50%);text-align:center;pointer-events:auto}.sky-whisper{margin:0;color:rgba(255,255,255,.92);font-size:clamp(1.05rem,1.55vw,1.42rem);line-height:1.45;text-shadow:0 2px 28px rgba(0,0,0,.9)}.product-line{margin:.55rem auto 0;max-width:34rem;color:rgba(226,242,255,.64);font-size:clamp(.76rem,1vw,.95rem);line-height:1.5;text-shadow:0 2px 22px rgba(0,0,0,.72)}.life-map-cta{margin-top:.9rem;border:1px solid rgba(186,230,253,.42);border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.07));color:rgba(255,255,255,.94);padding:.72rem 1.1rem;font-size:.68rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;box-shadow:0 18px 64px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.22);backdrop-filter:blur(16px);cursor:zoom-in}.state-hud{position:fixed;left:1rem;bottom:1rem;z-index:48;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;width:min(420px,calc(100vw - 2rem));pointer-events:auto}.state-chip{border:1px solid rgba(255,255,255,.12);border-radius:1rem;background:rgba(2,6,23,.5);padding:.7rem .78rem;backdrop-filter:blur(16px)}.state-chip span{display:block;color:rgba(226,242,255,.52);font-size:.58rem;letter-spacing:.16em;text-transform:uppercase}.state-chip strong{display:block;margin-top:.22rem;color:rgba(255,255,255,.9);font-size:.84rem;font-weight:650}.context-card{position:fixed;right:1rem;bottom:1rem;z-index:56;width:min(360px,calc(100vw - 2rem));border:1px solid rgba(255,255,255,.16);border-radius:1.4rem;background:linear-gradient(180deg,rgba(15,23,42,.82),rgba(2,6,23,.72));padding:1rem;box-shadow:0 28px 96px rgba(0,0,0,.46);backdrop-filter:blur(20px);pointer-events:auto}.context-eyebrow{color:rgba(125,211,252,.78);font-size:.62rem;letter-spacing:.2em;text-transform:uppercase}.context-card h2{margin:.42rem 0 .35rem;color:rgba(255,255,255,.94);font-size:1.05rem;line-height:1.25}.context-card p{margin:0;color:rgba(226,242,255,.66);font-size:.86rem;line-height:1.5}.context-card button{margin-top:.8rem;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.86);padding:.55rem .8rem;cursor:pointer}.is-transitioning .orb-button{transform:translate(-50%,-310%) scale(.68);opacity:.78;filter:drop-shadow(0 0 110px rgba(255,255,255,.72))}.is-transitioning .silhouette-wrap{transform:translateY(34vh) scale(.74);opacity:.14;filter:blur(3px)}.is-transitioning .foreground-stars{transform:scale(2.25) translateY(-8vh);opacity:1}.is-transitioning .state-hud,.is-transitioning .context-card,.is-transitioning .biome-hitbox,.is-transitioning .product-line,.is-transitioning .life-map-cta{opacity:0;pointer-events:none}@keyframes orbPulse{0%,100%{opacity:.68;transform:scale(.94)}50%{opacity:1;transform:scale(1.08)}}@keyframes orbBreath{0%,100%{filter:drop-shadow(0 0 34px rgba(125,211,252,.34))}50%{filter:drop-shadow(0 0 70px rgba(125,211,252,.7))}}@keyframes orbitRing{0%{transform:rotate(0deg) scaleX(1.04) scaleY(.94)}100%{transform:rotate(360deg) scaleX(1.04) scaleY(.94)}}@keyframes starFloat{0%,100%{opacity:.68;transform:translate(-50%,-50%) translateY(0) scale(.92)}50%{opacity:1;transform:translate(-50%,-50%) translateY(-8px) scale(1.1)}}@keyframes ambientTwinkle{0%,100%{opacity:.3;transform:scale(.86)}50%{opacity:.82;transform:scale(1.15)}}@keyframes auraDrift{0%{transform:translateX(-2vw) translateY(1vh) scale(1)}100%{transform:translateX(2vw) translateY(-1vh) scale(1.04)}}@keyframes horizonBreathe{0%,100%{opacity:.76;transform:translateX(-50%) scaleX(.98)}50%{opacity:.95;transform:translateX(-50%) scaleX(1.03)}}@media(max-width:800px){.orb-bloom-field{width:84vw}.silhouette-wrap{left:calc(50% - 112px);width:118px;height:330px;bottom:14vh}.orb-button{top:64%;width:152px;height:152px}.home-copy{top:12%}.state-hud{grid-template-columns:1fr 1fr;bottom:.75rem;left:.75rem;width:calc(100vw - 1.5rem)}.context-card{right:.75rem;bottom:7.6rem}.biome-hitbox{bottom:14vh}}@media(prefers-reduced-motion:reduce){.orb-button,.silhouette-wrap,.foreground-stars,.orb-fallback-glow,.memory-star,.ambient-star,.aurora,.terrain,.orb-ring{animation:none!important;transition-duration:.01ms!important}}
`;
