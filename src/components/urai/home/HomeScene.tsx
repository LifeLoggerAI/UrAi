"use client";

import { motion } from "framer-motion";
import { cinematicEase } from "@/components/urai/motion/ascentMotion";
import { useAscentTransition } from "@/components/urai/hooks/useAscentTransition";

function HeroStars() {
  return (
    <div className="urai-hero-stars" aria-hidden>
      {Array.from({ length: 90 }, (_, index) => (
        <span
          key={index}
          style={{
            left: `${(index * 73) % 100}%`,
            top: `${8 + ((index * 47) % 72)}%`,
            width: `${1 + ((index * 13) % 18) / 12}px`,
            height: `${1 + ((index * 13) % 18) / 12}px`,
            opacity: 0.18 + ((index * 17) % 56) / 100,
            animationDelay: `${((index * 9) % 50) / 10}s`,
          }}
        />
      ))}
    </div>
  );
}

function FinalTerrain() {
  return (
    <div className="urai-hero-terrain" aria-hidden>
      <div className="urai-hero-horizon-glow" />
      <svg className="urai-hero-terrain-svg" viewBox="0 0 1600 720" preserveAspectRatio="none">
        <defs>
          <linearGradient id="heroRidgeA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(61,108,186,.52)" />
            <stop offset=".45" stopColor="rgba(12,33,76,.82)" />
            <stop offset="1" stopColor="rgba(0,2,10,1)" />
          </linearGradient>
          <linearGradient id="heroRidgeB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(60,226,238,.24)" />
            <stop offset=".25" stopColor="rgba(18,49,101,.82)" />
            <stop offset="1" stopColor="rgba(0,1,7,1)" />
          </linearGradient>
          <radialGradient id="heroGroundBloom" cx="50%" cy="12%" r="58%">
            <stop offset="0" stopColor="rgba(223,255,255,.42)" />
            <stop offset=".22" stopColor="rgba(77,232,242,.21)" />
            <stop offset=".54" stopColor="rgba(255,229,138,.10)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="heroTerrainBlur" x="-20%" y="-25%" width="140%" height="150%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M0 250 C105 214 184 237 278 190 C394 132 487 182 590 150 C706 112 790 168 902 125 C1028 77 1145 144 1240 122 C1350 96 1452 156 1600 128 L1600 720 L0 720 Z" fill="url(#heroRidgeA)" opacity=".75" />
        <path d="M0 354 C146 286 232 326 342 275 C462 219 560 270 682 224 C782 186 884 243 990 199 C1128 142 1237 231 1360 184 C1450 150 1520 172 1600 148 L1600 720 L0 720 Z" fill="url(#heroRidgeB)" opacity=".96" />
        <ellipse cx="800" cy="278" rx="520" ry="128" fill="url(#heroGroundBloom)" filter="url(#heroTerrainBlur)" />
        <path d="M0 430 C180 374 272 432 416 392 C552 354 670 427 812 382 C994 324 1120 435 1280 388 C1425 346 1506 382 1600 360 L1600 720 L0 720 Z" fill="rgba(0,6,18,.86)" />
        <ellipse cx="800" cy="485" rx="310" ry="80" fill="rgba(68,209,242,.20)" filter="url(#heroTerrainBlur)" opacity=".82" />
        <path d="M0 590 C220 528 390 618 590 560 C770 508 930 628 1134 556 C1338 484 1450 592 1600 532 L1600 720 L0 720 Z" fill="rgba(0,1,5,.94)" />
      </svg>
      <div className="urai-hero-foreground-fade" />
    </div>
  );
}

export function HomeScene() {
  const { phase, beginAscent, isTransitioning } = useAscentTransition("/life-map");

  return (
    <main className={`urai-hero-home phase-${phase}`} onClick={beginAscent}>
      <button className="urai-hero-hit" type="button" aria-label="Enter Memory Galaxy" disabled={isTransitioning} />
      <div className="urai-hero-sky" aria-hidden>
        <HeroStars />
        <div className="urai-hero-aurora urai-hero-aurora-cyan" />
        <div className="urai-hero-aurora urai-hero-aurora-violet" />
        <div className="urai-hero-aurora urai-hero-aurora-gold" />
      </div>
      <FinalTerrain />
      <motion.div
        className="urai-hero-body"
        animate={phase === "portal" ? { y: "22vh", opacity: 0.08, filter: "blur(10px)" } : phase === "lift" ? { y: "7vh", opacity: 0.58 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: cinematicEase }}
        aria-hidden
      >
        <div className="urai-hero-body-aura" />
        <div className="urai-hero-body-beam" />
        <svg className="urai-hero-body-svg" viewBox="0 0 260 520" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="heroBodyFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="rgba(220,255,255,.34)" />
              <stop offset=".44" stopColor="rgba(61,232,242,.18)" />
              <stop offset="1" stopColor="rgba(61,120,210,0)" />
            </linearGradient>
          </defs>
          <path d="M130 18 C82 82 76 151 96 224 C107 264 127 288 108 354 C91 413 99 474 130 512 C161 474 169 413 152 354 C133 288 153 264 164 224 C184 151 178 82 130 18Z" fill="url(#heroBodyFill)" />
          <path d="M130 56 C111 100 108 160 120 222 C128 260 138 290 128 344" fill="none" stroke="rgba(225,255,255,.22)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.div>
      <motion.div
        className="urai-hero-orb-system"
        animate={phase === "portal" ? { scale: 8.5, y: "-3vh", opacity: 0.95 } : phase === "lift" ? { scale: 1.14, y: "-3vh" } : phase === "ignition" ? { scale: 1.06 } : { scale: 1 }}
        transition={{ duration: phase === "portal" ? 0.52 : 0.42, ease: cinematicEase }}
        aria-hidden
      >
        <div className="urai-hero-orb-beam" />
        <div className="urai-hero-orb-halo" />
        <div className="urai-hero-orb-ring urai-hero-orb-ring-a" />
        <div className="urai-hero-orb-ring urai-hero-orb-ring-b" />
        <div className="urai-hero-orb"><span /><i /></div>
        <div className="urai-hero-orb-satellite" />
      </motion.div>
      <motion.div className="urai-hero-bloom" animate={{ opacity: phase === "portal" ? 0.9 : phase === "emergence" ? 0.35 : 0 }} transition={{ duration: 0.5, ease: cinematicEase }} aria-hidden />
      <div className="urai-hero-copy" aria-hidden>
        <span>URAI</span>
        <strong>Inner Sky Shrine</strong>
        <em>Tap to enter memory</em>
      </div>
    </main>
  );
}
