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
      <div className="celestial-depth" aria-hidden />
      <div className="sky-door" aria-hidden>
        <span className="door-core" />
        <span className="door-ring door-ring-one" />
        <span className="door-ring door-ring-two" />
        <span className="door-ray door-ray-left" />
        <span className="door-ray door-ray-right" />
      </div>
      <div className="ascent-column" aria-hidden />
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
        <span className="terrain-mist" />
        <span className="terrain-glow" />
        <span className="hill hill-back" />
        <span className="hill hill-mid" />
        <span className="hill hill-front" />
        <span className="ground-root root-left" />
        <span className="ground-root root-center" />
        <span className="ground-root root-right" />
      </div>

      <div className="self-avatar" aria-hidden>
        <span className="self-aura" />
        <span className="self-silhouette" />
        <span className="self-heart" />
        <span className="self-shadow" />
      </div>

      <section className="world-stage" aria-label="URAI emotional home scene">
        <button type="button" className="companion-orb" onClick={(event) => { event.stopPropagation(); openLifeMap(); }} disabled={isTransitioning} aria-label="Ascend into Life Map">
          <span className="orb-halo" />
          <span className="orb-core" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
        </button>

        <p className="sky-whisper" aria-live="polite">{isTransitioning ? copy.opening : copy.whisper}</p>
        <p className="ascend-hint">Click the upper sky</p>

        <button type="button" className="explain-glyph" onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel ? null : "whisper"); }} aria-label="What am I seeing?">?</button>
        <button type="button" className="access-glyph" onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel === "access" ? null : "access"); }} aria-label="Open early access">demo</button>

        {activePanel && (
          <aside className="floating-panel" onClick={(event) => event.stopPropagation()}>
            {activePanel === "forecast" && <><p>Mood weather</p><h2>{forecastState}</h2><span>{forecast.summary}</span><small>Confidence {confidence}% · {forecast.nextBestAction}</small></>}
            {activePanel === "reflection" && <><p>Weekly scroll</p><h2>{reflection.title}</h2><span>{reflection.narratorSummary}</span><small>{reflection.highlights[0]}</small></>}
            {activePanel === "whisper" && <><p>What am I seeing?</p><h2>The sky is the doorway.</h2><span>Click the upper sky to ascend into the Life Map. The silhouette is the embodied self, the small orb is the companion, and the terrain is the emotional ground.</span><div className="prompt-row"><button type="button" onClick={() => setActivePanel("forecast")}>Mood weather</button><button type="button" onClick={() => setActivePanel("reflection")}>Weekly scroll</button></div></>}
            {activePanel === "access" && <><p>Public demo</p><h2>Sample data only.</h2><span>No private user data is shown. Reflective insight only, not medical diagnosis.</span><div className="email-row"><input type="email" placeholder="you@example.com" aria-label="Email address" /><button type="button">Request access</button></div></>}
          </aside>
        )}
      </section>

      <style jsx>{`
        .home-scene { --tone-a: rgba(125,211,252,.16); --tone-b: rgba(196,181,253,.13); --tone-c: rgba(45,212,191,.12); --tone-speed: 1; position: relative; min-height: 100dvh; overflow: hidden; background: #000; color: white; isolation: isolate; user-select: none; cursor: zoom-in; }
        .tone-focused { --tone-a: rgba(96,165,250,.18); --tone-b: rgba(45,212,191,.12); --tone-c: rgba(125,211,252,.12); --tone-speed: .9; }
        .tone-charged { --tone-a: rgba(251,191,36,.14); --tone-b: rgba(244,114,182,.13); --tone-c: rgba(251,113,133,.11); --tone-speed: .82; }
        .tone-restorative { --tone-a: rgba(167,139,250,.16); --tone-b: rgba(14,165,233,.12); --tone-c: rgba(110,231,183,.11); --tone-speed: 1.25; }
        .sky-base,.celestial-depth,.sky-door,.ascent-column,.transition-vignette,.star-tunnel,.terrain-world,.self-avatar { position: fixed; inset: 0; pointer-events: none; }
        .sky-base { z-index: 0; background: radial-gradient(circle at 50% 3%, rgba(118,133,224,.48), transparent 24%), radial-gradient(ellipse at 50% 27%, rgba(54,91,154,.28), transparent 50%), linear-gradient(180deg,#01040e 0%,#071126 44%,#04110c 78%,#000 100%); }
        .celestial-depth { z-index: 3; background: radial-gradient(circle at 50% 21%, rgba(230,242,255,.18), transparent 16%), radial-gradient(ellipse at 50% 48%, var(--tone-b), transparent 34%), radial-gradient(ellipse at 50% 78%, rgba(68,160,126,.06), transparent 42%), linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(2,6,18,.06) 55%,rgba(0,0,0,.72) 100%); mix-blend-mode: screen; opacity: .86; transition: opacity 900ms ease, transform 1200ms ease; }
        .sky-door { z-index: 12; display: grid; place-items: center; transform: translateY(-22vh); opacity: .9; transition: opacity 900ms ease, transform 1500ms cubic-bezier(.16,1,.3,1); }
        .door-core { position: absolute; width: min(38vw, 520px); height: min(38vw, 520px); border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.18), rgba(125,211,252,.08) 24%, transparent 60%); filter: blur(12px); }
        .door-ring { position: absolute; width: min(42vw, 580px); height: min(18vw, 250px); border-radius: 999px; border: 1px solid rgba(210,232,255,.07); }
        .door-ring-one { transform: rotate(-14deg); }
        .door-ring-two { transform: rotate(18deg) scaleX(.82); opacity: .6; }
        .door-ray { position: absolute; top: 50%; width: min(26vw, 360px); height: 1px; background: linear-gradient(90deg, transparent, rgba(200,230,255,.12), transparent); filter: blur(.4px); }
        .door-ray-left { transform: translateX(-35%) rotate(-56deg); }
        .door-ray-right { transform: translateX(35%) rotate(56deg); }
        .ascent-column { z-index: 13; opacity: .22; background: radial-gradient(ellipse at 50% 30%, rgba(245,250,255,.18), rgba(125,211,252,.09) 18%, transparent 46%); transform: translateY(4%); transition: opacity 900ms ease, transform 1550ms cubic-bezier(.16,1,.3,1); }
        .transition-vignette { z-index: 31; opacity: 0; background: radial-gradient(circle at 50% 20%, transparent 0%, rgba(5,8,22,.24) 34%, rgba(0,0,0,.96) 100%); transition: opacity 1200ms ease; }
        .sky-trigger { position: fixed; inset: 0 0 44% 0; z-index: 18; border: 0; background: transparent; cursor: zoom-in; }
        .star-tunnel { z-index: 20; opacity: 0; transform: scale(.75) translateY(12%); background: radial-gradient(circle at 50% 18%,rgba(205,225,255,.42),transparent 6%), radial-gradient(circle at 42% 38%,var(--tone-b),transparent 12%), radial-gradient(circle at 58% 42%,var(--tone-a),transparent 14%); transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; } .star-two { left: 45%; top: 16%; width: .24rem; height: .24rem; } .star-three { left: 58%; top: 29%; width: .38rem; height: .38rem; } .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; } .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; } .star-six { left: 52%; top: 10%; width: .3rem; height: .3rem; } .star-seven { left: 72%; top: 21%; width: .18rem; height: .18rem; }
        .terrain-world { z-index: 8; top: auto; height: 46%; bottom: 0; overflow: hidden; transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 1100ms ease; }
        .terrain-world::before { content: ''; position: absolute; inset: -24% -8% 0; background: radial-gradient(ellipse at 50% 6%, rgba(113,210,162,.12), transparent 24%), linear-gradient(180deg, rgba(0,0,0,0), rgba(3,19,13,.42) 40%, rgba(0,0,0,.98)); }
        .terrain-mist,.terrain-glow,.hill,.ground-root { position: absolute; }
        .terrain-mist { left: 14%; right: 14%; top: 10%; height: 18%; background: radial-gradient(ellipse at 50% 0%, rgba(125,211,252,.1), transparent 64%); filter: blur(18px); opacity: .5; }
        .terrain-glow { left: 26%; right: 26%; top: 20%; height: 1px; background: linear-gradient(90deg, transparent, rgba(125,211,252,.16), transparent); box-shadow: 0 0 36px rgba(125,211,252,.18); opacity: .45; }
        .hill { left: -14%; right: -14%; border-radius: 50% 50% 0 0 / 18% 24% 0 0; }
        .hill-back { bottom: 36%; height: 24%; transform: rotate(-1.5deg); background: linear-gradient(180deg, rgba(40,104,77,.12), rgba(0,0,0,0)); opacity: .55; }
        .hill-mid { bottom: 15%; height: 36%; transform: rotate(.8deg); background: radial-gradient(ellipse at 50% 0%, rgba(74,160,116,.1), transparent 30%), linear-gradient(180deg, rgba(3,31,21,.24), rgba(0,0,0,.1)); opacity: .78; }
        .hill-front { bottom: -30%; height: 68%; transform: rotate(-.4deg) scaleX(1.1); background: radial-gradient(ellipse at 50% 0%, rgba(91,184,132,.1), transparent 25%), linear-gradient(180deg, rgba(2,24,16,.5), rgba(0,0,0,.99)); }
        .ground-root { left: 50%; bottom: 6%; width: 1px; height: 26%; transform-origin: bottom; background: linear-gradient(180deg, transparent, rgba(125,211,252,.11), transparent); opacity: .24; filter: blur(.3px); }
        .root-left { transform: rotate(-34deg); height: 20%; } .root-center { transform: rotate(0deg); height: 27%; } .root-right { transform: rotate(34deg); height: 20%; }
        .self-avatar { z-index: 16; display: grid; place-items: center; transform: translateY(18vh); transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .self-aura { position: absolute; width: min(25vw, 340px); height: min(47vh, 500px); border-radius: 46% 46% 34% 34%; background: radial-gradient(ellipse at 50% 12%, rgba(235,248,255,.12), transparent 22%), radial-gradient(ellipse at 50% 44%, rgba(125,211,252,.055), transparent 62%); filter: blur(16px); opacity: .62; }
        .self-silhouette { position: absolute; top: calc(50% - 132px); width: clamp(126px, 10vw, 168px); height: clamp(290px, 39vh, 430px); clip-path: path("M 62 0 C 87 0 105 18 105 43 C 105 62 94 78 78 86 C 113 101 126 130 130 174 C 135 227 119 282 111 330 C 105 363 20 363 15 331 C 6 279 -7 226 -2 175 C 2 130 17 101 52 86 C 36 78 25 62 25 43 C 25 18 42 0 62 0 Z"); background: linear-gradient(180deg, rgba(205,232,255,.18), rgba(125,211,252,.07) 38%, rgba(0,0,0,0) 100%); border: 1px solid rgba(255,255,255,.035); box-shadow: inset 0 34px 70px rgba(255,255,255,.028); opacity: .58; }
        .self-heart { position: absolute; top: calc(50% + 2px); width: 18px; height: 18px; border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.66), rgba(125,211,252,.32), transparent 70%); box-shadow: 0 0 24px rgba(125,211,252,.28); opacity: .55; }
        .self-shadow { position: absolute; top: calc(50% + 204px); width: min(18vw, 260px); height: 28px; border-radius: 999px; background: radial-gradient(ellipse, rgba(125,211,252,.08), transparent 72%); filter: blur(10px); opacity: .44; }
        .world-stage { position: relative; z-index: 22; min-height: 100dvh; width: 100%; display: grid; place-items: center; padding: 2rem; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease; pointer-events: none; }
        .world-stage button,.world-stage input,.floating-panel,.companion-orb { pointer-events: auto; }
        .companion-orb { position: fixed; left: calc(50% + min(12vw, 160px)); top: 39%; z-index: 27; width: clamp(74px,7.2vw,112px); height: clamp(74px,7.2vw,112px); transform: translate(-50%,-50%); border: 0; border-radius: 999px; background: transparent; cursor: zoom-in; transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .orb-halo,.orb-core,.orb-ring { position: absolute; border-radius: 999px; }
        .orb-halo { inset: -52%; background: radial-gradient(circle,rgba(255,255,255,.16),var(--tone-a) 34%,transparent 70%); filter: blur(16px); opacity: .78; animation: orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite; }
        .orb-core { inset: 18%; background: radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.94) 18%,rgba(125,211,252,.66) 48%,rgba(45,89,120,.18) 76%,transparent 100%); box-shadow: 0 0 20px rgba(255,255,255,.72),0 0 66px rgba(125,211,252,.42),0 0 144px rgba(196,181,253,.14); }
        .orb-ring-one { inset: 0; border: 1px solid rgba(255,255,255,.18); box-shadow: inset 0 0 20px rgba(125,211,252,.06); animation: orbOrbit calc(18s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 10%; border: 1px solid rgba(196,181,253,.14); transform: rotate(32deg) scaleX(.72); animation: orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse; }
        .sky-whisper { position: fixed; left: 50%; top: 21%; z-index: 29; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); margin: 0; text-align: center; font-size: clamp(.9rem,1.12vw,1.02rem); line-height: 1.45; color: rgba(255,255,255,.72); text-shadow: 0 2px 24px rgba(0,0,0,.75); transition: opacity .8s ease, transform 1.2s ease; }
        .ascend-hint { position: fixed; left: 50%; top: 26%; z-index: 28; transform: translateX(-50%); margin: 0; font-size: .54rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.28); animation: hintFade 5s ease-in-out infinite; transition: opacity .6s ease; }
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
        .home-scene.is-transitioning .world-stage { opacity: .14; transform: translateY(4rem) scale(.965); filter: blur(2px); }
        .home-scene.is-transitioning .companion-orb { transform: translate(-50%, -230%) scale(.56); opacity: .72; filter: drop-shadow(0 0 80px rgba(255,255,255,.5)); }
        .home-scene.is-transitioning .self-avatar { transform: translateY(42vh) scale(.7); opacity: .12; filter: blur(2px); }
        .home-scene.is-transitioning .terrain-world { transform: translateY(72%); opacity: 0; }
        .home-scene.is-transitioning .sky-door { opacity: 1; transform: scale(1.48) translateY(-22vh); }
        .home-scene.is-transitioning .ascent-column { opacity: .95; transform: scale(2.4) translateY(-15%); }
        .home-scene.is-transitioning .celestial-depth { opacity: 1; transform: scale(1.23) translateY(-5%); }
        .home-scene.is-transitioning .star-tunnel { opacity: .96; transform: scale(2.72) translateY(-18%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .sky-whisper,.home-scene.is-transitioning .ascend-hint,.home-scene.is-transitioning .explain-glyph,.home-scene.is-transitioning .access-glyph,.home-scene.is-transitioning .floating-panel { opacity: 0; pointer-events: none; }
        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }
        @keyframes orbBreathe { 0%,100% { transform: scale(.96); opacity: .7; } 50% { transform: scale(1.06); opacity: .96; } }
        @keyframes panelIn { from { opacity: 0; transform: translateX(-50%) translateY(.6rem) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes hintFade { 0%,100% { opacity: .18; } 50% { opacity: .42; } }
        @media (max-width: 900px) { .sky-whisper { top: 18%; } .ascend-hint { top: 24%; } .companion-orb { left: calc(50% + 92px); top: 35%; width: 82px; height: 82px; } .self-avatar { transform: translateY(20vh) scale(.82); } .terrain-world { height: 44%; } .floating-panel { bottom: 4.6rem; } }
        @media (prefers-reduced-motion: reduce) { .celestial-depth,.star-tunnel,.transition-vignette,.companion-orb,.orb-ring,.orb-halo,.ascent-column,.terrain-world,.sky-door,.self-avatar { transition-duration: .01ms !important; animation: none !important; } }
      `}</style>
    </main>
  );
}
