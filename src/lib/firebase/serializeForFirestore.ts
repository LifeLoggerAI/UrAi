import type { ExportArtifact } from "@/lib/exports/exportTypes";
import type { GroundGardenData } from "@/lib/ground/groundTypes";
import type { LegacyArchive } from "@/lib/legacy/legacyTypes";
import type { LifeMapData } from "@/lib/lifemap/lifeMapTypes";
import type { MirrorSession } from "@/lib/mirror/mirrorTypes";
import type { OnboardingPreferences } from "@/lib/onboarding/onboardingTypes";
import type { ShadowSession } from "@/lib/shadow/shadowTypes";
import type { UraiRitual } from "@/lib/rituals/ritualTypes";
import type { UraiSettingsProfile } from "@/lib/settings/settingsTypes";

function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => clean(item)).filter((item) => item !== undefined) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([, item]) => item !== undefined).map(([key, item]) => [key, clean(item)])) as T;
  }
  return value;
}

function iso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return undefined;
}

export function serializePassportProfile<T extends Record<string, unknown>>(profile: T): T { return clean(profile); }
export function serializeSettingsProfile(profile: UraiSettingsProfile): UraiSettingsProfile { return clean({ ...profile, updatedAt: iso(profile.updatedAt) ?? new Date().toISOString() }); }
export function serializeOnboardingPreferences(preferences: OnboardingPreferences): OnboardingPreferences { return clean(preferences); }
export function serializeLifeMapData(data: LifeMapData): LifeMapData { return clean({ ...data, stars: data.stars.filter((star) => star.visibility !== "requires_permission" && star.visibility !== "hidden") }); }
export function serializeGroundData(data: GroundGardenData): GroundGardenData { return clean({ ...data, elements: data.elements.filter((element) => element.state !== "requires_permission" && element.state !== "hidden") }); }
export function serializeMirrorSession(session: MirrorSession): MirrorSession { return clean({ ...session, reflections: session.reflections.filter((reflection) => reflection.visible && !reflection.permissionRequired) }); }
export function serializeShadowSession(session: ShadowSession): ShadowSession { return clean({ ...session, reflections: session.reflections.filter((reflection) => reflection.visibility !== "hidden" && reflection.visibility !== "locked").map((reflection) => ({ ...reflection, title: reflection.softenedTitle ?? reflection.title, summary: reflection.softenedSummary ?? reflection.summary, visibility: reflection.visibility === "visible" ? "softened" : reflection.visibility })) }); }
export function serializeLegacyArchive(archive: LegacyArchive): LegacyArchive { return clean({ ...archive, items: archive.items.filter((item) => item.userApproved && item.visibility !== "requires_permission"), chapters: archive.chapters.filter((chapter) => chapter.userApproved) }); }
export function serializeRituals(rituals: UraiRitual[]): UraiRitual[] { return clean(rituals.filter((ritual) => ritual.status === "saved" || ritual.status === "completed" || ritual.status === "hidden")); }
export function serializeExportArtifact(artifact: ExportArtifact): ExportArtifact { return clean({ ...artifact, exportAllowed: artifact.exportAllowed && artifact.userApproved, privacyLevel: artifact.includesShadow ? "requires_review" : artifact.privacyLevel }); }
export function deserializeFirestoreRecord<T>(record: unknown): T | null { if (!record || typeof record !== "object") return null; const maybe = record as { data?: T }; return maybe.data ?? (record as T); }
