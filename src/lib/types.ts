export type Category = "winter" | "spring" | "summer" | "autumn";

export type OrbMessageMode = "text" | "voice";

export interface OrbChatContext {
  todayMoodState?: string;
  mentalLoadScore?: number;
  rhythmState?: string;
  lastNarratorInsight?: string;
  recentTimelineEvents?: string[];
  relationshipSignals?: string[];
  userTonePreference?: string;
}

export interface OrbMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: OrbMessageMode;
  emotionTags: string[];
  createdAt: string;
}

export interface OrbChat {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
}

export interface ConversationInsight {
  id: string;
  userId: string;
  insight: string;
  emotionTags: string[];
  score: number;
  createdAt: string;
}
