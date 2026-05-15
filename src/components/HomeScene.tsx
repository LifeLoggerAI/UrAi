"use client";

import { useEffect, useMemo, useState } from "react";
import HomeWebGLSky from "@/components/HomeWebGLSky";
import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useEmotionalTone } from "@/components/lifemap/useEmotionalTone";
import { adamClampDemoProfile } from "@/lib/demo-data";

type HomeMode = "home" | "transitioning" | "lifemap";
type HomePanel = "forecast" | "reflection" | "whisper" | "access" | null;

const TONE_COPY = {
  calm: { whisper: "A quiet pattern is becoming visible.", opening: "The sky is opening." },
  focused: { whisper: "A small signal is asking for attention.", opening: "The stars are drawing upward." },
  charged: { whisper: "Something bright is rising through the noise.", opening: "The active pattern is opening." },
  restorative: { whisper: "Recovery is returning softly.", opening: "The sky is lifting gently." },
};

function titleCase(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function HomeScene() {
  const profile = adamClampDemoProfile;
  const [mode, setMode] = useState<HomeMode>("home");
  const [activePanel, setActivePanel] = useState<HomePanel>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const emotionalTone = useEmotionalTone();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  const transitionDuration = useMemo(() => {
    if (reduceMotion) return 0;
    if (emotionalTone === "restorative") return 1900;
    if (emotionalTone === "charged") return 1300;
    if (emotionalTone === "focused") return 1500;
    return 1650;
  }, [emotionalTone, reduceMotion]);

  useEffect(() => {
    if (mode !== "transitioning") return undefined;
    if (reduceMotion) {
      setMode("lifemap");
      return undefined;
    }
    const timer = window.setTimeout(() => setMode("lifemap"), transitionDuration);
    return () => window.clearTimeout(timer);
  }, [mode, reduceMotion, transitionDuration]);

  const openLifeMap = () => {
    if (mode !== "home") return;
    setActivePanel(null);
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setActivePanel(null);
    setMode("home");
  };

  if (mode === "lifemap") {
    return (
      <div className="relative h-dvh w-full overflow-hidden bg-black">
        <LifeMapScene />
        <button
          type="button"
          onClick={returnHome}
          className="absolute left-4 top-4 z-50 rounded-full border border-white/24 bg-black/40 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10"
          aria-label="Return to home scene"
        >
          Return home
        </button>
      </div>
    );
  }

  const isTransitioning = mode === "transitioning";
  const copy = TONE_COPY[emotionalTone];
  const forecast = profile.moodForecast;
  const reflection = profile.weeklyReflection;
  const forecastState = titleCase(forecast.rhythmState);
  const confidence = Math.round(forecast.confidence * 100);

  return (
    <main className={`home-scene tone-${emotionalTone} ${isTransitioning ? "is-transitioning" : ""}`} onClick={openLifeMap}>
      <button type="button" onClick={(event) => { event.stopPropagation(); openLifeMap(); }} disabled={isTransitioning} className="sky-trigger" aria-label="Ascend through the sky into the URAI Life Map">
        <span className="sr-only">Ascend through the sky into the URAI Life Map</span>
      </button>

      <div className="sky-base" aria-hidden />
      <HomeWebGLSky />
      <div className="sky-depth" aria-hidden />
      <div className="sky-rift" aria-hidden />
      <div className="aurora-column" aria-hidden />
      <div className="ascension-beam" aria-hidden />
      <div className="transition-vignette" aria-hidden />
      <div className="star-tunnel" aria-hidden>
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
        <span className="star star-six" />
        <span className="star star-seven" />
      </div>

      <div className="terrain-world" aria-hidden>
        <span className="terrain-haze" />
        <span className="ridge ridge-far" />
        <span className="ridge ridge-mid" />
        <span className="ridge ridge-near" />
        <span className="root root-left" />
        <span className="root root-center" />
        <span className="root root-right" />
      </div>

      <div className="self-avatar" aria-hidden>
        <span className="self-glow" />
        <span className="self-head" />
        <span className="self-shoulders" />
        <span className="self-core" />
        <span className="self-ground-shadow" />
      </div>

      <section className="world-stage" aria-label="URAI emotional home scene">
        <button type="button" className="companion-orb" onClick={(event) => { event.stopPropagation(); openLifeMap(); }} disabled={isTransitioning} aria-label="Ascend into Life Map">
          <span className="orb-halo" />
          <span className="orb-core" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
        </button>

        <p className="sky-whisper" aria-live="polite">{isTransitioning ? copy.opening : copy.whisper}</p>
        <p className="ascend-hint">Click the sky</p>

        <button type="button" className="explain-glyph" onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel ? null : "whisper"); }} aria-label="What am I seeing?">?</button>
        <button type="button" className="access-glyph" onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel === "access" ? null : "access"); }} aria-label="Open early access">demo</button>

        {activePanel && (
          <aside className="floating-panel" onClick={(event) => event.stopPropagation()}>
            {activePanel === "forecast" && <><p>Mood weather</p><h2>{forecastState}</h2><span>{forecast.summary}</span><small>Confidence {confidence}% · {forecast.nextBestAction}</small></>}
            {activePanel === "reflection" && <><p>Weekly scroll</p><h2>{reflection.title}</h2><span>{reflection.narratorSummary}</span><small>{reflection.highlights[0]}</small></>}
            {activePanel === "whisper" && <><p>What am I seeing?</p><h2>The sky is the doorway.</h2><span>Click the upper sky to ascend into the Life Map. The silhouette is the embodied self, the orb is the companion, and the terrain is the emotional ground.</span><div className="prompt-row"><button type="button" onClick={() => setActivePanel("forecast")}>Mood weather</button><button type="button" onClick={() => setActivePanel("reflection")}>Weekly scroll</button></div></>}
            {activePanel === "access" && <><p>Public demo</p><h2>Sample data only.</h2><span>No private user data is shown. Reflective insight only, not medical diagnosis.</span><div className="email-row"><input type="email" placeholder="you@example.com" aria-label="Email address" /><button type="button">Request access</button></div></>}
          </aside>
        )}
      </section>

      <style jsx>{`
        .home-scene { --tone-a: rgba(125,211,252,.16); --tone-b: rgba(196,181,253,.13); --tone-c: rgba(45,212,191,.12); --tone-speed: 1; position: relative; min-height: 100dvh; overflow: hidden; background: #000; color: white; isolation: isolate; user-select: none; cursor: zoom-in; }
        .tone-focused { --tone-a: rgba(96,165,250,.18); --tone-b: rgba(45,212,191,.12); --tone-c: rgba(125,211,252,.12); --tone-speed: .9; }
        .tone-charged { --tone-a: rgba(251,191,36,.14); --tone-b: rgba(244,114,182,.13); --tone-c: rgba(251,113,133,.11); --tone-speed: .82; }
        .tone-restorative { --tone-a: rgba(167,139,250,.16); --tone-b: rgba(14,165,233,.12); --tone-c: rgba(110,231,183,.11); --tone-speed: 1.25; }
        .sky-base,.sky-depth,.sky-rift,.aurora-column,.ascension-beam,.transition-vignette,.star-tunnel,.terrain-world,.self-avatar { position: fixed; inset: 0; pointer-events: none; }
        .sky-base { z-index: 0; background: radial-gradient(circle at 50% 10%, rgba(124,140,225,.62), transparent 27%), radial-gradient(ellipse at 50% 34%, rgba(54,91,154,.32), transparent 48%), linear-gradient(180deg,#020510 0%,#071126 48%,#03120c 80%,#000 100%); }
        .sky-depth { z-index: 3; background: radial-gradient(circle at 50% 28%, rgba(220,240,255,.16), transparent 18%), radial-gradient(ellipse at 50% 52%, var(--tone-b), transparent 33%), radial-gradient(ellipse at 50% 70%, rgba(68,160,126,.08), transparent 38%), linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(2,6,18,.1) 58%,rgba(0,0,0,.68) 100%); mix-blend-mode: screen; opacity: .9; transition: opacity 900ms ease, transform 1200ms ease; }
        .sky-rift { z-index: 11; background: radial-gradient(ellipse at 50% 13%, rgba(245,250,255,.2), rgba(125,211,252,.08) 19%, transparent 48%); opacity: .68; filter: blur(9px); transition: opacity 900ms ease, transform 1500ms cubic-bezier(.16,1,.3,1); }
        .aurora-column { z-index: 12; inset: -10%; background: linear-gradient(180deg,transparent 0%,rgba(125,211,252,.07) 36%,rgba(196,181,253,.04) 60%,transparent 100%); opacity: .28; filter: blur(7px); transition: opacity 1000ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .ascension-beam { z-index: 13; opacity: 0; background: radial-gradient(ellipse at 50% 32%, rgba(245,250,255,.52), rgba(125,211,252,.2) 18%, transparent 46%); transform: scale(.72) translateY(14%); transition: opacity 900ms ease, transform 1550ms cubic-bezier(.16,1,.3,1); }
        .transition-vignette { z-index: 31; opacity: 0; background: radial-gradient(circle at 50% 26%, transparent 0%, rgba(5,8,22,.24) 34%, rgba(0,0,0,.96) 100%); transition: opacity 1200ms ease; }
        .sky-trigger { position: fixed; inset: 0 0 42% 0; z-index: 18; border: 0; background: transparent; cursor: zoom-in; }
        .star-tunnel { z-index: 20; opacity: 0; transform: scale(.75) translateY(12%); background: radial-gradient(circle at 50% 18%,rgba(205,225,255,.42),transparent 6%), radial-gradient(circle at 42% 38%,var(--tone-b),transparent 12%), radial-gradient(circle at 58% 42%,var(--tone-a),transparent 14%); transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; } .star-two { left: 45%; top: 16%; width: .24rem; height: .24rem; } .star-three { left: 58%; top: 29%; width: .38rem; height: .38rem; } .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; } .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; } .star-six { left: 52%; top: 10%; width: .3rem; height: .3rem; } .star-seven { left: 72%; top: 21%; width: .18rem; height: .18rem; }
        .terrain-world { z-index: 8; top: auto; height: 50%; bottom: 0; overflow: hidden; transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 1100ms ease; }
        .terrain-world::before { content: ''; position: absolute; inset: -28% -8% 0; background: radial-gradient(ellipse at 50% 0%, rgba(113,210,162,.16), transparent 26%), linear-gradient(180deg, rgba(0,0,0,0), rgba(3,20,13,.54) 44%, rgba(0,0,0,.98)); }
        .terrain-haze,.ridge,.root { position: absolute; }
        .terrain-haze { left: 18%; right: 18%; top: 7%; height: 1px; background: linear-gradient(90deg, transparent, rgba(125,211,252,.2), transparent); box-shadow: 0 0 42px rgba(125,211,252,.24); opacity: .52; }
        .ridge { left: -12%; right: -12%; border-radius: 50% 50% 0 0 / 18% 22% 0 0; }
        .ridge-far { bottom: 34%; height: 30%; transform: rotate(-1.2deg); background: linear-gradient(180deg, rgba(39,105,75,.16), rgba(0,0,0,0)); opacity: .62; }
        .ridge-mid { bottom: 15%; height: 44%; transform: rotate(.7deg); background: radial-gradient(ellipse at 50% 3%, rgba(72,160,112,.13), transparent 30%), linear-gradient(180deg, rgba(3,32,20,.34), rgba(0,0,0,.2)); opacity: .82; }
        .ridge-near { bottom: -24%; height: 70%; transform: rotate(-.45deg) scaleX(1.1); background: radial-gradient(ellipse at 50% 3%, rgba(95,184,132,.12), transparent 25%), linear-gradient(180deg, rgba(3,27,18,.52), rgba(0,0,0,.98)); }
        .root { left: 50%; bottom: 1%; width: 1px; height: 34%; transform-origin: bottom; background: linear-gradient(180deg, transparent, rgba(125,211,252,.16), transparent); opacity: .36; filter: blur(.3px); }
        .root-left { transform: rotate(-37deg); height: 26%; } .root-center { transform: rotate(0deg); height: 38%; } .root-right { transform: rotate(37deg); height: 26%; }
        .self-avatar { z-index: 16; display: grid; place-items: center; transform: translateY(16vh); transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .self-glow { position: absolute; top: calc(50% - 120px); width: min(27vw, 380px); height: min(52vh, 560px); border-radius: 48% 48% 38% 38%; background: radial-gradient(ellipse at 50% 9%, rgba(235,248,255,.18), transparent 24%), radial-gradient(ellipse at 50% 36%, rgba(125,211,252,.08), transparent 58%); filter: blur(16px); opacity: .75; }
        .self-head { position: absolute; top: calc(50% - 118px); width: clamp(62px,5.7vw,92px); height: clamp(62px,5.7vw,92px); border-radius: 999px; background: radial-gradient(circle at 42% 28%, rgba(255,255,255,.72), rgba(198,224,255,.34) 42%, rgba(105,141,201,.06) 76%, transparent 100%); box-shadow: 0 0 30px rgba(192,220,255,.18); opacity: .44; }
        .self-shoulders { position: absolute; top: calc(50% - 52px); width: clamp(150px,13vw,215px); height: clamp(70px,8vh,110px); border-radius: 48% 48% 22% 22%; background: radial-gradient(ellipse at 50% 8%, rgba(210,235,255,.12), rgba(125,211,252,.04) 54%, transparent 82%); opacity: .54; filter: blur(.2px); }
        .self-core { position: absolute; top: calc(50% + 4px); width: clamp(92px,7.5vw,128px); height: clamp(180px,22vh,290px); border-radius: 42% 42% 28% 28%; background: linear-gradient(180deg, rgba(185,220,255,.1), rgba(125,211,252,.035) 45%, rgba(0,0,0,0) 100%); border: 1px solid rgba(255,255,255,.035); box-shadow: inset 0 24px 60px rgba(255,255,255,.025); opacity: .48; }
        .self-ground-shadow { position: absolute; top: calc(50% + 188px); width: min(21vw, 300px); height: 32px; border-radius: 999px; background: radial-gradient(ellipse, rgba(125,211,252,.09), transparent 72%); filter: blur(10px); opacity: .58; }
        .world-stage { position: relative; z-index: 22; min-height: 100dvh; width: 100%; display: grid; place-items: center; padding: 2rem; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease; pointer-events: none; }
        .world-stage button,.world-stage input,.floating-panel,.companion-orb { pointer-events: auto; }
        .companion-orb { position: fixed; left: 50%; top: 38%; z-index: 27; width: clamp(118px,10.8vw,176px); height: clamp(118px,10.8vw,176px); transform: translate(-50%,-50%); border: 0; border-radius: 999px; background: transparent; cursor: zoom-in; transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .orb-halo,.orb-core,.orb-ring { position: absolute; border-radius: 999px; }
        .orb-halo { inset: -38%; background: radial-gradient(circle,rgba(255,255,255,.16),var(--tone-a) 34%,transparent 70%); filter: blur(16px); opacity: .9; animation: orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite; }
        .orb-core { inset: 22%; background: radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.94) 18%,rgba(125,211,252,.66) 48%,rgba(45,89,120,.18) 76%,transparent 100%); box-shadow: 0 0 26px rgba(255,255,255,.78),0 0 86px rgba(125,211,252,.46),0 0 184px rgba(196,181,253,.18); }
        .orb-ring-one { inset: 0; border: 1px solid rgba(255,255,255,.2); box-shadow: inset 0 0 24px rgba(125,211,252,.08); animation: orbOrbit calc(18s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 10%; border: 1px solid rgba(196,181,253,.16); transform: rotate(32deg) scaleX(.72); animation: orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse; }
        .sky-whisper { position: fixed; left: 50%; top: 24%; z-index: 29; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); margin: 0; text-align: center; font-size: clamp(.92rem,1.2vw,1.08rem); line-height: 1.45; color: rgba(255,255,255,.72); text-shadow: 0 2px 24px rgba(0,0,0,.75); transition: opacity .8s ease, transform 1.2s ease; }
        .ascend-hint { position: fixed; left: 50%; top: 29%; z-index: 28; transform: translateX(-50%); margin: 0; font-size: .56rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.3); animation: hintFade 5s ease-in-out infinite; transition: opacity .6s ease; }
        .explain-glyph,.access-glyph { position: fixed; z-index: 34; border: 1px solid rgba(255,255,255,.12); background: rgba(0,0,0,.16); color: rgba(255,255,255,.52); backdrop-filter: blur(10px); cursor: pointer; transition: opacity .2s ease, transform .2s ease, background .2s ease; }
        .explain-glyph { right: 1rem; bottom: 1rem; width: 2.1rem; height: 2.1rem; border-radius: 999px; font-weight: 700; }
        .access-glyph { left: 1rem; bottom: 1rem; border-radius: 999px; padding: .45rem .75rem; font-size: .58rem; letter-spacing: .16em; text-transform: uppercase; }
        .explain-glyph:hover,.access-glyph:hover { transform: translateY(-1px); background: rgba(255,255,255,.08); }
        .floating-panel { position: fixed; left: 50%; bottom: 4.6rem; z-index: 38; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); border: 1px solid rgba(255,255,255,.16); border-radius: 28px; background: rgba(5,9,22,.72); padding: 1.05rem; text-align: center; box-shadow: 0 32px 90px rgba(0,0,0,.34); backdrop-filter: blur(18px); animation: panelIn .3s cubic-bezier(.19,1,.22,1) both; }
        .floating-panel p { margin: 0 0 .4rem; font-size: .66rem; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.45); }
        .floating-panel h2 { margin: 0 0 .5rem; font-size: clamp(1.25rem,2vw,1.8rem); }
        .floating-panel span { display: block; color: rgba(255,255,255,.76); line-height: 1.55; }
        .floating-panel small { display: block; margin-top: .7rem; color: rgba(255,255,255,.52); line-height: 1.45; }
        .prompt-row,.email-row { margin-top: .9rem; display: flex; justify-content: center; gap: .45rem; flex-wrap: wrap; }
        .prompt-row button,.email-row button,.email-row input { border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: rgba(255,255,255,.08); color: white; padding: .56rem .75rem; font-size: .8rem; }
        .email-row input { min-width: 14rem; outline: none; }
        .email-row input::placeholder { color: rgba(255,255,255,.4); }
        .home-scene.is-transitioning .world-stage { opacity: .16; transform: translateY(4rem) scale(.965); filter: blur(2px); }
        .home-scene.is-transitioning .companion-orb { transform: translate(-50%, -180%) scale(.5); opacity: .7; filter: drop-shadow(0 0 80px rgba(255,255,255,.5)); }
        .home-scene.is-transitioning .self-avatar { transform: translateY(38vh) scale(.72); opacity: .14; filter: blur(2px); }
        .home-scene.is-transitioning .terrain-world { transform: translateY(68%); opacity: 0; }
        .home-scene.is-transitioning .sky-rift { opacity: 1; transform: scale(1.45) translateY(-15%); }
        .home-scene.is-transitioning .ascension-beam { opacity: .92; transform: scale(2.4) translateY(-14%); }
        .home-scene.is-transitioning .aurora-column { opacity: .78; transform: translateY(-24%) scaleY(1.46); }
        .home-scene.is-transitioning .sky-depth { opacity: 1; transform: scale(1.22) translateY(-5%); }
        .home-scene.is-transitioning .star-tunnel { opacity: .96; transform: scale(2.7) translateY(-17%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .sky-whisper,.home-scene.is-transitioning .ascend-hint,.home-scene.is-transitioning .explain-glyph,.home-scene.is-transitioning .access-glyph,.home-scene.is-transitioning .floating-panel { opacity: 0; pointer-events: none; }
        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }
        @keyframes orbBreathe { 0%,100% { transform: scale(.96); opacity: .74; } 50% { transform: scale(1.06); opacity: 1; } }
        @keyframes panelIn { from { opacity: 0; transform: translateX(-50%) translateY(.6rem) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes hintFade { 0%,100% { opacity: .2; } 50% { opacity: .48; } }
        @media (max-width: 900px) { .sky-whisper { top: 19%; } .ascend-hint { top: 25%; } .companion-orb { top: 35%; width: 124px; height: 124px; } .self-avatar { transform: translateY(17vh) scale(.88); } .terrain-world { height: 44%; } .floating-panel { bottom: 4.6rem; } }
        @media (prefers-reduced-motion: reduce) { .sky-depth,.star-tunnel,.transition-vignette,.companion-orb,.aurora-column,.orb-ring,.orb-halo,.ascension-beam,.terrain-world,.sky-rift,.self-avatar { transition-duration: .01ms !important; animation: none !important; } }
      `}</style>
    </main>
  );
}
