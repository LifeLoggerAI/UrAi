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
    <svg className="avatar-svg" viewBox="0 0 260 560" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="avatarRobeGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(236,248,255,.72)" />
          <stop offset=".3" stopColor="rgba(125,211,252,.24)" />
          <stop offset=".72" stopColor="rgba(84,160,190,.08)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <radialGradient id="avatarHoodLight" cx="64%" cy="36%" r="64%">
          <stop offset="0" stopColor="rgba(255,255,255,.86)" />
          <stop offset=".34" stopColor="rgba(214,236,255,.36)" />
          <stop offset="1" stopColor="rgba(125,211,252,0)" />
        </radialGradient>
        <filter id="avatarGlow" x="-80%" y="-70%" width="280%" height="260%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <ellipse className="avatar-aura-svg" cx="132" cy="300" rx="110" ry="230" />
      <path className="avatar-robe-svg" d="M133 76 C165 80 188 105 190 139 C192 169 176 192 154 207 C197 235 217 285 209 355 C202 416 192 470 194 532 C153 553 91 553 52 530 C58 470 65 417 58 356 C50 285 72 234 112 207 C91 190 77 166 81 136 C86 105 105 80 133 76 Z" />
      <path className="avatar-hood-svg" d="M128 64 C155 64 176 85 178 114 C180 143 159 165 132 166 C106 166 88 145 91 119 C94 88 110 66 128 64 Z" />
      <path className="avatar-profile-light" d="M151 104 C171 111 188 126 202 148" />
      <path className="avatar-arm-svg" d="M156 250 C181 244 205 226 224 199" />
      <path className="avatar-gaze-svg" d="M166 119 C205 105 242 78 260 49" />
      <circle className="avatar-heart-svg" cx="132" cy="276" r="7" />
      <ellipse className="avatar-shadow-svg" cx="123" cy="538" rx="62" ry="11" />
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
        .sky-base { z-index: 0; background: radial-gradient(circle at 50% 8%, rgba(108,126,218,.46), transparent 24%), radial-gradient(ellipse at 50% 33%, rgba(54,91,154,.24), transparent 54%), linear-gradient(180deg,#01030c 0%,#071126 49%,#03100b 82%,#000 100%); }
        .sky-mood { z-index: 3; background: radial-gradient(circle at 50% 25%, rgba(230,242,255,.14), transparent 18%), radial-gradient(ellipse at 50% 51%, var(--tone-b), transparent 31%), radial-gradient(ellipse at 50% 82%, rgba(68,160,126,.035), transparent 50%), linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(2,6,18,.04) 63%,rgba(0,0,0,.84) 100%); mix-blend-mode: screen; opacity: .86; transition: opacity 900ms ease, transform 1200ms ease; }
        .sky-trigger { position: fixed; inset: 0 0 50% 0; z-index: 18; border: 0; background: transparent; cursor: zoom-in; }
        .sky-portal { z-index: 12; display: grid; place-items: center; transform: translateY(-26vh); opacity: .72; transition: opacity 900ms ease, transform 1500ms cubic-bezier(.16,1,.3,1); }
        .portal-core { position: absolute; width: min(35vw, 480px); height: min(35vw, 480px); border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.13), rgba(125,211,252,.07) 23%, transparent 63%); filter: blur(14px); }
        .portal-orbit { position: absolute; width: min(40vw, 560px); height: min(16vw, 220px); border-radius: 999px; border: 1px solid rgba(210,232,255,.055); }
        .portal-orbit-one { transform: rotate(-14deg); }
        .portal-orbit-two { transform: rotate(18deg) scaleX(.82); opacity: .52; }
        .portal-streak { position: absolute; width: min(27vw, 360px); height: 1px; background: linear-gradient(90deg, transparent, rgba(205,232,255,.09), transparent); filter: blur(.45px); }
        .portal-streak-one { transform: translateX(-25%) rotate(-58deg); }
        .portal-streak-two { transform: translateX(25%) rotate(58deg); }
        .ascent-column { z-index: 13; opacity: .18; background: radial-gradient(ellipse at 50% 35%, rgba(245,250,255,.18), rgba(125,211,252,.075) 18%, transparent 51%); transition: opacity 900ms ease, transform 1550ms cubic-bezier(.16,1,.3,1); }
        .transition-vignette { z-index: 31; opacity: 0; background: radial-gradient(circle at 50% 22%, transparent 0%, rgba(5,8,22,.24) 34%, rgba(0,0,0,.96) 100%); transition: opacity 1200ms ease; }
        .star-tunnel { z-index: 20; opacity: 0; transform: scale(.75) translateY(12%); background: radial-gradient(circle at 50% 17%,rgba(205,225,255,.42),transparent 6%), radial-gradient(circle at 42% 38%,var(--tone-b),transparent 12%), radial-gradient(circle at 58% 42%,var(--tone-a),transparent 14%); transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; } .star-two { left: 45%; top: 16%; width: .24rem; height: .24rem; } .star-three { left: 58%; top: 29%; width: .38rem; height: .38rem; } .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; } .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; } .star-six { left: 52%; top: 10%; width: .3rem; height: .3rem; } .star-seven { left: 72%; top: 21%; width: .18rem; height: .18rem; } .star-eight { left: 23%; top: 39%; width: .2rem; height: .2rem; }
        .terrain-world { z-index: 8; top: auto; height: 24%; bottom: 0; overflow: hidden; transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 1100ms ease; }
        .terrain-world::before { content: ''; position: absolute; inset: -86% -16% 0; background: radial-gradient(ellipse at 50% 0%, rgba(113,210,162,.06), transparent 17%), linear-gradient(180deg, rgba(0,0,0,0), rgba(3,19,13,.16) 25%, rgba(0,0,0,.99)); }
        .terrain-mist,.terrain-glow,.terrain,.root-line { position: absolute; }
        .terrain-mist { left: -12%; right: -12%; top: -75%; height: 82%; background: radial-gradient(ellipse at 50% 84%, rgba(125,211,252,.06), transparent 70%); filter: blur(32px); opacity: .38; }
        .terrain-glow { left: 39%; right: 39%; top: -2%; height: 1px; background: linear-gradient(90deg, transparent, rgba(125,211,252,.08), transparent); box-shadow: 0 0 28px rgba(125,211,252,.1); opacity: .22; }
        .terrain { left: -24%; right: -24%; border-radius: 52% 48% 0 0 / 16% 22% 0 0; }
        .hill-far { bottom: 68%; height: 14%; transform: rotate(-1.2deg); background: linear-gradient(180deg, rgba(47,120,85,.04), rgba(0,0,0,0)); opacity: .3; }
        .hill-mid { bottom: 36%; height: 24%; transform: rotate(.5deg); background: radial-gradient(ellipse at 50% 0%, rgba(74,160,116,.048), transparent 28%), linear-gradient(180deg, rgba(3,31,21,.1), rgba(0,0,0,.02)); opacity: .48; }
        .hill-front { bottom: -58%; height: 80%; transform: rotate(-.35deg) scaleX(1.12); background: radial-gradient(ellipse at 50% 0%, rgba(91,184,132,.048), transparent 24%), linear-gradient(180deg, rgba(2,24,16,.28), rgba(0,0,0,.99)); }
        .root-line { left: 50%; bottom: 17%; width: 1px; height: 16%; transform-origin: bottom; background: linear-gradient(180deg, transparent, rgba(125,211,252,.06), transparent); opacity: .12; filter: blur(.35px); }
        .root-one { transform: rotate(-30deg); height: 12%; } .root-two { transform: rotate(0deg); height: 16%; } .root-three { transform: rotate(30deg); height: 12%; }
        .orb-light-field { z-index: 15; background: radial-gradient(circle at 50% 47%, rgba(210,238,255,.2), rgba(125,211,252,.08) 11%, transparent 31%), radial-gradient(circle at 41% 51%, rgba(180,226,255,.12), transparent 17%); opacity: .86; transition: opacity 900ms ease, transform 1200ms ease; }
        .avatar-figure { z-index: 16; left: calc(50% - min(15vw, 210px)); top: 55%; right: auto; bottom: auto; width: clamp(170px, 12vw, 224px); height: clamp(380px, 47vh, 520px); transform: translate(-50%, -6%) rotate(-4deg); transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .avatar-svg { position: absolute; inset: 0; overflow: visible; filter: drop-shadow(0 0 22px rgba(125,211,252,.12)); }
        :global(.avatar-aura-svg) { fill: rgba(125, 211, 252, .095); filter: url(#avatarGlow); opacity: .92; }
        :global(.avatar-robe-svg) { fill: url(#avatarRobeGradient); stroke: rgba(230,245,255,.075); stroke-width: 1.2; opacity: .72; }
        :global(.avatar-hood-svg) { fill: url(#avatarHoodLight); opacity: .72; }
        :global(.avatar-profile-light) { fill: none; stroke: rgba(230,248,255,.34); stroke-width: 2; stroke-linecap: round; opacity: .66; }
        :global(.avatar-arm-svg) { fill: none; stroke: rgba(210,236,255,.18); stroke-width: 7; stroke-linecap: round; opacity: .58; }
        :global(.avatar-gaze-svg) { fill: none; stroke: rgba(210,240,255,.22); stroke-width: 1.2; stroke-linecap: round; opacity: .42; }
        :global(.avatar-heart-svg) { fill: rgba(220,246,255,.5); filter: drop-shadow(0 0 14px rgba(125,211,252,.36)); opacity: .64; }
        :global(.avatar-shadow-svg) { fill: rgba(125,211,252,.1); filter: blur(8px); opacity: .62; }
        .world-stage { position: relative; z-index: 22; min-height: 100dvh; width: 100%; display: grid; place-items: center; padding: 2rem; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease; pointer-events: none; }
        .world-stage button,.world-stage input,.floating-panel,.companion-orb { pointer-events: auto; }
        .companion-orb { position: fixed; left: 50%; top: 47%; z-index: 27; width: clamp(160px, 13vw, 224px); height: clamp(160px, 13vw, 224px); transform: translate(-50%,-50%); border: 0; border-radius: 999px; background: transparent; cursor: zoom-in; transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .orb-atmosphere,.orb-core,.orb-ring { position: absolute; border-radius: 999px; }
        .orb-atmosphere { inset: -50%; background: radial-gradient(circle,rgba(255,255,255,.2),var(--tone-a) 34%,transparent 70%); filter: blur(18px); opacity: .98; animation: orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite; }
        .orb-core { inset: 19%; background: radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.96) 18%,rgba(125,211,252,.72) 48%,rgba(45,89,120,.2) 76%,transparent 100%); box-shadow: 0 0 26px rgba(255,255,255,.82),0 0 92px rgba(125,211,252,.52),0 0 184px rgba(196,181,253,.18); }
        .orb-ring-one { inset: 0; border: 1px solid rgba(255,255,255,.22); box-shadow: inset 0 0 24px rgba(125,211,252,.075); animation: orbOrbit calc(18s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 10%; border: 1px solid rgba(196,181,253,.16); transform: rotate(32deg) scaleX(.74); animation: orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse; }
        .sky-whisper { position: fixed; left: 50%; top: 20%; z-index: 29; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); margin: 0; text-align: center; font-size: clamp(.9rem,1.12vw,1.04rem); line-height: 1.45; color: rgba(255,255,255,.72); text-shadow: 0 2px 24px rgba(0,0,0,.75); transition: opacity .8s ease, transform 1.2s ease; }
        .ascend-hint { position: fixed; left: 50%; top: 26%; z-index: 28; transform: translateX(-50%); margin: 0; font-size: .54rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.24); animation: hintFade 5s ease-in-out infinite; transition: opacity .6s ease; }
        .explain-glyph,.access-glyph { position: fixed; z-index: 34; border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.12); color: rgba(255,255,255,.42); backdrop-filter: blur(10px); cursor: pointer; opacity: .72; transition: opacity .2s ease, transform .2s ease, background .2s ease; }
        .explain-glyph { right: 1rem; bottom: 1rem; width: 2.1rem; height: 2.1rem; border-radius: 999px; font-weight: 700; }
        .access-glyph { left: 1rem; bottom: 1rem; border-radius: 999px; padding: .45rem .75rem; font-size: .58rem; letter-spacing: .16em; text-transform: uppercase; }
        .explain-glyph:hover,.access-glyph:hover { opacity: 1; transform: translateY(-1px); background: rgba(255,255,255,.08); }
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
        .home-scene.is-transitioning .avatar-figure { transform: translate(-50%, 38vh) rotate(-4deg) scale(.72); opacity: .12; filter: blur(2px); }
        .home-scene.is-transitioning .terrain-world { transform: translateY(82%); opacity: 0; }
        .home-scene.is-transitioning .sky-portal { opacity: 1; transform: scale(1.48) translateY(-27vh); }
        .home-scene.is-transitioning .ascent-column { opacity: .96; transform: scale(2.42) translateY(-15%); }
        .home-scene.is-transitioning .sky-mood { opacity: 1; transform: scale(1.24) translateY(-6%); }
        .home-scene.is-transitioning .star-tunnel { opacity: .96; transform: scale(2.75) translateY(-18%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .sky-whisper,.home-scene.is-transitioning .ascend-hint,.home-scene.is-transitioning .explain-glyph,.home-scene.is-transitioning .access-glyph,.home-scene.is-transitioning .floating-panel { opacity: 0; pointer-events: none; }
        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }
        @keyframes orbBreathe { 0%,100% { transform: scale(.96); opacity: .74; } 50% { transform: scale(1.06); opacity: 1; } }
        @keyframes panelIn { from { opacity: 0; transform: translateX(-50%) translateY(.6rem) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes hintFade { 0%,100% { opacity: .12; } 50% { opacity: .32; } }
        @media (max-width: 900px) { .sky-whisper { top: 17%; } .ascend-hint { top: 23%; } .companion-orb { top: 46%; width: 156px; height: 156px; } .avatar-figure { left: calc(50% - 132px); top: 55%; width: 150px; height: 410px; transform: translate(-50%, -5%) rotate(-4deg); } .terrain-world { height: 23%; } .floating-panel { bottom: 4.6rem; } }
        @media (prefers-reduced-motion: reduce) { .sky-mood,.star-tunnel,.transition-vignette,.companion-orb,.orb-ring,.orb-atmosphere,.ascent-column,.terrain-world,.sky-portal,.avatar-figure,.orb-light-field { transition-duration: .01ms !important; animation: none !important; } }
      `}</style>
    </main>
  );
}
