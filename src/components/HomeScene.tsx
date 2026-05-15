"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AncientSignalAmbientLayer from "@/components/ancient-signals/AncientSignalAmbientLayer";
import CompanionChat from "@/components/CompanionChat";
import ForecastCard from "@/components/ForecastCard";
import HomeWebGLSky from "@/components/HomeWebGLSky";
import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useEmotionalTone } from "@/components/lifemap/useEmotionalTone";
import WaitlistForm from "@/components/WaitlistForm";
import WeeklyReflectionCard from "@/components/WeeklyReflectionCard";
import { adamClampDemoProfile } from "@/lib/demo-data";
import { useAncientSignals } from "@/lib/useAncientSignals";

type HomeMode = "home" | "transitioning" | "lifemap";

const TONE_COPY = {
  calm: {
    idle: "Tap the orb to enter the demo Life Map",
    opening: "The orb is lifting you into the Life Map...",
  },
  focused: {
    idle: "Tap the orb to trace the demo pattern",
    opening: "The constellation is focusing around you...",
  },
  charged: {
    idle: "Tap the orb to see what is lighting up",
    opening: "The active pattern is opening...",
  },
  restorative: {
    idle: "Tap the orb to enter quiet memory space",
    opening: "Entering gently through the sky...",
  },
};

export default function HomeScene() {
  const profile = adamClampDemoProfile;
  const { result: ancientResult, source, loading } = useAncientSignals();
  const [mode, setMode] = useState<HomeMode>("home");
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

  const openLifeMap = () => setMode(reduceMotion ? "lifemap" : "transitioning");
  const returnHome = () => setMode("home");

  if (mode === "lifemap") {
    return (
      <div className="relative h-dvh w-full overflow-hidden bg-black">
        <LifeMapScene />
        <button
          type="button"
          onClick={returnHome}
          className="absolute left-4 top-4 z-50 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
          aria-label="Return to home scene"
        >
          Return home
        </button>
      </div>
    );
  }

  const isTransitioning = mode === "transitioning";
  const copy = TONE_COPY[emotionalTone];

  return (
    <main className={`home-scene tone-${emotionalTone} ${isTransitioning ? "is-transitioning" : ""}`}>
      <button
        type="button"
        onClick={openLifeMap}
        disabled={isTransitioning}
        className="sky-trigger"
        aria-label="Open URAI demo Life Map from the sky"
      >
        <span className="sr-only">Open URAI demo Life Map</span>
      </button>

      <div className="sky-base" aria-hidden />
      <HomeWebGLSky />
      <AncientSignalAmbientLayer result={ancientResult} source={source} loading={loading} />

      <div className="emotional-wash" aria-hidden />
      <div className="clean-horizon" aria-hidden />
      <div className="orb-stage" aria-hidden>
        <span className="orb-shadow" />
        <span className="orb-pedestal" />
      </div>
      <div className="ascent-column" aria-hidden />
      <div className="transition-vignette" aria-hidden />

      <button
        type="button"
        className="companion-orb"
        onClick={openLifeMap}
        disabled={isTransitioning}
        aria-label="Open Life Map through the companion orb"
      >
        <span className="orb-core" />
        <span className="orb-ring orb-ring-one" />
        <span className="orb-ring orb-ring-two" />
        <span className="orb-cta">Enter</span>
      </button>

      <div className="star-tunnel" aria-hidden>
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
      </div>

      <section className="content-stage">
        <div className="hero-copy">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.45em] text-white/55">URAI Preview</p>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/65">
              Interactive Life Map · Sample data
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Your life patterns, mapped as meaning.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/76 md:text-lg">
            URAI turns passive mood, memory, behavior, and reflection signals into a private emotional constellation — helping you notice what is changing, repeating, and ready to heal.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
            This public preview uses sample data. No private user data is shown.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openLifeMap}
              disabled={isTransitioning}
              className="inline-flex min-h-11 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:cursor-progress disabled:opacity-70"
            >
              {isTransitioning ? copy.opening : "Enter Life Map"}
            </button>
            <Link
              href="/u/adamclamp"
              className="inline-flex min-h-11 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Explore Public Constellation
            </Link>
          </div>
        </div>

        <div className="orb-instruction" aria-hidden>
          <span>Tap the orb to enter the demo Life Map</span>
        </div>

        <div className="demo-card-grid grid gap-4 pb-14 md:grid-cols-2 xl:grid-cols-4">
          <ForecastCard forecast={profile.moodForecast} />
          <WeeklyReflectionCard reflection={profile.weeklyReflection} />
          <CompanionChat />
          <WaitlistForm source="home" />
        </div>
      </section>

      <div className="trust-strip">
        Private by default · Explainable insights · User-controlled data · Reflective insights, not medical diagnosis
      </div>
      <div className="tone-chip" aria-hidden>{emotionalTone}</div>
      <div className="tap-hint">{isTransitioning ? copy.opening : copy.idle}</div>

      <style jsx>{`
        .home-scene {
          --tone-a: rgba(125, 211, 252, 0.12);
          --tone-b: rgba(196, 181, 253, 0.1);
          --tone-c: rgba(255, 255, 255, 0.05);
          --tone-speed: 1;
          position: relative;
          min-height: 100dvh;
          overflow: hidden;
          background: #000;
          color: white;
          isolation: isolate;
        }

        .tone-focused { --tone-a: rgba(96,165,250,.14); --tone-b: rgba(45,212,191,.08); --tone-speed: .9; }
        .tone-charged { --tone-a: rgba(251,191,36,.1); --tone-b: rgba(244,114,182,.08); --tone-speed: .8; }
        .tone-restorative { --tone-a: rgba(167,139,250,.12); --tone-b: rgba(14,165,233,.08); --tone-speed: 1.25; }

        .sky-base,
        .emotional-wash,
        .clean-horizon,
        .orb-stage,
        .ascent-column,
        .transition-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sky-base {
          z-index: 0;
          background:
            radial-gradient(circle at 52% 24%, rgba(68, 86, 154, 0.72), transparent 28%),
            linear-gradient(180deg, #060913 0%, #101936 42%, #07100d 78%, #010203 100%);
        }

        .emotional-wash {
          z-index: 3;
          background:
            radial-gradient(circle at 50% 36%, rgba(125, 211, 252, 0.11), transparent 18%),
            radial-gradient(circle at 50% 58%, rgba(196, 181, 253, 0.08), transparent 22%),
            linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(4,8,18,.16) 58%, rgba(0,0,0,.5) 100%);
          mix-blend-mode: screen;
          opacity: .68;
          transition: opacity 900ms ease, transform 1200ms ease;
        }

        .clean-horizon {
          z-index: 7;
          inset: auto -8% 0 -8%;
          height: 34%;
          background:
            radial-gradient(ellipse at 50% 10%, rgba(126, 220, 170, 0.13), transparent 34%),
            radial-gradient(ellipse at 50% 72%, rgba(32, 90, 58, 0.32), transparent 46%),
            linear-gradient(180deg, rgba(0,0,0,0), rgba(7, 22, 14, 0.72) 58%, rgba(0,0,0,.88));
          filter: blur(0.2px);
          opacity: .82;
        }

        .orb-stage { z-index: 9; }

        .orb-shadow {
          position: absolute;
          left: 50%;
          top: 68%;
          width: min(40vw, 460px);
          height: min(10vh, 105px);
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(ellipse at center, rgba(125, 211, 252, .2), rgba(24, 55, 68, .09) 38%, transparent 72%);
          filter: blur(12px);
        }

        .orb-pedestal {
          position: absolute;
          left: 50%;
          top: 59%;
          width: min(20vw, 220px);
          height: min(22vh, 220px);
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 42%, rgba(255,255,255,.14), transparent 20%),
            radial-gradient(circle at 50% 50%, rgba(125,211,252,.12), transparent 48%);
          border: 1px solid rgba(255,255,255,.08);
          filter: blur(.2px);
          opacity: .92;
        }

        .sky-trigger {
          position: absolute;
          inset: 0;
          z-index: 10;
          border: 0;
          background: transparent;
          cursor: zoom-in;
        }

        .companion-orb {
          position: absolute;
          left: 50%;
          top: 53%;
          z-index: 23;
          width: clamp(112px, 11vw, 150px);
          height: clamp(112px, 11vw, 150px);
          transform: translate(-50%, -50%);
          border: 0;
          border-radius: 999px;
          background: transparent;
          cursor: zoom-in;
          transition: transform 1450ms cubic-bezier(.16,1,.3,1), opacity 800ms ease, filter 800ms ease;
        }

        .companion-orb:focus-visible {
          outline: 2px solid rgba(255,255,255,.85);
          outline-offset: 8px;
        }

        .orb-core,
        .orb-ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
        }

        .orb-core {
          inset: 18%;
          background: radial-gradient(circle at 42% 34%, #fff, rgba(219,242,255,.92) 18%, rgba(125,211,252,.55) 48%, rgba(45,89,120,.2) 76%, transparent 100%);
          box-shadow: 0 0 18px rgba(255,255,255,.72), 0 0 58px rgba(125,211,252,.36), 0 0 110px rgba(196,181,253,.14);
        }

        .orb-ring-one { border: 1px solid rgba(255,255,255,.24); box-shadow: inset 0 0 18px rgba(125,211,252,.08); animation: orbOrbit calc(16s * var(--tone-speed)) linear infinite; }
        .orb-ring-two { inset: 9%; border: 1px solid rgba(196,181,253,.18); transform: rotate(32deg) scaleX(.72); animation: orbOrbit calc(20s * var(--tone-speed)) linear infinite reverse; }

        .orb-cta {
          position: absolute;
          left: 50%;
          bottom: -1.6rem;
          transform: translateX(-50%);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(0,0,0,.42);
          padding: .35rem .8rem;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(255,255,255,.84);
          backdrop-filter: blur(8px);
        }

        .ascent-column {
          z-index: 12;
          inset: -8%;
          background: radial-gradient(ellipse at 50% 56%, rgba(255,255,255,.08), transparent 12%), linear-gradient(180deg, transparent 0%, rgba(125,211,252,.045) 48%, rgba(196,181,253,.035) 70%, transparent 100%);
          opacity: .12;
          filter: blur(4px);
          transition: opacity 1000ms ease, transform 1450ms cubic-bezier(.16,1,.3,1);
        }

        .star-tunnel {
          position: absolute;
          inset: 0;
          z-index: 18;
          opacity: 0;
          transform: scale(.85);
          pointer-events: none;
          background: radial-gradient(circle at 50% 32%, rgba(205,225,255,.32), transparent 6%), radial-gradient(circle at 42% 44%, var(--tone-b), transparent 12%), radial-gradient(circle at 58% 48%, var(--tone-a), transparent 14%);
          transition: opacity 800ms ease, transform 1450ms cubic-bezier(.16,1,.3,1);
        }

        .star { position: absolute; width: .32rem; height: .32rem; border-radius: 999px; background: white; box-shadow: 0 0 14px rgba(255,255,255,.65), 0 0 32px var(--tone-a); opacity: .72; }
        .star-one { left: 30%; top: 24%; }
        .star-two { left: 45%; top: 18%; width: .24rem; height: .24rem; }
        .star-three { left: 58%; top: 31%; width: .38rem; height: .38rem; }
        .star-four { left: 66%; top: 43%; width: .22rem; height: .22rem; }
        .star-five { left: 38%; top: 52%; width: .2rem; height: .2rem; }

        .transition-vignette {
          z-index: 19;
          opacity: 0;
          background: radial-gradient(circle at 50% 42%, transparent 0%, rgba(5,8,22,.25) 35%, rgba(0,0,0,.92) 100%);
          transition: opacity 1200ms ease;
        }

        .content-stage {
          position: relative;
          z-index: 20;
          min-height: 100dvh;
          width: 100%;
          max-width: 78rem;
          margin: 0 auto;
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 2rem;
          transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1), filter 900ms ease;
        }

        .hero-copy { max-width: 50rem; padding-top: 2.5rem; }
        .orb-instruction {
          align-self: center;
          margin-top: auto;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(0,0,0,.26);
          padding: .55rem 1rem;
          color: rgba(255,255,255,.74);
          font-size: .86rem;
          backdrop-filter: blur(8px);
        }
        .demo-card-grid { position: relative; z-index: 25; transition: opacity 900ms ease, transform 1450ms cubic-bezier(.16,1,.3,1); }

        .tone-chip,
        .tap-hint,
        .trust-strip {
          position: absolute;
          z-index: 30;
          border: 1px solid rgba(255,255,255,.18);
          background: rgba(0,0,0,.34);
          color: rgba(255,255,255,.82);
          backdrop-filter: blur(8px);
          pointer-events: none;
        }

        .tone-chip { top: 1rem; right: 1rem; border-radius: 999px; padding: .35rem .75rem; font-size: .7rem; letter-spacing: .18em; text-transform: uppercase; opacity: .62; }
        .tap-hint { bottom: 1.5rem; left: 50%; transform: translateX(-50%); border-radius: 999px; padding: .5rem 1rem; font-size: .875rem; transition: opacity 500ms ease, transform 500ms ease; }
        .trust-strip { left: 50%; bottom: 4.25rem; transform: translateX(-50%); border-radius: 999px; padding: .45rem .9rem; font-size: .72rem; color: rgba(255,255,255,.64); white-space: nowrap; }

        .home-scene.is-transitioning .content-stage { opacity: .38; transform: translateY(2.5rem) scale(.985); filter: blur(1.5px); }
        .home-scene.is-transitioning .demo-card-grid { opacity: .16; transform: translateY(4rem) scale(.96); }
        .home-scene.is-transitioning .companion-orb { transform: translate(-50%, -90%) scale(1.72); opacity: 1; filter: drop-shadow(0 0 54px rgba(255,255,255,.38)); }
        .home-scene.is-transitioning .ascent-column { opacity: .58; transform: translateY(-12%) scaleY(1.2); }
        .home-scene.is-transitioning .emotional-wash { opacity: .9; transform: scale(1.12); }
        .home-scene.is-transitioning .star-tunnel { opacity: .72; transform: scale(1.9) translateY(-5%); }
        .home-scene.is-transitioning .transition-vignette { opacity: 1; }
        .home-scene.is-transitioning .tap-hint { transform: translateX(-50%) translateY(-.35rem); opacity: .92; }

        @keyframes orbOrbit { to { transform: rotate(360deg) scaleX(.82); } }

        @media (max-width: 900px) {
          .content-stage { justify-content: flex-start; padding-bottom: 7rem; }
          .hero-copy { padding-top: 1rem; }
          .companion-orb { position: relative; left: 50%; top: auto; margin: 1rem 0 2.25rem; width: 112px; height: 112px; }
          .orb-pedestal { top: 44%; width: 150px; height: 150px; }
          .clean-horizon { height: 38%; }
          .orb-instruction { display: none; }
          .trust-strip { left: 1rem; right: 1rem; bottom: 4rem; transform: none; white-space: normal; text-align: center; }
          .tap-hint { left: 1rem; right: 1rem; bottom: 1rem; transform: none; text-align: center; }
          .home-scene.is-transitioning .tap-hint { transform: translateY(-.35rem); }
        }

        @media (prefers-reduced-motion: reduce) {
          .emotional-wash,
          .star-tunnel,
          .transition-vignette,
          .tap-hint,
          .companion-orb,
          .ascent-column,
          .orb-ring {
            transition-duration: .01ms !important;
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
