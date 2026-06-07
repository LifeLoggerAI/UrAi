import type { CompanionMode, GenesisMoodState } from "./companionTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { PassportDataLayerId, PermissionedCompanionContext, UraiAISuggestedActionType } from "@/lib/ai/aiTypes";
import { canSendLayerToAI, type PrivacyLayerId } from "@/lib/privacy/privacyRulesEngine";

export type { PermissionedCompanionContext } from "@/lib/ai/aiTypes";
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

function aiAllowed(layer: PrivacyLayerId, profile: PassportContextPermissions): boolean {
  return canSendLayerToAI(layer, profile);
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

  const allowMood = aiAllowed("mood", p);
  const allowMemory = aiAllowed("memory", p);
  const allowMirror = aiAllowed("longTermPattern", p);
  const allowShadow = aiAllowed("shadow", p);
  const allowLegacy = aiAllowed("legacy", p);
  const allowExports = aiAllowed("exports", p);
  const allowGmail = aiAllowed("gmail", p);
  const allowLocation = aiAllowed("location", p);
  const allowTranscripts = aiAllowed("transcripts", p);
  const allowRelationships = aiAllowed("relationships", p);
  const allowDevice = aiAllowed("deviceBehavior", p);
  const allowCalendar = aiAllowed("calendar", p);
  const allowCompanionMemory = aiAllowed("companionMemory", p);

  layerIf(allowMood, "mood", allowedLayers, blockedLayers);
  layerIf(allowMemory, "life_map", allowedLayers, blockedLayers);
  layerIf(allowMemory, "ground", allowedLayers, blockedLayers);
  layerIf(allowMirror, "mirror", allowedLayers, blockedLayers);
  layerIf(allowShadow, "shadow", allowedLayers, blockedLayers);
  layerIf(allowLegacy, "legacy", allowedLayers, blockedLayers);
  layerIf(allowMemory, "rituals", allowedLayers, blockedLayers);
  layerIf(true, "notifications", allowedLayers, blockedLayers);
  layerIf(allowExports, "exports", allowedLayers, blockedLayers);
  layerIf(true, "account", allowedLayers, blockedLayers);
  layerIf(allowGmail, "gmail", allowedLayers, blockedLayers);
  layerIf(allowLocation, "location", allowedLayers, blockedLayers);
  layerIf(allowTranscripts, "transcripts", allowedLayers, blockedLayers);
  layerIf(allowRelationships, "relationships", allowedLayers, blockedLayers);
  layerIf(false, "health", allowedLayers, blockedLayers);
  layerIf(allowDevice, "device_behavior", allowedLayers, blockedLayers);
  layerIf(allowCalendar, "calendar", allowedLayers, blockedLayers);
  layerIf(allowCompanionMemory, "companion_memory", allowedLayers, blockedLayers);

  const availableActions: UraiAISuggestedActionType[] = ["open_life_map", "open_ground", "open_mirror", "open_passport", "open_settings", "start_ritual", "open_export_center", "none"];
  if (allowShadow) availableActions.push("open_shadow");
  if (allowLegacy) availableActions.push("open_legacy");

  return {
    allowedLayers,
    blockedLayers,
    moodContext: allowMood ? `Visible mood state: ${moodState}. This is a soft UI state, not a diagnosis.` : null,
    lifeMapContext: allowMemory ? selectedLabel(selectedContext?.selectedLifeMapStarId) ?? "Life Map may be discussed only as approved memory summaries." : null,
    groundContext: allowMemory ? selectedLabel(selectedContext?.selectedGroundElementId) ?? "Ground may be discussed as symbolic stability and roots, not private raw data." : null,
    mirrorContext: allowMirror ? selectedLabel(selectedContext?.selectedMirrorReflectionId) ?? "Mirror may reflect visible patterns with uncertainty." : null,
    shadowContext: allowShadow ? selectedLabel(selectedContext?.selectedShadowReflectionId) ?? "Shadow is open by explicit permission; use only summaries. This is a reflection, not a verdict." : null,
    legacyContext: allowLegacy ? selectedLabel(selectedContext?.selectedLegacyItemId) ?? "Legacy is open by explicit permission; nothing is carried forward unless the user chooses." : null,
    ritualContext: allowMemory ? selectedLabel(selectedContext?.selectedRitualId) ?? "Ritual suggestions may be gentle and optional." : null,
    notificationContext: "Notifications can be made quieter by user choice. No sensitive details or Shadow content in notification copy.",
    exportContext: allowExports ? "Export metadata may be discussed. Nothing leaves URAI without review approval." : null,
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
    context.blockedLayers.length ? `Closed layers: ${context.blockedLayers.join(", ")}. If asked, say: That layer is closed in Passport.` : null,
    `Available actions: ${context.availableActions.join(", ")}.`,
  ].filter((entry): entry is string => Boolean(entry));

  return entries.length > 0 ? entries.join("\n").slice(0, 1600) : "No private context is available.";
}
