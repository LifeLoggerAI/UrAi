"use client";

import { useEffect, useState } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";

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
    y: "25%",
    size: 21,
    delay: "-.4s",
  },
  {
    id: "forecast-shift",
    label: "Forecast Shift",
    detail: "The next state is trending softer, not solved yet.",
    x: "52%",
    y: "11%",
    size: 24,
    delay: "-1.2s",
  },
  {
    id: "focus-thread",
    label: "Focus Thread",
    detail: "Attention returned around one repeated proof action.",
    x: "59%",
    y: "27%",
    size: 28,
    delay: "-1.7s",
  },
  {
    id: "relationship-echo",
    label: "Relationship Echo",
    detail: "A silence pattern is asking to be seen without judgment.",
    x: "72%",
    y: "40%",
    size: 20,
    delay: "-2.6s",
  },
];

const AMBIENT_STARS = [
  ["12%", "64%", 5, "-0.2s"],
  ["36%", "50%", 9, "-1.1s"],
  ["42%", "17%", 8, "-2.1s"],
  ["66%", "56%", 7, "-3.1s"],
  ["82%", "55%", 6, "-4.1s"],
] as const;

export default function UraiResolvedHomeScene() {
  const [mode, setMode] = useState<Mode>("home");
  const [activePanel, setActivePanel] = useState<HomePanel>(null);
  const [activeNode, setActiveNode] = useState<MemoryNode | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

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
      <div className="cinematic-backdrop" aria-hidden="true">
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="light-beam" />
        <div className="terrain" />
      </div>
      <button type="button" className="sky-hitbox" onClick={openLifeMap} aria-label="Open URAI Life Map" />

      <section className="home-stage" aria-label="URAI resolved visual home scene">
        <button
          type="button"
          className="biome-hitbox"
          onClick={(event) => {
            event.stopPropagation();
            openPanel("biome");
          }}
          aria-label="Open Emotional Biome"
        >
          Emotional Biome
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
          <span className="silhouette-head" />
          <span className="silhouette-body" />
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
          <span className="orb-fallback-glow" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
          <span className="orb-core" />
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
              <span className="star-core" />
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
          <aside className="context-card" onClick={(event) => event.stopPropagation()} aria-live="polite">
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
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    min-height: 100dvh;
    height: 100dvh;
    width: 100vw;
    overflow: hidden;
    isolation: isolate;
    background: #020617;
    color: white;
    cursor: zoom-in;
    user-select: none;
    contain: paint;
  }
  .lifemap-shell {
    cursor: default;
  }
  .lifemap-backdrop,
  .cinematic-backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 51% 68%, rgba(125, 211, 252, .34), transparent 19%),
      radial-gradient(circle at 48% 44%, rgba(99, 102, 241, .26), transparent 31%),
      radial-gradient(circle at 27% 29%, rgba(74, 99, 187, .22), transparent 26%),
      linear-gradient(180deg, #071431 0%, #101c49 48%, #304a80 74%, #020617 100%);
  }
  .cinematic-backdrop::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 2;
    background:
      radial-gradient(circle at 15% 64%, rgba(221, 244, 255, .72) 0 2px, transparent 3px),
      radial-gradient(circle at 28% 25%, rgba(221, 244, 255, .78) 0 1px, transparent 3px),
      radial-gradient(circle at 43% 19%, rgba(221, 244, 255, .75) 0 2px, transparent 3px),
      radial-gradient(circle at 52% 10%, rgba(255, 255, 255, .9) 0 2px, transparent 4px),
      radial-gradient(circle at 59% 27%, rgba(255, 255, 255, .9) 0 3px, transparent 6px),
      radial-gradient(circle at 72% 40%, rgba(221, 244, 255, .8) 0 2px, transparent 4px),
      radial-gradient(circle at 81% 55%, rgba(221, 244, 255, .72) 0 2px, transparent 4px);
    filter: drop-shadow(0 0 12px rgba(191, 234, 255, .56));
    opacity: .78;
    pointer-events: none;
  }
  .aurora {
    position: fixed;
    z-index: 1;
    border-radius: 999px;
    filter: blur(40px);
    opacity: .68;
    animation: auraDrift 15s ease-in-out infinite alternate;
  }
  .aurora-one {
    left: 19vw;
    top: 18vh;
    width: 44vw;
    height: 42vh;
    background: radial-gradient(circle, rgba(96,165,250,.28), transparent 67%);
  }
  .aurora-two {
    right: 9vw;
    top: 28vh;
    width: 42vw;
    height: 48vh;
    background: radial-gradient(circle, rgba(167,139,250,.22), transparent 70%);
    animation-delay: -4s;
  }
  .light-beam {
    position: fixed;
    left: 50%;
    bottom: 1vh;
    z-index: 4;
    width: min(410px, 32vw);
    height: 76vh;
    transform: translateX(-50%);
    clip-path: polygon(50% 0%, 92% 100%, 8% 100%);
    background: linear-gradient(180deg, rgba(255,255,255,.7), rgba(225,238,255,.5) 55%, rgba(255,255,255,.08) 100%);
    opacity: .75;
    filter: blur(.25px);
  }
  .terrain {
    position: fixed;
    left: 50%;
    bottom: -24vh;
    z-index: 5;
    width: min(1180px, 96vw);
    height: 48vh;
    transform: translateX(-50%);
    border-radius: 50% 50% 0 0;
    background:
      radial-gradient(ellipse at 50% 8%, rgba(220, 244, 255, .56), rgba(125, 211, 252, .22) 34%, rgba(67, 56, 202, .08) 58%, transparent 76%),
      linear-gradient(to top, rgba(255,255,255,.18), transparent 62%);
    box-shadow: 0 -24px 120px rgba(125, 211, 252, .28);
    animation: horizonBreathe 8s ease-in-out infinite;
  }
  .lifemap-layer {
    position: relative;
    z-index: 5;
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
  .biome-hitbox {
    position: fixed;
    left: 50%;
    bottom: 4vh;
    z-index: 42;
    transform: translateX(-50%);
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 999px;
    background: rgba(15, 23, 42, .34);
    color: rgba(255,255,255,.62);
    padding: .5rem .85rem;
    font-size: .62rem;
    letter-spacing: .22em;
    text-transform: uppercase;
    backdrop-filter: blur(14px);
    cursor: pointer;
    pointer-events: auto;
    transition: opacity 240ms ease, border-color 240ms ease, color 240ms ease, transform 240ms ease;
  }
  .biome-hitbox:hover,
  .biome-hitbox:focus-visible {
    color: rgba(255,255,255,.9);
    border-color: rgba(125, 211, 252, .56);
    transform: translateX(-50%) translateY(-2px);
  }
  .silhouette-wrap {
    position: fixed;
    left: calc(50% - min(16vw, 230px));
    bottom: 10vh;
    z-index: 25;
    width: clamp(118px, 10vw, 170px);
    height: clamp(300px, 44vh, 480px);
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
    opacity: .88;
    filter: drop-shadow(0 0 42px rgba(126,231,255,.34));
    transition: transform 700ms cubic-bezier(.16, 1, .3, 1), opacity 500ms ease, filter 500ms ease;
  }
  .silhouette-wrap:hover,
  .silhouette-wrap:focus-visible {
    opacity: 1;
    transform: translateY(-4px);
    filter: drop-shadow(0 0 58px rgba(186,230,253,.48));
  }
  .silhouette-head,
  .silhouette-body {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: block;
    background: linear-gradient(180deg, rgba(190,235,255,.55), rgba(74,112,160,.18), transparent);
    box-shadow: inset 0 0 35px rgba(255,255,255,.08);
  }
  .silhouette-head {
    top: 0;
    width: 50%;
    height: 21%;
    border-radius: 50%;
  }
  .silhouette-body {
    top: 20%;
    width: 82%;
    height: 78%;
    border-radius: 50% 50% 28% 28%;
    clip-path: polygon(42% 0, 58% 0, 80% 24%, 92% 100%, 8% 100%, 20% 24%);
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
    transition: transform 700ms cubic-bezier(.16, 1, .3, 1), filter 500ms ease;
    animation: orbBreath 6.4s ease-in-out infinite;
  }
  .orb-button:hover,
  .orb-button:focus-visible {
    transform: translate(-50%, -50%) scale(1.08);
    filter: drop-shadow(0 0 72px rgba(125,211,252,.7));
  }
  .orb-core {
    position: absolute;
    inset: 22%;
    z-index: 3;
    border-radius: 999px;
    background:
      radial-gradient(circle at 36% 30%, rgba(255,255,255,1), rgba(207,250,254,.92) 18%, rgba(103,232,249,.84) 50%, rgba(21,94,117,.62) 77%, transparent 100%);
    box-shadow:
      inset -18px -20px 35px rgba(15,23,42,.35),
      inset 18px 16px 25px rgba(255,255,255,.22),
      0 0 26px rgba(255,255,255,.76),
      0 0 68px rgba(103,232,249,.58);
  }
  .orb-fallback-glow {
    position: absolute;
    inset: -64%;
    z-index: 1;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255,255,255,.36), rgba(103,232,249,.24) 32%, rgba(139,92,246,.12) 58%, transparent 76%);
    filter: blur(20px);
    animation: orbPulse 5.5s ease-in-out infinite;
  }
  .orb-ring {
    position: absolute;
    inset: 6%;
    z-index: 2;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.25);
    box-shadow: 0 0 30px rgba(125,211,252,.16);
    animation: orbitRing 8s linear infinite;
  }
  .orb-ring-two {
    inset: -4%;
    opacity: .56;
    animation-duration: 12s;
    animation-direction: reverse;
  }
  .hotspot-label,
  .star-label {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 999px;
    background: rgba(2, 6, 23, .5);
    color: rgba(255,255,255,.72);
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
  .orb-button:focus-visible .hotspot-label,
  .memory-star:hover .star-label,
  .memory-star:focus-visible .star-label {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .foreground-stars {
    position: fixed;
    inset: 0;
    z-index: 30;
    pointer-events: none;
    opacity: .95;
    transition: transform 900ms cubic-bezier(.16, 1, .3, 1), opacity 700ms ease;
  }
  .memory-star {
    position: absolute;
    z-index: 2;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
    transform: translate(-50%, -50%);
    animation: starFloat 7s ease-in-out infinite;
    transition: filter 180ms ease;
  }
  .memory-star:hover,
  .memory-star:focus-visible {
    filter: drop-shadow(0 0 34px rgba(255,255,255,.95)) drop-shadow(0 0 18px rgba(125,211,252,.66));
  }
  .star-core,
  .ambient-star {
    position: absolute;
    inset: 0;
    display: block;
    border-radius: 999px;
    background: radial-gradient(circle, white 0 16%, #b9e8ff 26%, rgba(138,108,255,.34) 60%, transparent 72%);
    filter: drop-shadow(0 0 16px rgba(255,255,255,.76));
  }
  .star-core::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 210%;
    height: 18%;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    background: rgba(255,255,255,.74);
  }
  .star-core::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18%;
    height: 210%;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    background: rgba(255,255,255,.74);
  }
  .star-label { top: calc(100% + .42rem); }
  .ambient-star {
    z-index: 1;
    opacity: .5;
    animation: ambientTwinkle 6s ease-in-out infinite;
  }
  .home-copy {
    position: fixed;
    left: 50%;
    top: 18.5%;
    z-index: 44;
    width: min(640px, calc(100vw - 2rem));
    transform: translateX(-50%);
    text-align: center;
    pointer-events: auto;
  }
  .sky-whisper {
    margin: 0;
    color: rgba(255,255,255,.9);
    font-size: clamp(1.05rem, 1.55vw, 1.42rem);
    line-height: 1.45;
    text-shadow: 0 2px 28px rgba(0,0,0,.9);
  }
  .product-line {
    margin: .55rem auto 0;
    max-width: 34rem;
    color: rgba(226,242,255,.66);
    font-size: clamp(.76rem, 1vw, .95rem);
    line-height: 1.5;
    text-shadow: 0 2px 22px rgba(0,0,0,.72);
  }
  .life-map-cta {
    margin-top: .9rem;
    border: 1px solid rgba(186,230,253,.42);
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.07));
    color: rgba(255,255,255,.94);
    padding: .72rem 1.1rem;
    font-size: .68rem;
    font-weight: 700;
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
    border-color: rgba(125,211,252,.8);
    background: linear-gradient(180deg, rgba(255,255,255,.24), rgba(125,211,252,.12));
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
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 1rem;
    background: rgba(2, 6, 23, .48);
    padding: .7rem .78rem;
    backdrop-filter: blur(16px);
    box-shadow: 0 20px 70px rgba(0,0,0,.2);
  }
  .state-chip span {
    display: block;
    color: rgba(226,242,255,.52);
    font-size: .58rem;
    letter-spacing: .16em;
    text-transform: uppercase;
  }
  .state-chip strong {
    display: block;
    margin-top: .22rem;
    color: rgba(255,255,255,.9);
    font-size: .84rem;
    font-weight: 650;
  }
  .context-card {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 56;
    width: min(360px, calc(100vw - 2rem));
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 1.4rem;
    background: linear-gradient(180deg, rgba(15,23,42,.82), rgba(2,6,23,.72));
    padding: 1rem;
    box-shadow: 0 28px 96px rgba(0,0,0,.46);
    backdrop-filter: blur(20px);
    pointer-events: auto;
  }
  .context-eyebrow {
    color: rgba(125,211,252,.78);
    font-size: .62rem;
    letter-spacing: .2em;
    text-transform: uppercase;
  }
  .context-card h2 {
    margin: .42rem 0 .35rem;
    color: rgba(255,255,255,.94);
    font-size: 1.05rem;
    line-height: 1.25;
  }
  .context-card p {
    margin: 0;
    color: rgba(226,242,255,.66);
    font-size: .86rem;
    line-height: 1.5;
  }
  .context-card button {
    margin-top: .8rem;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    color: rgba(255,255,255,.86);
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
    0%, 100% { opacity: .72; transform: translate(-50%, -50%) translateY(0) scale(.92); }
    50% { opacity: 1; transform: translate(-50%, -50%) translateY(-8px) scale(1.12); }
  }
  @keyframes ambientTwinkle {
    0%, 100% { opacity: .34; transform: scale(.86); }
    50% { opacity: .88; transform: scale(1.15); }
  }
  @keyframes auraDrift {
    0% { transform: translateX(-2vw) translateY(1vh) scale(1); }
    100% { transform: translateX(2vw) translateY(-1vh) scale(1.04); }
  }
  @keyframes horizonBreathe {
    0%, 100% { opacity: .78; transform: translateX(-50%) scaleX(.98); }
    50% { opacity: 1; transform: translateX(-50%) scaleX(1.03); }
  }
  @media (max-width: 800px) {
    .silhouette-wrap {
      left: calc(50% - 112px);
      width: 130px;
      height: 350px;
      bottom: 12vh;
    }
    .orb-button {
      top: 73%;
      width: 142px;
      height: 142px;
    }
    .home-copy {
      top: 12%;
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
    .memory-star,
    .ambient-star,
    .aurora,
    .terrain,
    .orb-ring {
      animation: none !important;
      transition-duration: .01ms !important;
    }
  }
`;
