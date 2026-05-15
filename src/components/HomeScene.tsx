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

function AvatarSilhouette() {
  return (
    <svg className="avatar-svg" viewBox="0 0 220 520" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="avatarBodyGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(226,244,255,.82)" />
          <stop offset=".42" stopColor="rgba(125,211,252,.34)" />
          <stop offset="1" stopColor="rgba(125,211,252,0)" />
        </linearGradient>
        <radialGradient id="avatarHeadGradient" cx="55%" cy="28%" r="70%">
          <stop offset="0" stopColor="rgba(255,255,255,.92)" />
          <stop offset=".46" stopColor="rgba(195,225,255,.42)" />
          <stop offset="1" stopColor="rgba(80,125,190,0)" />
        </radialGradient>
        <filter id="avatarSoftGlow" x="-80%" y="-60%" width="260%" height="240%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <ellipse className="avatar-backglow" cx="118" cy="258" rx="95" ry="205" />
      <path
        className="avatar-body-path"
        d="M111 82 C137 84 157 101 163 128 C170 160 154 184 134 198 C174 222 190 262 184 328 C179 389 165 444 162 499 C124 514 77 514 45 500 C45 451 58 390 52 326 C46 263 62 222 99 198 C78 184 64 160 71 128 C77 101 93 84 111 82 Z"
      />
      <circle className="avatar-head-path" cx="116" cy="62" r="42" />
      <path className="avatar-facing-light" d="M141 52 C161 57 176 68 190 87" />
      <path className="avatar-arm-path" d="M147 230 C178 225 201 210 218 189" />
      <path className="avatar-heart" d="M119 247 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0" />
      <ellipse className="avatar-ground-shadow" cx="104" cy="505" rx="62" ry="10" />
    </svg>
  );
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
        <span className="terrain-mist" />
        <span className="terrain-glow" />
        <span className="terrain hill-far" />
        <span className="terrain hill-mid" />
        <span className="terrain hill-front" />
        <span className="root-line root-one" />
        <span className="root-line root-two" />
        <span className="root-line root-three" />
      </div>

      <div className="orb-light-field" aria-hidden />

      <div className="avatar-figure" aria-hidden>
        <AvatarSilhouette />
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
            {activePanel === "whisper" && <><p>What am I seeing?</p><h2>The sky is the doorway.</h2><span>The orb is the centered companion core. The avatar stands beside it, looking inward. Click the upper sky to ascend into the Life Map.</span><div className="prompt-row"><button type="button" onClick={() => setActivePanel("forecast")}>Mood weather</button><button type="button" onClick={() => setActivePanel("reflection")}>Weekly scroll</button></div></>}
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
        .sky-base,.sky-mood,.sky-portal,.ascent-column,.transition-vignette,.star-tunnel,.terrain-world,.avatar-figure,.orb-light-field { position: fixed; inset: 0; pointer-events: none; }
        .sky-base { z-index: 0; background: radial-gradient(circle at 50% 8%, rgba(108,126,218,.48), transparent 25%), radial-gradient(ellipse at 50% 34%, rgba(54,91,154,.24), transparent 54%), linear-gradient(180deg,#01030c 0%,#061024 47%,#03110b 80%,#000 100%); }
        .sky-mood { z-index: 3; background: radial-gradient(circle at 50% 26%, rgba(230,242,255,.15), transparent 18%), radial-gradient(ellipse at 50% 52%, var(--tone-b), transparent 31%), radial-gradient(ellipse at 50% 82%, rgba(68,160,126,.045), transparent 48%), linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(2,6,18,.04) 62%,rgba(0,0,0,.82) 100%); mix-blend-mode: screen; opacity: .86; transition: opacity 900ms ease, transform 1200ms ease; }
        .sky-trigger { position: fixed; inset: 0 0 50% 0; z-index: 18; border: 0; background: transparent; cursor: zoom-in; }
        .sky-portal { z-index: 12; display: grid; place-items: center; transform: translateY(-25vh); opacity: .78; transition: opacity 900ms ease, transform 1500ms cubic-bezier(.16,1,.3,1); }
        .portal-core { position: absolute; width: min(36vw, 500px); height: min(36vw, 500px); border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.14), rgba(125,211,252,.07) 23%, transparent 62%); filter: blur(14px); }
        .portal-orbit { position: absolute; width: min(42vw, 580px); height: min(17vw, 236px); border-radius: 999px; border: 1px solid rgba(210,232,255,.06); }
        .portal-orbit-one { transform: rotate(-14deg); }
        .portal-orbit-two { transform: rotate(18deg) scaleX(.82); opacity: .55; }
        .portal-streak { position: absolute; width: min(27vw, 360px); height: 1px; background: linear-gradient(90deg, transparent, rgba(205,232,255,.1), transparent); filter: blur(.45px); }
        .portal-streak-one { transform: translateX(-25%) rotate(-58deg); }
        .portal-streak-two { transform: translateX(25%) rotate(58deg); }
        .ascent-column { z-index: 13; opacity: .18; background: radial-gradient(ellipse at 50% 34%, rgba(245,250,255,.18), rgba(125,211,252,.08) 19%, transparent 50%); transition: opacity 900ms ease, transform 1550ms cubic-bezier(.16,1,.3,1); }
        .transition-vignette { z-index: 31; opacity: 0; background: radial-gradient(circle at 50% 22%, transparent 0%, rgba(5,8,22,.24) 34%, rgba(0,0,0,.96) 100%); transition: opacity 1200ms ease; }
        .star-tunnel { z-index: 20; opacity: 0; transform: scale(.75) translateY(12%); background: radial-gradient(circle at 50% 17%,rgba(205,225,255,.42),transparent 6%), radial-gradient(circle at 42% 38%,var(--tone-b),transparent 12%), radial-gradient(circle at 58% 42%,var(--tone-a),transparent 14%); transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; } .star-two { left: 45%; top: 16%; width: .24rem; height: .24rem; } .star-three { left: 58%; top: 29%; width: .38rem; height: .38rem; } .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; } .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; } .star-six { left: 52%; top: 10%; width: .3rem; height: .3rem; } .star-seven { left: 72%; top: 21%; width: .18rem; height: .18rem; } .star-eight { left: 23%; top: 39%; width: .2rem; height: .2rem; }
        .terrain-world { z-index: 8; top: auto; height: 30%; bottom: 0; overflow: hidden; transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 1100ms ease; }
        .terrain-world::before { content: ''; position: absolute; inset: -62% -14% 0; background: radial-gradient(ellipse at 50% 0%, rgba(113,210,162,.08), transparent 18%), linear-gradient(180deg, rgba(0,0,0,0), rgba(3,19,13,.22) 28%, rgba(0,0,0,.99)); }
        .terrain-mist,.terrain-glow,.terrain,.root-line { position: absolute; }
        .terrain-mist { left: -12%; right: -12%; top: -42%; height: 58%; background: radial-gradient(ellipse at 50% 80%, rgba(125,211,252,.07), transparent 70%); filter: blur(28px); opacity: .42; }
        .terrain-glow { left: 38%; right: 38%; top: 3%; height: 1px; background: linear-gradient(90deg, transparent, rgba(125,211,252,.1), transparent); box-shadow: 0 0 30px rgba(125,211,252,.12); opacity: .28; }
        .terrain { left: -20%; right: -20%; border-radius: 52% 48% 0 0 / 18% 23% 0 0; }
        .hill-far { bottom: 58%; height: 16%; transform: rotate(-1.2deg); background: linear-gradient(180deg, rgba(47,120,85,.055), rgba(0,0,0,0)); opacity: .36; }
        .hill-mid { bottom: 28%; height: 27%; transform: rotate(.5deg); background: radial-gradient(ellipse at 50% 0%, rgba(74,160,116,.06), transparent 28%), linear-gradient(180deg, rgba(3,31,21,.13), rgba(0,0,0,.03)); opacity: .55; }
        .hill-front { bottom: -50%; height: 78%; transform: rotate(-.35deg) scaleX(1.12); background: radial-gradient(ellipse at 50% 0%, rgba(91,184,132,.055), transparent 24%), linear-gradient(180deg, rgba(2,24,16,.32), rgba(0,0,0,.99)); }
        .root-line { left: 50%; bottom: 12%; width: 1px; height: 20%; transform-origin: bottom; background: linear-gradient(180deg, transparent, rgba(125,211,252,.07), transparent); opacity: .14; filter: blur(.35px); }
        .root-one { transform: rotate(-30deg); height: 15%; } .root-two { transform: rotate(0deg); height: 20%; } .root-three { transform: rotate(30deg); height: 15%; }
        .orb-light-field { z-index: 15; background: radial-gradient(circle at 50% 47%, rgba(186,226,255,.18), rgba(125,211,252,.08) 11%, transparent 31%); opacity: .75; transition: opacity 900ms ease, transform 1200ms ease; }
        .avatar-figure { z-index: 16; left: calc(50% - min(17vw, 238px)); top: 53%; right: auto; bottom: auto; width: clamp(176px, 12vw, 228px); height: clamp(410px, 50vh, 560px); transform: translate(-50%, -6%) rotate(-3deg); transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .avatar-svg { position: absolute; inset: 0; overflow: visible; filter: drop-shadow(0 0 22px rgba(125,211,252,.12)); }
        :global(.avatar-backglow) { fill: rgba(125, 211, 252, .11); filter: url(#avatarSoftGlow); opacity: .95; }
        :global(.avatar-body-path) { fill: url(#avatarBodyGradient); stroke: rgba(230,245,255,.08); stroke-width: 1.2; opacity: .82; }
        :global(.avatar-head-path) { fill: url(#avatarHeadGradient); opacity: .86; }
        :global(.avatar-facing-light) { fill: none; stroke: rgba(230,248,255,.36); stroke-width: 2; stroke-linecap: round; opacity: .72; }
        :global(.avatar-arm-path) { fill: none; stroke: rgba(210,236,255,.25); stroke-width: 12; stroke-linecap: round; opacity: .74; }
        :global(.avatar-heart) { fill: rgba(220,246,255,.58); filter: drop-shadow(0 0 16px rgba(125,211,252,.38)); opacity: .7; }
        :global(.avatar-ground-shadow) { fill: rgba(125,211,252,.13); filter: blur(8px); opacity: .72; }
        .world-stage { position: relative; z-index: 22; min-height: 100dvh; width: 100%; display: grid; place-items: center; padding: 2rem; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease; pointer-events: none; }
        .world-stage button,.world-stage input,.floating-panel,.companion-orb { pointer-events: auto; }
        .companion-orb { position: fixed; left: 50%; top: 47%; z-index: 27; width: clamp(166px, 14vw, 238px); height: clamp(166px, 14vw, 238px); transform: translate(-50%,-50%); border: 0; border-radius: 999px; background: transparent; cursor: zoom-in; transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .orb-atmosphere,.orb-core,.orb-ring { position: absolute; border-radius: 999px; }
        .orb-atmosphere { inset: -48%; background: radial-gradient(circle,rgba(255,255,255,.2),var(--tone-a) 34%,transparent 70%); filter: blur(18px); opacity: .98; animation: orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite; }
        .orb-core { inset: 19%; background: radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.96) 18%,rgba(125,211,252,.72) 48%,rgba(45,89,120,.2) 76%,transparent 100%); box-shadow: 0 0 26px rgba(255,255,255,.82),0 0 92px rgba(125,211,252,.52),0 0 184px rgba(196,181,253,.18); }
        .orb-ring-one { inset: 0; border: 1px solid rgba(255,255,255,.22); box-shadow: inset 0 0 24px rgba(125,211,252,.075); animation: orbOrbit calc(18s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 10%; border: 1px solid rgba(196,181,253,.16); transform: rotate(32deg) scaleX(.74); animation: orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse; }
        .sky-whisper { position: fixed; left: 50%; top: 20%; z-index: 29; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); margin: 0; text-align: center; font-size: clamp(.9rem,1.12vw,1.04rem); line-height: 1.45; color: rgba(255,255,255,.72); text-shadow: 0 2px 24px rgba(0,0,0,.75); transition: opacity .8s ease, transform 1.2s ease; }
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
        .home-scene.is-transitioning .companion-orb { transform: translate(-50%, -205%) scale(.58); opacity: .78; filter: drop-shadow(0 0 84px rgba(255,255,255,.55)); }
        .home-scene.is-transitioning .avatar-figure { transform: translate(-50%, 38vh) rotate(-3deg) scale(.72); opacity: .12; filter: blur(2px); }
        .home-scene.is-transitioning .terrain-world { transform: translateY(78%); opacity: 0; }
        .home-scene.is-transitioning .sky-portal { opacity: 1; transform: scale(1.48) translateY(-26vh); }
        .home-scene.is-transitioning .ascent-column { opacity: .96; transform: scale(2.42) translateY(-15%); }
        .home-scene.is-transitioning .sky-mood { opacity: 1; transform: scale(1.24) translateY(-6%); }
        .home-scene.is-transitioning .star-tunnel { opacity: .96; transform: scale(2.75) translateY(-18%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .sky-whisper,.home-scene.is-transitioning .ascend-hint,.home-scene.is-transitioning .explain-glyph,.home-scene.is-transitioning .access-glyph,.home-scene.is-transitioning .floating-panel { opacity: 0; pointer-events: none; }
        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }
        @keyframes orbBreathe { 0%,100% { transform: scale(.96); opacity: .74; } 50% { transform: scale(1.06); opacity: 1; } }
        @keyframes panelIn { from { opacity: 0; transform: translateX(-50%) translateY(.6rem) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes hintFade { 0%,100% { opacity: .18; } 50% { opacity: .42; } }
        @media (max-width: 900px) { .sky-whisper { top: 17%; } .ascend-hint { top: 23%; } .companion-orb { top: 46%; width: 160px; height: 160px; } .avatar-figure { left: calc(50% - 142px); top: 55%; width: 142px; height: 390px; transform: translate(-50%, -6%) rotate(-3deg); } .terrain-world { height: 30%; } .floating-panel { bottom: 4.6rem; } }
        @media (prefers-reduced-motion: reduce) { .sky-mood,.star-tunnel,.transition-vignette,.companion-orb,.orb-ring,.orb-atmosphere,.ascent-column,.terrain-world,.sky-portal,.avatar-figure,.orb-light-field { transition-duration: .01ms !important; animation: none !important; } }
      `}</style>
    </main>
  );
}
