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
      <button
        type="button"
        onClick={(event) => { event.stopPropagation(); openLifeMap(); }}
        disabled={isTransitioning}
        className="sky-trigger"
        aria-label="Ascend through the sky into the URAI Life Map"
      >
        <span className="sr-only">Ascend through the sky into the URAI Life Map</span>
      </button>

      <div className="sky-base" aria-hidden />
      <HomeWebGLSky />
      <div className="sky-mood" aria-hidden />
      <div className="sky-portal" aria-hidden>
        <span className="portal-core" />
        <span className="portal-orbit portal-orbit-one" />
        <span className="portal-orbit portal-orbit-two" />
        <span className="portal-streak portal-streak-one" />
        <span className="portal-streak portal-streak-two" />
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
        <span className="star star-eight" />
      </div>

      <div className="terrain-world" aria-hidden>
        <span className="terrain-skyline" />
        <span className="terrain-aura" />
        <span className="terrain hill-far" />
        <span className="terrain hill-mid" />
        <span className="terrain hill-front" />
        <span className="root-line root-one" />
        <span className="root-line root-two" />
        <span className="root-line root-three" />
      </div>

      <div className="avatar-figure" aria-hidden>
        <span className="avatar-glow" />
        <span className="avatar-head" />
        <span className="avatar-neck" />
        <span className="avatar-torso" />
        <span className="avatar-arm" />
        <span className="avatar-gaze" />
        <span className="avatar-shadow" />
      </div>

      <section className="world-stage" aria-label="URAI emotional home scene">
        <button
          type="button"
          className="companion-orb"
          onClick={(event) => { event.stopPropagation(); openLifeMap(); }}
          disabled={isTransitioning}
          aria-label="Ascend into Life Map"
        >
          <span className="orb-atmosphere" />
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
            {activePanel === "whisper" && <><p>What am I seeing?</p><h2>The sky is the doorway.</h2><span>The orb is centered as the companion core. The avatar stands beside it, looking inward. Click the upper sky to ascend into the Life Map.</span><div className="prompt-row"><button type="button" onClick={() => setActivePanel("forecast")}>Mood weather</button><button type="button" onClick={() => setActivePanel("reflection")}>Weekly scroll</button></div></>}
            {activePanel === "access" && <><p>Public demo</p><h2>Sample data only.</h2><span>No private user data is shown. Reflective insight only, not medical diagnosis.</span><div className="email-row"><input type="email" placeholder="you@example.com" aria-label="Email address" /><button type="button">Request access</button></div></>}
          </aside>
        )}
      </section>

      <style jsx>{`
        .home-scene {
          --tone-a: rgba(125,211,252,.18);
          --tone-b: rgba(196,181,253,.12);
          --tone-c: rgba(77,190,139,.1);
          --tone-speed: 1;
          position: relative;
          min-height: 100dvh;
          overflow: hidden;
          background: #000;
          color: white;
          isolation: isolate;
          user-select: none;
          cursor: zoom-in;
        }
        .tone-focused { --tone-a: rgba(96,165,250,.2); --tone-b: rgba(45,212,191,.12); --tone-c: rgba(125,211,252,.12); --tone-speed: .9; }
        .tone-charged { --tone-a: rgba(251,191,36,.14); --tone-b: rgba(244,114,182,.13); --tone-c: rgba(251,113,133,.1); --tone-speed: .82; }
        .tone-restorative { --tone-a: rgba(167,139,250,.16); --tone-b: rgba(14,165,233,.12); --tone-c: rgba(110,231,183,.12); --tone-speed: 1.25; }
        .sky-base,.sky-mood,.sky-portal,.ascent-column,.transition-vignette,.star-tunnel,.terrain-world,.avatar-figure { position: fixed; inset: 0; pointer-events: none; }
        .sky-base { z-index: 0; background: radial-gradient(circle at 50% 8%, rgba(108,126,218,.5), transparent 26%), radial-gradient(ellipse at 50% 35%, rgba(54,91,154,.26), transparent 52%), linear-gradient(180deg,#01030c 0%,#061024 45%,#03120c 78%,#000 100%); }
        .sky-mood { z-index: 3; background: radial-gradient(circle at 50% 27%, rgba(230,242,255,.16), transparent 18%), radial-gradient(ellipse at 50% 54%, var(--tone-b), transparent 30%), radial-gradient(ellipse at 50% 83%, rgba(68,160,126,.055), transparent 45%), linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(2,6,18,.06) 60%,rgba(0,0,0,.76) 100%); mix-blend-mode: screen; opacity: .88; transition: opacity 900ms ease, transform 1200ms ease; }
        .sky-trigger { position: fixed; inset: 0 0 48% 0; z-index: 18; border: 0; background: transparent; cursor: zoom-in; }
        .sky-portal { z-index: 12; display: grid; place-items: center; transform: translateY(-23vh); opacity: .82; transition: opacity 900ms ease, transform 1500ms cubic-bezier(.16,1,.3,1); }
        .portal-core { position: absolute; width: min(36vw, 500px); height: min(36vw, 500px); border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.15), rgba(125,211,252,.08) 23%, transparent 60%); filter: blur(14px); }
        .portal-orbit { position: absolute; width: min(43vw, 590px); height: min(18vw, 246px); border-radius: 999px; border: 1px solid rgba(210,232,255,.065); }
        .portal-orbit-one { transform: rotate(-14deg); }
        .portal-orbit-two { transform: rotate(18deg) scaleX(.82); opacity: .58; }
        .portal-streak { position: absolute; width: min(28vw, 380px); height: 1px; background: linear-gradient(90deg, transparent, rgba(205,232,255,.11), transparent); filter: blur(.45px); }
        .portal-streak-one { transform: translateX(-25%) rotate(-58deg); }
        .portal-streak-two { transform: translateX(25%) rotate(58deg); }
        .ascent-column { z-index: 13; opacity: .2; background: radial-gradient(ellipse at 50% 33%, rgba(245,250,255,.2), rgba(125,211,252,.09) 19%, transparent 48%); transition: opacity 900ms ease, transform 1550ms cubic-bezier(.16,1,.3,1); }
        .transition-vignette { z-index: 31; opacity: 0; background: radial-gradient(circle at 50% 22%, transparent 0%, rgba(5,8,22,.24) 34%, rgba(0,0,0,.96) 100%); transition: opacity 1200ms ease; }
        .star-tunnel { z-index: 20; opacity: 0; transform: scale(.75) translateY(12%); background: radial-gradient(circle at 50% 17%,rgba(205,225,255,.42),transparent 6%), radial-gradient(circle at 42% 38%,var(--tone-b),transparent 12%), radial-gradient(circle at 58% 42%,var(--tone-a),transparent 14%); transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; } .star-two { left: 45%; top: 16%; width: .24rem; height: .24rem; } .star-three { left: 58%; top: 29%; width: .38rem; height: .38rem; } .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; } .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; } .star-six { left: 52%; top: 10%; width: .3rem; height: .3rem; } .star-seven { left: 72%; top: 21%; width: .18rem; height: .18rem; } .star-eight { left: 23%; top: 39%; width: .2rem; height: .2rem; }
        .terrain-world { z-index: 8; top: auto; height: 43%; bottom: 0; overflow: hidden; transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 1100ms ease; }
        .terrain-world::before { content: ''; position: absolute; inset: -26% -10% 0; background: radial-gradient(ellipse at 50% 0%, rgba(113,210,162,.11), transparent 23%), linear-gradient(180deg, rgba(0,0,0,0), rgba(3,19,13,.38) 42%, rgba(0,0,0,.99)); }
        .terrain-skyline,.terrain-aura,.terrain,.root-line { position: absolute; }
        .terrain-skyline { left: -8%; right: -8%; top: 1%; height: 30%; background: radial-gradient(ellipse at 50% 0%, rgba(125,211,252,.08), transparent 66%); filter: blur(20px); opacity: .46; }
        .terrain-aura { left: 34%; right: 34%; top: 20%; height: 1px; background: linear-gradient(90deg, transparent, rgba(125,211,252,.16), transparent); box-shadow: 0 0 32px rgba(125,211,252,.16); opacity: .42; }
        .terrain { left: -16%; right: -16%; border-radius: 50% 50% 0 0 / 16% 22% 0 0; }
        .hill-far { bottom: 39%; height: 20%; transform: rotate(-1.2deg); background: linear-gradient(180deg, rgba(47,120,85,.1), rgba(0,0,0,0)); opacity: .52; }
        .hill-mid { bottom: 17%; height: 34%; transform: rotate(.55deg); background: radial-gradient(ellipse at 50% 0%, rgba(74,160,116,.09), transparent 28%), linear-gradient(180deg, rgba(3,31,21,.2), rgba(0,0,0,.08)); opacity: .74; }
        .hill-front { bottom: -32%; height: 66%; transform: rotate(-.35deg) scaleX(1.12); background: radial-gradient(ellipse at 50% 0%, rgba(91,184,132,.085), transparent 25%), linear-gradient(180deg, rgba(2,24,16,.46), rgba(0,0,0,.99)); }
        .root-line { left: 50%; bottom: 7%; width: 1px; height: 24%; transform-origin: bottom; background: linear-gradient(180deg, transparent, rgba(125,211,252,.1), transparent); opacity: .2; filter: blur(.35px); }
        .root-one { transform: rotate(-32deg); height: 18%; } .root-two { transform: rotate(0deg); height: 25%; } .root-three { transform: rotate(32deg); height: 18%; }
        .avatar-figure { z-index: 16; left: calc(50% - min(17vw, 230px)); top: 52%; right: auto; bottom: auto; width: clamp(116px, 9vw, 156px); height: clamp(260px, 38vh, 410px); transform: translate(-50%, -6%) rotate(-3deg); transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .avatar-glow,.avatar-head,.avatar-neck,.avatar-torso,.avatar-arm,.avatar-gaze,.avatar-shadow { position: absolute; }
        .avatar-glow { left: 50%; top: 45%; width: 220%; height: 112%; transform: translate(-50%, -50%); border-radius: 999px; background: radial-gradient(ellipse at 50% 12%, rgba(235,248,255,.1), transparent 24%), radial-gradient(ellipse at 50% 48%, rgba(125,211,252,.05), transparent 64%); filter: blur(18px); opacity: .56; }
        .avatar-head { left: 54%; top: 4%; width: 34%; aspect-ratio: 1; transform: translateX(-50%); border-radius: 999px; background: radial-gradient(circle at 43% 30%, rgba(255,255,255,.58), rgba(198,224,255,.26) 44%, rgba(105,141,201,.05) 76%, transparent 100%); box-shadow: 0 0 22px rgba(192,220,255,.16); opacity: .52; }
        .avatar-neck { left: 47%; top: 26%; width: 18%; height: 12%; border-radius: 40%; background: linear-gradient(180deg, rgba(205,232,255,.12), rgba(125,211,252,.04)); opacity: .42; }
        .avatar-torso { left: 38%; top: 35%; width: 54%; height: 50%; border-radius: 46% 42% 32% 34%; transform: skewX(-7deg); background: linear-gradient(180deg, rgba(205,232,255,.14), rgba(125,211,252,.055) 38%, rgba(0,0,0,0) 100%); border: 1px solid rgba(255,255,255,.03); box-shadow: inset 0 30px 60px rgba(255,255,255,.022); opacity: .52; }
        .avatar-arm { left: 74%; top: 43%; width: 30%; height: 6%; transform: rotate(-22deg); border-radius: 999px; background: linear-gradient(90deg, rgba(205,232,255,.1), rgba(125,211,252,.03), transparent); opacity: .38; }
        .avatar-gaze { left: 75%; top: 12%; width: min(19vw, 260px); height: 1px; transform: rotate(-9deg); transform-origin: left center; background: linear-gradient(90deg, rgba(210,240,255,.18), transparent); filter: blur(.5px); opacity: .3; }
        .avatar-shadow { left: 50%; bottom: 0; width: 130%; height: 30px; transform: translateX(-50%); border-radius: 999px; background: radial-gradient(ellipse, rgba(125,211,252,.08), transparent 72%); filter: blur(10px); opacity: .38; }
        .world-stage { position: relative; z-index: 22; min-height: 100dvh; width: 100%; display: grid; place-items: center; padding: 2rem; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease; pointer-events: none; }
        .world-stage button,.world-stage input,.floating-panel,.companion-orb { pointer-events: auto; }
        .companion-orb { position: fixed; left: 50%; top: 48%; z-index: 27; width: clamp(130px, 12vw, 190px); height: clamp(130px, 12vw, 190px); transform: translate(-50%,-50%); border: 0; border-radius: 999px; background: transparent; cursor: zoom-in; transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .orb-atmosphere,.orb-core,.orb-ring { position: absolute; border-radius: 999px; }
        .orb-atmosphere { inset: -45%; background: radial-gradient(circle,rgba(255,255,255,.18),var(--tone-a) 34%,transparent 70%); filter: blur(18px); opacity: .92; animation: orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite; }
        .orb-core { inset: 20%; background: radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.95) 18%,rgba(125,211,252,.7) 48%,rgba(45,89,120,.2) 76%,transparent 100%); box-shadow: 0 0 24px rgba(255,255,255,.8),0 0 86px rgba(125,211,252,.5),0 0 170px rgba(196,181,253,.16); }
        .orb-ring-one { inset: 0; border: 1px solid rgba(255,255,255,.2); box-shadow: inset 0 0 22px rgba(125,211,252,.07); animation: orbOrbit calc(18s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 10%; border: 1px solid rgba(196,181,253,.15); transform: rotate(32deg) scaleX(.74); animation: orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse; }
        .sky-whisper { position: fixed; left: 50%; top: 21%; z-index: 29; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); margin: 0; text-align: center; font-size: clamp(.9rem,1.12vw,1.04rem); line-height: 1.45; color: rgba(255,255,255,.72); text-shadow: 0 2px 24px rgba(0,0,0,.75); transition: opacity .8s ease, transform 1.2s ease; }
        .ascend-hint { position: fixed; left: 50%; top: 27%; z-index: 28; transform: translateX(-50%); margin: 0; font-size: .54rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.28); animation: hintFade 5s ease-in-out infinite; transition: opacity .6s ease; }
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
        .home-scene.is-transitioning .companion-orb { transform: translate(-50%, -200%) scale(.58); opacity: .78; filter: drop-shadow(0 0 84px rgba(255,255,255,.55)); }
        .home-scene.is-transitioning .avatar-figure { transform: translate(-50%, 35vh) rotate(-3deg) scale(.72); opacity: .12; filter: blur(2px); }
        .home-scene.is-transitioning .terrain-world { transform: translateY(72%); opacity: 0; }
        .home-scene.is-transitioning .sky-portal { opacity: 1; transform: scale(1.48) translateY(-24vh); }
        .home-scene.is-transitioning .ascent-column { opacity: .96; transform: scale(2.42) translateY(-15%); }
        .home-scene.is-transitioning .sky-mood { opacity: 1; transform: scale(1.24) translateY(-6%); }
        .home-scene.is-transitioning .star-tunnel { opacity: .96; transform: scale(2.75) translateY(-18%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .sky-whisper,.home-scene.is-transitioning .ascend-hint,.home-scene.is-transitioning .explain-glyph,.home-scene.is-transitioning .access-glyph,.home-scene.is-transitioning .floating-panel { opacity: 0; pointer-events: none; }
        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }
        @keyframes orbBreathe { 0%,100% { transform: scale(.96); opacity: .72; } 50% { transform: scale(1.06); opacity: .98; } }
        @keyframes panelIn { from { opacity: 0; transform: translateX(-50%) translateY(.6rem) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes hintFade { 0%,100% { opacity: .18; } 50% { opacity: .42; } }
        @media (max-width: 900px) { .sky-whisper { top: 18%; } .ascend-hint { top: 24%; } .companion-orb { top: 47%; width: 132px; height: 132px; } .avatar-figure { left: calc(50% - 116px); width: 96px; height: 300px; transform: translate(-50%, 17vh) rotate(-3deg); } .terrain-world { height: 42%; } .floating-panel { bottom: 4.6rem; } }
        @media (prefers-reduced-motion: reduce) { .sky-mood,.star-tunnel,.transition-vignette,.companion-orb,.orb-ring,.orb-atmosphere,.ascent-column,.terrain-world,.sky-portal,.avatar-figure { transition-duration: .01ms !important; animation: none !important; } }
      `}</style>
    </main>
  );
}
