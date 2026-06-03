import type { GroundGardenData } from "@/lib/ground/groundTypes";
import type { LegacyArchive } from "@/lib/legacy/legacyTypes";
import type { LifeMapData } from "@/lib/lifemap/lifeMapTypes";
import type { MirrorSession } from "@/lib/mirror/mirrorTypes";
import type { ShadowSession } from "@/lib/shadow/shadowTypes";
import type { UraiRitual } from "@/lib/rituals/ritualTypes";
import { safeNotificationCopy } from "./buildNotificationCopy";
import type { UraiNotification, UraiNotificationType } from "./notificationTypes";

type BuildNotificationCandidatesInput = {
  ritualState?: { rituals?: UraiRitual[] } | null;
  groundData?: GroundGardenData | null;
  mirrorSession?: MirrorSession | null;
  shadowSession?: ShadowSession | null;
  legacyArchive?: LegacyArchive | null;
  lifeMapData?: LifeMapData | null;
  passportProfile?: { legacyEnabled?: boolean; shadowEnabled?: boolean; exportEnabled?: boolean } | null;
  companionState?: { idle?: boolean } | null;
};

const now = () => new Date().toISOString();

function candidate(input: {
  id: string;
  type: UraiNotificationType;
  sourceType: UraiNotification["sourceType"];
  sourceId?: string;
  priority?: UraiNotification["priority"];
  action?: UraiNotification["action"];
}): UraiNotification {
  const copy = safeNotificationCopy(input.type);
  return {
    id: input.id,
    type: input.type,
    title: copy.title,
    body: copy.body,
    priority: input.priority ?? "low",
    channels: ["in_app"],
    createdAt: now(),
    status: "draft",
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    sourceLayerIds: [input.sourceType === "shadow" ? "shadow" : input.sourceType === "legacy" ? "legacy" : input.sourceType === "ground" ? "recovery" : input.sourceType === "lifemap" ? "memory" : "system"],
    action: input.action,
  };
}

export function buildNotificationCandidates({ ritualState, groundData, mirrorSession, shadowSession, legacyArchive, lifeMapData, passportProfile, companionState }: BuildNotificationCandidatesInput = {}): UraiNotification[] {
  const candidates: UraiNotification[] = [];

  const savedRitual = ritualState?.rituals?.find((ritual) => ritual.status === "saved" || ritual.status === "started");
  if (savedRitual) candidates.push(candidate({ id: `notice-ritual-${savedRitual.id}`, type: "ritual_reminder", sourceType: "ritual", sourceId: savedRitual.id, priority: "normal", action: { label: "Open Ritual", type: "open_ritual" } }));

  const bloom = groundData?.elements?.find((element) => element.type === "recoveryBloom" || element.state === "blooming");
  if (bloom) candidates.push(candidate({ id: `notice-ground-${bloom.id}`, type: bloom.type === "recoveryBloom" ? "recovery_bloom" : "grounding_prompt", sourceType: "ground", sourceId: bloom.id, action: { label: "Open Ground", type: "open_ground" } }));

  const mirrorReflection = mirrorSession?.reflections?.find((reflection) => reflection.visible && !reflection.permissionRequired);
  if (mirrorReflection) candidates.push(candidate({ id: `notice-mirror-${mirrorReflection.id}`, type: "mirror_reflection", sourceType: "mirror", sourceId: mirrorReflection.id, action: { label: "Open Mirror", type: "open_mirror" } }));

  if (passportProfile?.shadowEnabled && shadowSession?.shadowConsentConfirmed) {
    candidates.push(candidate({ id: `notice-shadow-${shadowSession.id}`, type: "shadow_boundary", sourceType: "shadow", sourceId: shadowSession.id, action: { label: "Open Shadow", type: "open_shadow" } }));
  }

  const legacyItem = legacyArchive?.items?.find((item) => item.userApproved && item.visibility === "visible");
  if (passportProfile?.legacyEnabled && legacyItem) candidates.push(candidate({ id: `notice-legacy-${legacyItem.id}`, type: "legacy_prompt", sourceType: "legacy", sourceId: legacyItem.id, action: { label: "Open Legacy", type: "open_legacy" } }));

  const star = lifeMapData?.stars?.find((item) => item.visibility === "visible");
  if (star) candidates.push(candidate({ id: `notice-star-${star.id}`, type: "life_map_update", sourceType: "lifemap", sourceId: star.id, action: { label: "Open Life Map", type: "open_life_map" } }));

  if (passportProfile && !passportProfile.exportEnabled) candidates.push(candidate({ id: "notice-passport-export", type: "passport_review", sourceType: "passport", action: { label: "Open Passport", type: "open_passport" } }));
  if (companionState?.idle) candidates.push(candidate({ id: "notice-companion-idle", type: "companion_whisper", sourceType: "companion", action: { label: "Talk to URAI", type: "open_companion" } }));

  return candidates;
}
