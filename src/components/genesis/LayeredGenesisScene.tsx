"use client";

import { getAssetPath } from "@/lib/assets/uraiAssetManifest";
import { SafeLayerImage } from "@/components/common/SafeLayerImage";
import { OrbLayer } from "./OrbLayer";

type GenesisMoodState = "calm" | "heavy" | "focused" | "anxious" | "hopeful" | "recovering" | "shadow" | "threshold" | "luminous";

type LayeredGenesisSceneProps = {
  moodState?: GenesisMoodState;
  onSkyOpen?: () => void;
  onOrbOpen?: () => void;
  onGroundOpen?: () => void;
  onPassportOpen?: () => void;
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

export function LayeredGenesisScene({ moodState = "luminous", onSkyOpen, onOrbOpen, onGroundOpen, onPassportOpen, className = "" }: LayeredGenesisSceneProps) {
  const mood = moodValues[moodState];

  return (
    <div
      className={`urai-scene-root relative min-h-screen w-full overflow-hidden bg-black ${className}`}
      style={{
        ["--scene-focus-x" as string]: "50%",
        ["--scene-focus-y" as string]: "48%",
        ["--body-focus-y" as string]: "62%",
        ["--ground-height" as string]: "32vh",
        ["--orb-y" as string]: "58%",
      }}
    >
      <SafeLayerImage src={getAssetPath("skyBackground")} alt="" priority className={baseImageClass} style={{ opacity: 1, objectPosition: "var(--scene-focus-x) var(--scene-focus-y)" }} />
      <SafeLayerImage src={getAssetPath("skyCloudFar")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ opacity: 0.55 }} />
      <SafeLayerImage src={getAssetPath("skyCloudMid")} alt="" priority className={`${baseImageClass} mix-blend-soft-light`} style={{ opacity: 0.72 }} />
      <SafeLayerImage src={getAssetPath("skyCloudNear")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ opacity: 0.86 }} />
      <SafeLayerImage src={getAssetPath("moodAtmosphereOverlay")} alt="" className={`${baseImageClass} mix-blend-overlay`} style={{ opacity: mood.atmosphereOpacity }} />
      <SafeLayerImage src={getAssetPath("starfieldOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.starfieldOpacity }} />
      <SafeLayerImage src={getAssetPath("auroraOverlay")} alt="" className={`${baseImageClass} mix-blend-screen`} style={{ opacity: mood.auroraOpacity }} />

      <SafeLayerImage src={getAssetPath("bodySilhouetteBase")} alt="" priority className={baseImageClass} style={{ objectPosition: "50% var(--body-focus-y)", opacity: 0.92 }} />
      <SafeLayerImage src={getAssetPath("bodySilhouetteGlow")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ objectPosition: "50% var(--body-focus-y)", opacity: 0.65 }} />
      <SafeLayerImage src={getAssetPath("auraField")} alt="" priority className={`${baseImageClass} mix-blend-screen`} style={{ objectPosition: "50% var(--body-focus-y)", opacity: mood.auraOpacity }} />

      <SafeLayerImage src={getAssetPath("groundBase")} alt="" priority className={groundImageClass} style={{ opacity: 1 }} />
      <SafeLayerImage src={getAssetPath("groundBloom")} alt="" priority className={`${groundImageClass} mix-blend-screen`} style={{ opacity: 0.72 }} />
      <SafeLayerImage src={getAssetPath("groundMist")} alt="" className={`${groundImageClass} mix-blend-screen`} style={{ opacity: 0.62 }} />

      <button type="button" aria-label="Open Life Map" onClick={onSkyOpen} className="absolute inset-x-0 top-0 z-20 h-[55%] cursor-pointer bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
      <button type="button" aria-label="Open Ground" onClick={onGroundOpen} className="absolute inset-x-0 bottom-0 z-20 h-[28%] cursor-pointer bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />

      <div className="absolute left-1/2 top-[var(--orb-y)] z-30 -translate-x-1/2 -translate-y-1/2">
        <OrbLayer intensity={mood.orbIntensity} interactive onClick={onOrbOpen} />
      </div>

      <button type="button" aria-label="Open URAI Passport" onClick={onPassportOpen} className="absolute bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50" />
      <SafeLayerImage src={getAssetPath("passportPortal")} alt="" className="pointer-events-none absolute bottom-5 right-5 z-30 h-14 w-14 select-none object-contain opacity-70 mix-blend-screen" />
      <SafeLayerImage src={getAssetPath("foregroundVignette")} alt="" className={`${baseImageClass} mix-blend-multiply`} style={{ opacity: 0.72 }} />
    </div>
  );
}
