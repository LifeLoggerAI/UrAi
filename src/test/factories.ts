import { DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { CompanionMessage } from "@/lib/companion/companionTypes";
import type { DemoProfile } from "@/lib/demo/demoTypes";

export function makePassportProfile(overrides: Partial<PassportContextPermissions> = {}): PassportContextPermissions {
  return { ...DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, ...overrides };
}
export const makeLifeMapStar = (overrides = {}) => ({ id: "star-safe", title: "Sample Star", summary: "Safe summary", sample: true, ...overrides });
export const makeGroundElement = (overrides = {}) => ({ id: "ground-safe", title: "Sample Root", note: "Safe note", sample: true, ...overrides });
export const makeMirrorReflection = (overrides = {}) => ({ id: "mirror-safe", text: "Safe reflection", sample: true, ...overrides });
export const makeShadowReflection = (overrides = {}) => ({ id: "shadow-safe", sealed: true, mode: "soft", summary: "Soft summary", sample: true, ...overrides });
export const makeLegacyItem = (overrides = {}) => ({ id: "legacy-safe", approved: false, sealed: true, summary: "Safe summary", sample: true, ...overrides });
export const makeRitual = (overrides = {}) => ({ id: "ritual-safe", title: "One Breath", prompt: "Breathe once", sample: true, ...overrides });
export const makeExportArtifact = (overrides = {}) => ({ id: "export-safe", userApproved: false, exportAllowed: false, sourceLayerIds: ["memory"], summary: "Safe summary", ...overrides });
export const makeNotification = (overrides = {}) => ({ id: "notification-safe", title: "URAI", body: "A gentle check-in is available.", sensitive: false, ...overrides });
export function makeCompanionMessage(overrides: Partial<CompanionMessage> = {}): CompanionMessage {
  return { id: "message-safe", role: "urai", mode: "companion", text: "I’m here.", createdAt: "2026-06-03T00:00:00.000Z", moodState: "luminous", source: "systemWhisper", ...overrides };
}
export function makeDemoProfile(overrides: Partial<DemoProfile> = {}): DemoProfile {
  return { id: "public", mode: "public_demo", title: "URAI Genesis", description: "Sample demo", sensitivity: "synthetic", createdAt: "2026-06-03T00:00:00.000Z", allowCompanion: true, allowLifeMap: true, allowGround: true, allowMirror: true, allowShadow: false, allowLegacy: true, allowExports: false, allowWaitlist: true, ...overrides };
}
