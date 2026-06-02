import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { LifeMapData, LifeMapStar } from "./lifeMapTypes";

type BuildPermissionedLifeMapInput = {
  userId?: string;
  moodState?: GenesisMoodState;
  permissionVersion?: number;
};

const CHAPTER_ID = "genesis";
const now = () => new Date().toISOString();

export function createSafeStarterStars(moodState: GenesisMoodState = "luminous"): LifeMapStar[] {
  const createdAt = now();
  return [
    { id: "system-genesis-opened", type: "system", title: "Genesis Opened", subtitle: "The sky became a doorway.", summary: "A safe app-state star for the opening scene.", createdAt, emotionalTone: moodState, intensity: "soft", visibility: "visible", x: 18, y: 46, z: 0, chapterId: CHAPTER_ID, sourceLayerId: "system", glyph: "✦" },
    { id: "passport-created", type: "passport", title: "Passport Created", subtitle: "Control stays with you.", summary: "A permission star for user-owned visibility.", createdAt, emotionalTone: moodState, intensity: "soft", visibility: "visible", x: 34, y: 30, z: 1, chapterId: CHAPTER_ID, sourceLayerId: "passport", glyph: "◉" },
    { id: "orb-woke", type: "system", title: "The Orb Woke", subtitle: "URAI is ready when you are.", summary: "A safe app-state star for the Companion layer.", createdAt, emotionalTone: moodState, intensity: "bright", visibility: "visible", x: 52, y: 54, z: 2, chapterId: CHAPTER_ID, sourceLayerId: "system", glyph: "●" },
    { id: "first-reflection", type: "system", title: "First Reflection", subtitle: "A quiet place to begin.", summary: "A symbolic starter moment for the first map view.", createdAt, emotionalTone: moodState, intensity: "quiet", visibility: "visible", x: 66, y: 36, z: 1, chapterId: CHAPTER_ID, sourceLayerId: "system", glyph: "◇" },
    { id: "life-map-waiting", type: "passport", title: "Life Map Waiting", subtitle: "Open layers only when you choose.", summary: "The map can stay quiet or grow through Passport controls.", createdAt, emotionalTone: moodState, intensity: "soft", visibility: "visible", x: 80, y: 58, z: 0, chapterId: CHAPTER_ID, sourceLayerId: "passport", glyph: "✧" },
  ];
}

export function buildPermissionedLifeMap(input: BuildPermissionedLifeMapInput = {}): LifeMapData {
  const moodState = input.moodState ?? "luminous";
  const stars = createSafeStarterStars(moodState);
  return {
    userId: input.userId,
    stars,
    chapters: [{ id: CHAPTER_ID, title: "Genesis", subtitle: "The map is quiet and safe.", startDate: stars[0]?.createdAt ?? now(), dominantMood: moodState, starIds: stars.map((star) => star.id), constellationStyle: "thread" }],
    generatedAt: now(),
    permissionVersion: input.permissionVersion ?? 1,
  };
}
