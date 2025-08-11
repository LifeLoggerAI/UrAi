
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

export function clamp(n:number, min:number, max:number){ return Math.max(min, Math.min(max, n)); }
export function ema(prev:number|undefined, value:number, alpha=0.2){
  if(prev===undefined || isNaN(prev)) return value;
  return alpha*value + (1-alpha)*prev;
}
