
import { UraiPassportProfile } from "@/lib/passport/passportTypes";
import {
  PassiveDataSourceId,
  PassiveIngestionAction,
  PassiveSourceStatus,
} from "./passiveDataTypes";
import { getPassiveSourceDefinition } from "./passiveSourceRegistry";

export function canIngestPassiveSource({
  sourceId,
  passportProfile,
  action,
  sourceStatus,
}: {
  sourceId: PassiveDataSourceId;
  passportProfile: UraiPassportProfile | null | undefined;
  action: PassiveIngestionAction;
  sourceStatus?: PassiveSourceStatus;
}): {
  allowed: boolean;
  reason?: string;
} {
  const source = getPassiveSourceDefinition(sourceId);

  if (!source) {
    return { allowed: false, reason: "Source not found" };
  }

  if (sourceStatus?.status === "disabled" || sourceStatus?.paused) {
    return { allowed: false, reason: "Source disabled or paused" };
  }

  if (source.requiresExplicitPermission && !passportProfile?.dataLayers[source.passportLayerId]?.isOpen) {
    return { allowed: false, reason: "Passport permission required" };
  }

  switch (action) {
    case "sync_cloud":
      if (!source.supportsCloudSync || !passportProfile?.settings.cloudSyncEnabled) {
        return { allowed: false, reason: "Cloud sync not supported or not enabled" };
      }
      break;
    case "use_ai":
      if (!passportProfile?.dataLayers.aiCompanion?.isOpen) {
        return { allowed: false, reason: "AI Companion layer not open" };
      }
      break;
    case "use_lifemap":
      if (!passportProfile?.dataLayers.lifeMap?.isOpen) {
        return { allowed: false, reason: "Life Map layer not open" };
      }
      break;
    case "use_mirror":
      if (!passportProfile?.dataLayers.mirror?.isOpen) {
        return { allowed: false, reason: "Mirror layer not open" };
      }
      break;
    case "use_shadow":
      if (!passportProfile?.dataLayers.shadow?.isOpen) {
        return { allowed: false, reason: "Shadow layer not open" };
      }
      break;
    case "use_legacy":
      if (!passportProfile?.dataLayers.legacy?.isOpen) {
        return { allowed: false, reason: "Legacy layer not open" };
      }
      break;
    case "export":
      if (!passportProfile?.dataLayers.export?.isOpen) {
        return { allowed: false, reason: "Export layer not open" };
      }
      break;
    case "store_local":
        if (source.rawDataAllowed && !sourceStatus?.rawDataOptIn) {
            return { allowed: false, reason: "Raw data storage not opted in" };
        }
  }

  return { allowed: true };
}
