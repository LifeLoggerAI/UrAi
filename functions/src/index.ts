import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { deriveStarKindFromInsight, baseAudit } from "./enrich";

admin.initializeApp();
const db = admin.firestore();

// 1) Enrich insights into starMapEvents
export const onInsightWrite = functions.firestore
  .document("insights/{id}")
  .onWrite(async (change, context) => {
    const after = change.after.exists ? change.after.data() : null;
    if (!after) return;

    const kind = deriveStarKindFromInsight(after.type);
    const starRef = db.collection("starMapEvents").doc(context.params.id);
    await starRef.set({
      uid: after.uid,
      ts: after.ts ?? admin.firestore.FieldValue.serverTimestamp(),
      kind,
      summary: (after.text || "Insight" ).slice(0, 200),
      ...baseAudit(after.uid)
    }, { merge: true });
  });

// 2) Nightly forecast (placeholder — extend w/ model call)
export const nightlyForecast = functions.pubsub
  .schedule("0 3 * * *") // 03:00 UTC
  .timeZone("UTC")
  .onRun(async () => {
    const snap = await db.collection("moods").orderBy("ts", "desc").limit(1).get();
    const last = snap.docs[0]?.data();
    const forecastText = last ? `Continuation around ${last.val}` : "Insufficient data";
    await db.collection("insights").add({
      uid: last?.uid ?? "system",
      ts: admin.firestore.FieldValue.serverTimestamp(),
      type: "forecast",
      text: forecastText,
      confidence: 0.5
    });
    return null;
  });

// 3) HTTP health endpoint
export const health = functions.https.onRequest(async (_req, res) => {
  try {
    const now = new Date().toISOString();
    const cfg = await db.collection("appConfig").doc("public").get();
    res.status(200).json({ timestamp: now, firebase: cfg.exists ? "OK" : "MISSING_CONFIG", overall: cfg.exists ? "PASS" : "WARN" });
  } catch (e:any) {
    res.status(500).json({ overall: "FAIL", error: e?.message || String(e) });
  }
});

// 4) Derive shadow tensions from recent events (placeholder)
export const computeShadowWeekly = functions.pubsub
  .schedule("0 4 * * 1") // Mondays 04:00 UTC
  .timeZone("UTC")
  .onRun(async () => {
    const sevenDaysAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7*24*60*60*1000));
    const q = await db.collection("voiceEvents")
      .where("startedAt", ">=", sevenDaysAgo)
      .get();
    const score = Math.min(100, q.size * 3);
    await db.collection("shadowPatterns").add({
      uid: "system",
      window: "last7d",
      score,
      signals: { voiceEvents: q.size },
      _updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return null;
  });
