export type GenesisMoodState =
  | "calm"
  | "heavy"
  | "focused"
  | "anxious"
  | "hopeful"
  | "recovering"
  | "shadow"
  | "threshold"
  | "luminous";

export type UraiVoiceIntensity = "low" | "medium" | "high";

export type UraiVoiceLine = {
  key: string;
  text: string;
  audioPath?: string;
  moodTags?: GenesisMoodState[];
  intensity?: UraiVoiceIntensity;
  cooldownMs?: number;
  allowTextFallback?: boolean;
};

export const URAI_VOICE_LINES: Record<string, UraiVoiceLine> = {
  "welcome.firstOpen": {
    key: "welcome.firstOpen",
    text: "You’re here. I’ll stay quiet until you need me.",
    audioPath: "/assets/audio/voice/genesis/welcome/first-open.mp3",
    moodTags: ["luminous", "calm"],
    intensity: "low",
    cooldownMs: 86400000,
    allowTextFallback: true,
  },
  "welcome.returning": {
    key: "welcome.returning",
    text: "Welcome back. The sky remembered you.",
    audioPath: "/assets/audio/voice/genesis/welcome/returning.mp3",
    moodTags: ["luminous", "calm"],
    intensity: "low",
    cooldownMs: 21600000,
    allowTextFallback: true,
  },
  "orb.wake": {
    key: "orb.wake",
    text: "I’m here.",
    audioPath: "/assets/audio/voice/genesis/orb/wake.mp3",
    intensity: "low",
    cooldownMs: 45000,
    allowTextFallback: true,
  },
  "orb.tap": {
    key: "orb.tap",
    text: "We can look gently.",
    audioPath: "/assets/audio/voice/genesis/orb/tap.mp3",
    intensity: "low",
    cooldownMs: 30000,
    allowTextFallback: true,
  },
  "orb.idleWhisper": {
    key: "orb.idleWhisper",
    text: "Everything can stay simple for a moment.",
    audioPath: "/assets/audio/voice/genesis/orb/idle-whisper.mp3",
    moodTags: ["calm"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "orb.lowEnergy": {
    key: "orb.lowEnergy",
    text: "We can make this lighter, one layer at a time.",
    moodTags: ["heavy"],
    intensity: "low",
    cooldownMs: 180000,
    allowTextFallback: true,
  },
  "orb.recovery": {
    key: "orb.recovery",
    text: "You’re not back at the beginning.",
    moodTags: ["recovering"],
    intensity: "low",
    cooldownMs: 180000,
    allowTextFallback: true,
  },
  "orb.threshold": {
    key: "orb.threshold",
    text: "This is a doorway, not the whole story.",
    moodTags: ["threshold"],
    intensity: "medium",
    cooldownMs: 180000,
    allowTextFallback: true,
  },
  "portal.galaxy": {
    key: "portal.galaxy",
    text: "Let’s widen the view.",
    audioPath: "/assets/audio/voice/genesis/portals/galaxy.mp3",
    intensity: "low",
    cooldownMs: 12000,
    allowTextFallback: true,
  },
  "portal.mirror": {
    key: "portal.mirror",
    text: "Here’s the pattern, not the judgment.",
    audioPath: "/assets/audio/voice/genesis/portals/mirror.mp3",
    intensity: "low",
    cooldownMs: 12000,
    allowTextFallback: true,
  },
  "portal.shadow": {
    key: "portal.shadow",
    text: "We’ll keep the light on.",
    audioPath: "/assets/audio/voice/genesis/portals/shadow.mp3",
    intensity: "low",
    cooldownMs: 12000,
    allowTextFallback: true,
  },
  "portal.legacy": {
    key: "portal.legacy",
    text: "Some things are meant to be carried forward.",
    audioPath: "/assets/audio/voice/genesis/portals/legacy.mp3",
    intensity: "low",
    cooldownMs: 12000,
    allowTextFallback: true,
  },
  "portal.passport": {
    key: "portal.passport",
    text: "You decide what opens, what stays closed, and what belongs to you.",
    audioPath: "/assets/audio/voice/genesis/portals/passport.mp3",
    intensity: "medium",
    cooldownMs: 20000,
    allowTextFallback: true,
  },
  "ground.open": {
    key: "ground.open",
    text: "Return to what can hold you.",
    audioPath: "/assets/audio/voice/genesis/portals/ground.mp3",
    moodTags: ["heavy", "recovering", "calm"],
    intensity: "low",
    cooldownMs: 20000,
    allowTextFallback: true,
  },
  "mirror.open": {
    key: "mirror.open",
    text: "It looks like a pattern, not a verdict.",
    intensity: "low",
    cooldownMs: 20000,
    allowTextFallback: true,
  },
  "shadow.open": {
    key: "shadow.open",
    text: "We can look without getting lost.",
    moodTags: ["shadow"],
    intensity: "low",
    cooldownMs: 20000,
    allowTextFallback: true,
  },
  "legacy.open": {
    key: "legacy.open",
    text: "Memory becomes a thread when it is carried with care.",
    intensity: "low",
    cooldownMs: 20000,
    allowTextFallback: true,
  },
  "passport.open": {
    key: "passport.open",
    text: "You decide what belongs to you.",
    intensity: "low",
    cooldownMs: 20000,
    allowTextFallback: true,
  },
  "council.intro": {
    key: "council.intro",
    text: "The Council is not here to command you. It is here to help you notice.",
    audioPath: "/assets/audio/voice/genesis/council/intro.mp3",
    intensity: "medium",
    cooldownMs: 86400000,
    allowTextFallback: true,
  },
  "council.listening": {
    key: "council.listening",
    text: "I’m listening with the room quiet.",
    audioPath: "/assets/audio/voice/genesis/council/listening.mp3",
    intensity: "low",
    cooldownMs: 30000,
    allowTextFallback: true,
  },
  "council.closed": {
    key: "council.closed",
    text: "The door can stay closed until you want it open.",
    audioPath: "/assets/audio/voice/genesis/council/closed.mp3",
    intensity: "low",
    cooldownMs: 30000,
    allowTextFallback: true,
  },
  "settings.voiceEnabled": {
    key: "settings.voiceEnabled",
    text: "Voice is on. I’ll stay gentle.",
    audioPath: "/assets/audio/voice/genesis/settings/voice-enabled.mp3",
    intensity: "low",
    cooldownMs: 5000,
    allowTextFallback: true,
  },
  "settings.voiceDisabled": {
    key: "settings.voiceDisabled",
    text: "Voice is off.",
    audioPath: "/assets/audio/voice/genesis/settings/voice-disabled.mp3",
    intensity: "low",
    cooldownMs: 5000,
    allowTextFallback: true,
  },
  "mood.calm": {
    key: "mood.calm",
    text: "Everything can stay simple for a moment.",
    moodTags: ["calm"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.heavy": {
    key: "mood.heavy",
    text: "We can make this lighter, one layer at a time.",
    moodTags: ["heavy"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.focused": {
    key: "mood.focused",
    text: "I’ll keep the noise low.",
    moodTags: ["focused"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.anxious": {
    key: "mood.anxious",
    text: "Slow is enough right now.",
    moodTags: ["anxious"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.hopeful": {
    key: "mood.hopeful",
    text: "There’s movement here.",
    moodTags: ["hopeful"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.recovering": {
    key: "mood.recovering",
    text: "You’re not back at the beginning.",
    moodTags: ["recovering"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.shadow": {
    key: "mood.shadow",
    text: "We can look without getting lost.",
    moodTags: ["shadow"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.threshold": {
    key: "mood.threshold",
    text: "This is a doorway, not the whole story.",
    moodTags: ["threshold"],
    intensity: "medium",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
  "mood.luminous": {
    key: "mood.luminous",
    text: "Something in you is becoming visible.",
    moodTags: ["luminous"],
    intensity: "low",
    cooldownMs: 240000,
    allowTextFallback: true,
  },
};

export function getVoiceLine(key: string): UraiVoiceLine | null {
  return URAI_VOICE_LINES[key] ?? null;
}
