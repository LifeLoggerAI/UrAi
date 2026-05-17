export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  timestamp?: number;
  meta?: Record<string, unknown>;
};

export type CompanionChatOutput = {
  reply: string;
  moodTag?: string;
  insights?: string[];
};

export function isChatRole(value: unknown): value is ChatRole {
  return value === "system" || value === "user" || value === "assistant";
}

export function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ChatMessage>;
  return isChatRole(candidate.role) && typeof candidate.content === "string";
}

export function normalizeChatMessage(value: unknown): ChatMessage | null {
  if (!isChatMessage(value)) return null;

  const timestamp = typeof value.timestamp === "number" && Number.isFinite(value.timestamp)
    ? value.timestamp
    : undefined;

  const meta = value.meta && typeof value.meta === "object" && !Array.isArray(value.meta)
    ? value.meta
    : undefined;

  return {
    role: value.role,
    content: value.content.trim().slice(0, 4000),
    ...(timestamp ? { timestamp } : {}),
    ...(meta ? { meta } : {}),
  };
}

export function normalizeChatHistory(history: unknown, maxMessages = 12): ChatMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .map(normalizeChatMessage)
    .filter((message): message is ChatMessage => Boolean(message && message.content))
    .slice(-maxMessages);
}

export function normalizeCompanionChatOutput(value: unknown): CompanionChatOutput {
  if (!value || typeof value !== "object") {
    return { reply: "I am listening. Keep it simple and tell me the next visible step." };
  }

  const candidate = value as Partial<CompanionChatOutput>;
  const reply = typeof candidate.reply === "string" && candidate.reply.trim()
    ? candidate.reply.trim()
    : "I am listening. Keep it simple and tell me the next visible step.";

  const moodTag = typeof candidate.moodTag === "string" && candidate.moodTag.trim()
    ? candidate.moodTag.trim()
    : undefined;

  const insights = Array.isArray(candidate.insights)
    ? candidate.insights.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).slice(0, 5)
    : undefined;

  return {
    reply,
    ...(moodTag ? { moodTag } : {}),
    ...(insights?.length ? { insights } : {}),
  };
}
