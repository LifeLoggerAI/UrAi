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
      skyTop: "#02030a",
      skyMid: "#10182d",
      skyBottom: "#211736",
      aura: "rgba(196,181,253,0.52)",
      auraSoft: "rgba(126,34,206,0.18)",
      horizon: "rgba(245,158,11,0.2)",
      particleOpacity: 0.18,
      auraPulseSeconds: 7.2,
      fogOpacity: 0.42,
      constellationOpacity: 0.18,
      vignetteOpacity: 0.78,
      orbLabel: "Protective",
    };
  }

  if (home.visualState === "recovery" || home.bloomReady) {
    return {
      skyTop: "#020817",
      skyMid: "#0a2a3e",
      skyBottom: "#03111f",
      aura: "rgba(94,234,212,0.62)",
      auraSoft: "rgba(251,191,36,0.22)",
      horizon: "rgba(251,191,36,0.34)",
      particleOpacity: 0.34,
      auraPulseSeconds: 5.2,
      fogOpacity: 0.22,
      constellationOpacity: 0.3,
      vignetteOpacity: 0.42,
      orbLabel: "Blooming",
    };
  }

  if (home.visualState === "overstimulated" || home.rhythmState === "overstimulated") {
    return {
      skyTop: "#010411",
      skyMid: "#172554",
      skyBottom: "#020617",
      aura: "rgba(56,189,248,0.68)",
      auraSoft: "rgba(129,140,248,0.34)",
      horizon: "rgba(56,189,248,0.3)",
      particleOpacity: 0.44,
      auraPulseSeconds: 3.1,
      fogOpacity: 0.3,
      constellationOpacity: 0.28,
      vignetteOpacity: 0.5,
      orbLabel: "Fast Rhythm",
    };
  }

  if (home.visualState === "offRhythm" || home.rhythmState === "offRhythm") {
    return {
      skyTop: "#020617",
      skyMid: "#13234b",
      skyBottom: "#01030a",
      aura: "rgba(147,197,253,0.48)",
      auraSoft: "rgba(99,102,241,0.2)",
      horizon: "rgba(99,102,241,0.22)",
      particleOpacity: 0.22,
      auraPulseSeconds: 4.8,
      fogOpacity: 0.36,
      constellationOpacity: 0.18,
      vignetteOpacity: 0.58,
      orbLabel: "Recalibrating",
    };
  }

  return {
    skyTop: "#01040d",
    skyMid: "#0b2947",
    skyBottom: "#01030a",
    aura: "rgba(103,232,249,0.58)",
    auraSoft: "rgba(59,130,246,0.24)",
    horizon: "rgba(125,211,252,0.28)",
    particleOpacity: 0.26,
    auraPulseSeconds: 5.8,
    fogOpacity: 0.22,
    constellationOpacity: 0.24,
    vignetteOpacity: 0.48,
    orbLabel: home.companionMode === "listening" ? "Listening" : "Ambient",
  };
}

function nodeSize(node: UraiLifeMapNode) {
  return Math.round(8 + node.emotionalWeight * 13);
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
  const topNode = useMemo(() => [...home.nodes].sort((a, b) => b.emotionalWeight - a.emotionalWeight)[0], [home.nodes]);

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
        <span className="distant-aurora" />
        <span className="sky-fog sky-fog-one" />
        <span className="sky-fog sky-fog-two" />
        <span className="horizon-glow" />
        <Constellation nodes={home.nodes} onNodeOpen={(node) => { setActiveSheet(null); setActiveNode(node); }} />
        <span className="sky-vignette" />
      </button>

      <header className="home-header">
        <div>
          <span className="field-eyebrow">URAI Home Field</span>
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
          <span className="aura-backlight" />
          <span className="aura-ring aura-ring-one" />
          <span className="aura-ring aura-ring-two" />
          <span className="aura-ring aura-ring-three" />
          <span className="orb-shadow" />
          <span className="orb-core" />
          <span className="orb-glass" />
          <span className="orb-reflection" />
          <span className="orb-status">{visuals.orbLabel}</span>
        </button>

        <button type="button" className="companion-dot" aria-label="Open companion" onClick={() => setActiveSheet("companion")}>
          <span />
        </button>
      </section>

      <button type="button" className="emotional-biome" aria-label="Open emotional biome" onClick={() => setActiveSheet("body")}>
        <span className="biome-atmosphere" />
        <span className="biome-terrain" />
        <span className="biome-rim" />
        <span className="biome-horizon" />
        <span className="biome-reflection" />
        <span className="biome-label">Emotional Biome</span>
      </button>

      <section className="state-strip">
        <button type="button" onClick={() => setActiveSheet("mood")}>
          <strong>{home.moodWeather}</strong>
          <span>{Math.round(home.recoveryScore)}% Recovery</span>
          <span>{home.memoryNodeCount} Memory Nodes</span>
          <span>{topNode ? topNode.title : home.forecastSummary}</span>
        </button>
      </section>

      {(activeSheet || activeNode) && (
        <div className="sheet-backdrop" onClick={() => { setActiveSheet(null); setActiveNode(null); }}>
          <aside className="home-sheet" onClick={(event) => event.stopPropagation()}>
            <span className="sheet-handle" />
            {activeNode ? (
              <>
                <span className="sheet-eyebrow">{activeNode.type} signal</span>
                <h2>{activeNode.title}</h2>
                <p>{activeNode.subtitle}</p>
                <button type="button" onClick={openLifeMap}>Open Life Map</button>
              </>
            ) : null}
            {activeSheet === "body" ? (
              <>
                <span className="sheet-eyebrow">Body field</span>
                <h2>{home.rhythmState === "offRhythm" ? "Your rhythm is recalibrating." : "The field is steady enough to read."}</h2>
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
                <p className="why-copy">Why this appears: this home field is summarizing rhythm, recovery, memory stars, companion state, and active Life Map signals.</p>
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
      <i className="ambient-star a5" />
      <i className="ambient-star a6" />
    </span>
  );
}

const styles = `
  .urai-home-shell{position:fixed;inset:0;z-index:2147483647;min-height:100dvh;width:100vw;overflow:hidden;background:#01030a;color:white;isolation:isolate;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  .lifemap-shell{background:#020617}.return-home{position:fixed;left:calc(env(safe-area-inset-left) + 1rem);top:calc(env(safe-area-inset-top) + 1rem);z-index:70;border:1px solid rgba(186,230,253,.2);border-radius:999px;background:rgba(1,6,18,.72);color:rgba(255,255,255,.9);padding:.62rem .9rem;font-size:.8rem;backdrop-filter:blur(18px)}
  .sky-layer{position:absolute;inset:0;z-index:0;border:0;padding:0;text-align:left;background:transparent;cursor:zoom-in;overflow:hidden}
  .sky-gradient{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 57%,var(--aura-soft),transparent 33%),radial-gradient(ellipse at 50% 82%,rgba(125,211,252,.13),transparent 30%),linear-gradient(180deg,var(--sky-top),var(--sky-mid) 48%,var(--sky-bottom));}
  .distant-aurora{position:absolute;left:22%;right:18%;top:13%;height:20vh;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(125,211,252,.1),transparent 66%);filter:blur(34px);opacity:.56;animation:auroraDrift 18s ease-in-out infinite alternate}
  .sky-fog{position:absolute;border-radius:999px;filter:blur(64px);opacity:var(--fog-opacity);mix-blend-mode:screen}.sky-fog-one{left:8%;top:31%;width:48vw;height:34vh;background:radial-gradient(circle,rgba(125,211,252,.18),transparent 68%);animation:fogDrift 16s ease-in-out infinite alternate}.sky-fog-two{right:2%;top:20%;width:44vw;height:40vh;background:radial-gradient(circle,rgba(167,139,250,.16),transparent 72%);animation:fogDrift 20s ease-in-out infinite alternate-reverse}
  .horizon-glow{position:absolute;left:50%;bottom:19.5%;width:min(980px,82vw);height:25vh;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at 50% 38%,var(--horizon),rgba(125,211,252,.1) 36%,transparent 72%);filter:blur(26px);opacity:.9}
  .sky-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 52%,transparent 0%,transparent 44%,rgba(0,0,0,.18) 72%,rgba(0,0,0,var(--vignette-opacity)) 100%),linear-gradient(180deg,rgba(0,0,0,.36),transparent 35%,rgba(0,0,0,.46));pointer-events:none}
  .constellation-layer{position:absolute;inset:0;opacity:var(--constellation-opacity);pointer-events:none;transition:opacity .4s ease}.constellation-layer svg{position:absolute;inset:8% 16% auto 16%;height:36%;width:68%;overflow:visible}.constellation-layer path{fill:none;stroke:rgba(186,230,253,.55);stroke-width:.12;stroke-dasharray:1.4 2.6;filter:drop-shadow(0 0 5px rgba(186,230,253,.62));animation:pathReveal 2.6s ease-out both}.memory-star{position:absolute;z-index:3;transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;animation:starFloat 7s ease-in-out infinite}.memory-star span{position:absolute;inset:-70%;border-radius:999px;background:radial-gradient(circle,#fff 0 7%,var(--node-color) 16%,rgba(186,230,253,.3) 38%,transparent 70%);filter:drop-shadow(0 0 14px rgba(255,255,255,.65))}.node-ritual span,.node-breakthrough span{background:radial-gradient(circle,#fff 0 7%,#fbbf24 16%,rgba(251,191,36,.25) 42%,transparent 70%)}.node-relationship span,.node-mirror span{background:radial-gradient(circle,#fff 0 7%,#c084fc 16%,rgba(192,132,252,.22) 42%,transparent 70%)}.node-forecast span,.node-becoming span{background:radial-gradient(circle,#fff 0 7%,#67e8f9 16%,rgba(103,232,249,.26) 42%,transparent 70%)}.node-recovery span{background:radial-gradient(circle,#fff 0 7%,#5eead4 16%,rgba(94,234,212,.26) 42%,transparent 70%)}.node-threshold span,.node-warning span{background:radial-gradient(circle,#fff 0 7%,#d8b4fe 16%,rgba(216,180,254,.3) 42%,transparent 70%)}
  .ambient-star{position:absolute;display:block;width:4px;height:4px;border-radius:999px;background:white;filter:drop-shadow(0 0 12px rgba(255,255,255,.72));opacity:.36;animation:twinkle 5.5s ease-in-out infinite}.a1{left:12%;top:66%}.a2{right:18%;top:52%;animation-delay:-2s}.a3{left:52%;top:76%;animation-delay:-4s}.a4{left:30%;top:32%;animation-delay:-1s}.a5{left:61%;top:18%;animation-delay:-3s}.a6{left:82%;top:58%;animation-delay:-5s}
  .home-header{position:relative;z-index:20;display:grid;place-items:center;text-align:center;padding-top:calc(env(safe-area-inset-top) + 13.3vh);pointer-events:none}.field-eyebrow{display:block;margin-bottom:.55rem;color:rgba(186,230,253,.34);font-size:.58rem;font-weight:900;letter-spacing:.32em;text-transform:uppercase}.home-header h1{margin:0;max-width:42rem;color:rgba(255,255,255,.94);font-size:clamp(1.35rem,2.25vw,2rem);line-height:1.08;letter-spacing:-.045em;text-shadow:0 2px 30px rgba(0,0,0,.78)}.home-header p{margin:.6rem auto 0;max-width:35rem;color:rgba(226,242,255,.68);font-size:.92rem;line-height:1.5}.enter-life-map{pointer-events:auto;margin-top:1.05rem;border:1px solid rgba(186,230,253,.24);border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.05));color:rgba(255,255,255,.95);padding:.78rem 1.22rem;font-size:.68rem;font-weight:900;letter-spacing:.22em;text-transform:uppercase;backdrop-filter:blur(18px);box-shadow:0 18px 58px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.18);cursor:zoom-in}.enter-life-map:hover{transform:translateY(-1px);border-color:rgba(186,230,253,.54)}
  .body-field{position:absolute;inset:0;z-index:18;pointer-events:none}.silhouette-button{position:absolute;left:calc(50% - min(9.4vw,118px));top:58%;z-index:20;width:118px;height:320px;transform:translate(-50%,-24%);border:0;background:transparent;pointer-events:auto;cursor:pointer;opacity:.58;filter:drop-shadow(0 0 34px rgba(103,232,249,.14));transition:opacity .2s ease,transform .2s ease}.silhouette-button:hover{opacity:.82;transform:translate(-50%,-25%)}.body-halo{position:absolute;inset:-2% -45%;border-radius:50%;background:radial-gradient(ellipse at 50% 42%,rgba(186,230,253,.14),transparent 64%);filter:blur(18px)}.body-head{position:absolute;left:50%;top:1%;width:54px;height:70px;transform:translateX(-50%);border-radius:999px;background:linear-gradient(180deg,rgba(207,250,254,.25),rgba(125,211,252,.1));box-shadow:0 0 28px rgba(125,211,252,.12)}.body-core{position:absolute;left:50%;top:20%;width:76px;height:238px;transform:translateX(-50%);border-radius:52% 52% 38% 38%;background:linear-gradient(180deg,rgba(188,235,255,.2),rgba(96,165,250,.11) 42%,rgba(2,6,23,.07) 82%,transparent);clip-path:polygon(42% 0,58% 0,82% 22%,92% 72%,70% 100%,30% 100%,8% 72%,18% 22%);box-shadow:inset 10px 0 20px rgba(255,255,255,.045),inset -14px -18px 30px rgba(2,6,23,.16)}.body-ground-glow{position:absolute;left:50%;bottom:12%;width:150px;height:80px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(125,211,252,.12),transparent 70%);filter:blur(14px)}
  .aura-orb-button{position:absolute;left:50%;top:58%;z-index:24;width:380px;height:380px;transform:translate(-50%,-38%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;transition:transform .24s ease}.aura-orb-button:hover{transform:translate(-50%,-39%) scale(1.018)}.aura-field{position:absolute;inset:-30%;border-radius:999px;background:radial-gradient(circle,var(--aura),var(--aura-soft) 34%,rgba(14,165,233,.06) 52%,transparent 70%);filter:blur(30px);animation:auraPulse var(--aura-pulse) ease-in-out infinite}.aura-backlight{position:absolute;inset:15%;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.18),rgba(103,232,249,.12) 30%,transparent 68%);filter:blur(22px)}.aura-ring{position:absolute;border-radius:999px;border:1px solid rgba(255,255,255,.13);box-shadow:0 0 34px rgba(125,211,252,.13);animation:ringRotate 14s linear infinite}.aura-ring-one{inset:17%;transform:rotate(-12deg) scaleX(1.12) scaleY(.9)}.aura-ring-two{inset:8%;opacity:.42;animation-duration:20s;animation-direction:reverse;transform:rotate(22deg) scaleX(1.15) scaleY(.88)}.aura-ring-three{inset:25%;opacity:.24;animation-duration:26s;transform:rotate(54deg) scaleX(1.2) scaleY(.84)}.orb-shadow{position:absolute;left:50%;top:62%;width:138px;height:38px;transform:translateX(-50%);border-radius:50%;background:rgba(0,0,0,.42);filter:blur(8px);opacity:.74}.orb-core{position:absolute;left:50%;top:50%;width:136px;height:136px;transform:translate(-50%,-50%);border-radius:999px;background:radial-gradient(circle at 30% 24%,#ffffff 0 9%,#d9fbff 17%,#7cf4ff 35%,#1fb7c9 51%,#0e627a 68%,#061728 92%);box-shadow:inset -24px -28px 38px rgba(1,5,14,.68),inset 16px 12px 22px rgba(255,255,255,.24),0 0 40px rgba(255,255,255,.38),0 0 124px rgba(103,232,249,.44),0 0 190px rgba(59,130,246,.2)}.orb-glass{position:absolute;left:calc(50% - 28px);top:calc(50% - 44px);width:56px;height:48px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.88),rgba(255,255,255,.18) 52%,transparent 72%);filter:blur(3px);transform:rotate(-18deg)}.orb-reflection{position:absolute;left:50%;top:67%;width:118px;height:32px;transform:translateX(-50%);border-radius:50%;background:rgba(2,6,23,.34);filter:blur(6px)}.orb-status{position:absolute;left:50%;bottom:50px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(226,242,255,.66);padding:.34rem .58rem;font-size:.58rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase;backdrop-filter:blur(12px)}.companion-dot{position:absolute;right:calc(50% - 126px);top:60%;z-index:30;width:50px;height:50px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:transparent;box-shadow:0 0 36px rgba(103,232,249,.32);pointer-events:auto;cursor:pointer;animation:companionBreath 5.6s ease-in-out infinite}.companion-dot span{position:absolute;inset:9px;border-radius:999px;background:radial-gradient(circle,#e0f2fe,rgba(103,232,249,.34),rgba(255,255,255,.04));}
  .emotional-biome{position:absolute;left:50%;bottom:-11.5vh;z-index:19;width:min(1220px,92vw);height:35vh;transform:translateX(-50%);border:0;background:transparent;pointer-events:auto;cursor:pointer}.biome-atmosphere{position:absolute;left:4%;right:4%;top:-26%;height:34%;border-radius:50%;background:radial-gradient(ellipse at 50% 80%,rgba(125,211,252,.14),transparent 70%);filter:blur(20px)}.biome-terrain{position:absolute;inset:0;border-radius:55% 55% 0 0;background:radial-gradient(ellipse at 50% 6%,rgba(226,249,255,.16),rgba(125,211,252,.075) 28%,transparent 52%),linear-gradient(180deg,rgba(18,58,91,.28),rgba(4,18,38,.72) 64%,rgba(0,0,0,.94));box-shadow:0 -26px 90px rgba(125,211,252,.12),inset 0 1px 0 rgba(255,255,255,.16)}.biome-rim{position:absolute;left:5%;right:5%;top:7%;height:2px;background:linear-gradient(90deg,transparent,rgba(226,242,255,.35),rgba(125,211,252,.22),transparent);filter:blur(.3px)}.biome-horizon{position:absolute;left:12%;right:12%;top:16%;height:1px;background:linear-gradient(90deg,transparent,rgba(226,242,255,.28),transparent);filter:blur(.5px)}.biome-reflection{position:absolute;left:50%;top:4%;width:min(500px,50vw);height:92px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(125,211,252,.2),rgba(255,255,255,.05) 34%,transparent 72%);filter:blur(18px)}.biome-label{position:absolute;left:50%;top:22%;transform:translateX(-50%);border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(1,7,20,.62);color:rgba(226,242,255,.72);padding:.52rem .84rem;font-size:.62rem;font-weight:900;letter-spacing:.2em;text-transform:uppercase;backdrop-filter:blur(16px)}
  .state-strip{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom) + 1.35rem);z-index:42;width:min(640px,calc(100vw - 2rem));transform:translateX(-50%);pointer-events:none}.state-strip button{pointer-events:auto;width:100%;display:flex;align-items:center;justify-content:center;gap:.62rem;border:1px solid rgba(186,230,253,.16);border-radius:999px;background:rgba(1,7,20,.6);color:rgba(226,242,255,.72);padding:.72rem .96rem;box-shadow:0 22px 80px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px);cursor:pointer}.state-strip strong{color:rgba(255,255,255,.94);font-size:.8rem}.state-strip span{font-size:.74rem;white-space:nowrap}.state-strip span:before{content:"·";margin-right:.62rem;color:rgba(186,230,253,.38)}
  .sheet-backdrop{position:absolute;inset:0;z-index:60;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.42);padding:1rem;backdrop-filter:blur(2px)}.home-sheet{width:min(430px,100%);border:1px solid rgba(255,255,255,.12);border-radius:2rem;background:rgba(2,6,23,.92);padding:1.05rem;box-shadow:0 30px 100px rgba(0,0,0,.55);backdrop-filter:blur(24px)}.sheet-handle{display:block;width:42px;height:4px;margin:0 auto .9rem;border-radius:999px;background:rgba(255,255,255,.18)}.sheet-eyebrow{color:rgba(125,211,252,.72);font-size:.62rem;font-weight:900;letter-spacing:.2em;text-transform:uppercase}.home-sheet h2{margin:.45rem 0 .45rem;color:rgba(255,255,255,.94);font-size:1.12rem;line-height:1.25}.home-sheet p{margin:.45rem 0 0;color:rgba(226,242,255,.66);font-size:.9rem;line-height:1.55}.why-copy{font-size:.8rem!important;color:rgba(226,242,255,.48)!important}.home-sheet button{margin-top:.9rem;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.88);padding:.62rem .86rem;font-size:.84rem;font-weight:700}.is-transitioning .sky-layer{transform:scale(1.12);opacity:.42;transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .9s ease}.is-transitioning .home-header,.is-transitioning .state-strip,.is-transitioning .silhouette-button,.is-transitioning .companion-dot,.is-transitioning .emotional-biome{opacity:0;transition:opacity .35s ease}.is-transitioning .aura-orb-button{transform:translate(-50%,-190%) scale(.72);transition:transform .9s cubic-bezier(.22,1,.36,1)}.is-transitioning .constellation-layer{opacity:.78;transform:scale(2) translateY(-6vh);transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .9s ease}
  @keyframes auraPulse{0%,100%{transform:scale(.96);opacity:.62}50%{transform:scale(1.06);opacity:.94}}@keyframes ringRotate{0%{rotate:0deg}100%{rotate:360deg}}@keyframes companionBreath{0%,100%{transform:scale(.94);opacity:.72}50%{transform:scale(1.06);opacity:1}}@keyframes fogDrift{0%{transform:translate(-2vw,1vh) scale(1)}100%{transform:translate(2vw,-1vh) scale(1.06)}}@keyframes auroraDrift{0%{transform:translateX(-2vw) scaleX(.95);opacity:.32}100%{transform:translateX(2vw) scaleX(1.08);opacity:.62}}@keyframes starFloat{0%,100%{opacity:.62;transform:translate(-50%,-50%) translateY(0) scale(.9)}50%{opacity:1;transform:translate(-50%,-50%) translateY(-7px) scale(1.08)}}@keyframes twinkle{0%,100%{opacity:.24;transform:scale(.84)}50%{opacity:.72;transform:scale(1.2)}}@keyframes pathReveal{from{stroke-dashoffset:18;opacity:0}to{stroke-dashoffset:0;opacity:1}}
  @media(min-width:760px){.home-header{padding-top:13.6vh}.urai-home-shell:after{content:"";position:absolute;left:50%;bottom:0;width:min(940px,82vw);height:52vh;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 28%,rgba(125,211,252,.055),transparent 62%);pointer-events:none;z-index:1}}
  @media(max-width:760px){.home-header{padding:calc(env(safe-area-inset-top) + 9vh) 1.2rem 0}.home-header h1{font-size:1.35rem}.home-header p{font-size:.84rem}.aura-orb-button{top:57%;width:300px;height:300px}.orb-core{width:112px;height:112px}.silhouette-button{left:calc(50% - 82px);height:270px;opacity:.45}.companion-dot{right:calc(50% - 98px)}.emotional-biome{width:112vw;height:32vh;bottom:-12vh}.state-strip{bottom:1rem}.state-strip button{overflow:auto;justify-content:flex-start}.state-strip span{font-size:.68rem}.biome-label{top:20%}}
`;
