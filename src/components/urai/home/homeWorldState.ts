export type HomeWorldMode =
  | "idle"
  | "hover"
  | "listening"
  | "thinking"
  | "speaking"
  | "memory-ready"
  | "privacy-locked"
  | "threshold"
  | "offline";

export type HomeWorldState = {
  mode: HomeWorldMode;
  eyebrow: string;
  title: string;
  body: string;
  orbLabel: string;
  mood: "cyan" | "emerald" | "violet" | "amber" | "slate";
};

export const HOME_WORLD_STATES: Record<HomeWorldMode, HomeWorldState> = {
  idle: {
    mode: "idle",
    eyebrow: "Tier 5 · Home World Locked",
    title: "The home world is alive.",
    body: "Orb, sky, ground, avatar, privacy, and Memory Galaxy move as one system.",
    orbLabel: "URAI",
    mood: "cyan",
  },
  hover: {
    mode: "hover",
    eyebrow: "Tier 2 · Sky Gateway",
    title: "The sky can become a map.",
    body: "Enter Memory Galaxy through the world above you.",
    orbLabel: "Map",
    mood: "cyan",
  },
  listening: {
    mode: "listening",
    eyebrow: "Tier 4 · Companion Listening",
    title: "Speak softly. URAI is here.",
    body: "The companion listens without pressure.",
    orbLabel: "Listen",
    mood: "violet",
  },
  thinking: {
    mode: "thinking",
    eyebrow: "Pattern Field Active",
    title: "The signal is becoming meaning.",
    body: "URAI is holding context and turning fragments into a gentler map.",
    orbLabel: "Think",
    mood: "violet",
  },
  speaking: {
    mode: "speaking",
    eyebrow: "Narrator Ready",
    title: "A reflection is ready to surface.",
    body: "The orb answers calmly, with timing that respects your nervous system.",
    orbLabel: "Speak",
    mood: "emerald",
  },
  "memory-ready": {
    mode: "memory-ready",
    eyebrow: "Memory Galaxy Ready",
    title: "The sky remembers patterns.",
    body: "Memory, recovery, shadow, joy, and legacy are ready to open.",
    orbLabel: "Galaxy",
    mood: "cyan",
  },
  "privacy-locked": {
    mode: "privacy-locked",
    eyebrow: "Privacy Locked",
    title: "You control the whole field.",
    body: "Capture, voice, location, export, and deletion remain yours to govern.",
    orbLabel: "Lock",
    mood: "emerald",
  },
  threshold: {
    mode: "threshold",
    eyebrow: "Threshold Mode",
    title: "You do not have to cross alone.",
    body: "When life gets sharp, URAI softens the interface and holds only what matters.",
    orbLabel: "Hold",
    mood: "amber",
  },
  offline: {
    mode: "offline",
    eyebrow: "Local Field",
    title: "The world can stay quiet.",
    body: "URAI can remain calm and private even when cloud services are unavailable.",
    orbLabel: "Quiet",
    mood: "slate",
  },
};

export function glowForMood(mood: HomeWorldState["mood"]) {
  if (mood === "emerald") return "rgba(110,231,183,.62)";
  if (mood === "violet") return "rgba(196,181,253,.62)";
  if (mood === "amber") return "rgba(251,191,36,.52)";
  if (mood === "slate") return "rgba(148,163,184,.42)";
  return "rgba(186,230,253,.68)";
}
