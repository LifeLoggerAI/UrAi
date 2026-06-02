export type Category = "winter" | "spring" | "summer" | "autumn";

export type GenesisMoodState =
  | "calm"
  | "heavy"
  | "focused"
  | "anxious"
  | "hopeful"
  | "recovering"
  | "shadow"
  | "threshold"
  | "luminous"
  | "stable"
  | "creative"
  | "joyful"
  | "reflective"
  | "overstimulated"
  | "sad"
  | "angry"
  | "tired"
  | "off_rhythm"
  | "unknown";

export type OrbMessageRole = "user" | "assistant" | "system";
export type OrbMessageMode = "text" | "voice";

export interface ConversationInsight {
  id: string;
  userId: string;
  chatId?: string;
  insight: string;
  emotionTags: string[];
  memoryImportanceScore: number;
  createdAt: string;
  title?: string;
  summary?: string;
  confidence?: number;
  type?:
    | "mood"
    | "memory"
    | "relationship"
    | "ritual"
    | "pattern"
    | "system"
    | "reflection";
  metadata?: Record<string, unknown>;
}

export interface OrbMessage {
  id: string;
  role: OrbMessageRole;
  content: string;
  mode: OrbMessageMode;
  emotionTags: string[];
  createdAt: string;
  chatId?: string;
  userId?: string;
  ownerUid?: string;
  moodState?: GenesisMoodState | string;
  insights?: ConversationInsight[];
  metadata?: Record<string, unknown>;
}

export interface OrbChatContext {
  todayMoodState?: string;
  mentalLoadScore?: number;
  rhythmState?: string;
  lastNarratorInsight?: string;
  userTonePreference?: string;
  recentTimelineEvents?: string[];
  relationshipSignals?: string[];
  userId?: string;
  sessionId?: string;
  moodState?: GenesisMoodState | string;
  activeEnvironment?: string;
  currentView?: string;
  recentInsights?: ConversationInsight[];
  recentMessages?: OrbMessage[];
  metadata?: Record<string, unknown>;
}

export interface OrbChat {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
  messages?: OrbMessage[];
  context?: OrbChatContext;
  insights?: ConversationInsight[];
  metadata?: Record<string, unknown>;
}
