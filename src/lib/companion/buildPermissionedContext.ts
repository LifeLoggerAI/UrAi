import type { CompanionMode, GenesisMoodState } from "./companionTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { PassportDataLayerId, PermissionedCompanionContext, UraiAISuggestedActionType } from "@/lib/ai/aiTypes";

export type CompanionAvailableAction = UraiAISuggestedActionType;

type SelectedContext = {
  selectedLifeMapStarId?: string;
  selectedGroundElementId?: string;
  selectedMirrorReflectionId?: string;
  selectedShadowReflectionId?: string;
  selectedLegacyItemId?: string;
  selectedRitualId?: string;
};

type BuildPermissionedCompanionContextInput = {
  userId?: string;
  passportProfile?: Partial<PassportContextPermissions> | null;
  permissions?: Partial<PassportContextPermissions> | null;
  moodState?: GenesisMoodState;
  lifeMapData?: unknown;
  groundData?: unknown;
  mirrorSession?: unknown;
  shadowSession?: unknown;
  legacyArchive?: unknown;
  rituals?: unknown;
  notifications?: unknown;
  selectedContext?: SelectedContext;
  mode: CompanionMode;
  councilRoleId?: string;
};

function layerIf(condition: boolean, layer: PassportDataLayerId, allowed: PassportDataLayerId[], blocked: PassportDataLayerId[]): void {
  if (condition) allowed.push(layer);
  else blocked.push(layer);
}

function selectedLabel(value?: string): string | null {
  return value ? "A selected item is visible by summary only." : null;
}

export function buildPermissionedCompanionContext({
  moodState = "luminous",
  passportProfile,
  permissions,
  selectedContext,
}: BuildPermissionedCompanionContextInput): PermissionedCompanionContext {
  const p = normalizePassportContextPermissions(passportProfile ?? permissions);
  const allowedLayers: PassportDataLayerId[] = [];
  const blockedLayers: PassportDataLayerId[] = [];

  layerIf(p.allowMoodContext, "mood", allowedLayers, blockedLayers);
  layerIf(p.allowMemoryContext, "life_map", allowedLayers, blockedLayers);
  layerIf(p.allowMemoryContext, "ground", allowedLayers, blockedLayers);
  layerIf(p.allowLongTermPatternContext, "mirror", allowedLayers, blockedLayers);
  layerIf(p.allowShadowCloudSync && p.allowLongTermPatternContext, "shadow", allowedLayers, blockedLayers);
  layerIf(p.allowLegacyCloudSync && p.allowLongTermPatternContext, "legacy", allowedLayers, blockedLayers);
  layerIf(p.allowMemoryContext, "rituals", allowedLayers, blockedLayers);
  layerIf(true, "notifications", allowedLayers, blockedLayers);
  layerIf(p.allowExportMetadataCloudSync, "exports", allowedLayers, blockedLayers);
  layerIf(true, "account", allowedLayers, blockedLayers);
  layerIf(p.allowGmailContext, "gmail", allowedLayers, blockedLayers);
  layerIf(p.allowLocationContext, "location", allowedLayers, blockedLayers);
  layerIf(p.allowAudioTranscriptContext, "transcripts", allowedLayers, blockedLayers);
  layerIf(p.allowRelationshipContext, "relationships", allowedLayers, blockedLayers);
  layerIf(false, "health", allowedLayers, blockedLayers);
  layerIf(p.allowDeviceBehaviorContext, "device_behavior", allowedLayers, blockedLayers);
  layerIf(p.allowCalendarContext, "calendar", allowedLayers, blockedLayers);
  layerIf(p.allowCompanionSessionMemory, "companion_memory", allowedLayers, blockedLayers);

  const availableActions: UraiAISuggestedActionType[] = [
    "open_life_map",
    "open_ground",
    "open_mirror",
    "open_passport",
    "open_settings",
    "start_ritual",
    "open_export_center",
    "none",
  ];
  if (p.allowShadowCloudSync) availableActions.push("open_shadow");
  if (p.allowLegacyCloudSync) availableActions.push("open_legacy");

  return {
    allowedLayers,
    blockedLayers,
    moodContext: p.allowMoodContext ? `Visible mood state: ${moodState}. This is a soft UI state, not a diagnosis.` : null,
    lifeMapContext: p.allowMemoryContext ? selectedLabel(selectedContext?.selectedLifeMapStarId) ?? "Life Map may be discussed only as approved memory summaries." : null,
    groundContext: p.allowMemoryContext ? selectedLabel(selectedContext?.selectedGroundElementId) ?? "Ground may be discussed as symbolic stability and roots, not private raw data." : null,
    mirrorContext: p.allowLongTermPatternContext ? selectedLabel(selectedContext?.selectedMirrorReflectionId) ?? "Mirror may reflect visible patterns with uncertainty." : null,
    shadowContext: p.allowShadowCloudSync && p.allowLongTermPatternContext ? selectedLabel(selectedContext?.selectedShadowReflectionId) ?? "Shadow is open by explicit permission; use only summaries and gentle boundaries." : null,
    legacyContext: p.allowLegacyCloudSync && p.allowLongTermPatternContext ? selectedLabel(selectedContext?.selectedLegacyItemId) ?? "Legacy is open by explicit permission; use only grounded chapter summaries." : null,
    ritualContext: p.allowMemoryContext ? selectedLabel(selectedContext?.selectedRitualId) ?? "Ritual suggestions may be gentle and optional." : null,
    notificationContext: "Notifications can be made quieter by user choice. No manipulative prompting.",
    exportContext: p.allowExportMetadataCloudSync ? "Export metadata may be discussed. Nothing leaves URAI without review approval." : null,
    accountContext: "Account mode may be discussed as local, anonymous, or signed in. Never expose internal IDs.",
    availableActions,
  };
}

export function summarizePermissionedContextForPrompt(context: PermissionedCompanionContext): string {
  const entries = [
    context.moodContext,
    context.lifeMapContext,
    context.groundContext,
    context.mirrorContext,
    context.shadowContext,
    context.legacyContext,
    context.ritualContext,
    context.notificationContext,
    context.exportContext,
    context.accountContext,
    context.blockedLayers.length ? `Closed layers: ${context.blockedLayers.join(", ")}. If asked, direct to Passport without describing their contents.` : null,
    `Available actions: ${context.availableActions.join(", ")}.`,
  ].filter((entry): entry is string => Boolean(entry));

  return entries.length > 0 ? entries.join("\n").slice(0, 1600) : "No private context is available.";
}
