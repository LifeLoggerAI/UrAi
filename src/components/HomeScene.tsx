"use client";

import Link from "next/link";
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
    idle: "Tap the orb or sky to open the demo Life Map",
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
        aria-label="Open URAI demo Life Map from the sky"
      >
        <span className="sr-only">Open URAI demo Life Map</span>
      </button>

      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-black to-black" />

      <AncientSignalAmbientLayer result={ancientResult} source={source} loading={loading} />

      <GroundLayer
        className="home-ground"
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
      <div className="cloud-veil cloud-low" aria-hidden />
      <div className="cloud-veil cloud-high" aria-hidden />

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

      <div className="soul-anchor" aria-hidden>
        <div className="avatar-halo" />
        <div className="avatar-silhouette">
          <span className="avatar-head" />
          <span className="avatar-body" />
          <span className="avatar-heart" />
        </div>
      </div>

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
      </button>

      <div className="ascent-column" aria-hidden />

      <div className="star-tunnel" aria-hidden>
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
      </div>

      <div className="transition-vignette" aria-hidden />

      <section className="content-stage relative z-20 mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-between px-5 py-8">
        <div className="max-w-3xl pt-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.45em] text-white/50">
              URAI V1 Demo Spine
            </p>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/60">
              Public-safe demo data
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            A public demo for memory patterns, mood signals, and personal meaning.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            This launch path shows the working V1 loop: a symbolic environment, a mood forecast,
            a weekly reflection, a companion interpretation, and a waitlist CTA.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            The demo is intentionally narrow: it uses curated demo data, avoids private memory exposure,
            and keeps future roadmap surfaces out of the public path.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/u/adamclamp"
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Open public constellation
            </Link>

            <button
              type="button"
              onClick={openLifeMap}
              disabled={isTransitioning}
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 disabled:cursor-progress disabled:opacity-70"
            >
              {isTransitioning ? copy.opening : "Preview Life Map"}
            </button>
          </div>
        </div>

        <div className="demo-card-grid grid gap-4 pb-4 md:grid-cols-2 lg:grid-cols-4">
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
        .sky-breath,
        .cloud-veil,
        .ascent-column {
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

        .cloud-veil {
          z-index: 6;
          opacity: 0.32;
          filter: blur(18px);
          mix-blend-mode: screen;
          background:
            radial-gradient(ellipse at 20% 64%, rgba(255,255,255,.12), transparent 22%),
            radial-gradient(ellipse at 58% 58%, rgba(125,211,252,.12), transparent 26%),
            radial-gradient(ellipse at 84% 70%, rgba(196,181,253,.1), transparent 22%);
          transition:
            opacity 1100ms ease,
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cloud-high {
          opacity: 0.18;
          transform: translateY(-16%) scale(1.1);
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

        .soul-anchor {
          position: absolute;
          left: 50%;
          bottom: 18%;
          z-index: 11;
          width: min(32vw, 340px);
          height: min(42vh, 440px);
          transform: translateX(-50%);
          pointer-events: none;
          opacity: 0.78;
          transition:
            opacity 900ms ease,
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 900ms ease;
        }

        .avatar-halo {
          position: absolute;
          inset: 6% 12% 2%;
          border-radius: 999px 999px 48% 48%;
          background:
            radial-gradient(ellipse at 50% 28%, rgba(255,255,255,.16), transparent 22%),
            radial-gradient(ellipse at 50% 58%, var(--tone-a), transparent 48%);
          filter: blur(18px);
          opacity: 0.62;
        }

        .avatar-silhouette {
          position: absolute;
          left: 50%;
          bottom: 4%;
          width: 42%;
          height: 80%;
          transform: translateX(-50%);
          opacity: 0.74;
          filter: drop-shadow(0 0 22px rgba(125,211,252,.22));
        }

        .avatar-head {
          position: absolute;
          left: 50%;
          top: 3%;
          width: 42%;
          aspect-ratio: 1;
          transform: translateX(-50%);
          border-radius: 999px;
          background:
            radial-gradient(circle at 45% 35%, rgba(255,255,255,.42), rgba(255,255,255,.12) 42%, rgba(255,255,255,.03) 72%, transparent 100%);
          border: 1px solid rgba(255,255,255,.12);
        }

        .avatar-body {
          position: absolute;
          left: 50%;
          top: 27%;
          width: 62%;
          height: 65%;
          transform: translateX(-50%);
          border-radius: 52% 52% 40% 40%;
          background:
            linear-gradient(180deg, rgba(255,255,255,.13), rgba(125,211,252,.07) 48%, rgba(0,0,0,.02)),
            radial-gradient(ellipse at 50% 28%, rgba(255,255,255,.2), transparent 42%);
          border: 1px solid rgba(255,255,255,.1);
        }

        .avatar-heart {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 0.9rem;
          height: 0.9rem;
          transform: translateX(-50%);
          border-radius: 999px;
          background: rgba(255,255,255,.92);
          box-shadow:
            0 0 18px rgba(255,255,255,.9),
            0 0 44px var(--tone-a),
            0 0 80px var(--tone-b);
          animation: orbPulse calc(4.8s * var(--tone-speed)) ease-in-out infinite;
        }

        .companion-orb {
          position: absolute;
          left: 50%;
          top: 48%;
          z-index: 23;
          width: clamp(72px, 11vw, 132px);
          height: clamp(72px, 11vw, 132px);
          transform: translate(-50%, -50%);
          border: 0;
          border-radius: 999px;
          background: transparent;
          cursor: zoom-in;
          transition:
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 800ms ease,
            filter 800ms ease;
        }

        .companion-orb:disabled {
          cursor: progress;
        }

        .orb-core,
        .orb-ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
        }

        .orb-core {
          inset: 22%;
          background:
            radial-gradient(circle at 40% 35%, #fff, rgba(255,255,255,.82) 22%, rgba(125,211,252,.45) 50%, rgba(196,181,253,.08) 76%, transparent 100%);
          box-shadow:
            0 0 18px rgba(255,255,255,.9),
            0 0 58px var(--tone-a),
            0 0 112px var(--tone-b);
          animation: orbPulse calc(5.5s * var(--tone-speed)) ease-in-out infinite;
        }

        .orb-ring-one {
          border: 1px solid rgba(255,255,255,.2);
          box-shadow: 0 0 38px rgba(125,211,252,.18) inset;
          animation: orbOrbit calc(13s * var(--tone-speed)) linear infinite;
        }

        .orb-ring-two {
          inset: 10%;
          border: 1px solid rgba(196,181,253,.18);
          transform: rotate(32deg) scaleX(.72);
          animation: orbOrbit calc(16s * var(--tone-speed)) linear infinite reverse;
        }

        .ascent-column {
          z-index: 12;
          background:
            radial-gradient(ellipse at 50% 58%, rgba(255,255,255,.13), transparent 16%),
            linear-gradient(180deg, transparent 0%, rgba(125,211,252,.08) 42%, rgba(196,181,253,.07) 70%, transparent 100%);
          opacity: 0.16;
          filter: blur(4px);
          transition:
            opacity 1000ms ease,
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .star-tunnel {
          position: absolute;
          inset: 0;
          z-index: 18;
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
          z-index: 19;
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

        .content-stage,
        .demo-card-grid {
          transition:
            opacity 900ms ease,
            transform 1450ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 900ms ease;
        }

        .home-scene.is-transitioning .content-stage {
          opacity: 0.42;
          transform: translateY(2.5rem) scale(0.985);
          filter: blur(1.5px);
        }

        .home-scene.is-transitioning .demo-card-grid {
          opacity: 0.18;
          transform: translateY(4rem) scale(0.96);
        }

        .home-scene.is-transitioning .soul-anchor {
          opacity: 0.96;
          transform: translateX(-50%) translateY(-9vh) scale(1.08);
          filter: drop-shadow(0 0 42px var(--tone-a));
        }

        .home-scene.is-transitioning .companion-orb {
          transform: translate(-50%, -74%) scale(1.72);
          opacity: 1;
          filter: drop-shadow(0 0 54px rgba(255,255,255,.5));
        }

        .home-scene.is-transitioning .ascent-column {
          opacity: 0.72;
          transform: translateY(-12%) scaleY(1.2);
        }

        .home-scene.is-transitioning .cloud-low {
          opacity: 0.52;
          transform: translateY(-8%) scale(1.18);
        }

        .home-scene.is-transitioning .cloud-high {
          opacity: 0.44;
          transform: translateY(-30%) scale(1.32);
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
          transform: scale(1.9) translateY(-5%);
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

        @keyframes orbPulse {
          0%,
          100% {
            transform: translateX(-50%) scale(0.96);
            opacity: 0.78;
          }

          50% {
            transform: translateX(-50%) scale(1.08);
            opacity: 1;
          }
        }

        @keyframes orbOrbit {
          to {
            transform: rotate(360deg) scaleX(.82);
          }
        }

        @media (max-width: 900px) {
          .soul-anchor {
            width: min(52vw, 280px);
            height: min(36vh, 360px);
            bottom: 22%;
            opacity: 0.5;
          }

          .companion-orb {
            top: 44%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .emotional-wash,
          .ambient-drift,
          .sky-breath,
          .cloud-veil,
          .parallax-field,
          .star-tunnel,
          .transition-vignette,
          .tap-hint,
          .soul-anchor,
          .companion-orb,
          .ascent-column,
          .avatar-heart,
          .orb-core,
          .orb-ring {
            transition-duration: 0.01ms !important;
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
