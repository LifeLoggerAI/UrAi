"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useUraiHomeState, type UraiHomeViewModel, type UraiLifeMapNode } from "@/lib/use-urai-home-state";

type Mode = "home" | "transitioning" | "lifemap";
type HomeSheet = "body" | "mood" | "insight" | "companion" | null;

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
  orbLabel: string;
};

function deriveHomeVisuals(home: UraiHomeViewModel): HomeVisuals {
  if (home.visualState === "threshold" || home.thresholdRisk > 0.7) {
    return {
      skyTop: "#030712",
      skyMid: "#111827",
      skyBottom: "#1e1b4b",
      aura: "rgba(167,139,250,0.55)",
      auraSoft: "rgba(59,130,246,0.18)",
      horizon: "rgba(245,158,11,0.18)",
      particleOpacity: 0.12,
      auraPulseSeconds: 7.2,
      fogOpacity: 0.48,
      constellationOpacity: 0.1,
      vignetteOpacity: 0.72,
      orbLabel: "Protective",
    };
  }

  if (home.visualState === "recovery" || home.bloomReady) {
    return {
      skyTop: "#07111f",
      skyMid: "#123047",
      skyBottom: "#0f172a",
      aura: "rgba(45,212,191,0.58)",
      auraSoft: "rgba(251,191,36,0.28)",
      horizon: "rgba(251,191,36,0.38)",
      particleOpacity: 0.32,
      auraPulseSeconds: 5,
      fogOpacity: 0.18,
      constellationOpacity: 0.24,
      vignetteOpacity: 0.34,
      orbLabel: "Blooming",
    };
  }

  if (home.visualState === "overstimulated" || home.rhythmState === "overstimulated") {
    return {
      skyTop: "#020617",
      skyMid: "#1e1b4b",
      skyBottom: "#0f172a",
      aura: "rgba(56,189,248,0.68)",
      auraSoft: "rgba(129,140,248,0.32)",
      horizon: "rgba(56,189,248,0.32)",
      particleOpacity: 0.44,
      auraPulseSeconds: 3.1,
      fogOpacity: 0.28,
      constellationOpacity: 0.26,
      vignetteOpacity: 0.42,
      orbLabel: "Fast rhythm",
    };
  }

  if (home.visualState === "offRhythm" || home.rhythmState === "offRhythm") {
    return {
      skyTop: "#050816",
      skyMid: "#172554",
      skyBottom: "#020617",
      aura: "rgba(96,165,250,0.48)",
      auraSoft: "rgba(148,163,184,0.2)",
      horizon: "rgba(99,102,241,0.22)",
      particleOpacity: 0.2,
      auraPulseSeconds: 4.6,
      fogOpacity: 0.38,
      constellationOpacity: 0.14,
      vignetteOpacity: 0.52,
      orbLabel: "Recalibrating",
    };
  }

  return {
    skyTop: "#020617",
    skyMid: "#0f2a4a",
    skyBottom: "#020617",
    aura: "rgba(103,232,249,0.56)",
    auraSoft: "rgba(59,130,246,0.24)",
    horizon: "rgba(125,211,252,0.28)",
    particleOpacity: 0.22,
    auraPulseSeconds: 5.8,
    fogOpacity: 0.22,
    constellationOpacity: 0.18,
    vignetteOpacity: 0.42,
    orbLabel: home.companionMode === "listening" ? "Listening" : "Ambient",
  };
}

function nodeSize(node: UraiLifeMapNode) {
  return Math.round(7 + node.emotionalWeight * 12);
}

function constellationPath(nodes: UraiLifeMapNode[]) {
  if (nodes.length < 2) return "";
  return nodes.slice(0, 7).map((node, index) => `${index === 0 ? "M" : "L"} ${node.x} ${node.y}`).join(" ");
}

export default function UraiResolvedHomeScene() {
  const [mode, setMode] = useState<Mode>("home");
  const [activeSheet, setActiveSheet] = useState<HomeSheet>(null);
  const [activeNode, setActiveNode] = useState<UraiLifeMapNode | null>(null);
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
    const timer = window.setTimeout(() => setMode("lifemap"), 900);
    return () => window.clearTimeout(timer);
  }, [mode, reduceMotion]);

  const openLifeMap = () => {
    if (mode !== "home") return;
    setActiveSheet(null);
    setActiveNode(null);
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setActiveSheet(null);
    setActiveNode(null);
    setMode("home");
  };

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
  } as CSSProperties;

  if (mode === "lifemap") {
    return (
      <main className="urai-home-shell lifemap-shell">
        <LifeMapScene />
        <button type="button" className="return-home" onClick={returnHome}>Return home</button>
        <style jsx>{styles}</style>
      </main>
    );
  }

  const transitioning = mode === "transitioning";

  return (
    <main className={`urai-home-shell ${transitioning ? "is-transitioning" : ""}`} style={sceneStyle}>
      <button type="button" className="sky-layer" aria-label="Open your Symbolic Life Map" onClick={openLifeMap}>
        <span className="sky-gradient" />
        <span className="sky-fog sky-fog-one" />
        <span className="sky-fog sky-fog-two" />
        <span className="horizon-glow" />
        <Constellation nodes={home.nodes} onNodeOpen={(node) => { setActiveSheet(null); setActiveNode(node); }} />
        <span className="sky-vignette" />
      </button>

      <header className="home-header">
        <div>
          <h1>{home.insight.title}</h1>
          <p>{home.forecastMessage}</p>
          <button type="button" className="enter-life-map" onClick={openLifeMap}>Enter Life Map</button>
        </div>
      </header>

      <section className="body-field" aria-label="URAI body, aura, and companion field">
        <button type="button" className="silhouette-button" aria-label="Open body state" onClick={() => setActiveSheet("body")}>
          <span className="body-halo" />
          <span className="body-head" />
          <span className="body-core" />
          <span className="body-ground-glow" />
        </button>

        <button type="button" className="aura-orb-button" aria-label="Open mood weather" onClick={() => setActiveSheet("mood")}>
          <span className="aura-field" />
          <span className="aura-ring aura-ring-one" />
          <span className="aura-ring aura-ring-two" />
          <span className="orb-core" />
          <span className="orb-reflection" />
          <span className="orb-status">{visuals.orbLabel}</span>
        </button>

        <button type="button" className="companion-dot" aria-label="Open companion" onClick={() => setActiveSheet("companion")} />
      </section>

      <button type="button" className="emotional-biome" aria-label="Open emotional biome" onClick={() => setActiveSheet("body")}>
        <span className="biome-terrain" />
        <span className="biome-horizon" />
        <span className="biome-reflection" />
        <span className="biome-label">Emotional Biome</span>
      </button>

      <section className="state-strip">
        <button type="button" onClick={() => setActiveSheet("mood")}>
          <strong>{home.moodWeather}</strong>
          <span>{Math.round(home.recoveryScore)}% Recovery</span>
          <span>{home.memoryNodeCount} Memory Nodes</span>
          <span>{home.forecastSummary}</span>
        </button>
      </section>

      {(activeSheet || activeNode) && (
        <div className="sheet-backdrop" onClick={() => { setActiveSheet(null); setActiveNode(null); }}>
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
            {activeSheet === "body" ? (
              <>
                <span className="sheet-eyebrow">Body field</span>
                <h2>{home.rhythmState === "offRhythm" ? "Your rhythm is recalibrating." : "Your body field is being read gently."}</h2>
                <p>Rhythm: {home.rhythmState}. Recovery: {Math.round(home.recoveryScore)}%. Shadow load: {Math.round(home.shadowLoad * 100)}%. Cognitive load: {Math.round(home.cognitiveLoad * 100)}%.</p>
                <button type="button" onClick={() => setActiveSheet(null)}>Hold here</button>
              </>
            ) : null}
            {activeSheet === "mood" ? (
              <>
                <span className="sheet-eyebrow">Mood weather</span>
                <h2>{home.moodWeather}</h2>
                <p>Confidence: {Math.round(home.moodConfidence * 100)}%. Forecast: {home.forecastMessage}</p>
                <button type="button" onClick={() => setActiveSheet(null)}>Close weather</button>
              </>
            ) : null}
            {activeSheet === "insight" ? (
              <>
                <span className="sheet-eyebrow">Passive insight</span>
                <h2>{home.insight.title}</h2>
                <p>{home.insight.body}</p>
                <p className="why-copy">Why this appears: mood weather, rhythm, recovery, memory stars, and companion state are being summarized from your Home state.</p>
                <button type="button" onClick={() => setActiveSheet(null)}>Save for later</button>
              </>
            ) : null}
            {activeSheet === "companion" ? (
              <>
                <span className="sheet-eyebrow">Companion</span>
                <h2>The companion is {home.companionMode}.</h2>
                <p>{home.narratorWhisper}</p>
                <button type="button" onClick={() => setActiveSheet(null)}>Stay quiet</button>
              </>
            ) : null}
          </aside>
        </div>
      )}

      <style jsx>{styles}</style>
    </main>
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
    </span>
  );
}

const styles = `
  .urai-home-shell{position:fixed;inset:0;z-index:2147483647;min-height:100dvh;width:100vw;overflow:hidden;background:#020617;color:white;isolation:isolate;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.lifemap-shell{background:#020617}.return-home{position:fixed;left:calc(env(safe-area-inset-left) + 1rem);top:calc(env(safe-area-inset-top) + 1rem);z-index:70;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(2,6,23,.62);color:rgba(255,255,255,.86);padding:.62rem .9rem;font-size:.8rem;backdrop-filter:blur(18px)}.sky-layer{position:absolute;inset:0;z-index:0;border:0;padding:0;text-align:left;background:transparent;cursor:zoom-in;overflow:hidden}.sky-gradient{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 54%,var(--aura-soft),transparent 38%),radial-gradient(ellipse at 51% 68%,rgba(125,211,252,.14),transparent 28%),linear-gradient(180deg,var(--sky-top),var(--sky-mid) 48%,var(--sky-bottom))}.sky-fog{position:absolute;border-radius:999px;filter:blur(58px);opacity:var(--fog-opacity);mix-blend-mode:screen}.sky-fog-one{left:16%;top:28%;width:44vw;height:35vh;background:radial-gradient(circle,rgba(125,211,252,.22),transparent 68%);animation:fogDrift 16s ease-in-out infinite alternate}.sky-fog-two{right:8%;top:24%;width:38vw;height:36vh;background:radial-gradient(circle,rgba(167,139,250,.14),transparent 72%);animation:fogDrift 20s ease-in-out infinite alternate-reverse}.horizon-glow{position:absolute;left:50%;bottom:19%;width:min(760px,76vw);height:22vh;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at 50% 44%,var(--horizon),rgba(125,211,252,.07) 38%,transparent 72%);filter:blur(22px);opacity:.72}.sky-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 52%,transparent 0%,transparent 48%,rgba(0,0,0,.22) 76%,rgba(0,0,0,var(--vignette-opacity)) 100%),linear-gradient(180deg,rgba(0,0,0,.34),transparent 38%,rgba(0,0,0,.32));pointer-events:none}.constellation-layer{position:absolute;inset:0;opacity:var(--constellation-opacity);pointer-events:none;transition:opacity .4s ease}.constellation-layer svg{position:absolute;inset:5% 16% auto 16%;height:36%;width:68%;overflow:visible}.constellation-layer path{fill:none;stroke:rgba(186,230,253,.62);stroke-width:.12;stroke-dasharray:1.4 2.6;filter:drop-shadow(0 0 5px rgba(186,230,253,.62));animation:pathReveal 2.6s ease-out both}.memory-star{position:absolute;z-index:3;transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;animation:starFloat 7s ease-in-out infinite}.memory-star span{position:absolute;inset:-60%;border-radius:999px;background:radial-gradient(circle,#fff 0 7%,var(--node-color) 16%,rgba(186,230,253,.3) 38%,transparent 70%);filter:drop-shadow(0 0 14px rgba(255,255,255,.65))}.node-ritual span{background:radial-gradient(circle,#fff 0 7%,#fbbf24 16%,rgba(251,191,36,.25) 42%,transparent 70%)}.node-relationship span{background:radial-gradient(circle,#fff 0 7%,#c084fc 16%,rgba(192,132,252,.22) 42%,transparent 70%)}.node-forecast span{background:radial-gradient(circle,#fff 0 7%,#67e8f9 16%,rgba(103,232,249,.26) 42%,transparent 70%)}.node-recovery span{background:radial-gradient(circle,#fff 0 7%,#5eead4 16%,rgba(94,234,212,.26) 42%,transparent 70%)}.ambient-star{position:absolute;display:block;width:4px;height:4px;border-radius:999px;background:white;filter:drop-shadow(0 0 12px rgba(255,255,255,.72));opacity:.38;animation:twinkle 5.5s ease-in-out infinite}.a1{left:12%;top:64%}.a2{right:18%;top:52%;animation-delay:-2s}.a3{left:52%;top:78%;animation-delay:-4s}.a4{left:30%;top:32%;animation-delay:-1s}.home-header{position:relative;z-index:20;display:grid;place-items:center;text-align:center;padding-top:calc(env(safe-area-inset-top) + 14.5vh);pointer-events:none}.home-header h1{margin:0;max-width:42rem;color:rgba(255,255,255,.92);font-size:clamp(1.2rem,2vw,1.6rem);line-height:1.18;letter-spacing:-.03em;text-shadow:0 2px 30px rgba(0,0,0,.74)}.home-header p{margin:.55rem 0 0;max-width:32rem;color:rgba(226,242,255,.64);font-size:.9rem;line-height:1.5}.enter-life-map{pointer-events:auto;margin-top:1rem;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(255,255,255,.09);color:rgba(255,255,255,.92);padding:.72rem 1.1rem;font-size:.68rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase;backdrop-filter:blur(18px);box-shadow:0 16px 58px rgba(0,0,0,.28);cursor:zoom-in}.enter-life-map:hover{transform:translateY(-1px);border-color:rgba(186,230,253,.5)}.body-field{position:absolute;inset:0;z-index:18;pointer-events:none}.silhouette-button{position:absolute;left:calc(50% - min(14vw,190px));top:54%;z-index:20;width:128px;height:340px;transform:translate(-50%,-22%);border:0;background:transparent;pointer-events:auto;cursor:pointer;opacity:.64;filter:drop-shadow(0 0 36px rgba(103,232,249,.16));transition:opacity .2s ease,transform .2s ease}.silhouette-button:hover{opacity:.86;transform:translate(-50%,-23%)}.body-halo{position:absolute;inset:0 -38%;border-radius:50%;background:radial-gradient(ellipse at 50% 42%,rgba(186,230,253,.16),transparent 64%);filter:blur(18px)}.body-head{position:absolute;left:50%;top:1%;width:54px;height:70px;transform:translateX(-50%);border-radius:999px;background:linear-gradient(180deg,rgba(207,250,254,.28),rgba(125,211,252,.12));box-shadow:0 0 28px rgba(125,211,252,.14)}.body-core{position:absolute;left:50%;top:20%;width:76px;height:246px;transform:translateX(-50%);border-radius:52% 52% 38% 38%;background:linear-gradient(180deg,rgba(188,235,255,.22),rgba(96,165,250,.13) 42%,rgba(2,6,23,.08) 82%,transparent);clip-path:polygon(42% 0,58% 0,82% 22%,92% 72%,70% 100%,30% 100%,8% 72%,18% 22%);box-shadow:inset 10px 0 20px rgba(255,255,255,.05),inset -14px -18px 30px rgba(2,6,23,.16)}.body-ground-glow{position:absolute;left:50%;bottom:11%;width:128px;height:70px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(125,211,252,.13),transparent 70%);filter:blur(14px)}.aura-orb-button{position:absolute;left:50%;top:56%;z-index:24;width:330px;height:330px;transform:translate(-50%,-36%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;transition:transform .24s ease}.aura-orb-button:hover{transform:translate(-50%,-37%) scale(1.025)}.aura-field{position:absolute;inset:-28%;border-radius:999px;background:radial-gradient(circle,var(--aura),var(--aura-soft) 36%,transparent 70%);filter:blur(28px);animation:auraPulse var(--aura-pulse) ease-in-out infinite}.aura-ring{position:absolute;inset:16%;border-radius:999px;border:1px solid rgba(255,255,255,.15);box-shadow:0 0 34px rgba(125,211,252,.12);animation:ringRotate 14s linear infinite}.aura-ring-two{inset:7%;opacity:.36;animation-duration:20s;animation-direction:reverse}.orb-core{position:absolute;left:50%;top:50%;width:118px;height:118px;transform:translate(-50%,-50%);border-radius:999px;background:radial-gradient(circle at 34% 26%,#fff 0 8%,#cffafe 18%,#67e8f9 42%,#0e7490 64%,#082f49 86%);box-shadow:inset -18px -24px 34px rgba(2,6,23,.58),inset 14px 10px 20px rgba(255,255,255,.2),0 0 42px rgba(255,255,255,.42),0 0 112px rgba(103,232,249,.38)}.orb-reflection{position:absolute;left:50%;top:62%;width:104px;height:30px;transform:translateX(-50%);border-radius:50%;background:rgba(2,6,23,.32);filter:blur(5px)}.orb-status{position:absolute;left:50%;bottom:44px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(226,242,255,.62);padding:.32rem .55rem;font-size:.58rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;backdrop-filter:blur(12px)}.companion-dot{position:absolute;right:calc(50% - 116px);top:58%;z-index:30;width:44px;height:44px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:radial-gradient(circle,#e0f2fe,rgba(103,232,249,.24),rgba(255,255,255,.04));box-shadow:0 0 36px rgba(103,232,249,.32);pointer-events:auto;cursor:pointer;animation:companionBreath 5.6s ease-in-out infinite}.emotional-biome{position:absolute;left:50%;bottom:-10vh;z-index:19;width:min(1120px,90vw);height:31vh;transform:translateX(-50%);border:0;background:transparent;pointer-events:auto;cursor:pointer}.biome-terrain{position:absolute;inset:0;border-radius:52% 52% 0 0;background:radial-gradient(ellipse at 50% 5%,rgba(226,249,255,.18),rgba(125,211,252,.07) 34%,transparent 58%),linear-gradient(180deg,rgba(16,45,84,.22),rgba(2,6,23,.52) 74%,rgba(2,6,23,.76));box-shadow:0 -20px 90px rgba(125,211,252,.12)}.biome-horizon{position:absolute;left:11%;right:11%;top:13%;height:1px;background:linear-gradient(90deg,transparent,rgba(226,242,255,.33),transparent);filter:blur(.5px)}.biome-reflection{position:absolute;left:50%;top:6%;width:min(430px,48vw);height:82px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(125,211,252,.2),rgba(255,255,255,.05) 34%,transparent 72%);filter:blur(16px)}.biome-label{position:absolute;left:50%;top:24%;transform:translateX(-50%);border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(2,6,23,.48);color:rgba(226,242,255,.68);padding:.52rem .84rem;font-size:.62rem;font-weight:850;letter-spacing:.2em;text-transform:uppercase;backdrop-filter:blur(16px)}.state-strip{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom) + 1.35rem);z-index:42;width:min(560px,calc(100vw - 2rem));transform:translateX(-50%);pointer-events:none}.state-strip button{pointer-events:auto;width:100%;display:flex;align-items:center;justify-content:center;gap:.62rem;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(2,6,23,.5);color:rgba(226,242,255,.7);padding:.68rem .92rem;box-shadow:0 22px 80px rgba(0,0,0,.3);backdrop-filter:blur(22px);cursor:pointer}.state-strip strong{color:rgba(255,255,255,.92);font-size:.8rem}.state-strip span{font-size:.74rem;white-space:nowrap}.state-strip span:before{content:"·";margin-right:.62rem;color:rgba(186,230,253,.38)}.sheet-backdrop{position:absolute;inset:0;z-index:60;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.42);padding:1rem;backdrop-filter:blur(2px)}.home-sheet{width:min(430px,100%);border:1px solid rgba(255,255,255,.12);border-radius:2rem;background:rgba(2,6,23,.92);padding:1.05rem;box-shadow:0 30px 100px rgba(0,0,0,.55);backdrop-filter:blur(24px)}.sheet-handle{display:block;width:42px;height:4px;margin:0 auto .9rem;border-radius:999px;background:rgba(255,255,255,.18)}.sheet-eyebrow{color:rgba(125,211,252,.72);font-size:.62rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.home-sheet h2{margin:.45rem 0 .45rem;color:rgba(255,255,255,.94);font-size:1.12rem;line-height:1.25}.home-sheet p{margin:.45rem 0 0;color:rgba(226,242,255,.66);font-size:.9rem;line-height:1.55}.why-copy{font-size:.8rem!important;color:rgba(226,242,255,.48)!important}.home-sheet button{margin-top:.9rem;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.88);padding:.62rem .86rem;font-size:.84rem;font-weight:700}.is-transitioning .sky-layer{transform:scale(1.12);opacity:.42;transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .9s ease}.is-transitioning .home-header,.is-transitioning .state-strip,.is-transitioning .silhouette-button,.is-transitioning .companion-dot,.is-transitioning .emotional-biome{opacity:0;transition:opacity .35s ease}.is-transitioning .aura-orb-button{transform:translate(-50%,-190%) scale(.72);transition:transform .9s cubic-bezier(.22,1,.36,1)}.is-transitioning .constellation-layer{opacity:.78;transform:scale(2) translateY(-6vh);transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .9s ease}@keyframes auraPulse{0%,100%{transform:scale(.96);opacity:.6}50%{transform:scale(1.06);opacity:.92}}@keyframes ringRotate{0%{transform:rotate(0deg) scaleX(1.06) scaleY(.94)}100%{transform:rotate(360deg) scaleX(1.06) scaleY(.94)}}@keyframes companionBreath{0%,100%{transform:scale(.94);opacity:.64}50%{transform:scale(1.06);opacity:1}}@keyframes fogDrift{0%{transform:translate(-2vw,1vh) scale(1)}100%{transform:translate(2vw,-1vh) scale(1.06)}}@keyframes starFloat{0%,100%{opacity:.62;transform:translate(-50%,-50%) translateY(0) scale(.9)}50%{opacity:1;transform:translate(-50%,-50%) translateY(-7px) scale(1.08)}}@keyframes twinkle{0%,100%{opacity:.24;transform:scale(.84)}50%{opacity:.72;transform:scale(1.2)}}@keyframes pathReveal{from{stroke-dashoffset:18;opacity:0}to{stroke-dashoffset:0;opacity:1}}@media(min-width:760px){.home-header{padding-top:15vh}.silhouette-button{left:calc(50% - 126px)}.urai-home-shell:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:min(960px,100%);transform:translateX(-50%);border-left:1px solid rgba(255,255,255,.035);border-right:1px solid rgba(255,255,255,.035);pointer-events:none}}@media(max-width:760px){.home-header{padding-top:calc(env(safe-area-inset-top) + 12vh);padding-left:1rem;padding-right:1rem}.home-header h1{font-size:1.16rem}.home-header p{font-size:.78rem}.constellation-layer svg{height:38%;inset-left:8%;width:84%}.silhouette-button{left:calc(50% - 78px);top:55%;width:100px;height:282px;opacity:.46}.aura-orb-button{top:56%;width:238px;height:238px}.orb-core{width:88px;height:88px}.orb-status{bottom:22px}.companion-dot{right:calc(50% - 94px);top:58%}.emotional-biome{width:104vw;height:27vh;bottom:-7vh}.biome-label{top:29%;font-size:.55rem}.state-strip{left:.75rem;right:.75rem;bottom:calc(env(safe-area-inset-bottom) + .75rem);width:auto;transform:none}.state-strip button{display:grid;grid-template-columns:1fr;gap:.16rem;text-align:left;border-radius:1.1rem;justify-items:start;padding:.72rem .86rem}.state-strip span:before{content:"";margin:0}.memory-star{min-width:44px;min-height:44px}.memory-star span{inset:14px}.sheet-backdrop{padding:.75rem}}@media(prefers-reduced-motion:reduce){.sky-fog,.memory-star,.ambient-star,.aura-field,.aura-ring,.companion-dot,.constellation-layer path{animation:none!important}.is-transitioning .sky-layer,.is-transitioning .aura-orb-button,.is-transitioning .constellation-layer{transition-duration:.01ms!important}}
`;