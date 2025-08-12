import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { deriveStarKindFromInsight, baseAudit, clamp, ema } from "./enrich";
import fetch from "node-fetch";
import { onDocumentWritten, Change, DocumentSnapshot, FirestoreEvent } from "firebase-functions/v2/firestore";
import { onSchedule, ScheduledEvent } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";


admin.initializeApp();
const db = admin.firestore();

interface InsightDocument {
  type: string;
  uid: string;
  ts?: admin.firestore.FieldValue;
  text?: string;
}

// 1) Enrich insights into starMapEvents
export const onInsightWrite = onDocumentWritten(
  "insights/{id}",
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { id: string }>) => {
    if (!event.data || !event.data.after || !event.data.after.exists) return;
    const afterData = event.data.after.data() as InsightDocument; // Cast to InsightDocument
    if (!afterData) return; 

    const kind = deriveStarKindFromInsight(afterData.type);
    const starRef = db.collection("starMapEvents").doc(event.params.id);
    await starRef.set({
      uid: afterData.uid,
      ts: afterData.ts ?? admin.firestore.FieldValue.serverTimestamp(),
      kind,
      summary: (afterData.text || "Insight" ).slice(0, 200),
      ...baseAudit(afterData.uid)
    }, { merge: true });
  }
);

// 2) Original Nightly forecast (placeholder)
export const nightlyForecast = onSchedule("0 3 * * *", async (event: ScheduledEvent) => {
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
    return; // Changed to return void
  });

// 3) HTTP health endpoint
export const health = onRequest(async (_req, res) => {
  try {
    const now = new Date().toISOString();
    const cfg = await db.collection("appConfig").doc("public").get();
    res.status(200).json({ timestamp: now, firebase: cfg.exists ? "OK" : "MISSING_CONFIG", overall: cfg.exists ? "PASS" : "WARN" });
  } catch (e:any) {
    res.status(500).json({ overall: "FAIL", error: e?.message || String(e) });
  }
});

// 4) Derive shadow tensions from recent events (placeholder)
export const computeShadowWeekly = onSchedule("0 4 * * 1", async (event: ScheduledEvent) => {
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
    return; // Changed to return void
  });

/** 11.4.1 Scheduled Forecast — calls external API and writes an `insights:forecast` */
export const nightlyForecastPro = onSchedule("0 2 * * *", async (event: ScheduledEvent) => {
    const url = functions.config().urai?.forecast_api_url as string | undefined;
    const key = functions.config().urai?.forecast_api_key as string | undefined;
    if(!url || !key) { console.warn("Forecast API not configured"); return; } // Changed to return void

    // Pull a recent sample of moods to send (small payload)
    const snap = await db.collection("moods").orderBy("ts","desc").limit(50).get();
    const series = snap.docs.map(d=>d.data());

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":`Bearer ${key}` },
      body: JSON.stringify({ series })
    });
    const data = await res.json().catch(()=>({ forecastText:"Unavailable", confidence:0.3 }));

    await db.collection("insights").add({
      uid: series[0]?.uid ?? "system",
      ts: admin.firestore.FieldValue.serverTimestamp(),
      type: "forecast",
      text: data.forecastText ?? "Forecast unavailable",
      confidence: typeof data.confidence === "number" ? data.confidence : 0.5
    });

    return; // Changed to return void
  });

/** 11.4.2 onVoiceEventWrite — derive relationship tone + memory strength */
export const onVoiceEventWrite = onDocumentWritten(
  "voiceEvents/{id}",
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { id: string }>) => {
    if (!event.data || !event.data.after || !event.data.after.exists) return;
    const v = event.data.after.data();
    if (!v) return; // Add this check

    const uid = v.uid as string;
    // Heuristics: tone score from tags (replace with real model later)
    const tone = (v.tags || []).includes("conflict") ? -0.5 : (v.tags || []).includes("support") ? 0.5 : 0.0;

    const peerId = (v.tags || []).find((t:string)=>t.startsWith("peer:"))?.slice(5) || "unknown";
    const relRef = db.collection("relationships").doc(`${uid}__${peerId}`);
    const rel = await relRef.get();

    const prev = rel.exists ? rel.data() : undefined;
    const avgTone = ema(prev?.avgTone, tone, 0.3);
    const strength = clamp((prev?.voiceMemoryStrength ?? 20) + (tone>=0?2:1), 0, 100);

    await relRef.set({
      uid, peerId,
      voiceMemoryStrength: strength,
      avgTone,
      lastHeardAt: v.startedAt ?? admin.firestore.FieldValue.serverTimestamp(),
      stats: {
        calls: (prev?.stats?.calls ?? 0) + 1,
        durationMs: (prev?.stats?.durationMs ?? 0) + (v.durationMs || 0)
      },
      ...baseAudit(uid)
    }, { merge: true });

    // Optional: create a star map event on notable changes
    if(Math.abs(tone) >= 0.5) {
      await db.collection("starMapEvents").add({
        uid,
        ts: v.startedAt ?? admin.firestore.FieldValue.serverTimestamp(),
        kind: "social",
        summary: tone < 0 ? `Tension with ${peerId}` : `Support from ${peerId}`,
        ...baseAudit(uid)
      });
    }
  });

/** 11.4.3 Companion Auto‑Update — reacts to daily mood delta */
export const onMoodWriteUpdateCompanion = onDocumentWritten(
  "moods/{id}",
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { id: string }>) => {
    if (!event.data || !event.data.after || !event.data.after.exists) return;
    const m = event.data.after.data();
    if (!m) return; // Add this check

    const uid = m.uid as string;

    const latestSnap = await db.collection("moods").where("uid","==",uid).orderBy("ts","desc").limit(2).get();
    const [cur, prev] = latestSnap.docs.map(d=>d.data());
    const delta = prev ? (cur.val - prev.val) : 0;

    // Simple mapping to archetype/mood (replace with richer logic later)
    let archetype = "Guide"; let mood = "neutral";
    if(delta >= 10) { archetype = "Champion"; mood = "uplifted"; }
    else if(delta <= -10) { archetype = "Guardian"; mood = "protective"; }

    await db.collection("companionState").doc(uid).set({
      uid,
      mood,
      archetype,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      ...baseAudit(uid)
    }, { merge: true });
  });

/** 11.4.4 suggestRituals — callable that writes to ritualSuggestions */
export const suggestRituals = onCall(async (event: CallableRequest) => {
    if(!event.auth?.uid) throw new HttpsError("unauthenticated", "Sign in required");
    const uid = event.auth.uid;
    const data = event.data; // Access data from event.data

    // Read latest state
    const moods = await db.collection("moods").where("uid","==",uid).orderBy("ts","desc").limit(7).get();
    const rels = await db.collection("relationships").where("uid","==",uid).orderBy("lastHeardAt","desc").limit(5).get();

    const avg7 = moods.docs.length ? Math.round(moods.docs.reduce((a,m)=>a+(m.data().val||0),0)/moods.docs.length) : 0;
    const hasSupport = rels.docs.some(r => (r.data().avgTone ?? 0) > 0.2);

    // Heuristic suggestion (swap to model call later)
    const suggestion = hasSupport
      ? { title: "Gratitude Call", steps:["Message a supportive friend","Name one thing you appreciated today"], confidence: 0.72 }
      : { title: "Evening Reset Walk", steps:["10‑minute walk","3 deep breaths at halfway","Log how you feel"], confidence: 0.64 };

    const reason = avg7 < 0 ? "Recent dip in average mood" : "Maintain positive momentum";

    const ref = await db.collection("ritualSuggestions").add({
      uid,
      ts: admin.firestore.FieldValue.serverTimestamp(),
      reason,
      suggestion,
      _updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { id: ref.id, ...suggestion };
});
