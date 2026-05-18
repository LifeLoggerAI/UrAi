"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cinematicEase } from "@/components/urai/motion/ascentMotion";
import { useAscentTransition } from "@/components/urai/hooks/useAscentTransition";

type HomeOverlay = "companion" | "ground" | null;

function HeroStars() {
  return (
    <div className="urai-hero-stars" aria-hidden>
      {Array.from({ length: 140 }, (_, index) => (
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

function SkyArchitecture() {
  return (
    <div className="urai-sky-architecture" aria-hidden>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="skyLineGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(190,245,255,.05)" />
            <stop offset=".5" stopColor="rgba(220,255,255,.23)" />
            <stop offset="1" stopColor="rgba(190,180,255,.08)" />
          </linearGradient>
          <filter id="skyLineBlur"><feGaussianBlur stdDeviation="1.4" /></filter>
        </defs>
        <path d="M120 330 C325 190 510 250 705 135 C905 15 1120 92 1472 18" stroke="url(#skyLineGlow)" strokeWidth="2" fill="none" filter="url(#skyLineBlur)" />
        <path d="M70 560 C350 378 520 508 740 328 C963 145 1112 232 1540 182" stroke="rgba(122,220,255,.12)" strokeWidth="2" fill="none" />
        <path d="M260 210 C520 300 705 205 910 300 C1128 402 1280 345 1510 435" stroke="rgba(255,232,180,.09)" strokeWidth="1.5" fill="none" />
        <circle cx="708" cy="136" r="5" fill="rgba(220,255,255,.66)" />
        <circle cx="910" cy="300" r="4" fill="rgba(255,232,180,.44)" />
        <circle cx="1120" cy="92" r="3" fill="rgba(210,190,255,.5)" />
      </svg>
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
            <stop offset="0" stopColor="rgba(101,154,230,.42)" />
            <stop offset=".35" stopColor="rgba(23,62,118,.76)" />
            <stop offset="1" stopColor="rgba(0,2,10,1)" />
          </linearGradient>
          <linearGradient id="heroRidgeB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(72,235,245,.26)" />
            <stop offset=".3" stopColor="rgba(13,62,108,.78)" />
            <stop offset="1" stopColor="rgba(0,1,7,1)" />
          </linearGradient>
          <linearGradient id="heroRidgeC" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(16,38,75,.96)" />
            <stop offset="1" stopColor="rgba(0,0,4,1)" />
          </linearGradient>
          <radialGradient id="heroGroundBloom" cx="50%" cy="20%" r="62%">
            <stop offset="0" stopColor="rgba(223,255,255,.46)" />
            <stop offset=".24" stopColor="rgba(77,232,242,.24)" />
            <stop offset=".56" stopColor="rgba(255,229,138,.09)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="heroTerrainBlur" x="-20%" y="-25%" width="140%" height="150%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M0 210 C142 182 210 214 318 172 C430 128 540 180 650 140 C794 86 898 164 1048 122 C1218 74 1342 132 1600 92 L1600 720 L0 720 Z" fill="url(#heroRidgeA)" opacity=".62" />
        <path d="M0 310 C122 265 230 292 352 245 C488 192 596 250 724 204 C858 158 982 224 1118 185 C1304 132 1428 188 1600 162 L1600 720 L0 720 Z" fill="url(#heroRidgeB)" opacity=".94" />
        <ellipse cx="800" cy="318" rx="575" ry="140" fill="url(#heroGroundBloom)" filter="url(#heroTerrainBlur)" opacity=".9" />
        <path d="M0 435 C160 384 282 430 436 394 C574 362 692 416 840 382 C1004 344 1132 414 1292 376 C1425 344 1510 370 1600 346 L1600 720 L0 720 Z" fill="url(#heroRidgeC)" />
        <ellipse cx="800" cy="514" rx="390" ry="96" fill="rgba(68,209,242,.18)" filter="url(#heroTerrainBlur)" opacity=".84" />
        <path d="M0 620 C188 560 388 620 590 576 C790 532 930 632 1140 568 C1338 508 1462 592 1600 538 L1600 720 L0 720 Z" fill="rgba(0,1,5,.95)" />
      </svg>
      <div className="urai-ground-ritual-ring" />
      <div className="urai-hero-foreground-fade" />
    </div>
  );
}

function AvatarPresence() {
  return (
    <div className="urai-avatar-presence" aria-hidden>
      <div className="urai-avatar-shadow" />
      <div className="urai-avatar-spine" />
      <div className="urai-avatar-head" />
      <div className="urai-avatar-shoulders" />
      <div className="urai-avatar-torso" />
      <div className="urai-avatar-root" />
    </div>
  );
}

export function HomeScene() {
  const { phase, beginAscent, isTransitioning } = useAscentTransition("/life-map");
  const [overlay, setOverlay] = useState<HomeOverlay>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (overlay) {
        event.preventDefault();
        setOverlay(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [overlay]);

  const openSky = () => {
    if (isTransitioning || overlay) return;
    beginAscent();
  };

  return (
    <main className={`urai-hero-home phase-${phase} ${overlay ? `home-overlay-${overlay}` : ""}`}>
      <button
        className="urai-hero-hit"
        type="button"
        aria-label="Ascend through the sky into Memory Galaxy"
        disabled={isTransitioning || Boolean(overlay)}
        onClick={openSky}
        style={{ position: "absolute", inset: "0 0 45% 0", zIndex: 55, background: "transparent", border: 0, cursor: "zoom-in" }}
      />
      <button
        type="button"
        aria-label="Open URAI companion chat"
        disabled={isTransitioning}
        onClick={(event) => { event.stopPropagation(); setOverlay("companion"); }}
        style={{ position: "absolute", left: "35%", top: "26%", width: "30%", height: "33%", zIndex: 70, border: 0, background: "transparent", borderRadius: 999, cursor: "pointer" }}
      />
      <button
        type="button"
        aria-label="Open ground foundation layer"
        disabled={isTransitioning}
        onClick={(event) => { event.stopPropagation(); setOverlay("ground"); }}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", zIndex: 64, border: 0, background: "transparent", cursor: "zoom-in" }}
      />

      <div className="urai-hero-sky" aria-hidden>
        <HeroStars />
        <SkyArchitecture />
        <div className="urai-hero-aurora urai-hero-aurora-cyan" />
        <div className="urai-hero-aurora urai-hero-aurora-violet" />
        <div className="urai-hero-aurora urai-hero-aurora-gold" />
      </div>
      <FinalTerrain />
      <motion.div
        className="urai-hero-body"
        animate={phase === "portal" ? { y: "22vh", opacity: 0.08, filter: "blur(10px)" } : phase === "lift" ? { y: "7vh", opacity: 0.58 } : overlay === "ground" ? { y: "-8vh", scale: 1.08, opacity: 0.68 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: cinematicEase }}
        aria-hidden
      >
        <div className="urai-hero-body-aura" />
        <div className="urai-hero-body-beam" />
        <AvatarPresence />
      </motion.div>
      <motion.div
        className="urai-hero-orb-system"
        animate={phase === "portal" ? { scale: 8.5, y: "-3vh", opacity: 0.95 } : phase === "lift" ? { scale: 1.14, y: "-3vh" } : overlay === "companion" ? { scale: 2.15, y: "-4vh", opacity: 0.42 } : phase === "ignition" ? { scale: 1.06 } : { scale: 1 }}
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
      <motion.div className="urai-hero-bloom" animate={{ opacity: phase === "portal" ? 0.9 : phase === "emergence" ? 0.35 : overlay ? 0.5 : 0 }} transition={{ duration: 0.5, ease: cinematicEase }} aria-hidden />
      <div className="urai-home-panel urai-home-panel-left" aria-hidden="true">
        <span>URAI</span>
        <strong>Inner Sky Shrine</strong>
        <em>stable · quiet sky · memory gateway ready</em>
      </div>
      <div className="urai-home-panel urai-home-panel-right" aria-hidden="true">
        <span>Companion</span>
        <strong>Your sky is quiet, but awake.</strong>
        <em>Tap the orb for companion. Tap sky for Memory Galaxy.</em>
      </div>
      <div className="urai-hero-copy" aria-hidden>
        <span>URAI</span>
        <strong>Inner Sky Shrine</strong>
        <em>Tap sky, orb, or ground</em>
      </div>

      {overlay === "companion" && (
        <section className="home-companion-overlay" role="dialog" aria-modal="true" aria-label="URAI companion chat" style={{ position: "fixed", zIndex: 120, left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "min(620px, calc(100vw - 32px))", border: "1px solid rgba(190,215,255,.22)", borderRadius: 34, padding: 32, background: "linear-gradient(135deg, rgba(3,7,18,.78), rgba(8,20,34,.62))", backdropFilter: "blur(24px)", boxShadow: "0 30px 120px rgba(0,0,0,.5)", color: "#eef8ff" }}>
          <button type="button" onClick={() => setOverlay(null)} aria-label="Close companion chat" style={{ position: "absolute", right: 16, top: 16, width: 38, height: 38, borderRadius: 999, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "white" }}>×</button>
          <div style={{ width: 118, height: 118, borderRadius: 999, background: "radial-gradient(circle at 30% 24%, #fff, #baf6ff 22%, #0b5d72 62%, #020617 100%)", boxShadow: "0 0 120px rgba(125,211,252,.58)", marginBottom: 22 }} />
          <p style={{ margin: 0, color: "rgba(191,233,255,.62)", fontWeight: 900, letterSpacing: ".24em", textTransform: "uppercase", fontSize: 11 }}>URAI Companion</p>
          <h2 style={{ margin: "10px 0 14px", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: .95 }}>I am listening from the center of the sky.</h2>
          <p style={{ color: "rgba(238,248,255,.78)", lineHeight: 1.65 }}>This is the companion chamber. The live chat endpoint can attach here, but the orb interaction now opens separately from sky ascent.</p>
          <textarea placeholder="Speak into the orb…" style={{ width: "100%", minHeight: 110, marginTop: 18, borderRadius: 20, border: "1px solid rgba(190,215,255,.18)", background: "rgba(2,6,23,.64)", color: "white", padding: 16 }} />
        </section>
      )}

      {overlay === "ground" && (
        <section className="home-ground-overlay" role="dialog" aria-modal="true" aria-label="URAI ground foundation" style={{ position: "fixed", zIndex: 120, left: "50%", bottom: 28, transform: "translateX(-50%)", width: "min(760px, calc(100vw - 32px))", border: "1px solid rgba(190,215,255,.2)", borderRadius: 34, padding: 30, background: "linear-gradient(180deg, rgba(5,20,28,.74), rgba(0,5,10,.88))", backdropFilter: "blur(24px)", boxShadow: "0 -20px 120px rgba(34,211,238,.18)", color: "#eef8ff" }}>
          <button type="button" onClick={() => setOverlay(null)} aria-label="Close ground foundation" style={{ position: "absolute", right: 16, top: 16, width: 38, height: 38, borderRadius: 999, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "white" }}>×</button>
          <p style={{ margin: 0, color: "rgba(191,233,255,.62)", fontWeight: 900, letterSpacing: ".24em", textTransform: "uppercase", fontSize: 11 }}>Foundation Layer</p>
          <h2 style={{ margin: "10px 0 14px", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: .95 }}>Roots, recovery, and body-memory signals.</h2>
          <div style={{ height: 150, borderRadius: 28, background: "radial-gradient(ellipse at 50% 0%, rgba(125,211,252,.22), transparent 70%), linear-gradient(180deg, rgba(15,23,42,.2), rgba(0,0,0,.46))", margin: "18px 0" }} />
          <p style={{ color: "rgba(238,248,255,.76)", lineHeight: 1.6 }}>Ground zoom now opens the foundation layer instead of triggering sky ascent. Escape closes this layer back to Home.</p>
        </section>
      )}
    </main>
  );
}
