"use client";

import { useEffect } from "react";
import { getAssetPath } from "@/lib/assets/uraiAssetManifest";
import { SafeLayerImage } from "@/components/common/SafeLayerImage";
import { useGenesisSoundscape } from "@/hooks/useGenesisSoundscape";
import { useInteractionSound } from "@/hooks/useInteractionSound";
import { useUraiVoice } from "@/providers/UraiVoiceProvider";
import { OrbLayer } from "./OrbLayer";

type GenesisMoodState = "calm" | "heavy" | "focused" | "anxious" | "hopeful" | "recovering" | "shadow" | "threshold" | "luminous";

type LayeredGenesisSceneProps = {
  moodState?: GenesisMoodState;
  onSkyOpen?: () => void;
  onOrbOpen?: () => void;
  onGroundOpen?: () => void;
  onPassportOpen?: () => void;
  isCompanionOpen?: boolean;
  className?: string;
};

const moodValues: Record<GenesisMoodState, { atmosphereOpacity: number; auroraOpacity: number; starfieldOpacity: number; auraOpacity: number; orbIntensity: number }> = {
  calm: { atmosphereOpacity: 0.32, auroraOpacity: 0.18, starfieldOpacity: 0.18, auraOpacity: 0.52, orbIntensity: 0.72 },
  heavy: { atmosphereOpacity: 0.58, auroraOpacity: 0.08, starfieldOpacity: 0.14, auraOpacity: 0.38, orbIntensity: 0.52 },
  focused: { atmosphereOpacity: 0.34, auroraOpacity: 0.22, starfieldOpacity: 0.24, auraOpacity: 0.58, orbIntensity: 0.8 },
  anxious: { atmosphereOpacity: 0.48, auroraOpacity: 0.26, starfieldOpacity: 0.28, auraOpacity: 0.62, orbIntensity: 0.88 },
  hopeful: { atmosphereOpacity: 0.38, auroraOpacity: 0.36, starfieldOpacity: 0.26, auraOpacity: 0.76, orbIntensity: 0.95 },
  recovering: { atmosphereOpacity: 0.36, auroraOpacity: 0.32, starfieldOpacity: 0.24, auraOpacity: 0.72, orbIntensity: 0.88 },
  shadow: { atmosphereOpacity: 0.66, auroraOpacity: 0.1, starfieldOpacity: 0.18, auraOpacity: 0.34, orbIntensity: 0.46 },
  threshold: { atmosphereOpacity: 0.72, auroraOpacity: 0.44, starfieldOpacity: 0.34, auraOpacity: 0.82, orbIntensity: 1 },
  luminous: { atmosphereOpacity: 0.34, auroraOpacity: 0.52, starfieldOpacity: 0.38, auraOpacity: 0.9, orbIntensity: 1 },
};

const baseImageClass = "pointer-events-none absolute inset-0 h-full w-full select-none object-cover";
const groundImageClass = "pointer-events-none absolute inset-x-0 bottom-0 h-[var(--ground-height)] w-full select-none object-cover object-bottom";

export function LayeredGenesisScene({ moodState = "luminous", onSkyOpen, onOrbOpen, onGroundOpen, onPassportOpen, isCompanionOpen = false, className = "" }: LayeredGenesisSceneProps) {
  const mood = moodValues[moodState];
  const sound = useInteractionSound();
  const voice = useUraiVoice();
  useGenesisSoundscape({ moodState, sceneActive: true });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasHeardWelcome = window.localStorage.getItem("urai.genesis.hasHeardWelcome") === "true";
    const key = hasHeardWelcome ? "welcome.returning" : "welcome.firstOpen";
    if (!hasHeardWelcome) window.localStorage.setItem("urai.genesis.hasHeardWelcome", "true");
    void voice.playVoiceLine(key, { priority: "normal", forceCaption: !voice.voiceEnabled });
  }, []);

  const openSky = async () => {
    await sound.playPortalOpen("life-map");
    void voice.playVoiceLine("portal.galaxy", { priority: "portal" });
    onSkyOpen?.();
  };

  const openOrb = async () => {
    await sound.playOrbTap();
    void voice.playVoiceLine("orb.tap", { priority: "normal", forceCaption: !voice.voiceEnabled });
    onOrbOpen?.();
  };

  const openGround = async () => {
    await sound.playGroundOpen();
    void voice.playVoiceLine("ground.open", { priority: "portal" });
    onGroundOpen?.();
  };

  const openPassport = async () => {
    await sound.playPortalOpen("passport");
    void voice.playVoiceLine("portal.passport", { priority: "portal" });
    onPassportOpen?.();
  };

  return (
    <div className={`urai-scene-root relative min-h-screen w-full overflow-hidden bg-black ${className}`}>
      <style jsx>{`
        .urai-scene-root {
          --scene-focus-x: 50%;
          --scene-focus-y: 48%;
          --body-focus-y: 62%;
          --ground-height: 32vh;
          --orb-y: 58%;
          --passport-offset: 1.5rem;
        }

        @media (max-width: 430px) {
          .urai-scene-root {
            --scene-focus-x: 50%;
            --scene-focus-y: 44%;
            --body-focus-y: 64%;
            --ground-height: 30vh;
            --orb-y: 60%;
            --passport-offset: 1rem;
          }
        }

        @media (min-width: 768px) {
          .urai-scene-root {
            --scene-focus-y: 47%;
            --body-focus-y: 61%;
            --ground-height: 32vh;
            --orb-y: 57%;
          }
        }

        @media (min-width: 1024px) {
          .urai-scene-root {
            --scene-focus-y: 48%;
            --body-focus-y: 60%;
            --ground-height: 34vh;
            --orb-y: 56%;
          }
        }
      `}</style>

      <SafeLayerImage src={getAssetPath("skyBackground")} alt="" priority className={baseImageClass} style={{ opacity: 1, objectPosition: "var(--scene-focus-x) var(--scene-focus-y)" }} />
      <SafeLayerImage src={getAssetPath("skyCloudFar")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ opacity: 0.55, objectPosition: "var(--scene-focus-x) 38%" }} />
      <SafeLayerImage src={getAssetPath("skyCloudMid")} alt="" priority className={`${baseImageClass} mix-blend-soft-light`} style={{ opacity: 0.72, objectPosition: "var(--scene-focus-x) 48%" }} />
      <SafeLayerImage src={getAssetPath("skyCloudNear")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ opacity: 0.86, objectPosition: "var(--scene-focus-x) 58%" }} />
      <SafeLayerImage src={getAssetPath("moodAtmosphereOverlay")} alt="" className={`${baseImageClass} mix-blend-overlay`} style={{ opacity: mood.atmosphereOpacity }} />
      <SafeLayerImage src={getAssetPath("starfieldOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.starfieldOpacity }} />
      <SafeLayerImage src={getAssetPath("auroraOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.auroraOpacity }} />

      <SafeLayerImage src={getAssetPath("bodySilhouetteBase")} alt="" priority className={baseImageClass} style={{ objectPosition: "50% var(--body-focus-y)", opacity: 0.92 }} />
      <SafeLayerImage src={getAssetPath("bodySilhouetteGlow")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ objectPosition: "50% var(--body-focus-y)", opacity: 0.65 }} />
      <SafeLayerImage src={getAssetPath("auraField")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ objectPosition: "50% var(--body-focus-y)", opacity: mood.auraOpacity }} />

      <SafeLayerImage src={getAssetPath("groundBase")} alt="" priority className={groundImageClass} style={{ opacity: 1 }} />
      <SafeLayerImage src={getAssetPath("groundBloom")} alt="" priority className={`${groundImageClass} mix-blend-screen`} style={{ opacity: 0.72 }} />
      <SafeLayerImage src={getAssetPath("groundMist")} alt="" className={`${groundImageClass} mix-blend-screen`} style={{ opacity: 0.62 }} />

      <button type="button" aria-label="Open Life Map" onClick={openSky} className="absolute inset-x-0 top-0 z-20 h-[55%] cursor-pointer bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
      <button type="button" aria-label="Open Ground" onClick={openGround} className="absolute inset-x-0 bottom-0 z-20 h-[28%] cursor-pointer bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />

      {isCompanionOpen ? <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-25 bg-black/20 backdrop-blur-[2px]" /> : null}

      <div className="absolute left-1/2 top-[var(--orb-y)] z-30 -translate-x-1/2 -translate-y-1/2">
        <OrbLayer intensity={isCompanionOpen ? Math.min(1.18, mood.orbIntensity + 0.18) : mood.orbIntensity} interactive onClick={openOrb} isAwake={isCompanionOpen} />
      </div>

      <button type="button" aria-label="Open URAI Passport" onClick={openPassport} className="absolute bottom-[var(--passport-offset)] right-[var(--passport-offset)] z-40 h-12 w-12 rounded-full bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
      <SafeLayerImage src={getAssetPath("passportPortal")} alt="" className="pointer-events-none absolute bottom-[calc(var(--passport-offset)-0.25rem)] right-[calc(var(--passport-offset)-0.25rem)] z-30 h-14 w-14 select-none object-contain opacity-70 mix-blend-screen" />
      <SafeLayerImage src={getAssetPath("foregroundVignette")} alt="" className={`${baseImageClass} mix-blend-multiply`} style={{ opacity: 0.72 }} />
    </div>
  );
}
