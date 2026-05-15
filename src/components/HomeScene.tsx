"use client";

import { useEffect, useMemo, useState } from "react";
import HomeWebGLSky from "@/components/HomeWebGLSky";
import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useEmotionalTone } from "@/components/lifemap/useEmotionalTone";
import { adamClampDemoProfile } from "@/lib/demo-data";

type HomeMode = "home" | "transitioning" | "lifemap";
type HomePanel = "forecast" | "reflection" | "whisper" | "access" | null;

const TONE_COPY = {
  calm: {
    whisper: "A quiet pattern is becoming visible.",
    opening: "The sky is opening.",
  },
  focused: {
    whisper: "A small signal is asking for attention.",
    opening: "The stars are drawing upward.",
  },
  charged: {
    whisper: "Something bright is rising through the noise.",
    opening: "The active pattern is opening.",
  },
  restorative: {
    whisper: "Recovery is returning softly.",
    opening: "The sky is lifting gently.",
  },
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
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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
      <div className="emotional-wash" aria-hidden />
      <div className="sky-rift" aria-hidden />
      <div className="aura-column" aria-hidden />
      <div className="ascension-beam" aria-hidden />
      <div className="transition-vignette" aria-hidden />
      <div className="organic-ground" aria-hidden>
        <span className="terrain terrain-back" />
        <span className="terrain terrain-front" />
        <span className="root root-one" />
        <span className="root root-two" />
        <span className="root root-three" />
      </div>
      <div className="star-tunnel" aria-hidden>
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
        <span className="star star-six" />
        <span className="star star-seven" />
      </div>

      <section className="world-stage" aria-label="URAI emotional home scene">
        <button
          type="button"
          className="companion-orb"
          onClick={(event) => { event.stopPropagation(); openLifeMap(); }}
          disabled={isTransitioning}
          aria-label="Ascend into Life Map"
        >
          <span className="orb-halo" />
          <span className="orb-core" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
        </button>

        <p className="sky-whisper" aria-live="polite">{isTransitioning ? copy.opening : copy.whisper}</p>
        <p className="ascend-hint">Click the sky</p>

        <button
          type="button"
          className="explain-glyph"
          onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel ? null : "whisper"); }}
          aria-label="What am I seeing?"
        >
          ?
        </button>

        <button
          type="button"
          className="access-glyph"
          onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel === "access" ? null : "access"); }}
          aria-label="Open early access"
        >
          demo
        </button>

        <aside className="companion-whisper" aria-live="polite">
          <span>{isTransitioning ? copy.opening : copy.whisper}</span>
        </aside>

        {activePanel && (
          <aside className="floating-panel" onClick={(event) => event.stopPropagation()}>
            {activePanel === "forecast" && (
              <>
                <p>Mood weather</p>
                <h2>{forecastState}</h2>
                <span>{forecast.summary}</span>
                <small>Confidence {confidence}% · {forecast.nextBestAction}</small>
              </>
            )}
            {activePanel === "reflection" && (
              <>
                <p>Weekly scroll</p>
                <h2>{reflection.title}</h2>
                <span>{reflection.narratorSummary}</span>
                <small>{reflection.highlights[0]}</small>
              </>
            )}
            {activePanel === "whisper" && (
              <>
                <p>What am I seeing?</p>
                <h2>The sky is the doorway.</h2>
                <span>Click anywhere in the sky to ascend into the Life Map. The orb is only a companion presence; the upper sky opens into the memory field.</span>
                <div className="prompt-row">
                  <button type="button" onClick={() => setActivePanel("forecast")}>Mood weather</button>
                  <button type="button" onClick={() => setActivePanel("reflection")}>Weekly scroll</button>
                </div>
              </>
            )}
            {activePanel === "access" && (
              <>
                <p>Public demo</p>
                <h2>Sample data only.</h2>
                <span>No private user data is shown. Reflective insight only, not medical diagnosis.</span>
                <div className="email-row"><input type="email" placeholder="you@example.com" aria-label="Email address" /><button type="button">Request access</button></div>
              </>
            )}
          </aside>
        )}
      </section>

      <style jsx>{`
        .home-scene {
          --tone-a: rgba(125,211,252,.15);
          --tone-b: rgba(196,181,253,.12);
          --tone-c: rgba(45,212,191,.1);
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
        .tone-focused { --tone-a: rgba(96,165,250,.17); --tone-b: rgba(45,212,191,.11); --tone-c: rgba(125,211,252,.12); --tone-speed: .9; }
        .tone-charged { --tone-a: rgba(251,191,36,.13); --tone-b: rgba(244,114,182,.12); --tone-c: rgba(251,113,133,.1); --tone-speed: .82; }
        .tone-restorative { --tone-a: rgba(167,139,250,.15); --tone-b: rgba(14,165,233,.11); --tone-c: rgba(110,231,183,.1); --tone-speed: 1.25; }
        .sky-base,.emotional-wash,.sky-rift,.aura-column,.ascension-beam,.transition-vignette,.organic-ground,.star-tunnel { position: fixed; inset: 0; pointer-events: none; }
        .sky-base { z-index: 0; background: radial-gradient(circle at 50% 19%, rgba(88,105,184,.7), transparent 27%), linear-gradient(180deg,#030611 0%,#0e1733 48%,#07120d 82%,#010202 100%); }
        .emotional-wash { z-index: 3; background: radial-gradient(circle at 50% 36%, rgba(175,215,255,.18), transparent 18%), radial-gradient(circle at 50% 56%, var(--tone-b), transparent 28%), linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(4,8,18,.1) 60%,rgba(0,0,0,.6) 100%); mix-blend-mode: screen; opacity: .84; transition: opacity 900ms ease, transform 1200ms ease; }
        .sky-rift { z-index: 11; background: radial-gradient(ellipse at 50% 24%, rgba(235,248,255,.16), rgba(125,211,252,.06) 18%, transparent 42%); opacity: .52; filter: blur(8px); transition: opacity 900ms ease, transform 1500ms cubic-bezier(.16,1,.3,1); }
        .aura-column { z-index: 12; inset: -8%; background: linear-gradient(180deg,transparent 0%,rgba(125,211,252,.06) 42%,rgba(196,181,253,.035) 64%,transparent 100%); opacity: .2; filter: blur(6px); transition: opacity 1000ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .ascension-beam { z-index: 13; opacity: 0; background: radial-gradient(ellipse at 50% 40%, rgba(245,250,255,.46), rgba(125,211,252,.18) 16%, transparent 42%); transform: scale(.7) translateY(14%); transition: opacity 900ms ease, transform 1550ms cubic-bezier(.16,1,.3,1); }
        .transition-vignette { z-index: 31; opacity: 0; background: radial-gradient(circle at 50% 34%, transparent 0%, rgba(5,8,22,.26) 34%, rgba(0,0,0,.96) 100%); transition: opacity 1200ms ease; }
        .sky-trigger { position: fixed; inset: 0 0 32% 0; z-index: 18; border: 0; background: transparent; cursor: zoom-in; }
        .organic-ground { z-index: 8; top: auto; height: 42%; bottom: 0; opacity: .86; transition: transform 1500ms cubic-bezier(.16,1,.3,1), opacity 1100ms ease; }
        .organic-ground::before { content: ''; position: absolute; inset: -22% -10% 0; background: radial-gradient(ellipse at 50% 0%, rgba(96,185,137,.16), transparent 28%), linear-gradient(180deg, rgba(0,0,0,0), rgba(4,19,12,.72) 48%, rgba(0,0,0,.96)); }
        .terrain { position: absolute; left: -8%; right: -8%; bottom: 0; height: 72%; border-radius: 50% 50% 0 0 / 22% 22% 0 0; background: radial-gradient(ellipse at 50% 0%, rgba(70,145,105,.18), transparent 36%), linear-gradient(180deg, rgba(6,31,20,.36), rgba(0,0,0,.92)); }
        .terrain-back { bottom: 4%; transform: rotate(-1deg) scaleX(1.08); opacity: .62; }
        .terrain-front { bottom: -16%; transform: rotate(1.4deg) scaleX(1.18); opacity: .94; }
        .root { position: absolute; left: 50%; bottom: 11%; width: 1px; height: 34%; transform-origin: bottom; background: linear-gradient(180deg, transparent, rgba(125,211,252,.13), transparent); filter: blur(.4px); opacity: .38; }
        .root-one { transform: rotate(-42deg); height: 27%; }
        .root-two { transform: rotate(0deg); height: 36%; }
        .root-three { transform: rotate(43deg); height: 25%; }
        .star-tunnel { z-index: 20; opacity: 0; transform: scale(.75) translateY(12%); background: radial-gradient(circle at 50% 22%, rgba(205,225,255,.4), transparent 6%), radial-gradient(circle at 42% 44%, var(--tone-b), transparent 12%), radial-gradient(circle at 58% 48%, var(--tone-a), transparent 14%); transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; } .star-two { left: 45%; top: 16%; width: .24rem; height: .24rem; } .star-three { left: 58%; top: 29%; width: .38rem; height: .38rem; } .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; } .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; } .star-six { left: 52%; top: 10%; width: .3rem; height: .3rem; } .star-seven { left: 72%; top: 21%; width: .18rem; height: .18rem; }
        .world-stage { position: relative; z-index: 22; min-height: 100dvh; width: 100%; display: grid; place-items: center; padding: 2rem; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease; pointer-events: none; }
        .world-stage button,.world-stage input,.floating-panel,.companion-orb { pointer-events: auto; }
        .companion-orb { position: fixed; left: 50%; top: 52%; z-index: 26; width: clamp(190px,19vw,290px); height: clamp(190px,19vw,290px); transform: translate(-50%,-50%); border: 0; border-radius: 999px; background: transparent; cursor: zoom-in; transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 900ms ease, filter 900ms ease; }
        .companion-orb:focus-visible { outline: 2px solid rgba(255,255,255,.85); outline-offset: 10px; }
        .orb-halo,.orb-core,.orb-ring { position: absolute; border-radius: 999px; }
        .orb-halo { inset: -28%; background: radial-gradient(circle,rgba(255,255,255,.15),var(--tone-a) 34%,transparent 69%); filter: blur(16px); opacity: .94; animation: orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite; }
        .orb-core { inset: 22%; background: radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.95) 18%,rgba(125,211,252,.65) 48%,rgba(45,89,120,.22) 76%,transparent 100%); box-shadow: 0 0 28px rgba(255,255,255,.82),0 0 92px rgba(125,211,252,.48),0 0 190px rgba(196,181,253,.2); }
        .orb-ring-one { inset: 0; border: 1px solid rgba(255,255,255,.22); box-shadow: inset 0 0 24px rgba(125,211,252,.08); animation: orbOrbit calc(18s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 10%; border: 1px solid rgba(196,181,253,.18); transform: rotate(32deg) scaleX(.72); animation: orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse; }
        .sky-whisper { position: fixed; left: 50%; top: 28%; z-index: 29; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); margin: 0; text-align: center; font-size: clamp(1rem,1.6vw,1.32rem); line-height: 1.45; color: rgba(255,255,255,.74); text-shadow: 0 2px 24px rgba(0,0,0,.75); transition: opacity .8s ease, transform 1.2s ease; }
        .ascend-hint { position: fixed; left: 50%; top: calc(52% + min(11vw, 170px)); z-index: 28; transform: translateX(-50%); margin: 0; border: 1px solid rgba(255,255,255,.1); border-radius: 999px; background: rgba(0,0,0,.18); padding: .36rem .72rem; font-size: .62rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.5); backdrop-filter: blur(10px); animation: hintFade 5s ease-in-out infinite; transition: opacity .6s ease; }
        .companion-whisper { position: fixed; right: 1.1rem; top: 1rem; z-index: 32; max-width: 260px; color: rgba(255,255,255,.56); text-align: right; font-size: .78rem; line-height: 1.4; pointer-events: none; opacity: .74; transition: opacity .5s ease; }
        .companion-whisper span { display: block; }
        .explain-glyph,.access-glyph { position: fixed; z-index: 34; border: 1px solid rgba(255,255,255,.12); background: rgba(0,0,0,.18); color: rgba(255,255,255,.58); backdrop-filter: blur(10px); cursor: pointer; transition: opacity .2s ease, transform .2s ease, background .2s ease; }
        .explain-glyph { right: 1rem; bottom: 1rem; width: 2.1rem; height: 2.1rem; border-radius: 999px; font-weight: 700; }
        .access-glyph { left: 1rem; bottom: 1rem; border-radius: 999px; padding: .45rem .75rem; font-size: .58rem; letter-spacing: .16em; text-transform: uppercase; }
        .explain-glyph:hover,.access-glyph:hover { opacity: 1; transform: translateY(-1px); background: rgba(255,255,255,.08); }
        .floating-panel { position: fixed; left: 50%; bottom: 4.6rem; z-index: 38; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); border: 1px solid rgba(255,255,255,.16); border-radius: 28px; background: rgba(5,9,22,.68); padding: 1.05rem; text-align: center; box-shadow: 0 32px 90px rgba(0,0,0,.34); backdrop-filter: blur(18px); animation: panelIn .3s cubic-bezier(.19,1,.22,1) both; }
        .floating-panel p { margin: 0 0 .4rem; font-size: .66rem; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.45); }
        .floating-panel h2 { margin: 0 0 .5rem; font-size: clamp(1.25rem,2vw,1.8rem); }
        .floating-panel span { display: block; color: rgba(255,255,255,.76); line-height: 1.55; }
        .floating-panel small { display: block; margin-top: .7rem; color: rgba(255,255,255,.52); line-height: 1.45; }
        .prompt-row,.email-row { margin-top: .9rem; display: flex; justify-content: center; gap: .45rem; flex-wrap: wrap; }
        .prompt-row button,.email-row button,.email-row input { border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: rgba(255,255,255,.08); color: white; padding: .56rem .75rem; font-size: .8rem; }
        .email-row input { min-width: 14rem; outline: none; }
        .email-row input::placeholder { color: rgba(255,255,255,.4); }
        .home-scene.is-transitioning .world-stage { opacity: .22; transform: translateY(4rem) scale(.965); filter: blur(2px); }
        .home-scene.is-transitioning .companion-orb { transform: translate(-50%, 38%) scale(.42); opacity: .42; filter: drop-shadow(0 0 80px rgba(255,255,255,.48)); }
        .home-scene.is-transitioning .organic-ground { transform: translateY(62%); opacity: 0; }
        .home-scene.is-transitioning .sky-rift { opacity: .96; transform: scale(1.35) translateY(-10%); }
        .home-scene.is-transitioning .ascension-beam { opacity: .9; transform: scale(2.25) translateY(-10%); }
        .home-scene.is-transitioning .aura-column { opacity: .75; transform: translateY(-22%) scaleY(1.42); }
        .home-scene.is-transitioning .emotional-wash { opacity: 1; transform: scale(1.2) translateY(-4%); }
        .home-scene.is-transitioning .star-tunnel { opacity: .94; transform: scale(2.55) translateY(-14%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .sky-whisper,.home-scene.is-transitioning .ascend-hint,.home-scene.is-transitioning .companion-whisper,.home-scene.is-transitioning .explain-glyph,.home-scene.is-transitioning .access-glyph,.home-scene.is-transitioning .floating-panel { opacity: 0; pointer-events: none; }
        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }
        @keyframes orbBreathe { 0%,100% { transform: scale(.96); opacity: .74; } 50% { transform: scale(1.06); opacity: 1; } }
        @keyframes panelIn { from { opacity: 0; transform: translateX(-50%) translateY(.6rem) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes hintFade { 0%,100% { opacity: .28; } 50% { opacity: .58; } }
        @media (max-width: 900px) { .sky-whisper { top: 22%; } .companion-orb { top: 50%; width: 190px; height: 190px; } .ascend-hint { top: calc(50% + 140px); } .companion-whisper { left: 1rem; right: 1rem; top: auto; bottom: 4.2rem; max-width: none; text-align: center; } .floating-panel { bottom: 4.6rem; } .organic-ground { height: 38%; } }
        @media (prefers-reduced-motion: reduce) { .emotional-wash,.star-tunnel,.transition-vignette,.companion-orb,.aura-column,.orb-ring,.orb-halo,.ascension-beam,.organic-ground,.sky-rift { transition-duration: .01ms !important; animation: none !important; } }
      `}</style>
    </main>
  );
}
