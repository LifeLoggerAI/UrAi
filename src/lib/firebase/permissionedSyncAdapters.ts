import type { ExportArtifact } from "@/lib/exports/exportTypes";
import type { GroundGardenData } from "@/lib/ground/groundTypes";
import type { LegacyArchive } from "@/lib/legacy/legacyTypes";
import type { LifeMapData } from "@/lib/lifemap/lifeMapTypes";
import type { MirrorSession } from "@/lib/mirror/mirrorTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { UraiRitual } from "@/lib/rituals/ritualTypes";
import type { ShadowSession } from "@/lib/shadow/shadowTypes";
import {
  getExportArtifactsPath,
  getGroundElementsPath,
  getLegacyChaptersPath,
  getLegacyItemsPath,
  getLifeMapChaptersPath,
  getLifeMapStarsPath,
  getMirrorReflectionsPath,
  getRitualsPath,
  getShadowReflectionsPath,
} from "./firestoreCollections";
import {
  serializeExportArtifact,
  serializeGroundData,
  serializeLegacyArchive,
  serializeLifeMapData,
  serializeMirrorSession,
  serializeRituals,
  serializeShadowSession,
} from "./serializeForFirestore";

export type PermissionedSyncWrite<T> = {
  path: string;
  data: T;
  allowed: boolean;
  reason?: string;
};

function allowed(permissions?: Partial<PassportContextPermissions> | null): PassportContextPermissions {
  return normalizePassportContextPermissions(permissions);
}

export function buildLifeMapSyncWrites(userId: string, data: LifeMapData, permissions?: Partial<PassportContextPermissions> | null): Array<PermissionedSyncWrite<unknown>> {
  const p = allowed(permissions);
  if (!p.allowMemoryContext) return [{ path: getLifeMapStarsPath(userId), data: [], allowed: false, reason: "memory_context_closed" }];
  const safe = serializeLifeMapData(data);
  return [
    { path: getLifeMapStarsPath(userId), data: safe.stars, allowed: true },
    { path: getLifeMapChaptersPath(userId), data: safe.chapters ?? [], allowed: true },
  ];
}

export function buildGroundSyncWrites(userId: string, data: GroundGardenData, permissions?: Partial<PassportContextPermissions> | null): Array<PermissionedSyncWrite<unknown>> {
  const p = allowed(permissions);
  if (!p.allowMoodContext && !p.allowMemoryContext && !p.allowDeviceBehaviorContext) return [{ path: getGroundElementsPath(userId), data: [], allowed: false, reason: "ground_layers_closed" }];
  const safe = serializeGroundData(data);
  return [{ path: getGroundElementsPath(userId), data: safe.elements, allowed: true }];
}

export function buildMirrorSyncWrites(userId: string, session: MirrorSession, permissions?: Partial<PassportContextPermissions> | null): Array<PermissionedSyncWrite<unknown>> {
  const p = allowed(permissions);
  if (!p.allowLongTermPatternContext && !p.allowMoodContext && !p.allowMemoryContext) return [{ path: getMirrorReflectionsPath(userId), data: [], allowed: false, reason: "mirror_context_closed" }];
  const safe = serializeMirrorSession(session);
  return [{ path: getMirrorReflectionsPath(userId), data: safe.reflections, allowed: true }];
}

export function buildShadowSyncWrites(userId: string, session: ShadowSession, permissions?: Partial<PassportContextPermissions> | null): Array<PermissionedSyncWrite<unknown>> {
  const p = allowed(permissions);
  if (!p.allowShadowCloudSync) return [{ path: getShadowReflectionsPath(userId), data: [], allowed: false, reason: "shadow_cloud_sync_closed" }];
  const safe = serializeShadowSession(session);
  return [{ path: getShadowReflectionsPath(userId), data: safe.reflections, allowed: true }];
}

export function buildLegacySyncWrites(userId: string, archive: LegacyArchive, permissions?: Partial<PassportContextPermissions> | null): Array<PermissionedSyncWrite<unknown>> {
  const p = allowed(permissions);
  if (!p.allowLegacyCloudSync) return [{ path: getLegacyItemsPath(userId), data: [], allowed: false, reason: "legacy_cloud_sync_closed" }];
  const safe = serializeLegacyArchive(archive);
  return [
    { path: getLegacyItemsPath(userId), data: safe.items, allowed: true },
    { path: getLegacyChaptersPath(userId), data: safe.chapters, allowed: true },
  ];
}

export function buildRitualSyncWrites(userId: string, rituals: UraiRitual[], permissions?: Partial<PassportContextPermissions> | null): Array<PermissionedSyncWrite<unknown>> {
  const p = allowed(permissions);
  const safe = serializeRituals(rituals).filter((ritual) => {
    if (ritual.sourceLayerIds.includes("shadow")) return p.allowShadowCloudSync;
    if (ritual.sourceLayerIds.includes("legacy")) return p.allowLegacyCloudSync || p.allowMemoryContext;
    return true;
  });
  return [{ path: getRitualsPath(userId), data: safe, allowed: true }];
}

export function buildExportSyncWrites(userId: string, artifacts: ExportArtifact[], permissions?: Partial<PassportContextPermissions> | null): Array<PermissionedSyncWrite<unknown>> {
  const p = allowed(permissions);
  if (!p.allowExportMetadataCloudSync) return [{ path: getExportArtifactsPath(userId), data: [], allowed: false, reason: "export_metadata_sync_closed" }];
  const safe = artifacts.filter((artifact) => artifact.userApproved && artifact.exportAllowed).filter((artifact) => !artifact.includesShadow || p.allowShadowCloudSync).map(serializeExportArtifact);
  return [{ path: getExportArtifactsPath(userId), data: safe, allowed: true }];
}

export function buildCompanionSessionSyncWrite(userId: string, summary: { id: string; summary: string; createdAt: string }, permissions?: Partial<PassportContextPermissions> | null): PermissionedSyncWrite<unknown> {
  const p = allowed(permissions);
  if (!p.allowCompanionCloudSync || !p.allowCompanionSessionMemory) return { path: `users/${userId}/companion/sessions/${summary.id}`, data: null, allowed: false, reason: "companion_cloud_memory_closed" };
  return { path: `users/${userId}/companion/sessions/${summary.id}`, data: { id: summary.id, summary: summary.summary.slice(0, 500), createdAt: summary.createdAt }, allowed: true };
}
