export type EmotionalTone =
  | "calm"
  | "focused"
  | "tender"
  | "heavy"
  | "recovering"
  | "social"
  | "threshold"
  | "celebratory";

export type SymbolicTag =
  | "recovery"
  | "focus"
  | "social"
  | "ritual"
  | "threshold"
  | "dream"
  | "companion"
  | "bloom";

export type UserProfile = {
  id: string;
  handle: string;
  displayName: string;
  tagline: string;
  currentTone: EmotionalTone;
  companionName: string;
  createdAt: string;
};

export type TimelineEvent = {
  id: string;
  userId: string;
  occurredAt: string;
  title: string;
  detail: string;
  emotionalTone: EmotionalTone;
  symbolicTags: SymbolicTag[];
  intensity: number;
  bloomId?: string;
};

export type MemoryBloom = {
  id: string;
  userId: string;
  title: string;
  summary: string;
  emotionalTone: EmotionalTone;
  symbolicTags: SymbolicTag[];
  narratorLine: string;
};

export type MoodForecast = {
  id: string;
  userId: string;
  generatedAt: string;
  rhythmState: "stable" | "off-rhythm" | "overstimulated" | "recovering";
  summary: string;
  confidence: number;
  nextBestAction: string;
};

export type WeeklyReflection = {
  id: string;
  userId: string;
  weekOf: string;
  title: string;
  highlights: string[];
  narratorSummary: string;
};

export type SymbolicState = {
  id: string;
  userId: string;
  skyState: "clear" | "mist" | "stars" | "storm" | "dawn";
  groundTier: 1 | 2 | 3 | 4 | 5;
  aura: string;
  companionState: "quiet" | "listening" | "guiding" | "celebrating";
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp?: number;
  meta?: Record<string, unknown>;
};

export type CompanionChatOutput = {
  reply: string;
  moodTag: EmotionalTone;
  insights: string[];
};

export type UraiDemoProfile = {
  user: UserProfile;
  timelineEvents: TimelineEvent[];
  memoryBlooms: MemoryBloom[];
  moodForecast: MoodForecast;
  weeklyReflection: WeeklyReflection;
  symbolicState: SymbolicState;
};

export function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ChatMessage>;
  return (
    (candidate.role === "system" || candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

export function clampIntensity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
