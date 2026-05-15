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

  if (home.visualState === "socialHigh") {
    return {
      skyTop: "#020617",
      skyMid: "#164e63",
      skyBottom: "#0f172a",
      aura: "rgba(103,232,249,0.58)",
      auraSoft: "rgba(192,132,252,0.28)",
      horizon: "rgba(125,211,252,0.32)",
      particleOpacity: 0.34,
      auraPulseSeconds: 5.2,
      fogOpacity: 0.18,
      constellationOpacity: 0.3,
      vignetteOpacity: 0.36,
      orbLabel: "Social field",
    };
  }

  if (home.visualState === "socialSilence") {
    return {
      skyTop: "#020617",
      skyMid: "#0b1b34",
      skyBottom: "#030712",
      aura: "rgba(147,197,253,0.44)",
      auraSoft: "rgba(30,64,175,0.16)",
      horizon: "rgba(96,165,250,0.16)",
      particleOpacity: 0.12,
      auraPulseSeconds: 6.8,
      fogOpacity: 0.26,
      constellationOpacity: 0.1,
      vignetteOpacity: 0.55,
      orbLabel: "Quiet field",
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
          <p className="brand-mark">URAI</p>
          <h1>{home.insight.title}</h1>
          <p>{home.forecastMessage}</p>
        </div>
        <button type="button" className="listening-pill" onClick={() => setActiveSheet("companion")}>
          <span />{home.source === "firestore" ? "Live" : "Demo"}
        </button>
      </header>

      <section className="body-field" aria-label="URAI body, aura, and companion field">
        <button type="button" className="silhouette-button" aria-label="Open body state" onClick={() => setActiveSheet("body")}>
          <span className="body-halo" />
          <span className="body-head" />
          <span className="body-core" />
          <span className="body-leg body-leg-left" />
          <span className="body-leg body-leg-right" />
        </button>

        <button type="button" className="aura-orb-button" aria-label="Open mood weather" onClick={() => setActiveSheet("mood")}>
          <span className="aura-field" />
          <span className="aura-ring aura-ring-one" />
          <span className="aura-ring aura-ring-two" />
          <span className="orb-core" />
          <span className="orb-shadow" />
          <span className="orb-status">{visuals.orbLabel}</span>
        </button>

        <button type="button" className="companion-dot" aria-label="Open companion" onClick={() => setActiveSheet("companion")} />
      </section>

      <section className="insight-dock">
        <button type="button" className="insight-card" onClick={() => setActiveSheet("insight")}>
          <span>{home.moodWeather} · {home.forecastSummary}</span>
          <strong>{home.insight.title}</strong>
          <p>{home.insight.body}</p>
        </button>
      </section>

      <nav className="home-nav" aria-label="URAI primary navigation">
        <button type="button" className="active">Home</button>
        <button type="button" onClick={() => setActiveSheet("body")}>Mirror</button>
        <button type="button" onClick={openLifeMap}>Map</button>
        <button type="button" onClick={() => setActiveSheet("insight")}>Replay</button>
      </nav>

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
          className="memory-star"
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
    </span>
  );
}

const styles = `
  .urai-home-shell{position:fixed;inset:0;z-index:2147483647;min-height:100dvh;width:100vw;overflow:hidden;background:#020617;color:white;isolation:isolate;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.lifemap-shell{background:#020617}.return-home{position:fixed;left:calc(env(safe-area-inset-left) + 1rem);top:calc(env(safe-area-inset-top) + 1rem);z-index:70;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(2,6,23,.62);color:rgba(255,255,255,.86);padding:.62rem .9rem;font-size:.8rem;backdrop-filter:blur(18px)}.sky-layer{position:absolute;inset:0;z-index:0;border:0;padding:0;text-align:left;background:transparent;cursor:zoom-in;overflow:hidden}.sky-gradient{position:absolute;inset:0;background:linear-gradient(180deg,var(--sky-top),var(--sky-mid) 48%,var(--sky-bottom))}.sky-fog{position:absolute;border-radius:999px;filter:blur(54px);opacity:var(--fog-opacity);mix-blend-mode:screen}.sky-fog-one{left:16%;top:28%;width:44vw;height:35vh;background:radial-gradient(circle,rgba(125,211,252,.24),transparent 68%);animation:fogDrift 16s ease-in-out infinite alternate}.sky-fog-two{right:8%;top:24%;width:38vw;height:36vh;background:radial-gradient(circle,rgba(167,139,250,.18),transparent 72%);animation:fogDrift 20s ease-in-out infinite alternate-reverse}.horizon-glow{position:absolute;left:50%;bottom:7%;width:min(980px,92vw);height:34vh;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at 50% 30%,var(--horizon),rgba(125,211,252,.08) 34%,transparent 70%);filter:blur(18px)}.sky-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 52%,transparent 0%,transparent 44%,rgba(0,0,0,.28) 72%,rgba(0,0,0,var(--vignette-opacity)) 100%),linear-gradient(180deg,rgba(0,0,0,.32),transparent 38%,rgba(0,0,0,.42));pointer-events:none}.constellation-layer{position:absolute;inset:0;opacity:var(--constellation-opacity);pointer-events:none;transition:opacity .4s ease}.constellation-layer svg{position:absolute;inset:4% 4% auto 4%;height:42%;width:92%;overflow:visible}.constellation-layer path{fill:none;stroke:rgba(186,230,253,.7);stroke-width:.14;stroke-dasharray:1.4 2.2;filter:drop-shadow(0 0 5px rgba(186,230,253,.75))}.memory-star{position:absolute;z-index:3;transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer;animation:starFloat 7s ease-in-out infinite}.memory-star span{position:absolute;inset:-60%;border-radius:999px;background:radial-gradient(circle,#fff 0 7%,var(--node-color) 16%,rgba(186,230,253,.3) 38%,transparent 70%);filter:drop-shadow(0 0 14px rgba(255,255,255,.65))}.ambient-star{position:absolute;display:block;width:5px;height:5px;border-radius:999px;background:white;filter:drop-shadow(0 0 14px rgba(255,255,255,.72));opacity:.46;animation:twinkle 5.5s ease-in-out infinite}.a1{left:12%;top:64%}.a2{right:18%;top:52%;animation-delay:-2s}.a3{left:52%;top:78%;animation-delay:-4s}.home-header{position:relative;z-index:20;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:calc(env(safe-area-inset-top) + 1.1rem) max(1.25rem,env(safe-area-inset-left)) 0 max(1.25rem,env(safe-area-inset-right));pointer-events:none}.brand-mark{margin:0 0 .7rem;color:rgba(255,255,255,.52);font-size:.68rem;font-weight:700;letter-spacing:.28em}.home-header h1{margin:0;max-width:36rem;color:rgba(255,255,255,.92);font-size:clamp(1.25rem,2.4vw,1.85rem);line-height:1.18;letter-spacing:-.03em;text-shadow:0 2px 30px rgba(0,0,0,.74)}.home-header p:last-child{margin:.55rem 0 0;max-width:32rem;color:rgba(226,242,255,.64);font-size:.92rem;line-height:1.5}.listening-pill{pointer-events:auto;display:flex;align-items:center;gap:.42rem;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.68);padding:.45rem .68rem;font-size:.62rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;backdrop-filter:blur(18px)}.listening-pill span{width:.42rem;height:.42rem;border-radius:999px;background:#67e8f9;box-shadow:0 0 18px #67e8f9}.body-field{position:absolute;inset:0;z-index:18;pointer-events:none}.silhouette-button{position:absolute;left:calc(50% - min(14vw,190px));top:50%;z-index:20;width:118px;height:330px;transform:translate(-50%,-22%);border:0;background:transparent;pointer-events:auto;cursor:pointer;opacity:.78;filter:drop-shadow(0 0 34px rgba(103,232,249,.18))}.body-halo{position:absolute;inset:4% -30%;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,rgba(186,230,253,.18),transparent 65%);filter:blur(16px)}.body-head{position:absolute;left:50%;top:2%;width:44px;height:62px;transform:translateX(-50%);border-radius:999px;background:rgba(125,211,252,.18);filter:blur(.4px)}.body-core{position:absolute;left:50%;top:22%;width:54px;height:178px;transform:translateX(-50%);border-radius:50% 50% 42% 42%;background:linear-gradient(180deg,rgba(2,6,23,.16),rgba(2,6,23,.82));box-shadow:inset 10px 0 18px rgba(125,211,252,.16),0 0 36px rgba(2,6,23,.74)}.body-leg{position:absolute;bottom:0;width:18px;height:146px;border-radius:999px;background:rgba(2,6,23,.76);box-shadow:0 0 22px rgba(2,6,23,.8)}.body-leg-left{left:37%}.body-leg-right{right:37%}.aura-orb-button{position:absolute;left:50%;top:55%;z-index:24;width:280px;height:280px;transform:translate(-50%,-36%);border:0;border-radius:999px;background:transparent;pointer-events:auto;cursor:pointer}.aura-field{position:absolute;inset:-26%;border-radius:999px;background:radial-gradient(circle,var(--aura),var(--aura-soft) 35%,transparent 70%);filter:blur(28px);animation:auraPulse var(--aura-pulse) ease-in-out infinite}.aura-ring{position:absolute;inset:16%;border-radius:999px;border:1px solid rgba(255,255,255,.16);box-shadow:0 0 34px rgba(125,211,252,.12);animation:ringRotate 14s linear infinite}.aura-ring-two{inset:7%;opacity:.36;animation-duration:20s;animation-direction:reverse}.orb-core{position:absolute;left:50%;top:50%;width:92px;height:92px;transform:translate(-50%,-50%);border-radius:999px;background:radial-gradient(circle at 34% 26%,#fff 0 8%,#a5f3fc 24%,#0891b2 55%,#082f49 80%);box-shadow:inset 0 -15px 22px rgba(2,6,23,.55),0 0 36px rgba(103,232,249,.62),0 0 110px rgba(103,232,249,.38)}.orb-shadow{position:absolute;left:50%;top:59%;width:64px;height:18px;transform:translateX(-50%);border-radius:50%;background:rgba(2,6,23,.38);filter:blur(3px)}.orb-status{position:absolute;left:50%;bottom:40px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(226,242,255,.62);padding:.32rem .55rem;font-size:.58rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;backdrop-filter:blur(12px)}.companion-dot{position:absolute;right:calc(50% - 104px);top:61%;z-index:30;width:44px;height:44px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:radial-gradient(circle,#e0f2fe,rgba(103,232,249,.26),rgba(255,255,255,.04));box-shadow:0 0 36px rgba(103,232,249,.34);pointer-events:auto;cursor:pointer;animation:companionBreath 5.6s ease-in-out infinite}.insight-dock{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom) + 5.4rem);z-index:40;padding:0 1rem;pointer-events:none}.insight-card{pointer-events:auto;display:block;width:min(430px,100%);margin:0 auto;border:1px solid rgba(255,255,255,.12);border-radius:1.55rem;background:rgba(2,6,23,.46);padding:1rem 1.05rem;text-align:left;box-shadow:0 22px 80px rgba(0,0,0,.34);backdrop-filter:blur(22px);cursor:pointer}.insight-card span{display:block;color:rgba(186,230,253,.52);font-size:.62rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase}.insight-card strong{display:block;margin:.48rem 0 .22rem;color:rgba(255,255,255,.92);font-size:1rem;line-height:1.25}.insight-card p{margin:0;color:rgba(226,242,255,.64);font-size:.86rem;line-height:1.45}.home-nav{position:absolute;left:50%;bottom:0;z-index:48;display:flex;width:min(430px,100%);transform:translateX(-50%);justify-content:space-around;border-top:1px solid rgba(255,255,255,.1);background:rgba(2,6,23,.68);padding:.78rem 1rem calc(env(safe-area-inset-bottom) + .72rem);backdrop-filter:blur(24px)}.home-nav button{border:0;background:transparent;color:rgba(255,255,255,.55);font-size:.72rem;font-weight:650;cursor:pointer}.home-nav .active{color:rgba(186,230,253,.96)}.home-nav .active:after{content:"";display:block;width:4px;height:4px;margin:.28rem auto 0;border-radius:999px;background:#bae6fd}.sheet-backdrop{position:absolute;inset:0;z-index:60;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.42);padding:1rem;backdrop-filter:blur(2px)}.home-sheet{width:min(430px,100%);border:1px solid rgba(255,255,255,.12);border-radius:2rem;background:rgba(2,6,23,.92);padding:1.05rem;box-shadow:0 30px 100px rgba(0,0,0,.55);backdrop-filter:blur(24px)}.sheet-handle{display:block;width:42px;height:4px;margin:0 auto .9rem;border-radius:999px;background:rgba(255,255,255,.18)}.sheet-eyebrow{color:rgba(125,211,252,.72);font-size:.62rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.home-sheet h2{margin:.45rem 0 .45rem;color:rgba(255,255,255,.94);font-size:1.12rem;line-height:1.25}.home-sheet p{margin:.45rem 0 0;color:rgba(226,242,255,.66);font-size:.9rem;line-height:1.55}.why-copy{font-size:.8rem!important;color:rgba(226,242,255,.48)!important}.home-sheet button{margin-top:.9rem;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.88);padding:.62rem .86rem;font-size:.84rem;font-weight:700}.is-transitioning .sky-layer{transform:scale(1.12);opacity:.42;transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .9s ease}.is-transitioning .home-header,.is-transitioning .insight-dock,.is-transitioning .home-nav,.is-transitioning .silhouette-button,.is-transitioning .companion-dot{opacity:0;transition:opacity .35s ease}.is-transitioning .aura-orb-button{transform:translate(-50%,-190%) scale(.72);transition:transform .9s cubic-bezier(.22,1,.36,1)}.is-transitioning .constellation-layer{opacity:.78;transform:scale(2) translateY(-6vh);transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .9s ease}@keyframes auraPulse{0%,100%{transform:scale(.96);opacity:.6}50%{transform:scale(1.06);opacity:.92}}@keyframes ringRotate{0%{transform:rotate(0deg) scaleX(1.06) scaleY(.94)}100%{transform:rotate(360deg) scaleX(1.06) scaleY(.94)}}@keyframes companionBreath{0%,100%{transform:scale(.94);opacity:.64}50%{transform:scale(1.06);opacity:1}}@keyframes fogDrift{0%{transform:translate(-2vw,1vh) scale(1)}100%{transform:translate(2vw,-1vh) scale(1.06)}}@keyframes starFloat{0%,100%{opacity:.62;transform:translate(-50%,-50%) translateY(0) scale(.9)}50%{opacity:1;transform:translate(-50%,-50%) translateY(-7px) scale(1.08)}}@keyframes twinkle{0%,100%{opacity:.24;transform:scale(.84)}50%{opacity:.72;transform:scale(1.2)}}@media(min-width:760px){.urai-home-shell:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:min(430px,100%);transform:translateX(-50%);border-left:1px solid rgba(255,255,255,.04);border-right:1px solid rgba(255,255,255,.04);pointer-events:none}.home-header{left:50%;width:min(430px,100%);transform:translateX(-50%);padding-left:1.25rem;padding-right:1.25rem}.silhouette-button{left:calc(50% - 88px)}.insight-dock{left:50%;right:auto;width:min(430px,100%);transform:translateX(-50%)}}@media(max-width:520px){.home-header h1{font-size:1.22rem}.home-header p:last-child{font-size:.82rem}.silhouette-button{left:calc(50% - 78px);top:49%;width:94px;height:276px}.aura-orb-button{top:55%;width:224px;height:224px}.orb-core{width:82px;height:82px}.orb-status{bottom:22px}.companion-dot{right:calc(50% - 86px);top:60%}.insight-dock{bottom:calc(env(safe-area-inset-bottom) + 5rem)}.insight-card{padding:.9rem}.sheet-backdrop{padding:.75rem}.constellation-layer svg{height:39%}}@media(prefers-reduced-motion:reduce){.sky-fog,.memory-star,.ambient-star,.aura-field,.aura-ring,.companion-dot{animation:none!important}.is-transitioning .sky-layer,.is-transitioning .aura-orb-button,.is-transitioning .constellation-layer{transition-duration:.01ms!important}}
`;
