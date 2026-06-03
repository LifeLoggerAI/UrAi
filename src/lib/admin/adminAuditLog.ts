import { addDoc, collection } from "firebase/firestore";
import { getUraiFirebaseClient } from "@/lib/firebase/firebaseClient";

export type AdminAuditLogInput = { userId?: string; action: string; target: string; createdAt?: string };

export async function recordAdminAction({ userId, action, target, createdAt = new Date().toISOString() }: AdminAuditLogInput): Promise<void> {
  if (!userId || !action || !target) return;
  const { db } = getUraiFirebaseClient();
  if (!db) return;
  try {
    await addDoc(collection(db, "admin/auditLog/entries"), { userId, action, target, createdAt });
  } catch {
    return;
  }
}
