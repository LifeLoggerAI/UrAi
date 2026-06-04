import { UraiVoiceLine, UraiVoiceLineId } from "./soundTypes";

export const URAI_VOICE_LINES: Record<UraiVoiceLineId, UraiVoiceLine> = {
  welcome: {
    id: "welcome",
    title: "Welcome",
    text: "Welcome to URAI. I stay quiet until you choose what to open.",
    context: "genesis",
  },
  passport_privacy: {
    id: "passport_privacy",
    title: "Passport Privacy",
    text: "Passport controls what URAI can use. Closed layers stay closed.",
    context: "passport",
  },
  companion_intro: {
    id: "companion_intro",
    title: "Companion",
    text: "I’m here quietly. You can ask, reflect, or simply leave the orb at rest.",
    context: "companion",
  },
  reflection_ready: {
    id: "reflection_ready",
    title: "Reflection Ready",
    text: "A symbolic reflection may be ready when you choose to review it.",
    context: "mirror",
  },
  spatial_optional: {
    id: "spatial_optional",
    title: "Spatial Optional",
    text: "Spatial previews are optional and do not use camera or motion access unless you explicitly open them.",
    context: "spatial",
  },
  shadow_protected: {
    id: "shadow_protected",
    title: "Shadow Protected",
    text: "Shadow remains protected. It opens only with your approval.",
    context: "shadow",
  },
  legacy_protected: {
    id: "legacy_protected",
    title: "Legacy Protected",
    text: "Legacy remains sealed until you choose what should be remembered.",
    context: "legacy",
  },
  sound_not_recording: {
    id: "sound_not_recording",
    title: "Sound Playback",
    text: "Sound playback is not recording. Audio capture would require a separate permission step later.",
    context: "system",
  },
};

export function getUraiVoiceLine(id: UraiVoiceLineId): UraiVoiceLine {
  return URAI_VOICE_LINES[id];
}
