import * as admin from "firebase-admin";

export async function healthCheck() {
  const db = admin.firestore();
  const now = new Date().toISOString();
  // lightweight read
  const cfg = await db.collection("appConfig").doc("public").get();
  return {
    timestamp: now,
    firebase: cfg.exists ? "OK" : "MISSING_CONFIG",
    overall: cfg.exists ? "PASS" : "WARN"
  } as const;
}
