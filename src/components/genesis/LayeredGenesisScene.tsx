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
  onSettingsOpen?: () => void;
  isCompanionOpen?: boolean;
  className?: string;
};

const moodValues: Record<GenesisMoodState, { atmosphereOpacity: number; auroraOpacity: number; starfieldOpacity: number; auraOpacity: number; cloudDepthOpacity: number; emotionalFieldOpacity: number; weatherOpacity: number; vignetteOpacity: number; rootGlowOpacity: number; portalOpacity: number; orbIntensity: number }> = {
  calm: { atmosphereOpacity: 0.22, auroraOpacity: 0.14, starfieldOpacity: 0.16, auraOpacity: 0.5, cloudDepthOpacity: 0.46, emotionalFieldOpacity: 0.2, weatherOpacity: 0.18, vignetteOpacity: 0.42, rootGlowOpacity: 0.34, portalOpacity: 0.34, orbIntensity: 0.72 },
  heavy: { atmosphereOpacity: 0.58, auroraOpacity: 0.06, starfieldOpacity: 0.12, auraOpacity: 0.34, cloudDepthOpacity: 0.62, emotionalFieldOpacity: 0.32, weatherOpacity: 0.36, vignetteOpacity: 0.72, rootGlowOpacity: 0.28, portalOpacity: 0.28, orbIntensity: 0.52 },
  focused: { atmosphereOpacity: 0.24, auroraOpacity: 0.18, starfieldOpacity: 0.18, auraOpacity: 0.58, cloudDepthOpacity: 0.34, emotionalFieldOpacity: 0.18, weatherOpacity: 0.1, vignetteOpacity: 0.38, rootGlowOpacity: 0.58, portalOpacity: 0.36, orbIntensity: 0.8 },
  anxious: { atmosphereOpacity: 0.42, auroraOpacity: 0.18, starfieldOpacity: 0.18, auraOpacity: 0.56, cloudDepthOpacity: 0.54, emotionalFieldOpacity: 0.28, weatherOpacity: 0.42, vignetteOpacity: 0.56, rootGlowOpacity: 0.48, portalOpacity: 0.3, orbIntensity: 0.78 },
  hopeful: { atmosphereOpacity: 0.3, auroraOpacity: 0.34, starfieldOpacity: 0.24, auraOpacity: 0.74, cloudDepthOpacity: 0.42, emotionalFieldOpacity: 0.34, weatherOpacity: 0.2, vignetteOpacity: 0.36, rootGlowOpacity: 0.66, portalOpacity: 0.42, orbIntensity: 0.95 },
  recovering: { atmosphereOpacity: 0.32, auroraOpacity: 0.3, starfieldOpacity: 0.22, auraOpacity: 0.72, cloudDepthOpacity: 0.4, emotionalFieldOpacity: 0.32, weatherOpacity: 0.18, vignetteOpacity: 0.38, rootGlowOpacity: 0.72, portalOpacity: 0.38, orbIntensity: 0.88 },
  shadow: { atmosphereOpacity: 0.66, auroraOpacity: 0.08, starfieldOpacity: 0.14, auraOpacity: 0.3, cloudDepthOpacity: 0.64, emotionalFieldOpacity: 0.26, weatherOpacity: 0.28, vignetteOpacity: 0.78, rootGlowOpacity: 0.26, portalOpacity: 0.24, orbIntensity: 0.46 },
  threshold: { atmosphereOpacity: 0.5, auroraOpacity: 0.42, starfieldOpacity: 0.3, auraOpacity: 0.8, cloudDepthOpacity: 0.48, emotionalFieldOpacity: 0.42, weatherOpacity: 0.2, vignetteOpacity: 0.46, rootGlowOpacity: 0.66, portalOpacity: 0.58, orbIntensity: 1 },
  luminous: { atmosphereOpacity: 0.3, auroraOpacity: 0.52, starfieldOpacity: 0.36, auraOpacity: 0.9, cloudDepthOpacity: 0.38, emotionalFieldOpacity: 0.4, weatherOpacity: 0.16, vignetteOpacity: 0.34, rootGlowOpacity: 0.72, portalOpacity: 0.48, orbIntensity: 1 },
};

const baseImageClass = "pointer-events-none absolute inset-0 h-full w-full select-none object-cover";
const groundImageClass = "pointer-events-none absolute inset-x-0 bottom-0 h-[var(--ground-height)] w-full select-none object-cover object-bottom";
const portalClass = "pointer-events-none absolute select-none object-contain mix-blend-screen";

export function LayeredGenesisScene({ moodState = "luminous", onSkyOpen, onOrbOpen, onGroundOpen, onPassportOpen, onSettingsOpen, isCompanionOpen = false, className = "" }: LayeredGenesisSceneProps) {
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
  }, [voice]);

  const openSky = async () => { await sound.playPortalOpen("life-map"); void voice.playVoiceLine("portal.galaxy", { priority: "portal" }); onSkyOpen?.(); };
  const openOrb = async () => { await sound.playOrbTap(); void voice.playVoiceLine("orb.tap", { priority: "normal", forceCaption: !voice.voiceEnabled }); onOrbOpen?.(); };
  const openGround = async () => { await sound.playGroundOpen(); void voice.playVoiceLine("ground.open", { priority: "portal" }); onGroundOpen?.(); };
  const openPassport = async () => { await sound.playPortalOpen("passport"); void voice.playVoiceLine("portal.passport", { priority: "portal" }); onPassportOpen?.(); };
  const openSettings = async () => { await sound.playOneShot("soft-select", { category: "ui", volume: 0.12 }); onSettingsOpen?.(); };

  return (
    <div className={`urai-scene-root relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_50%_32%,#203963_0%,#101a38_48%,#050714_100%)] ${className}`} data-mood={moodState}>
      <style jsx>{`
        .urai-scene-root { --scene-focus-x: 50%; --scene-focus-y: 48%; --body-focus-x: 50%; --body-focus-y: 62%; --ground-height: 34vh; --orb-x: 50%; --orb-y: 58%; --orb-size: 190px; --portal-opacity: ${mood.portalOpacity}; --vignette-opacity: ${mood.vignetteOpacity}; --aura-opacity: ${mood.auraOpacity}; --cloud-depth-opacity: ${mood.cloudDepthOpacity}; --mood-overlay-opacity: ${mood.atmosphereOpacity}; --passport-offset: 1.5rem; }
        @media (min-width: 640px) and (max-width: 1023px) { .urai-scene-root { --body-focus-y: 64%; --ground-height: 32vh; --orb-size: 165px; } }
        @media (max-width: 639px) { .urai-scene-root { --scene-focus-x: 50%; --scene-focus-y: 50%; --body-focus-y: 66%; --ground-height: 30vh; --orb-y: 60%; --orb-size: 132px; --passport-offset: 1rem; } }
        @media (prefers-reduced-motion: reduce) { .urai-scene-root { --portal-opacity: 0.28; --vignette-opacity: 0.36; --aura-opacity: 0.44; --cloud-depth-opacity: 0.32; --mood-overlay-opacity: 0.18; } }
      `}</style>

      <SafeLayerImage layerKey="skyBackground" src={getAssetPath("skyBackground")} alt="" priority className={baseImageClass} style={{ opacity: 1, objectPosition: "var(--scene-focus-x) var(--scene-focus-y)" }} />
      <SafeLayerImage layerKey="skyDepthHaze" src={getAssetPath("skyDepthHaze")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: "var(--cloud-depth-opacity)", objectPosition: "var(--scene-focus-x) var(--scene-focus-y)" }} />
      <SafeLayerImage layerKey="skyCloudFar" src={getAssetPath("skyCloudFar")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: 0.46, objectPosition: "var(--scene-focus-x) 38%" }} />
      <SafeLayerImage layerKey="skyCloudMid" src={getAssetPath("skyCloudMid")} alt="" className={`${baseImageClass} mix-blend-soft-light`} style={{ opacity: 0.68, objectPosition: "var(--scene-focus-x) 48%" }} />
      <SafeLayerImage layerKey="moodAtmosphereOverlay" src={getAssetPath("moodAtmosphereOverlay")} alt="" className={`${baseImageClass} mix-blend-overlay`} style={{ opacity: "var(--mood-overlay-opacity)" }} />
      <SafeLayerImage layerKey="starfieldOverlay" src={getAssetPath("starfieldOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.starfieldOpacity }} />
      <SafeLayerImage layerKey="auroraOverlay" src={getAssetPath("auroraOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.auroraOpacity }} />
      <SafeLayerImage layerKey="emotionalFieldOverlay" src={getAssetPath("emotionalFieldOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.emotionalFieldOpacity }} />
      <SafeLayerImage layerKey="weatherSoftOverlay" src={getAssetPath("weatherSoftOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.weatherOpacity }} />
      <SafeLayerImage layerKey="skyCloudNear" src={getAssetPath("skyCloudNear")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: 0.78, objectPosition: "var(--scene-focus-x) 58%" }} />
      <SafeLayerImage layerKey="bodyShadowSoft" src={getAssetPath("bodyShadowSoft")} alt="" className={baseImageClass} style={{ objectPosition: "var(--body-focus-x) var(--body-focus-y)", opacity: 0.5 }} />
      <SafeLayerImage layerKey="auraField" src={getAssetPath("auraField")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ objectPosition: "var(--body-focus-x) var(--body-focus-y)", opacity: "var(--aura-opacity)" }} />
      <SafeLayerImage layerKey="auraRing" src={getAssetPath("auraRing")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ objectPosition: "var(--body-focus-x) var(--body-focus-y)", opacity: Math.max(0.2, mood.auraOpacity - 0.16) }} />
      <SafeLayerImage layerKey="bodySilhouetteBase" src={getAssetPath("bodySilhouetteBase")} alt="" priority className={baseImageClass} style={{ objectPosition: "var(--body-focus-x) var(--body-focus-y)", opacity: 0.94 }} />
      <SafeLayerImage layerKey="bodySilhouetteGlow" src={getAssetPath("bodySilhouetteGlow")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ objectPosition: "var(--body-focus-x) var(--body-focus-y)", opacity: 0.64 }} />
      <SafeLayerImage layerKey="groundBase" src={getAssetPath("groundBase")} alt="" priority className={groundImageClass} style={{ opacity: 1 }} />
      <SafeLayerImage layerKey="rootGlow" src={getAssetPath("rootGlow")} alt="" className={`${groundImageClass} mix-blend-screen`} style={{ opacity: mood.rootGlowOpacity }} />
      <SafeLayerImage layerKey="groundBloom" src={getAssetPath("groundBloom")} alt="" className={`${groundImageClass} mix-blend-screen`} style={{ opacity: 0.62 }} />
      <SafeLayerImage layerKey="groundMist" src={getAssetPath("groundMist")} alt="" className={`${groundImageClass} mix-blend-screen`} style={{ opacity: 0.54 }} />
      <SafeLayerImage layerKey="groundForeground" src={getAssetPath("groundForeground")} alt="" className={groundImageClass} style={{ opacity: 0.92 }} />
      <SafeLayerImage layerKey="galaxyPortal" src={getAssetPath("galaxyPortal")} alt="" className={`${portalClass} left-1/2 top-[9%] z-20 h-[20vh] max-h-64 min-h-28 w-[34vw] -translate-x-1/2`} style={{ opacity: "var(--portal-opacity)" }} />
      <SafeLayerImage layerKey="mirrorPortal" src={getAssetPath("mirrorPortal")} alt="" className={`${portalClass} left-[5%] top-[42%] z-20 h-28 w-28 sm:h-36 sm:w-36`} style={{ opacity: mood.portalOpacity * 0.68 }} />
      <SafeLayerImage layerKey="shadowPortal" src={getAssetPath("shadowPortal")} alt="" className={`${portalClass} bottom-[17%] left-[10%] z-20 h-28 w-28 sm:h-40 sm:w-40`} style={{ opacity: moodState === "shadow" ? 0.54 : mood.portalOpacity * 0.5 }} />
      <SafeLayerImage layerKey="legacyPortal" src={getAssetPath("legacyPortal")} alt="" className={`${portalClass} right-[7%] top-[36%] z-20 h-28 w-28 sm:h-40 sm:w-40`} style={{ opacity: mood.portalOpacity * 0.62 }} />
      <SafeLayerImage layerKey="passportPortal" src={getAssetPath("passportPortal")} alt="" className={`${portalClass} bottom-[calc(var(--passport-offset)-0.25rem)] right-[calc(var(--passport-offset)-0.25rem)] z-30 h-14 w-14 opacity-75`} />
      <SafeLayerImage layerKey="settingsGlyph" src={getAssetPath("settingsGlyph")} alt="" className={`${portalClass} left-[var(--passport-offset)] bottom-[var(--passport-offset)] z-30 h-10 w-10 opacity-45`} />
      <SafeLayerImage layerKey="orbShadow" src={getAssetPath("orbShadow")} alt="" className="pointer-events-none absolute left-[var(--orb-x)] top-[var(--orb-y)] z-30 h-[calc(var(--orb-size)*1.35)] w-[calc(var(--orb-size)*1.35)] -translate-x-1/2 -translate-y-1/2 select-none object-contain opacity-55" />
      {isCompanionOpen ? <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-35 bg-black/20 backdrop-blur-[2px]" /> : null}
      <div className="absolute left-[var(--orb-x)] top-[var(--orb-y)] z-40 -translate-x-1/2 -translate-y-1/2" style={{ width: "var(--orb-size)", height: "var(--orb-size)" }}>
        <OrbLayer intensity={isCompanionOpen ? Math.min(1.18, mood.orbIntensity + 0.18) : mood.orbIntensity} interactive onClick={openOrb} isAwake={isCompanionOpen} />
      </div>
      <SafeLayerImage layerKey="foregroundVignette" src={getAssetPath("foregroundVignette")} alt="" priority className={`${baseImageClass} mix-blend-multiply`} style={{ opacity: "var(--vignette-opacity)" }} />
      <SafeLayerImage layerKey="edgeDarken" src={getAssetPath("edgeDarken")} alt="" className={`${baseImageClass} mix-blend-multiply`} style={{ opacity: 0.5 }} />
      <SafeLayerImage layerKey="cinematicSoftFrame" src={getAssetPath("cinematicSoftFrame")} alt="" className={`${baseImageClass} mix-blend-soft-light`} style={{ opacity: 0.42 }} />
      <button type="button" aria-label="Open Life Map" onClick={openSky} className="absolute inset-x-0 top-0 z-50 h-[55%] cursor-pointer bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
      <button type="button" aria-label="Open Ground" onClick={openGround} className="absolute inset-x-0 bottom-0 z-50 h-[28%] cursor-pointer bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
      <button type="button" aria-label="Open URAI Passport" onClick={openPassport} className="absolute bottom-[var(--passport-offset)] right-[var(--passport-offset)] z-[60] h-12 w-12 rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
      <button type="button" aria-label="Open Settings" onClick={openSettings} className="absolute bottom-[var(--passport-offset)] left-[var(--passport-offset)] z-[60] h-10 w-10 rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
    </div>
  );
}
