"use client";

import Link from "next/link";
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
    opening: "Ascending into your Life Map...",
  },
  focused: {
    whisper: "A small signal is asking for your attention.",
    opening: "Ascending through the constellation...",
  },
  charged: {
    whisper: "Something bright is rising through the noise.",
    opening: "Opening the active pattern...",
  },
  restorative: {
    whisper: "Recovery is returning in small, visible ways.",
    opening: "Entering gently through the emotional sky...",
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
    if (emotionalTone === "restorative") return 1850;
    if (emotionalTone === "charged") return 1280;
    if (emotionalTone === "focused") return 1450;
    return 1580;
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
  const returnHome = () => setMode("home");

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
        aria-label="Ascend into the URAI Life Map"
      >
        <span className="sr-only">Ascend into the URAI Life Map</span>
      </button>

      <div className="sky-base" aria-hidden />
      <HomeWebGLSky />
      <div className="emotional-wash" aria-hidden />
      <div className="horizon-glow" aria-hidden />
      <div className="aura-column" aria-hidden />
      <div className="ascension-beam" aria-hidden />
      <div className="transition-vignette" aria-hidden />
      <div className="star-tunnel" aria-hidden>
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
      </div>

      <section className="world-stage" aria-label="URAI emotional home scene">
        <header className="demo-badge">
          <span>Public demo</span>
          <small>sample data</small>
        </header>

        <section className="hero-world">
          <p className="eyebrow">URAI Preview</p>
          <h1>Your life patterns, mapped as meaning.</h1>
          <p className="hero-whisper">{isTransitioning ? copy.opening : copy.whisper}</p>
        </section>

        <button
          type="button"
          className="companion-orb"
          onClick={(event) => { event.stopPropagation(); openLifeMap(); }}
          disabled={isTransitioning}
          aria-label="Enter the Life Map through the companion orb"
        >
          <span className="orb-halo" />
          <span className="orb-core" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
          <span className="orb-label">{isTransitioning ? "Ascending" : "Tap sky to ascend"}</span>
        </button>

        <aside className="companion-whisper" aria-live="polite">
          <strong>Companion</strong>
          <span>{isTransitioning ? copy.opening : copy.whisper}</span>
        </aside>

        <nav className="quiet-dock" aria-label="URAI preview controls" onClick={(event) => event.stopPropagation()}>
          <button type="button" className={activePanel === "forecast" ? "active" : ""} onClick={() => setActivePanel(activePanel === "forecast" ? null : "forecast")}>
            <span>Mood weather</span>
            <strong>{forecastState}</strong>
          </button>
          <button type="button" className={activePanel === "reflection" ? "active" : ""} onClick={() => setActivePanel(activePanel === "reflection" ? null : "reflection")}>
            <span>Weekly scroll</span>
            <strong>{reflection.title}</strong>
          </button>
          <button type="button" className={activePanel === "whisper" ? "active" : ""} onClick={() => setActivePanel(activePanel === "whisper" ? null : "whisper")}>
            <span>Ask URAI</span>
            <strong>What changed?</strong>
          </button>
          <button type="button" className={activePanel === "access" ? "active" : ""} onClick={() => setActivePanel(activePanel === "access" ? null : "access")}>
            <span>Early access</span>
            <strong>Join quietly</strong>
          </button>
        </nav>

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
                <p>Companion whisper</p>
                <h2>Ask what the pattern means.</h2>
                <span>URAI answers in plain language without turning the home scene into a dashboard.</span>
                <div className="prompt-row"><button type="button">Explain this mood</button><button type="button">What should I protect?</button></div>
              </>
            )}
            {activePanel === "access" && (
              <>
                <p>Early access</p>
                <h2>Join the private demo list.</h2>
                <span>No spam. Launch updates only. Your data remains user-controlled.</span>
                <div className="email-row"><input type="email" placeholder="you@example.com" aria-label="Email address" /><button type="button">Request</button></div>
              </>
            )}
          </aside>
        )}

        <div className="primary-actions" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={openLifeMap} disabled={isTransitioning}>{isTransitioning ? "Ascending..." : "Enter Life Map"}</button>
          <Link href="/u/adamclamp">Public constellation</Link>
        </div>
      </section>

      <div className="trust-strip">Private by default · Sample data · Reflective insight only</div>

      <style jsx>{`
        .home-scene { --tone-a: rgba(125,211,252,.14); --tone-b: rgba(196,181,253,.12); --tone-speed: 1; position: relative; min-height: 100dvh; overflow: hidden; background: #000; color: white; isolation: isolate; user-select: none; cursor: zoom-in; }
        .tone-focused { --tone-a: rgba(96,165,250,.16); --tone-b: rgba(45,212,191,.1); --tone-speed: .9; }
        .tone-charged { --tone-a: rgba(251,191,36,.12); --tone-b: rgba(244,114,182,.1); --tone-speed: .8; }
        .tone-restorative { --tone-a: rgba(167,139,250,.14); --tone-b: rgba(14,165,233,.1); --tone-speed: 1.25; }
        .sky-base,.emotional-wash,.horizon-glow,.aura-column,.ascension-beam,.transition-vignette { position: fixed; inset: 0; pointer-events: none; }
        .sky-base { z-index: 0; background: radial-gradient(circle at 50% 24%, rgba(68,86,154,.72), transparent 28%), linear-gradient(180deg,#050814 0%,#101936 48%,#07100d 82%,#010203 100%); }
        .emotional-wash { z-index: 3; background: radial-gradient(circle at 50% 42%, rgba(125,211,252,.16), transparent 21%), radial-gradient(circle at 50% 58%, rgba(196,181,253,.1), transparent 26%), linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(4,8,18,.1) 62%,rgba(0,0,0,.6) 100%); mix-blend-mode: screen; opacity: .82; transition: opacity 900ms ease, transform 1200ms ease; }
        .horizon-glow { z-index: 7; inset: auto -8% 0 -8%; height: 32%; background: radial-gradient(ellipse at 50% 8%, rgba(126,220,170,.12), transparent 34%), linear-gradient(180deg,rgba(0,0,0,0),rgba(7,22,14,.62) 58%,rgba(0,0,0,.9)); opacity: .72; }
        .aura-column { z-index: 12; inset: -8%; background: radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.12),transparent 10%), linear-gradient(180deg,transparent 0%,rgba(125,211,252,.05) 45%,rgba(196,181,253,.04) 70%,transparent 100%); opacity: .18; filter: blur(6px); transition: opacity 1000ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .ascension-beam { z-index: 13; opacity: 0; background: radial-gradient(ellipse at 50% 50%, rgba(235,248,255,.42), rgba(125,211,252,.16) 16%, transparent 38%); transform: scale(.7); transition: opacity 900ms ease, transform 1500ms cubic-bezier(.16,1,.3,1); }
        .transition-vignette { z-index: 29; opacity: 0; background: radial-gradient(circle at 50% 46%, transparent 0%, rgba(5,8,22,.25) 34%, rgba(0,0,0,.94) 100%); transition: opacity 1200ms ease; }
        .sky-trigger { position: fixed; inset: 0; z-index: 18; border: 0; background: transparent; cursor: zoom-in; }
        .world-stage { position: relative; z-index: 20; min-height: 100dvh; width: 100%; display: grid; place-items: center; padding: 2rem; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease; pointer-events: none; }
        .world-stage button,.world-stage a,.world-stage input,.floating-panel,.quiet-dock,.primary-actions,.companion-orb { pointer-events: auto; }
        .demo-badge { position: fixed; left: 50%; top: 1.25rem; transform: translateX(-50%); z-index: 35; display: inline-flex; align-items: center; gap: .45rem; border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.18); border-radius: 999px; padding: .34rem .65rem; color: rgba(255,255,255,.58); backdrop-filter: blur(10px); pointer-events: none; }
        .demo-badge span { font-size: .56rem; letter-spacing: .18em; text-transform: uppercase; }
        .demo-badge small { font-size: .64rem; color: rgba(255,255,255,.36); }
        .hero-world { position: fixed; top: 13%; left: 50%; z-index: 28; width: min(700px, calc(100vw - 2rem)); transform: translateX(-50%); text-align: center; pointer-events: none; text-shadow: 0 2px 24px rgba(0,0,0,.7); transition: opacity .8s ease, transform 1.2s ease; }
        .eyebrow { margin: 0 0 .72rem; font-size: .62rem; letter-spacing: .44em; text-transform: uppercase; color: rgba(255,255,255,.34); }
        .hero-world h1 { margin: 0 auto; max-width: 720px; font-size: clamp(2.15rem,5.2vw,4.9rem); line-height: .95; letter-spacing: -.06em; font-weight: 680; }
        .hero-whisper { margin: .85rem auto 0; max-width: 30rem; font-size: clamp(.92rem,1.25vw,1.08rem); line-height: 1.55; color: rgba(255,255,255,.62); }
        .companion-orb { position: fixed; left: 50%; top: 52.5%; z-index: 26; width: clamp(205px,20vw,310px); height: clamp(205px,20vw,310px); transform: translate(-50%,-50%); border: 0; border-radius: 999px; background: transparent; cursor: zoom-in; transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 800ms ease, filter 800ms ease; }
        .companion-orb:focus-visible { outline: 2px solid rgba(255,255,255,.85); outline-offset: 10px; }
        .orb-halo,.orb-core,.orb-ring { position: absolute; border-radius: 999px; }
        .orb-halo { inset: -28%; background: radial-gradient(circle,rgba(255,255,255,.16),var(--tone-a) 34%,transparent 69%); filter: blur(16px); opacity: .96; animation: orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite; }
        .orb-core { inset: 22%; background: radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.95) 18%,rgba(125,211,252,.65) 48%,rgba(45,89,120,.22) 76%,transparent 100%); box-shadow: 0 0 28px rgba(255,255,255,.82),0 0 92px rgba(125,211,252,.48),0 0 190px rgba(196,181,253,.2); }
        .orb-ring-one { inset: 0; border: 1px solid rgba(255,255,255,.22); box-shadow: inset 0 0 24px rgba(125,211,252,.08); animation: orbOrbit calc(18s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 10%; border: 1px solid rgba(196,181,253,.18); transform: rotate(32deg) scaleX(.72); animation: orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse; }
        .orb-label { position: absolute; left: 50%; bottom: -1.1rem; transform: translateX(-50%); border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: rgba(0,0,0,.3); padding: .44rem .88rem; font-size: .68rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.78); backdrop-filter: blur(10px); white-space: nowrap; }
        .companion-whisper { position: fixed; right: 1rem; top: 1rem; z-index: 32; width: min(260px, calc(100vw - 2rem)); border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.2); border-radius: 18px; padding: .72rem .8rem; backdrop-filter: blur(12px); color: rgba(255,255,255,.68); pointer-events: none; }
        .companion-whisper strong { display: block; margin-bottom: .3rem; font-size: .58rem; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.34); }
        .companion-whisper span { display: block; font-size: .78rem; line-height: 1.45; }
        .quiet-dock { position: fixed; left: 50%; bottom: 2.4rem; z-index: 35; width: min(760px, calc(100vw - 2rem)); transform: translateX(-50%); display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .34rem; border: 1px solid rgba(255,255,255,.1); border-radius: 28px; background: rgba(2,6,18,.24); padding: .38rem; backdrop-filter: blur(14px); opacity: .2; transition: opacity .28s ease, transform .28s ease; }
        .quiet-dock:hover,.quiet-dock:focus-within { opacity: .94; transform: translateX(-50%) translateY(-.15rem); }
        .quiet-dock button { border: 0; border-radius: 20px; background: transparent; color: rgba(255,255,255,.54); padding: .62rem .68rem; text-align: left; cursor: pointer; transition: background .2s ease,color .2s ease; }
        .quiet-dock button:hover,.quiet-dock button.active { background: rgba(255,255,255,.08); color: white; }
        .quiet-dock span { display: block; margin-bottom: .14rem; font-size: .56rem; letter-spacing: .15em; text-transform: uppercase; opacity: .55; }
        .quiet-dock strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .74rem; }
        .floating-panel { position: fixed; left: 50%; bottom: 8.3rem; z-index: 38; width: min(520px, calc(100vw - 2rem)); transform: translateX(-50%); border: 1px solid rgba(255,255,255,.16); border-radius: 28px; background: rgba(5,9,22,.68); padding: 1.05rem; text-align: center; box-shadow: 0 32px 90px rgba(0,0,0,.34); backdrop-filter: blur(18px); animation: panelIn .3s cubic-bezier(.19,1,.22,1) both; }
        .floating-panel p { margin: 0 0 .4rem; font-size: .66rem; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.45); }
        .floating-panel h2 { margin: 0 0 .5rem; font-size: clamp(1.25rem,2vw,1.8rem); }
        .floating-panel span { display: block; color: rgba(255,255,255,.76); line-height: 1.55; }
        .floating-panel small { display: block; margin-top: .7rem; color: rgba(255,255,255,.52); line-height: 1.45; }
        .prompt-row,.email-row { margin-top: .9rem; display: flex; justify-content: center; gap: .45rem; flex-wrap: wrap; }
        .prompt-row button,.email-row button,.email-row input { border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: rgba(255,255,255,.08); color: white; padding: .56rem .75rem; font-size: .8rem; }
        .email-row input { min-width: 14rem; outline: none; }
        .email-row input::placeholder { color: rgba(255,255,255,.4); }
        .primary-actions { position: fixed; left: 50%; top: calc(52.5% + min(18vw,270px)); z-index: 31; transform: translateX(-50%); display: flex; gap: .65rem; align-items: center; justify-content: center; }
        .primary-actions button,.primary-actions a { min-height: 2.5rem; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); padding: .7rem .95rem; font-size: .82rem; font-weight: 700; text-decoration: none; backdrop-filter: blur(10px); transition: transform .2s ease,background .2s ease,opacity .2s ease; }
        .primary-actions button { background: rgba(255,255,255,.92); color: #050711; border-color: transparent; }
        .primary-actions a { background: rgba(0,0,0,.2); color: rgba(255,255,255,.78); }
        .primary-actions button:hover,.primary-actions a:hover { transform: translateY(-1px); }
        .star-tunnel { position: fixed; inset: 0; z-index: 18; opacity: 0; transform: scale(.85); pointer-events: none; background: radial-gradient(circle at 50% 32%,rgba(205,225,255,.32),transparent 6%), radial-gradient(circle at 42% 44%,var(--tone-b),transparent 12%), radial-gradient(circle at 58% 48%,var(--tone-a),transparent 14%); transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }
        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; } .star-two { left: 45%; top: 18%; width: .24rem; height: .24rem; } .star-three { left: 58%; top: 31%; width: .38rem; height: .38rem; } .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; } .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; }
        .trust-strip { position: fixed; left: 50%; bottom: .65rem; z-index: 36; transform: translateX(-50%); border-radius: 999px; padding: .35rem .75rem; font-size: .64rem; white-space: nowrap; opacity: .26; color: rgba(255,255,255,.56); pointer-events: none; }
        .home-scene.is-transitioning .world-stage { opacity: .24; transform: translateY(3.4rem) scale(.965); filter: blur(2px); }
        .home-scene.is-transitioning .companion-orb { transform: translate(-50%,-105%) scale(2.35); opacity: 1; filter: drop-shadow(0 0 90px rgba(255,255,255,.5)); }
        .home-scene.is-transitioning .ascension-beam { opacity: .88; transform: scale(2.2); }
        .home-scene.is-transitioning .aura-column { opacity: .74; transform: translateY(-18%) scaleY(1.34); }
        .home-scene.is-transitioning .emotional-wash { opacity: 1; transform: scale(1.18); }
        .home-scene.is-transitioning .star-tunnel { opacity: .9; transform: scale(2.45) translateY(-8%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .hero-world,.home-scene.is-transitioning .primary-actions,.home-scene.is-transitioning .quiet-dock,.home-scene.is-transitioning .trust-strip,.home-scene.is-transitioning .companion-whisper,.home-scene.is-transitioning .demo-badge { opacity: 0; pointer-events: none; }
        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }
        @keyframes orbBreathe { 0%,100% { transform: scale(.96); opacity: .74; } 50% { transform: scale(1.06); opacity: 1; } }
        @keyframes panelIn { from { opacity: 0; transform: translateX(-50%) translateY(.6rem) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @media (max-width: 900px) { .home-scene { overflow-y: auto; } .hero-world { top: 10%; } .hero-world h1 { font-size: clamp(2.1rem,11vw,3.9rem); } .companion-orb { top: 49%; width: 185px; height: 185px; } .primary-actions { top: calc(49% + 150px); flex-direction: column; } .quiet-dock { grid-template-columns: 1fr 1fr; bottom: 2.1rem; max-height: 6.6rem; overflow: auto; } .trust-strip { left: 1rem; right: 1rem; transform: none; white-space: normal; text-align: center; } .companion-whisper { right: 1rem; left: 1rem; top: auto; bottom: 10.2rem; width: auto; opacity: .88; } .demo-badge { top: .8rem; } .floating-panel { bottom: 9.8rem; } }
        @media (prefers-reduced-motion: reduce) { .emotional-wash,.star-tunnel,.transition-vignette,.companion-orb,.aura-column,.orb-ring,.orb-halo,.ascension-beam { transition-duration: .01ms !important; animation: none !important; } }
      `}</style>
    </main>
  );
}
