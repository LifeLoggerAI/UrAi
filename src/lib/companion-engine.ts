import {
  normalizeChatHistory,
  type ChatMessage,
  type CompanionChatOutput,
} from "@/ai/schemas/chat";

export type CompanionRequestBody = {
  history?: unknown;
  message?: unknown;
};

export function normalizeCompanionHistory(history: unknown): ChatMessage[] {
  return normalizeChatHistory(history, 12);
}

export function normalizeCompanionMessage(message: unknown): string {
  return typeof message === "string" ? message.trim().slice(0, 2000) : "";
}

export function buildCompanionReply(message: string, history: ChatMessage[] = []): CompanionChatOutput {
  const trimmed = message.trim();
  const hasMomentumWords = /build|ship|repo|deploy|launch|implement|finish|commit|release/i.test(trimmed);
  const hasHeavyWords = /stuck|overwhelmed|tired|anxious|scared|lost|burned out|burnt out/i.test(trimmed);
  const hasVisionWords = /future|vision|category|investor|pitch|moat|roadmap/i.test(trimmed);

  if (hasHeavyWords) {
    return {
      reply:
        "I hear the weight in that. Make the next step small enough to move: name the one thing that would make today feel less tangled, then build from there.",
      moodTag: "tender",
      insights: ["Reduce scope before adding pressure.", "Use one visible next action as the recovery anchor."],
    };
  }

  if (hasMomentumWords) {
    return {
      reply:
        "Good. This is build energy. Keep it narrow: one route, one schema, one visible user moment. The constellation becomes real when someone can open it and feel it.",
      moodTag: "focused",
      insights: ["Implementation energy is rising.", "Ship the demo spine before expanding the symbolic layer."],
    };
  }

  if (hasVisionWords) {
    return {
      reply:
        "The vision is strong. Anchor it to one proof point: a person opens URAI, recognizes a pattern, and joins the waitlist because it feels personal.",
      moodTag: "threshold",
      insights: ["Translate vision into proof.", "A demo loop is stronger than another abstract layer."],
    };
  }

  return {
    reply:
      history.length > 0
        ? "I am still with you. The pattern I see is continuity: keep turning the idea into something visible, one calm layer at a time."
        : "I am listening. Start with what feels most alive right now, and I will help turn it into a clear next step.",
    moodTag: "calm",
    insights: ["Calm focus is the default state for this session.", "The next best move is one concrete implementation step."],
  };
}
