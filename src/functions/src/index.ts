import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import * as crypto from "crypto";
import { withGuards } from "./middleware";

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
const storage = admin.storage().bucket();
const tts = new TextToSpeechClient();

export const narrate = onRequest({ region: "us-central1" }, withGuards(async (req, res) => {
  try {
    const {
      text = "Welcome to URAI.",
      clipId = "welcome",
      voice = "en-US-Neural2-C",
      languageCode = "en-US",
      speakingRate = 1.0,
      pitch = 0.0
    } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing text" });
    }

    const [resp] = await tts.synthesizeSpeech({
      input: { text },
      voice: { languageCode, name: voice },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: Number(speakingRate),
        pitch: Number(pitch),
        effectsProfileId: ["handset-class-device"]
      }
    });

    const audio = resp.audioContent as Buffer;
    if (!audio) return res.status(500).json({ error: "TTS failed" });

    const hash = crypto.createHash("sha1").update(text + voice + speakingRate + pitch).digest("hex").slice(0, 12);
    const path = `narration/${clipId}-${hash}.mp3`;

    const file = storage.file(path);
    await file.save(audio, {
      contentType: "audio/mpeg",
      metadata: { cacheControl: "public, max-age=31536000" }
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    return res.status(200).json({ url, path });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}));


export const narrateQueue = onRequest({ region: "us-central1" }, withGuards(async (req, res) => {
  try {
    const {
      items,
      voice = "en-US-Neural2-C",
      languageCode = "en-US",
      speakingRate = 1.0,
      pitch = 0.0,
      effectsProfileId = ["handset-class-device"]
    } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items must be a non-empty array of {clipId, text}" });
    }

    const results: Record<string, { url: string; path: string }> = {};

    for (const it of items) {
      const clipId = String(it.clipId || "clip").trim();
      const text = String(it.text || "").trim();
      if (!text) continue;

      const hash = crypto
        .createHash("sha1")
        .update(`${text}|${voice}|${speakingRate}|${pitch}`)
        .digest("hex")
        .slice(0, 12);

      const path = `narration/${clipId}-${hash}.mp3`;
      const file = storage.file(path);

      const [exists] = await file.exists();
      if (!exists) {
        const [resp] = await tts.synthesizeSpeech({
          input: { text },
          voice: { languageCode, name: voice },
          audioConfig: { audioEncoding: "MP3", speakingRate: Number(speakingRate), pitch: Number(pitch), effectsProfileId }
        });
        const audio = resp.audioContent as Buffer;
        if (!audio) throw new Error(`TTS failed for ${clipId}`);

        await file.save(audio, {
          contentType: "audio/mpeg",
          metadata: { cacheControl: "public, max-age=31536000" }
        });
      }

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 14 // 14 days
      });

      results[clipId] = { url, path };
    }

    return res.status(200).json({ results });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}));

async function synthToSignedUrl({
  text,
  clipId,
  voice = "en-US-Neural2-C",
  languageCode = "en-US",
  speakingRate = 1.03,
  pitch = 0.0
}: {
  text: string; clipId: string; voice?: string; languageCode?: string;
  speakingRate?: number; pitch?: number;
}) {
  const [resp] = await tts.synthesizeSpeech({
    input: { text },
    voice: { languageCode, name: voice },
    audioConfig: { audioEncoding: "MP3", speakingRate, pitch, effectsProfileId: ["handset-class-device"] }
  });
  const audio = resp.audioContent as Buffer;
  const hash = crypto.createHash("sha1").update(text + voice + speakingRate + pitch).digest("hex").slice(0, 12);
  const path = `narration/dummy/${clipId}-${hash}.mp3`;
  const file = storage.file(path);
  await file.save(audio, { contentType: "audio/mpeg", metadata: { cacheControl: "public, max-age=31536000" } });
  const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  return { path, url };
}

export const runDummyUser = onRequest({ region: "us-central1" }, withGuards(async (req, res) => {
  try {
    const userId = (req.body?.userId ?? "test-user-001") as string;
    const persona = (req.body?.persona ?? "gentle") as string;

    const actions = [
      { type: "scene-load", sky: "sky-neutral-01.mp4", ground: "ground-neutral-01.mp4" },
      { type: "narrate", text: "This is a test narration for Dummy User in URAI." },
      { type: "randomize-scene" },
      { type: "narrate", text: "Second narration to verify queue and playback." }
    ];

    const batch = db.bulkWriter();
    const ts = admin.firestore.FieldValue.serverTimestamp();
    for (const [i, a] of actions.entries()) {
      const ref = db.collection("events").doc();
      await batch.create(ref, { userId, persona, idx: i, action: a, createdAt: ts });
    }
    await batch.flush();

    const clip1 = await synthToSignedUrl({ text: actions[1].text!, clipId: "dummy-1" });
    const clip2 = await synthToSignedUrl({ text: actions[3].text!, clipId: "dummy-2" });

    return res.status(200).json({
      ok: true,
      userId,
      persona,
      events: actions,
      tts: [clip1, clip2],
      note: "Play these URLs in order to simulate narration; verify analytics in Firestore collection 'events'."
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}));

export { exportWorker } from './export';
