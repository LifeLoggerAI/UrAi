import type { CompanionMode, GenesisMoodState } from "./companionTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";

export type CompanionAvailableAction = "open_life_map" | "open_passport" | "open_ground";

export type PermissionedCompanionContext = {
  moodContext: string | null;
  memoryContext: string | null;
  relationshipContext: string | null;
  locationContext: string | null;
  audioTranscriptContext: string | null;
  calendarContext: string | null;
  gmailContext: string | null;
  deviceBehaviorContext: string | null;
  longTermPatternContext: string | null;
  availableActions: CompanionAvailableAction[];
  permissions: PassportContextPermissions;
  mode: CompanionMode;
  councilRoleId?: string;
};

type BuildPermissionedCompanionContextInput = {
  userId?: string;
  moodState?: GenesisMoodState;
  permissions?: Partial<PassportContextPermissions> | null;
  mode: CompanionMode;
  councilRoleId?: string;
};

export function buildPermissionedCompanionContext({ moodState = "luminous", permissions, mode, councilRoleId }: BuildPermissionedCompanionContextInput): PermissionedCompanionContext {
  const p = normalizePassportContextPermissions(permissions);

  return {
    moodContext: p.allowMoodContext ? `Visible mood state: ${moodState}.` : null,
    memoryContext: p.allowMemoryContext ? "Approved memory summary may be used when available." : null,
    relationshipContext: p.allowRelationshipContext ? "Approved relationship summary may be used when available." : null,
    locationContext: p.allowLocationContext ? "Approved location summary may be used when available." : null,
    audioTranscriptContext: p.allowAudioTranscriptContext ? "Approved transcript summary may be used when available." : null,
    calendarContext: p.allowCalendarContext ? "Approved calendar summary may be used when available." : null,
    gmailContext: p.allowGmailContext ? "Approved mail summary may be used when available." : null,
    deviceBehaviorContext: p.allowDeviceBehaviorContext ? "Approved device summary may be used when available." : null,
    longTermPatternContext: p.allowLongTermPatternContext ? "Approved pattern summary may be used when available." : null,
    availableActions: ["open_life_map", "open_passport", "open_ground"],
    permissions: p,
    mode,
    councilRoleId,
  };
}

export function summarizePermissionedContextForPrompt(context: PermissionedCompanionContext): string {
  const entries = [
    context.moodContext,
    context.memoryContext,
    context.relationshipContext,
    context.locationContext,
    context.audioTranscriptContext,
    context.calendarContext,
    context.gmailContext,
    context.deviceBehaviorContext,
    context.longTermPatternContext,
  ].filter((entry): entry is string => Boolean(entry));

  return entries.length > 0 ? entries.join("\n").slice(0, 1200) : "No private context is available.";
}
