"use client";

import { motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { cinematicEase } from "@/components/urai/motion/ascentMotion";
import { useAscentTransition } from "@/components/urai/hooks/useAscentTransition";

type HomeLayer = "home" | "orbChat" | "groundZoom";
type OrbMessage = { id: string; role: "user" | "urai"; text: string };

function HeroStars() {
  return (
    <div className="urai-hero-stars" aria-hidden>
      {Array.from({ length: 180 }, (_, index) => (
        <span
          key={index}
          style={{
            left: `${(index * 73) % 100}%`,
            top: `${6 + ((index * 47) % 78)}%`,
            width: `${0.8 + ((index * 13) % 20) / 12}px`,
            height: `${0.8 + ((index * 13) % 20) / 12}px`,
            opacity: 0.14 + ((index * 17) % 62) / 100,
            animationDelay: `${((index * 9) % 58) / 10}s`,
          }}
        />
      ))}
    </div>
  );
}

function CelestialDepth() {
  return (
    <div className="urai-celestial-depth" aria-hidden>
      <div className="urai-moon-crescent" />
      <div className="urai-distant-planet" />
      <div className="urai-atmosphere-band urai-atmosphere-band-a" />
      <div className="urai-atmosphere-band urai-atmosphere-band-b" />
      <div className="urai-atmosphere-band urai-atmosphere-band-c" />
      <div className="urai-sky-vault-ring urai-sky-vault-ring-a" />
      <div className="urai-sky-vault-ring urai-sky-vault-ring-b" />
    </div>
  );
}

function SkyArchitecture() {
  return (
    <div className="urai-sky-architecture" aria-hidden>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="skyLineGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(190,245,255,.035)" />
            <stop offset=".5" stopColor="rgba(220,255,255,.2)" />
            <stop offset="1" stopColor="rgba(190,180,255,.07)" />
          </linearGradient>
          <filter id="skyLineBlur"><feGaussianBlur stdDeviation="1.4" /></filter>
        </defs>
        <path d="M120 330 C325 190 510 250 705 135 C905 15 1120 92 1472 18" stroke="url(#skyLineGlow)" strokeWidth="2" fill="none" filter="url(#skyLineBlur)" />
        <path d="M70 560 C350 378 520 508 740 328 C963 145 1112 232 1540 182" stroke="rgba(122,220,255,.095)" strokeWidth="2" fill="none" />
        <path d="M260 210 C520 300 705 205 910 300 C1128 402 1280 345 1510 435" stroke="rgba(255,232,180,.07)" strokeWidth="1.5" fill="none" />
        <circle cx="708" cy="136" r="5" fill="rgba(220,255,255,.62)" />
        <circle cx="910" cy="300" r="4" fill="rgba(255,232,180,.4)" />
        <circle cx="1120" cy="92" r="3" fill="rgba(210,190,255,.46)" />
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
            <stop offset="0" stopColor="rgba(72,235,245,.24)" />
            <stop offset=".3" stopColor="rgba(13,62,108,.78)" />
            <stop offset="1" stopColor="rgba(0,1,7,1)" />
          </linearGradient>
          <linearGradient id="heroRidgeC" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(16,38,75,.96)" />
            <stop offset="1" stopColor="rgba(0,0,4,1)" />
          </linearGradient>
          <radialGradient id="heroGroundBloom" cx="50%" cy="20%" r="62%">
            <stop offset="0" stopColor="rgba(223,255,255,.42)" />
            <stop offset=".24" stopColor="rgba(77,232,242,.22)" />
            <stop offset=".56" stopColor="rgba(255,229,138,.08)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="heroTerrainBlur" x="-20%" y="-25%" width="140%" height="150%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M0 210 C142 182 210 214 318 172 C430 128 540 180 650 140 C794 86 898 164 1048 122 C1218 74 1342 132 1600 92 L1600 720 L0 720 Z" fill="url(#heroRidgeA)" opacity=".55" />
        <path d="M0 310 C122 265 230 292 352 245 C488 192 596 250 724 204 C858 158 982 224 1118 185 C1304 132 1428 188 1600 162 L1600 720 L0 720 Z" fill="url(#heroRidgeB)" opacity=".88" />
        <ellipse cx="800" cy="318" rx="575" ry="140" fill="url(#heroGroundBloom)" filter="url(#heroTerrainBlur)" opacity=".82" />
        <path d="M0 435 C160 384 282 430 436 394 C574 362 692 416 840 382 C1004 344 1132 414 1292 376 C1425 344 1510 370 1600 346 L1600 720 L0 720 Z" fill="url(#heroRidgeC)" />
        <ellipse cx="800" cy="514" rx="390" ry="96" fill="rgba(68,209,242,.16)" filter="url(#heroTerrainBlur)" opacity=".78" />
        <path d="M0 620 C188 560 388 620 590 576 C790 532 930 632 1140 568 C1338 508 1462 592 1600 538 L1600 720 L0 720 Z" fill="rgba(0,1,5,.95)" />
      </svg>
      <div className="urai-ground-ritual-ring" />
      <div className="urai-ground-ritual-ring urai-ground-ritual-ring-b" />
      <div className="urai-reflection-floor" />
      <div className="urai-foundation-glow-lines"><span /><span /><span /><span /><span /></div>
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

function nextOrbReply(text: string) {
  return `I hear “${text}.” I am keeping it as a soft signal, not a verdict. The next star to watch is the one that returns when everything gets quiet.`;
}

export function HomeScene() {
  const { phase, beginAscent, isTransitioning } = useAscentTransition("/life-map");
  const [layer, setLayer] = useState<HomeLayer>("home");
  const [orbInput, setOrbInput] = useState("");
  const [messages, setMessages] = useState<OrbMessage[]>([
    { id: "urai-wake", role: "urai", text: "I am awake in the orb. Ask me what your sky is trying to show you." },
  ]);
  const layerOpen = layer !== "home";

  const closeLayer = () => setLayer("home");
  const openOrb = () => {
    if (!isTransitioning) setLayer("orbChat");
  };
  const openGround = () => {
    if (!isTransitioning) setLayer("groundZoom");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (layerOpen) {
        event.preventDefault();
        closeLayer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [layerOpen]);

  const submitOrbMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = orbInput.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", text },
      { id: `urai-${Date.now()}`, role: "urai", text: nextOrbReply(text) },
    ]);
    setOrbInput("");
  };

  return (
    <main className={`urai-hero-home phase-${phase} layer-${layer}`}>
      <button className="urai-sky-zone" type="button" aria-label="Ascend through the sky into the Memory Galaxy" disabled={isTransitioning || layerOpen} onClick={beginAscent}>
        <span>Ascend through sky</span>
      </button>
      <button className="urai-orb-zone" type="button" aria-label="Open URAI orb companion" disabled={isTransitioning || layerOpen} onClick={(event) => { event.stopPropagation(); openOrb(); }} />
      <button className="urai-ground-zone" type="button" aria-label="Enter URAI ground foundation" disabled={isTransitioning || layerOpen} onClick={(event) => { event.stopPropagation(); openGround(); }} />

      <div className="urai-hero-sky" aria-hidden>
        <HeroStars />
        <CelestialDepth />
        <SkyArchitecture />
        <div className="urai-hero-aurora urai-hero-aurora-cyan" />
        <div className="urai-hero-aurora urai-hero-aurora-violet" />
        <div className="urai-hero-aurora urai-hero-aurora-gold" />
      </div>
      <FinalTerrain />
      <motion.div
        className="urai-hero-body"
        animate={phase === "portal" ? { y: "22vh", opacity: 0.08, filter: "blur(10px)" } : phase === "lift" ? { y: "7vh", opacity: 0.58 } : layer === "groundZoom" ? { y: "4vh", opacity: 0.48, filter: "blur(1px)" } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: cinematicEase }}
        aria-hidden
      >
        <div className="urai-hero-body-aura" />
        <div className="urai-hero-body-beam" />
        <AvatarPresence />
      </motion.div>
      <motion.div
        className="urai-hero-orb-system"
        animate={layer === "orbChat" ? { scale: 1.18, y: "-1vh", opacity: 1 } : phase === "portal" ? { scale: 8.5, y: "-3vh", opacity: 0.95 } : phase === "lift" ? { scale: 1.14, y: "-3vh" } : phase === "ignition" ? { scale: 1.06 } : { scale: 1 }}
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
      <motion.div className="urai-hero-bloom" animate={{ opacity: phase === "portal" ? 0.9 : phase === "emergence" ? 0.35 : layer === "orbChat" ? 0.22 : layer === "groundZoom" ? 0.12 : 0 }} transition={{ duration: 0.5, ease: cinematicEase }} aria-hidden />
      <div className="urai-home-panel urai-home-panel-left" aria-hidden="true">
        <span>URAI</span>
        <strong>Inner Sky Shrine</strong>
        <em>stable · quiet sky · memory gateway ready</em>
      </div>
      <div className="urai-home-panel urai-home-panel-right" aria-hidden="true">
        <span>Companion</span>
        <strong>Your sky is quiet, but awake.</strong>
        <em>Sky opens the Memory Galaxy. Orb opens companion. Ground opens foundation.</em>
      </div>
      <div className="urai-zone-runes" aria-hidden>
        <span>Sky</span><span>Orb</span><span>Ground</span>
      </div>
      <div className="urai-hero-copy" aria-hidden>
        <span>URAI</span>
        <strong>Inner Sky Shrine</strong>
        <em>Sky · Orb · Ground</em>
      </div>

      {layer === "orbChat" && (
        <section className="urai-orb-chat-layer" onClick={closeLayer} aria-label="URAI orb companion chat">
          <div className="urai-orb-chat" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="urai-layer-close" onClick={closeLayer} aria-label="Close orb companion">Return</button>
            <div className="urai-orb-chat-bloom" aria-hidden />
            <p>Orb Companion</p>
            <h1>URAI is listening.</h1>
            <div className="urai-chat-stream">
              {messages.map((message) => <div key={message.id} className={`urai-chat-message ${message.role}`}>{message.text}</div>)}
            </div>
            <form className="urai-chat-form" onSubmit={submitOrbMessage}>
              <input value={orbInput} onChange={(event) => setOrbInput(event.target.value)} placeholder="Ask the orb what is forming..." aria-label="Message URAI companion" />
              <button type="submit">Send</button>
            </form>
          </div>
        </section>
      )}

      {layer === "groundZoom" && (
        <section className="urai-ground-layer" onClick={closeLayer} aria-label="URAI ground foundation layer">
          <div className="urai-ground-sanctum" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="urai-layer-close" onClick={closeLayer} aria-label="Return home from foundation">Return</button>
            <div className="urai-root-field" aria-hidden>{Array.from({ length: 24 }, (_, index) => <span key={index} />)}</div>
            <p>Foundation</p>
            <h1>What is beneath the map.</h1>
            <span>Roots, body-memory, rhythm, silence, and buried signal live here. This is the symbolic base layer under the Memory Galaxy.</span>
            <div className="urai-foundation-signals"><span>Breath rhythm steadying</span><span>Recurring evening reflection</span><span>Unspoken threshold memory</span></div>
          </div>
        </section>
      )}
    </main>
  );
}
