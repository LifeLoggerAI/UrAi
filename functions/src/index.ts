import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { deriveStarKindFromInsight, baseAudit, clamp, ema } from "./enrich";
import fetch from "node-fetch";
import { onDocumentWritten, Change, DocumentSnapshot, FirestoreEvent } from "firebase-functions/v2/firestore";
import { onSchedule, ScheduledEvent } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { runSeed } from "./seed";

// Export the seed function
export { runSeed };


// Import AI flow functions
import { summarizeText } from "./summarize-text";
import { analyzeDream } from "./analyze-dream";
import { companionChat } from "./companion-chat";
import { generateSpeech } from "./generate-speech";
import { generateSymbolicInsight } from "./generate-symbolic-insight";
import { suggestRitual } from "./suggest-ritual";
import { transcribeAudio } from "./transcribe-audio";
import { processOnboardingTranscript } from "./process-onboarding-transcript";
import { analyzeCameraImage } from "./analyze-camera-image";

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


/** 11.4.1 Scheduled Forecast — calls external API and writes an `insights:forecast` */
export const nightlyForecastPro = onSchedule("0 2 * * *", async (event: ScheduledEvent) => {
    const url = functions.config().urai?.forecast_api_url as string | undefined;
    const key = functions.config().urai?.forecast_api_key as string | undefined;
    if(!url || !key) { console.warn("Forecast API not configured"); return; } 

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

    return;
  });

/** 11.4.2 onVoiceEventWrite — derive relationship tone + memory strength */
export const onVoiceEventWrite = onDocumentWritten(
  "voiceEvents/{id}",
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { id: string }>) => {
    if (!event.data || !event.data.after || !event.data.after.exists) return;
    const v = event.data.after.data();
    if (!v) return; 

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
    if (!m) return; 

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
export const suggestRitualsCallable = onCall(async (data: any, context: any) => {
    if(!context.auth?.uid) throw new HttpsError("unauthenticated", "Sign in required");
    const uid = context.auth.uid;

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

// Callable functions for AI flows
export const generateSpeechFunction = onCall(async (request) => {
  try {
    const result = await generateSpeech(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const summarizeTextFunction = onCall(async (request) => {
  try {
    const result = await summarizeText(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const analyzeDreamFunction = onCall(async (request) => {
  try {
    const result = await analyzeDream(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const companionChatFunction = onCall(async (request) => {
  try {
    const result = await companionChat(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const generateSymbolicInsightFunction = onCall(async (request) => {
  try {
    const result = await generateSymbolicInsight(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const suggestRitualFunction = onCall(async (request) => {
  try {
    const result = await suggestRitual(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const transcribeAudioFunction = onCall(async (request) => {
  try {
    const result = await transcribeAudio(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const processOnboardingTranscriptFunction = onCall(async (request) => {
  try {
    const result = await processOnboardingTranscript(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});

export const analyzeCameraImageFunction = onCall(async (request) => {
  try {
    const result = await analyzeCameraImage(request.data);
    return result;
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});
