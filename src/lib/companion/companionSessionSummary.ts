import type { CompanionMessage } from "./companionTypes";
import type { PassportContextPermissions } from "@/lib/passport/passportContextTypes";

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, 220);
}

export function shouldStoreCompanionSummary(passportProfile?: Partial<PassportContextPermissions> | null): boolean {
  return Boolean(passportProfile?.allowCompanionSessionMemory);
}

export function summarizeCompanionSession(messages: CompanionMessage[]): string {
  const safeMessages = messages
    .filter((message) => message.role === "user" || message.role === "urai")
    .slice(-8)
    .map((message) => `${message.role === "user" ? "User" : "URAI"}: ${clean(message.text)}`)
    .join(" ");
  return safeMessages.slice(0, 700);
}

export function updateSessionSummary(previousSummary: string | undefined, newMessages: CompanionMessage[]): string {
  const next = summarizeCompanionSession(newMessages);
  return [previousSummary, next].filter(Boolean).join(" ").slice(0, 900);
}
