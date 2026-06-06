import type { PassportLayerId } from "@/lib/passport";
import {
  PassiveDataSourceId,
  PassiveIngestionAction,
  PassiveSourceStatus,
} from "./passiveDataTypes";
import { getPassiveSourceDefinition } from "./passiveSourceRegistry";

type PassportGate = {
  isLayerOpen?: (layerId: PassportLayerId) => boolean;
  getLayerStatus?: (layerId: PassportLayerId) => "open" | "closed" | "blocked";
};

function isPassportLayerOpen(
  passport: PassportGate | null | undefined,
  layerId: string | undefined
): boolean {
  if (!passport || !layerId) return false;

  const passportLayerId = layerId as PassportLayerId;

  if (typeof passport.isLayerOpen === "function") {
    return passport.isLayerOpen(passportLayerId);
  }

  if (typeof passport.getLayerStatus === "function") {
    return passport.getLayerStatus(passportLayerId) === "open";
  }

  return false;
}

export function canIngestPassiveSource({
  sourceId,
  passport,
  action,
  sourceStatus,
}: {
  sourceId: PassiveDataSourceId;
  passport: PassportGate | null | undefined;
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

  if (
    source.requiresExplicitPermission &&
    !isPassportLayerOpen(passport, source.passportLayerId)
  ) {
    return { allowed: false, reason: "Passport permission required" };
  }

  switch (action) {
    case "sync_cloud":
      return { allowed: false, reason: "Cloud sync is not enabled in this pass" };

    case "use_ai":
      if (!isPassportLayerOpen(passport, "intelligence")) {
        return { allowed: false, reason: "Intelligence layer not open" };
      }
      break;

    case "use_lifemap":
      if (!isPassportLayerOpen(passport, "lifemap")) {
        return { allowed: false, reason: "Life Map layer not open" };
      }
      break;

    case "use_mirror":
      if (!isPassportLayerOpen(passport, "mirror")) {
        return { allowed: false, reason: "Mirror layer not open" };
      }
      break;

    case "use_shadow":
      if (!isPassportLayerOpen(passport, "shadow")) {
        return { allowed: false, reason: "Shadow layer not open" };
      }
      break;

    case "use_legacy":
      if (!isPassportLayerOpen(passport, "legacy")) {
        return { allowed: false, reason: "Legacy layer not open" };
      }
      break;

    case "export":
      if (!isPassportLayerOpen(passport, "export")) {
        return { allowed: false, reason: "Export layer not open" };
      }
      break;

    case "store_local":
      if (source.rawDataAllowed && !sourceStatus?.rawDataOptIn) {
        return { allowed: false, reason: "Raw data storage not opted in" };
      }
      break;

    case "collect":
    default:
      break;
  }

  return { allowed: true };
}
