"use client";

import { useEffect, useMemo, useState } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { ResolvedVisual } from "@/components/urai/ResolvedVisual";
import { UraiVisualBackdrop } from "@/components/urai/UraiVisualBackdrop";
import { resolveUraiAssets } from "@/lib/urai-assets";

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
  {
    id: "recovery-signal",
    label: "Recovery Signal",
    detail: "A calmer pattern appeared after the late-night loop.",
    x: "28%",
    y: "24%",
    size: 22,
    delay: "-.4s",
  },
  {
    id: "focus-thread",
    label: "Focus Thread",
    detail: "Attention returned around one repeated proof action.",
    x: "58%",
    y: "26%",
    size: 28,
    delay: "-1.7s",
  },
  {
    id: "relationship-echo",
    label: "Relationship Echo",
    detail: "A silence pattern is asking to be seen without judgment.",
    x: "72%",
    y: "39%",
    size: 20,
    delay: "-2.6s",
  },
  {
    id: "forecast-shift",
    label: "Forecast Shift",
    detail: "The next state is trending softer, not solved yet.",
    x: "51%",
    y: "10%",
    size: 24,
    delay: "-3.2s",
  },
];

export default function UraiResolvedHomeScene() {
  const [mode, setMode] = useState<Mode>("home");
  const [activePanel, setActivePanel] = useState<HomePanel>(null);
  const [activeNode, setActiveNode] = useState<MemoryNode | null>(null);
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
        <div className="atmosphere-drift" aria-hidden="true" />
        <div className="horizon-glow" aria-hidden="true" />

        <button
          type="button"
          className="biome-hitbox"
          onClick={(event) => {
            event.stopPropagation();
            openPanel("biome");
          }}
          aria-label="Open Emotional Biome"
        >
          <span>Emotional Biome</span>
        </button>

        <button
          type="button"
          className="silhouette-wrap"
          onClick={(event) => {
            event.stopPropagation();
            openPanel("self");
          }}
          aria-label="Open Self State"
        >
          <ResolvedVisual asset={assets["home.silhouette.body"]} className="silhouette-asset" />
          <span className="silhouette-rim" aria-hidden="true" />
          <span className="hotspot-label silhouette-label">Self State</span>
        </button>

        <button
          type="button"
          className="orb-button"
          onClick={(event) => {
            event.stopPropagation();
            openPanel("companion");
          }}
          onDoubleClick={(event) => {
            event.stopPropagation();
            openLifeMap();
          }}
          aria-label="Open URAI companion"
        >
          <span className="orb-fallback-glow" aria-hidden="true" />
          <span className="orb-ring orb-ring-one" aria-hidden="true" />
          <span className="orb-ring orb-ring-two" aria-hidden="true" />
          <ResolvedVisual asset={assets["home.orb.core"]} className="orb-asset" />
          <span className="hotspot-label orb-label">Companion</span>
        </button>

        <div className="foreground-stars" aria-label="Memory nodes">
          {MEMORY_NODES.map((node) => (
            <button
              key={node.id}
              type="button"
              className="memory-star"
              style={{ left: node.x, top: node.y, width: node.size, height: node.size, animationDelay: node.delay }}
              onClick={(event) => {
                event.stopPropagation();
                setActivePanel(null);
                setActiveNode(node);
              }}
              aria-label={`Open ${node.label} memory node`}
            >
              <ResolvedVisual asset={assets["spatial.star.default"]} className="memory-star-asset" />
              <span className="star-label">{node.label}</span>
            </button>
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <ResolvedVisual key={index} asset={assets["spatial.star.default"]} className={`ambient-star ambient-star-${index + 1}`} />
          ))}
        </div>

        <div className="home-copy">
          <p className="sky-whisper" aria-live="polite">{TONE_COPY[mode]}</p>
          <p className="product-line">URAI turns passive signals into a living map of memory, mood, and reflection.</p>
          <button
            type="button"
            className="life-map-cta"
            onClick={(event) => {
              event.stopPropagation();
              openLifeMap();
            }}
          >
            Enter Life Map
          </button>
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
          <aside
            className="context-card"
            onClick={(event) => event.stopPropagation()}
            aria-live="polite"
          >
            {activeNode ? (
              <>
                <span className="context-eyebrow">Memory Node</span>
                <h2>{activeNode.label}</h2>
                <p>{activeNode.detail}</p>
                <button type="button" onClick={openLifeMap}>Open Memory Field</button>
              </>
            ) : null}
            {activePanel === "companion" ? (
              <>
                <span className="context-eyebrow">Companion</span>
                <h2>The orb is listening.</h2>
                <p>Open the Life Map, or keep this as the quiet companion surface for reflection and voice later.</p>
                <button type="button" onClick={openLifeMap}>Enter Life Map</button>
              </>
            ) : null}
            {activePanel === "self" ? (
              <>
                <span className="context-eyebrow">Self State</span>
                <h2>Clouded focus, stabilizing.</h2>
                <p>The avatar represents body, mood, cognition, and recovery signals. Tap deeper once biometric layers are wired.</p>
                <button type="button" onClick={() => setActivePanel(null)}>Hold Here</button>
              </>
            ) : null}
            {activePanel === "biome" ? (
              <>
                <span className="context-eyebrow">Emotional Biome</span>
                <h2>The ground is softening.</h2>
                <p>Horizon, mist, and terrain now act as the user&apos;s current emotional weather layer.</p>
                <button type="button" onClick={() => setActivePanel(null)}>Close Biome</button>
              </>
            ) : null}
          </aside>
        )}
      </section>

      <style jsx>{shellStyles}</style>
    </main>
  );
}

const shellStyles = `
  .resolved-shell {
    position: relative;
    min-height: 100dvh;
    height: 100dvh;
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
    inset: 0 0 40% 0;
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
  .atmosphere-drift {
    position: fixed;
    inset: 8vh 12vw 16vh;
    z-index: 18;
    background:
      radial-gradient(circle at 32% 58%, rgba(125, 211, 252, .14), transparent 30%),
      radial-gradient(circle at 68% 42%, rgba(167, 139, 250, .12), transparent 34%),
      linear-gradient(110deg, transparent 10%, rgba(255,255,255,.05) 48%, transparent 78%);
    filter: blur(24px);
    opacity: .75;
    animation: auraDrift 14s ease-in-out infinite alternate;
  }
  .horizon-glow {
    position: fixed;
    left: 50%;
    bottom: -24vh;
    z-index: 21;
    width: min(1120px, 92vw);
    height: 48vh;
    transform: translateX(-50%);
    border-radius: 50% 50% 0 0;
    background:
      radial-gradient(ellipse at 50% 8%, rgba(186, 230, 253, .46), rgba(125, 211, 252, .18) 34%, rgba(79, 70, 229, .08) 58%, transparent 76%),
      linear-gradient(to top, rgba(255,255,255,.18), transparent 62%);
    filter: blur(1px);
    box-shadow: 0 -24px 120px rgba(125, 211, 252, .28);
    animation: horizonBreathe 8s ease-in-out infinite;
  }
  .biome-hitbox {
    position: fixed;
    left: 50%;
    bottom: 4vh;
    z-index: 42;
    transform: translateX(-50%);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 999px;
    background: rgba(3, 7, 18, .18);
    color: rgba(255,255,255,.5);
    padding: .48rem .78rem;
    font-size: .62rem;
    letter-spacing: .22em;
    text-transform: uppercase;
    backdrop-filter: blur(12px);
    cursor: pointer;
    pointer-events: auto;
    opacity: .62;
    transition: opacity 240ms ease, border-color 240ms ease, color 240ms ease, transform 240ms ease;
  }
  .biome-hitbox:hover,
  .biome-hitbox:focus-visible {
    opacity: 1;
    color: rgba(255,255,255,.86);
    border-color: rgba(125, 211, 252, .42);
    transform: translateX(-50%) translateY(-2px);
  }
  .silhouette-wrap {
    position: fixed;
    left: calc(50% - min(16vw, 230px));
    bottom: 4vh;
    z-index: 25;
    width: clamp(160px, 13.6vw, 240px);
    height: clamp(380px, 60vh, 630px);
    border: 0;
    padding: 0;
    background: transparent;
    opacity: .86;
    filter: drop-shadow(0 0 42px rgba(126,231,255,.26));
    cursor: pointer;
    pointer-events: auto;
    transition: transform 900ms cubic-bezier(.16, 1, .3, 1), opacity 700ms ease, filter 700ms ease;
  }
  .silhouette-wrap:hover,
  .silhouette-wrap:focus-visible {
    opacity: 1;
    filter: drop-shadow(0 0 54px rgba(186,230,253,.38));
    transform: translateY(-4px);
  }
  .silhouette-wrap :global(img),
  .silhouette-wrap :global(svg) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .silhouette-rim {
    position: absolute;
    inset: 8% 16% 7%;
    border-radius: 52% 52% 34% 34%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
    filter: blur(18px);
    opacity: .72;
    pointer-events: none;
  }
  .orb-button {
    position: fixed;
    left: 50%;
    top: 73%;
    z-index: 34;
    width: clamp(154px, 13vw, 214px);
    height: clamp(154px, 13vw, 214px);
    transform: translate(-50%, -50%);
    border: 0;
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
    transition: transform 900ms cubic-bezier(.16, 1, .3, 1), opacity 700ms ease, filter 700ms ease;
    animation: orbBreath 6.4s ease-in-out infinite;
  }
  .orb-button:hover,
  .orb-button:focus-visible {
    transform: translate(-50%, -50%) scale(1.08);
    filter: drop-shadow(0 0 72px rgba(125,211,252,.7));
  }
  .orb-button :global(img),
  .orb-button :global(svg) {
    position: absolute;
    inset: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 44px rgba(126,231,255,.9));
  }
  .orb-fallback-glow {
    position: absolute;
    inset: -64%;
    z-index: 1;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255,255,255,.34), rgba(103,232,249,.24) 32%, rgba(139,92,246,.12) 58%, transparent 76%);
    filter: blur(20px);
    animation: orbPulse 5.5s ease-in-out infinite;
  }
  .orb-ring {
    position: absolute;
    inset: 5%;
    z-index: 2;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.22);
    box-shadow: 0 0 30px rgba(125,211,252,.16);
    animation: orbitRing 8s linear infinite;
  }
  .orb-ring-two {
    inset: -4%;
    opacity: .55;
    animation-duration: 12s;
    animation-direction: reverse;
  }
  .hotspot-label {
    position: absolute;
    left: 50%;
    z-index: 9;
    transform: translateX(-50%) translateY(8px);
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 999px;
    background: rgba(2, 6, 23, .36);
    color: rgba(255,255,255,.68);
    padding: .35rem .55rem;
    font-size: .58rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0;
    backdrop-filter: blur(12px);
    transition: opacity 220ms ease, transform 220ms ease;
    pointer-events: none;
  }
  .silhouette-label { top: 38%; }
  .orb-label { bottom: -8%; }
  .silhouette-wrap:hover .hotspot-label,
  .silhouette-wrap:focus-visible .hotspot-label,
  .orb-button:hover .hotspot-label,
  .orb-button:focus-visible .hotspot-label {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .foreground-stars {
    position: fixed;
    inset: 0;
    z-index: 30;
    pointer-events: none;
    opacity: .92;
    transition: transform 900ms cubic-bezier(.16, 1, .3, 1), opacity 700ms ease;
  }
  .memory-star,
  .ambient-star {
    position: absolute;
    filter: drop-shadow(0 0 20px rgba(255,255,255,.78));
    animation: starFloat 7s ease-in-out infinite;
  }
  .memory-star {
    z-index: 2;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
    transform: translate(-50%, -50%);
  }
  .memory-star:hover,
  .memory-star:focus-visible {
    filter: drop-shadow(0 0 34px rgba(255,255,255,.95)) drop-shadow(0 0 18px rgba(125,211,252,.66));
    transform: translate(-50%, -50%) scale(1.28);
  }
  .memory-star :global(img),
  .memory-star :global(svg),
  .ambient-star :global(img),
  .ambient-star :global(svg) {
    width: 100%;
    height: 100%;
  }
  .star-label {
    position: absolute;
    left: 50%;
    top: calc(100% + .42rem);
    transform: translateX(-50%);
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 999px;
    background: rgba(2, 6, 23, .42);
    color: rgba(255,255,255,.75);
    padding: .3rem .48rem;
    font-size: .55rem;
    letter-spacing: .13em;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0;
    backdrop-filter: blur(10px);
    transition: opacity 180ms ease;
  }
  .memory-star:hover .star-label,
  .memory-star:focus-visible .star-label {
    opacity: 1;
  }
  .ambient-star {
    z-index: 1;
    width: 12px;
    height: 12px;
    opacity: .48;
  }
  .ambient-star-1 { left: 42%; top: 17%; width: 12px; height: 12px; animation-delay: -1.2s; }
  .ambient-star-2 { left: 35%; top: 50%; width: 13px; height: 13px; animation-delay: -2s; }
  .ambient-star-3 { left: 66%; top: 56%; width: 11px; height: 11px; animation-delay: -2.8s; }
  .ambient-star-4 { left: 15%; top: 67%; width: 8px; height: 8px; animation-delay: -3.3s; }
  .ambient-star-5 { left: 81%; top: 55%; width: 9px; height: 9px; animation-delay: -4.1s; }
  .home-copy {
    position: fixed;
    left: 50%;
    top: 19%;
    z-index: 44;
    width: min(640px, calc(100vw - 2rem));
    transform: translateX(-50%);
    text-align: center;
    pointer-events: auto;
  }
  .sky-whisper {
    margin: 0;
    color: rgba(255,255,255,.86);
    font-size: clamp(1.05rem, 1.55vw, 1.42rem);
    line-height: 1.45;
    text-shadow: 0 2px 28px rgba(0,0,0,.9);
  }
  .product-line {
    margin: .55rem auto 0;
    max-width: 34rem;
    color: rgba(226,242,255,.58);
    font-size: clamp(.76rem, 1vw, .95rem);
    line-height: 1.5;
    text-shadow: 0 2px 22px rgba(0,0,0,.72);
  }
  .life-map-cta {
    margin-top: .9rem;
    border: 1px solid rgba(186,230,253,.36);
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,.06));
    color: rgba(255,255,255,.9);
    padding: .68rem 1.05rem;
    font-size: .68rem;
    font-weight: 650;
    letter-spacing: .22em;
    text-transform: uppercase;
    box-shadow: 0 18px 64px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.22);
    backdrop-filter: blur(16px);
    cursor: zoom-in;
    transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
  }
  .life-map-cta:hover,
  .life-map-cta:focus-visible {
    transform: translateY(-2px);
    border-color: rgba(125,211,252,.72);
    background: linear-gradient(180deg, rgba(255,255,255,.22), rgba(125,211,252,.1));
  }
  .state-hud {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    z-index: 48;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: .5rem;
    width: min(420px, calc(100vw - 2rem));
    pointer-events: auto;
  }
  .state-chip {
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 1rem;
    background: rgba(2, 6, 23, .34);
    padding: .7rem .78rem;
    backdrop-filter: blur(14px);
    box-shadow: 0 20px 70px rgba(0,0,0,.18);
  }
  .state-chip span {
    display: block;
    color: rgba(226,242,255,.48);
    font-size: .58rem;
    letter-spacing: .16em;
    text-transform: uppercase;
  }
  .state-chip strong {
    display: block;
    margin-top: .22rem;
    color: rgba(255,255,255,.86);
    font-size: .84rem;
    font-weight: 620;
  }
  .context-card {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 56;
    width: min(360px, calc(100vw - 2rem));
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 1.4rem;
    background: linear-gradient(180deg, rgba(15,23,42,.74), rgba(2,6,23,.62));
    padding: 1rem;
    box-shadow: 0 28px 96px rgba(0,0,0,.46);
    backdrop-filter: blur(18px);
    pointer-events: auto;
  }
  .context-eyebrow {
    color: rgba(125,211,252,.74);
    font-size: .62rem;
    letter-spacing: .2em;
    text-transform: uppercase;
  }
  .context-card h2 {
    margin: .42rem 0 .35rem;
    color: rgba(255,255,255,.92);
    font-size: 1.05rem;
    line-height: 1.25;
  }
  .context-card p {
    margin: 0;
    color: rgba(226,242,255,.62);
    font-size: .86rem;
    line-height: 1.5;
  }
  .context-card button {
    margin-top: .8rem;
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    color: rgba(255,255,255,.82);
    padding: .55rem .8rem;
    cursor: pointer;
  }
  .is-transitioning .orb-button {
    transform: translate(-50%, -310%) scale(.68);
    opacity: .78;
    filter: drop-shadow(0 0 110px rgba(255,255,255,.72));
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
  .is-transitioning .state-hud,
  .is-transitioning .context-card,
  .is-transitioning .biome-hitbox,
  .is-transitioning .product-line,
  .is-transitioning .life-map-cta {
    opacity: 0;
    pointer-events: none;
  }
  @keyframes orbPulse {
    0%, 100% { opacity: .68; transform: scale(.94); }
    50% { opacity: 1; transform: scale(1.08); }
  }
  @keyframes orbBreath {
    0%, 100% { filter: drop-shadow(0 0 34px rgba(125,211,252,.34)); }
    50% { filter: drop-shadow(0 0 70px rgba(125,211,252,.7)); }
  }
  @keyframes orbitRing {
    0% { transform: rotate(0deg) scaleX(1.04) scaleY(.94); }
    100% { transform: rotate(360deg) scaleX(1.04) scaleY(.94); }
  }
  @keyframes starFloat {
    0%, 100% { opacity: .58; transform: translate(-50%, -50%) translateY(0) scale(.9); }
    50% { opacity: 1; transform: translate(-50%, -50%) translateY(-8px) scale(1.12); }
  }
  @keyframes auraDrift {
    0% { transform: translateX(-2vw) translateY(1vh) scale(1); }
    100% { transform: translateX(2vw) translateY(-1vh) scale(1.04); }
  }
  @keyframes horizonBreathe {
    0%, 100% { opacity: .74; transform: translateX(-50%) scaleX(.98); }
    50% { opacity: .98; transform: translateX(-50%) scaleX(1.03); }
  }
  @media (max-width: 800px) {
    .silhouette-wrap {
      left: calc(50% - 112px);
      width: 146px;
      height: 400px;
    }
    .orb-button {
      top: 73%;
      width: 142px;
      height: 142px;
    }
    .home-copy {
      top: 13%;
    }
    .product-line {
      font-size: .75rem;
    }
    .state-hud {
      grid-template-columns: 1fr 1fr;
      bottom: .75rem;
      left: .75rem;
      width: calc(100vw - 1.5rem);
    }
    .state-chip {
      padding: .56rem .62rem;
    }
    .state-chip strong {
      font-size: .76rem;
    }
    .context-card {
      right: .75rem;
      bottom: 7.6rem;
    }
    .biome-hitbox {
      bottom: 16vh;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .orb-button,
    .silhouette-wrap,
    .foreground-stars,
    .orb-fallback-glow,
    .foreground-star,
    .memory-star,
    .ambient-star,
    .atmosphere-drift,
    .horizon-glow,
    .orb-ring {
      animation: none !important;
      transition-duration: .01ms !important;
    }
  }
`;
