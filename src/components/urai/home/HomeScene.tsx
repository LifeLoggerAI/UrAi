"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type AscentPhase = "idle" | "ignition" | "lift" | "portal" | "emergence" | "settle";

const cinematicEase = [0.16, 1, 0.3, 1] as const;
const softEase = [0.22, 0.86, 0.18, 1] as const;

function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function StarParticleField({ density = 1, className = "" }: { density?: number; className?: string }) {
  const reduced = useReducedMotionSafe();
  const stars = useMemo(() => {
    const count = reduced ? Math.round(36 * density) : Math.round(110 * density);
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      x: (index * 73) % 100,
      y: (index * 41) % 100,
      size: 1 + ((index * 17) % 28) / 18,
      delay: ((index * 11) % 40) / 10,
      opacity: 0.18 + ((index * 19) % 62) / 100,
    }));
  }, [density, reduced]);

  return (
    <div className={`urai-star-field ${className}`} aria-hidden>
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function AvatarSilhouette({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-avatar-wrap"
      animate={
        phase === "portal"
          ? { y: "22vh", opacity: 0.08, filter: "blur(10px)" }
          : phase === "lift"
            ? { y: "5vh", opacity: 0.72, filter: "blur(0px)" }
            : { y: "0vh", opacity: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.5, ease: cinematicEase }}
      aria-hidden
    >
      <div className="urai-avatar-aura" />
      <svg className="urai-avatar-silhouette" viewBox="0 0 260 420" role="img" aria-label="URAI symbolic avatar silhouette">
        <defs>
          <linearGradient id="uraiAvatarGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#bffaff" stopOpacity="0.28" />
            <stop offset="0.46" stopColor="#4ee8f2" stopOpacity="0.21" />
            <stop offset="1" stopColor="#4e6caa" stopOpacity="0" />
          </linearGradient>
          <filter id="softAvatarGlow">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M130 18 C82 58 68 124 84 190 C93 229 112 248 92 306 C78 346 88 391 130 412 C172 391 182 346 168 306 C148 248 167 229 176 190 C192 124 178 58 130 18Z" fill="url(#uraiAvatarGradient)" filter="url(#softAvatarGlow)" />
        <path d="M130 44 C104 82 100 134 112 184 C119 214 132 234 122 282" fill="none" stroke="rgba(218,250,255,.22)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="130" cy="172" r="7" fill="rgba(225,255,255,.38)" />
      </svg>
    </motion.div>
  );
}

function GroundSystem({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-ground-system"
      animate={
        phase === "portal"
          ? { y: "28vh", opacity: 0.2, filter: "blur(8px)" }
          : phase === "lift"
            ? { y: "8vh", opacity: 1, filter: "blur(0px)" }
            : { y: "0vh", opacity: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.5, ease: cinematicEase }}
      aria-hidden
    >
      <div className="urai-horizon-mist" />
      <div className="urai-ground-back" />
      <div className="urai-ground-mid" />
      <div className="urai-ground-light-spill" />
      <div className="urai-ground-front" />
      <div className="urai-foreground-fog" />
    </motion.div>
  );
}

function MemoryOrb({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-memory-orb-wrap"
      animate={
        phase === "portal"
          ? { y: "-4vh", scale: 8.5, opacity: 0.92 }
          : phase === "lift"
            ? { y: "-4vh", scale: 1.18, opacity: 1 }
            : phase === "ignition"
              ? { y: "0vh", scale: 1.08, opacity: 1 }
              : { y: "0vh", scale: 1, opacity: 1 }
      }
      transition={{ duration: phase === "portal" ? 0.5 : 0.42, ease: cinematicEase }}
      aria-hidden
    >
      <div className="urai-orb-beam" />
      <div className="urai-orb-halo" />
      <div className="urai-orb-ring urai-orb-ring-one" />
      <div className="urai-orb-ring urai-orb-ring-two" />
      <div className="urai-orb-core"><span className="urai-orb-highlight" /><span className="urai-orb-shadow" /></div>
      <div className="urai-orb-spark" />
    </motion.div>
  );
}

export function HomeScene() {
  const router = useRouter();
  const reduced = useReducedMotionSafe();
  const [phase, setPhase] = useState<AscentPhase>("idle");

  const beginAscent = () => {
    if (phase !== "idle") return;
    if (reduced) {
      router.push("/life-map");
      return;
    }
    setPhase("ignition");
    window.setTimeout(() => setPhase("lift"), 220);
    window.setTimeout(() => setPhase("portal"), 620);
    window.setTimeout(() => setPhase("emergence"), 1120);
    window.setTimeout(() => setPhase("settle"), 1650);
    window.setTimeout(() => router.push("/life-map"), 2100);
  };

  const inTransition = phase !== "idle";

  return (
    <main className={`urai-screen urai-home-screen phase-${phase}`} onClick={beginAscent}>
      <button className="urai-fullscreen-button" aria-label="Enter Memory Galaxy" disabled={inTransition} />
      <motion.div className="urai-home-camera" animate={{ scale: phase === "ignition" ? 1.025 : 1 }} transition={{ duration: 0.22, ease: softEase }}>
        <div className="urai-cosmic-sky" aria-hidden>
          <div className="urai-sky-gradient" />
          <StarParticleField density={0.88} className="urai-stars-far" />
          <StarParticleField density={0.32} className="urai-stars-near" />
          <div className="urai-sky-vignette" />
        </div>
        <motion.div className="urai-nebula-layer" animate={{ opacity: phase === "portal" ? 0.9 : 0.62, y: phase === "lift" ? -18 : 0 }} transition={{ duration: 0.8, ease: softEase }} aria-hidden>
          <div className="urai-nebula urai-nebula-cyan" />
          <div className="urai-nebula urai-nebula-violet" />
          <div className="urai-nebula urai-nebula-gold" />
        </motion.div>
        <GroundSystem phase={phase} />
        <AvatarSilhouette phase={phase} />
        <MemoryOrb phase={phase} />
      </motion.div>
      <motion.div className="urai-ascent-bloom" animate={{ opacity: phase === "portal" ? 0.86 : phase === "emergence" ? 0.34 : 0 }} transition={{ duration: 0.5, ease: cinematicEase }} aria-hidden />
      <motion.div className="urai-star-emergence" animate={{ opacity: phase === "emergence" || phase === "settle" ? 1 : 0, scale: phase === "emergence" ? 1 : 0.92 }} transition={{ duration: 0.54, ease: cinematicEase }} aria-hidden />
      <div className="urai-home-label" aria-hidden>
        <span>URAI</span>
        <strong>Inner Sky Shrine</strong>
        <em>Tap the sky to enter memory</em>
      </div>
    </main>
  );
}
