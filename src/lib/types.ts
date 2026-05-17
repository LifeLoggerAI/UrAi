export type Category = "winter" | "spring" | "summer" | "autumn";

export type OrbMessageMode = "text" | "voice";

export type OrbMessageRole = "user" | "assistant" | "system";

export type OrbMessage = {
  id: string;
  role: OrbMessageRole;
  content: string;
  mode: OrbMessageMode;
  emotionTags: string[];
  createdAt: string;
};

export type OrbChatContext = {
  todayMoodState?: string;
  mentalLoadScore?: number;
  rhythmState?: string;
  lastNarratorInsight?: string;
  userTonePreference?: string;
  recentTimelineEvents?: string[];
  relationshipSignals?: string[];
};

export type OrbChat = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
};

export type ConversationInsight = {
  id: string;
  userId: string;
  chatId?: string;
  insight: string;
  emotionTags: string[];
  memoryImportanceScore: number;
  createdAt: string;
};
