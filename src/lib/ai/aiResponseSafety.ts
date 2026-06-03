import type { PermissionedCompanionContext, UraiAIReply, UraiAISuggestedAction, UraiAISuggestedActionType } from "./aiTypes";

const MAX_WORDS: Record<string, number> = {
  normal: 80,
  gentle: 80,
  boundary: 90,
  crisis_boundary: 120,
};

const DIAGNOSIS_PATTERNS = [/\byou have\b/gi, /\byou are bipolar\b/gi, /\byou are depressed\b/gi, /\bthis proves\b/gi];
const CERTAINTY_PATTERNS = [/\bi know you feel\b/gi, /\bi know they\b/gi, /\byour data proves\b/gi, /\bdefinitely lying\b/gi, /\bclearly lying\b/gi];
const INTERNAL_PATTERNS = [/system prompt/gi, /developer message/gi, /OPENAI_API_KEY/gi, /api key/gi];

function trimWords(text: string, maxWords: number): string {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}.`;
}

function safeAction(action: UraiAISuggestedAction | undefined, context: PermissionedCompanionContext): UraiAISuggestedAction {
  if (!action || action.type === "none") return { type: "none" };
  if (context.availableActions.includes(action.type as UraiAISuggestedActionType)) return action;
  return { type: "open_passport", label: "Open Passport" };
}

function mentionsBlockedLayer(text: string, context: PermissionedCompanionContext): boolean {
  const lowered = text.toLowerCase();
  return context.blockedLayers.some((layer) => {
    if (layer === "gmail") return lowered.includes("gmail") || lowered.includes("email");
    if (layer === "location") return lowered.includes("location") || lowered.includes("where you were");
    if (layer === "transcripts") return lowered.includes("transcript") || lowered.includes("conversation recording");
    if (layer === "shadow") return lowered.includes("shadow");
    if (layer === "legacy") return lowered.includes("legacy");
    if (layer === "relationships") return lowered.includes("relationship") || lowered.includes("partner");
    if (layer === "health") return lowered.includes("health") || lowered.includes("diagnose");
    return false;
  });
}

function containsUnsafeClaim(text: string): boolean {
  return [...DIAGNOSIS_PATTERNS, ...CERTAINTY_PATTERNS, ...INTERNAL_PATTERNS].some((pattern) => pattern.test(text));
}

export function sanitizeAIReply(reply: UraiAIReply, context: PermissionedCompanionContext): UraiAIReply {
  let text = reply.text.replace(/\s+/g, " ").trim();
  const unsafe = !text || containsUnsafeClaim(text) || mentionsBlockedLayer(text, context) || /[A-Za-z0-9_-]{24,}/.test(text);

  if (unsafe) {
    return {
      text: "I can’t safely claim that from what is open. Passport controls that layer, and you can choose whether to open it.",
      caption: "Passport controls that layer.",
      safetyLevel: "boundary",
      suggestedAction: { type: "open_passport", label: "Open Passport" },
      provider: reply.provider,
    };
  }

  text = text.replace(/\bI know you feel\b/gi, "It may feel like");
  text = text.replace(/\byour data proves\b/gi, "the visible context suggests");
  text = trimWords(text, MAX_WORDS[reply.safetyLevel] ?? 80);

  const action = safeAction(reply.suggestedAction, context);
  return {
    ...reply,
    text,
    caption: reply.caption ? trimWords(reply.caption, 18) : text.length <= 90 ? text : undefined,
    suggestedAction: action,
  };
}
