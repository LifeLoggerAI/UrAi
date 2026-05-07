"use client";

import { useEffect, useMemo, useState } from "react";
import AncientSignalAmbientLayer from "@/components/ancient-signals/AncientSignalAmbientLayer";
import CompanionChat from "@/components/CompanionChat";
import ForecastCard from "@/components/ForecastCard";
import GroundLayer from "@/components/GroundLayer";
import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useEmotionalTone } from "@/components/lifemap/useEmotionalTone";
import WaitlistForm from "@/components/WaitlistForm";
import WeeklyReflectionCard from "@/components/WeeklyReflectionCard";
import { adamClampDemoProfile } from "@/lib/demo-data";
import { useAncientSignals } from "@/lib/useAncientSignals";

type HomeMode = "home" | "transitioning" | "lifemap";

const TONE_COPY = {
  calm: {
    idle: "Tap the sky to open your Life Map",
    opening: "Softening into the Life Map...",
  },
  focused: {
    idle: "Tap the sky to trace today’s pattern",
    opening: "Focusing the constellation...",
  },
  charged: {
    idle: "Tap the sky to see what is lighting up",
    opening: "Opening the active pattern...",
  },
  restorative: {
    idle: "Tap the sky to enter quiet memory space",
    opening: "Entering gently...",
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
    if (emotionalTone === "restorative") return 1700;
    if (emotionalTone === "charged") return 1150;
    if (emotionalTone === "focused") return 1325;
    return 1450;
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
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setMode("home");
  };

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
    <main
      className={`home-scene tone-${emotionalTone} ${
        isTransitioning ? "is-transitioning" : ""
      } relative min-h-dvh overflow-hidden bg-black text-white`}
    >
      <button
        type="button"
        onClick={openLifeMap}
        disabled={isTransitioning}
        className="sky-trigger"
        aria-label="Open URAI Life Map from the sky"
      >
        <span className="sr-only">Open URAI Life Map</span>
      </button>

      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-black to-black" />

      <AncientSignalAmbientLayer result={ancientResult} source={source} loading={loading} />

      <GroundLayer
        state={{
          moodScore: ancientResult.auraAtmosphere.warmth,
          rhythmState:
            ancientResult.preverbalState === "recovering"
              ? "recovering"
              : ancientResult.preverbalState === "activated"
                ? "overstimulated"
                : "stable",
          recoveryScore: ancientResult.recoveryPulseScore,
          vitalityScore: ancientResult.seekingScore,
          symbolicIntensity: ancientResult.signalDepth.auraAtmosphere,
          shadowStress: ancientResult.activationScore,
        }}
      />

      <div className="emotional-wash" aria-hidden />
      <div className="ambient-drift" aria-hidden />
      <div className="sky-breath" aria-hidden />

      <div className="parallax-field parallax-near" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className="parallax-field parallax-far" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="star-tunnel" aria-hidden>
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
      </div>

      <div className="transition-vignette" aria-hidden />

      <section className="relative z-20 mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-between px-5 py-8">
        <div className="max-w-3xl pt-10">
          <p className="text-xs uppercase tracking-[0.45em] text-white/50">
            URAI V1 Demo Spine
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            A passive emotional operating system for memory, mood, and meaning.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            This route renders the core loop: symbolic environment, mood forecast,
            weekly reflection, companion narrator, and Ancient Signals body-weather.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/u/adamclamp"
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Open public constellation
            </a>

            <button
              type="button"
              onClick={openLifeMap}
              disabled={isTransitioning}
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 disabled:cursor-progress disabled:opacity-70"
            >
              {isTransitioning ? copy.opening : "Open Life Map"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 pb-4 md:grid-cols-2 lg:grid-cols-4">
          <ForecastCard forecast={profile.moodForecast} />
          <WeeklyReflectionCard reflection={profile.weeklyReflection} />
          <CompanionChat />
          <WaitlistForm source="home" />
        </div>
      </section>

      <div className="tone-chip" aria-hidden>
        {emotionalTone}
      </div>

      <div className="tap-hint">{isTransitioning ? copy.opening : copy.idle}</div>

      <style jsx>{`
        .home-scene {
          --tone-a: rgba(125, 211, 252, 0.14);
          --tone-b: rgba(196, 181, 253, 0.12);
          --tone-c: rgba(255, 255, 255, 0.07);
          --tone-speed: 1;
          isolation: isolate;
        }

        .tone-calm {
          --tone-a: rgba(125, 211, 252, 0.13);
          --tone-b: rgba(196, 181, 253, 0.1);
          --tone-c: rgba(255, 255, 255, 0.06);
          --tone-speed: 1;
        }

        .tone-focused {
          --tone-a: rgba(96, 165, 250, 0.15);
          --tone-b: rgba(45, 212, 191, 0.1);
          --tone-c: rgba(219, 234, 254, 0.08);
          --tone-speed: 0.9;
        }

        .tone-charged {
          --tone-a: rgba(251, 191, 36, 0.13);
          --tone-b: rgba(244, 114, 182, 0.1);
          --tone-c: rgba(255, 255, 255, 0.08);
          --tone-speed: 0.75;
        }

        .tone-restorative {
          --tone-a: rgba(167, 139, 250, 0.14);
          --tone-b: rgba(14, 165, 233, 0.09);
          --tone-c: rgba(226, 232, 240, 0.06);
          --tone-speed: 1.25;
        }

        .sky-trigger {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: zoom-in;
          border: 0;
          background: transparent;
        }

        .sky-trigger:disabled {
          cursor: progress;
        }

        .emotional-wash,
        .ambient-drift,
        .sky-breath {
          position: absolute;
          inset: -8%;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .emotional-wash {
          z-index: 7;
          background:
            radial-gradient(circle at 28% 22%, var(--tone-a), transparent 24%),
            radial-gradient(circle at 74% 36%, var(--tone-b), transparent 26%),
            linear-gradient(180deg, transparent 20%, var(--tone-c) 100%);
          mix-blend-mode: screen;
          opacity: 0.78;
          transition:
            opacity 900ms ease,
            transform 1200ms ease;
        }

        .ambient-drift {
          z-index: 4;
          background:
            radial-gradient(circle at 18% 22%, var(--tone-a), transparent 18%),
            radial-gradient(circle at 78% 30%, var(--tone-b), transparent 22%),
            radial-gradient(circle at 50% 70%, var(--tone-c), transparent 26%);
          mix-blend-mode: screen;
          opacity: 0.75;
          animation: ambientDrift calc(18s * var(--tone-speed)) ease-in-out infinite alternate;
        }

        .sky-breath {
          z-index: 5;
          background: radial-gradient(
            circle at 50% 35%,
            rgba(255, 255, 255, 0.13),
            transparent 18%
          );
          mix-blend-mode: screen;
          opacity: 0.32;
          animation: skyBreath calc(6.5s * var(--tone-speed)) ease-in-out infinite;
        }

        .parallax-field {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          opacity: 0.65;
          overflow: hidden;
        }

        .parallax-field span {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow:
            0 0 16px rgba(255, 255, 255, 0.7),
            0 0 32px var(--tone-a);
        }

        .parallax-near span:nth-child(1) {
          left: 18%;
          top: 26%;
          width: 0.22rem;
          height: 0.22rem;
          animation: nearDrift calc(11s * var(--tone-speed)) ease-in-out infinite alternate;
        }

        .parallax-near span:nth-child(2) {
          left: 72%;
          top: 38%;
          width: 0.18rem;
          height: 0.18rem;
          animation: nearDrift calc(13s * var(--tone-speed)) ease-in-out infinite alternate-reverse;
        }

        .parallax-near span:nth-child(3) {
          left: 52%;
          top: 16%;
          width: 0.16rem;
          height: 0.16rem;
          animation: nearDrift calc(10s * var(--tone-speed)) ease-in-out infinite alternate;
        }

        .parallax-far span:nth-child(1) {
          left: 28%;
          top: 14%;
          width: 0.12rem;
          height: 0.12rem;
          animation: farDrift calc(18s * var(--tone-speed)) ease-in-out infinite alternate;
        }

        .parallax-far span:nth-child(2) {
          left: 80%;
          top: 22%;
          width: 0.1rem;
          height: 0.1rem;
          animation: farDrift calc(20s * var(--tone-speed)) ease-in-out infinite alternate-reverse;
        }

        .parallax-far span:nth-child(3) {
          left: 64%;
          top: 62%;
          width: 0.11rem;
          height: 0.11rem;
          animation: farDrift calc(17s * var(--tone-speed)) ease-in-out infinite alternate;
        }

        .parallax-far span:nth-child(4) {
          left: 12%;
          top: 58%;
          width: 0.09rem;
          height: 0.09rem;
          animation: farDrift calc(21s * var(--tone-speed)) ease-in-out infinite alternate-reverse;
        }

        .star-tunnel {
          position: absolute;
          inset: 0;
          z-index: 8;
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 32%, rgba(205, 225, 255, 0.45), transparent 6%),
            radial-gradient(circle at 42% 44%, var(--tone-b), transparent 12%),
            radial-gradient(circle at 58% 48%, var(--tone-a), transparent 14%);
          transition:
            opacity 800ms ease,
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .star {
          position: absolute;
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 999px;
          background: white;
          box-shadow:
            0 0 18px rgba(255, 255, 255, 0.95),
            0 0 42px var(--tone-a);
          opacity: 0.85;
        }

        .star-one {
          left: 30%;
          top: 24%;
        }

        .star-two {
          left: 45%;
          top: 18%;
          width: 0.32rem;
          height: 0.32rem;
        }

        .star-three {
          left: 58%;
          top: 31%;
          width: 0.5rem;
          height: 0.5rem;
        }

        .star-four {
          left: 66%;
          top: 43%;
          width: 0.28rem;
          height: 0.28rem;
        }

        .star-five {
          left: 38%;
          top: 52%;
          width: 0.24rem;
          height: 0.24rem;
        }

        .transition-vignette {
          position: absolute;
          inset: 0;
          z-index: 9;
          opacity: 0;
          pointer-events: none;
          background: radial-gradient(
            circle at 50% 35%,
            transparent 0%,
            rgba(5, 8, 22, 0.25) 35%,
            rgba(0, 0, 0, 0.92) 100%
          );
          transition: opacity 1200ms ease;
        }

        .tone-chip,
        .tap-hint {
          position: absolute;
          z-index: 30;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.4);
          color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          pointer-events: none;
        }

        .tone-chip {
          top: 1rem;
          right: 1rem;
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.62;
        }

        .tap-hint {
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 999px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          transition:
            opacity 500ms ease,
            transform 500ms ease;
        }

        .home-scene.is-transitioning .emotional-wash,
        .home-scene.is-transitioning .ambient-drift,
        .home-scene.is-transitioning .sky-breath {
          opacity: 1;
          transform: scale(1.18);
        }

        .home-scene.is-transitioning .parallax-near {
          opacity: 1;
          transform: scale(1.5) translateY(-5%);
          transition:
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 800ms ease;
        }

        .home-scene.is-transitioning .parallax-far {
          opacity: 1;
          transform: scale(1.25) translateY(-2%);
          transition:
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 800ms ease;
        }

        .home-scene.is-transitioning .star-tunnel {
          opacity: 1;
          transform: scale(1.7);
        }

        .home-scene.is-transitioning .transition-vignette {
          opacity: 1;
        }

        .home-scene.is-transitioning .tap-hint {
          transform: translateX(-50%) translateY(-0.35rem);
          opacity: 0.92;
        }

        @keyframes ambientDrift {
          from {
            transform: translate3d(-1.5%, -0.8%, 0) scale(1);
            opacity: 0.52;
          }

          to {
            transform: translate3d(1.2%, 0.9%, 0) scale(1.08);
            opacity: 0.78;
          }
        }

        @keyframes skyBreath {
          0%,
          100% {
            transform: scale(0.92);
            opacity: 0.22;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.38;
          }
        }

        @keyframes nearDrift {
          from {
            transform: translate3d(-0.35rem, -0.25rem, 0);
            opacity: 0.55;
          }

          to {
            transform: translate3d(0.45rem, 0.3rem, 0);
            opacity: 0.95;
          }
        }

        @keyframes farDrift {
          from {
            transform: translate3d(0.2rem, -0.18rem, 0);
            opacity: 0.35;
          }

          to {
            transform: translate3d(-0.18rem, 0.22rem, 0);
            opacity: 0.7;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .emotional-wash,
          .ambient-drift,
          .sky-breath,
          .parallax-field,
          .star-tunnel,
          .transition-vignette,
          .tap-hint {
            transition-duration: 0.01ms !important;
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}