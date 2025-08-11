import { FieldValue } from "firebase-admin/firestore";

export function deriveStarKindFromInsight(type: string): string {
  const map: Record<string,string> = {
    mood_shift: "mood",
    ritual: "ritual",
    social: "social",
    dream: "dream",
  };
  return map[type] ?? "general";
}

export function baseAudit(uid: string) {
  return { _updatedAt: FieldValue.serverTimestamp(), _by: uid };
}
