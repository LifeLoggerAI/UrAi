import type { CompanionMessage } from "@/lib/companion/companionTypes";
import type { PermissionedCompanionContext } from "./aiTypes";

export type AIChatMessage = { role: "system" | "user" | "assistant"; content: string };

function contextLine(label: string, value?: string | null): string | null {
  if (!value) return null;
  return `- ${label}: ${value.slice(0, 220)}`;
}

function summarizeContext(context: PermissionedCompanionContext): string {
  const lines = [
    "Visible context:",
    contextLine("Mood", context.moodContext),
    contextLine("Life Map", context.lifeMapContext),
    contextLine("Ground", context.groundContext),
    contextLine("Mirror", context.mirrorContext),
    contextLine("Shadow", context.shadowContext),
    contextLine("Legacy", context.legacyContext),
    contextLine("Ritual", context.ritualContext),
    contextLine("Notifications", context.notificationContext),
    contextLine("Exports", context.exportContext),
    contextLine("Account", context.accountContext),
    context.blockedLayers.length ? `- Passport: These layers are closed: ${context.blockedLayers.join(", ")}.` : "- Passport: No extra private layers are open by default.",
    `Available actions: ${context.availableActions.join(", ") || "none"}.`,
  ].filter((line): line is string => Boolean(line));
  return lines.join("\n").slice(0, 1600);
}

function mapRecentMessage(message: CompanionMessage): AIChatMessage | null {
  const content = message.text.replace(/\s+/g, " ").trim().slice(0, 260);
  if (!content) return null;
  if (message.role === "user") return { role: "user", content };
  if (message.role === "urai") return { role: "assistant", content };
  return null;
}

export function buildAIRequestMessages({
  systemPrompt,
  userMessage,
  context,
  recentMessages,
  conversationSummary,
}: {
  systemPrompt: string;
  userMessage: string;
  context: PermissionedCompanionContext;
  recentMessages?: CompanionMessage[];
  conversationSummary?: string;
}): AIChatMessage[] {
  const messages: AIChatMessage[] = [
    { role: "system", content: systemPrompt.slice(0, 2400) },
    { role: "system", content: summarizeContext(context) },
  ];

  if (conversationSummary) {
    messages.push({ role: "system", content: `Conversation summary, if user allowed it: ${conversationSummary.slice(0, 700)}` });
  }

  const safeRecent = (recentMessages ?? []).slice(-6).map(mapRecentMessage).filter((entry): entry is AIChatMessage => Boolean(entry));
  messages.push(...safeRecent);
  messages.push({ role: "user", content: userMessage.slice(0, 500) });
  return messages;
}
