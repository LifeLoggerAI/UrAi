import {spawn} from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as admin from "firebase-admin";
import {setGlobalOptions} from "firebase-functions";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {
  AncientSignalCallableInput,
  computeAncientSignalPayload,
  mapRawAncientSignals,
  resolveRollupWindow,
} from "./ancientSignalCompute";
import {buildAncientSignalsFromPassiveRollups} from "./ancientPassiveRollups";

setGlobalOptions({maxInstances: 10});

if (!admin.apps.length) {
  admin.initializeApp();
}

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

export interface MovieDoc {
  durationSec?: number | null;
  renderProfile?: string | null;
  titlePngPath?: string | null;
  audioPath?: string | null;
}

export async function renderStoryMovieMP4(
  movieId: string,
  movie: MovieDoc
): Promise<{localOut: string}> {
  const total = Math.max(6, Math.min(movie.durationSec ?? 10, 120));
  const introDur = Math.max(1.5, Math.round(total * 0.2 * 10) / 10);
  const midDur = Math.max(3.0, Math.round(total * 0.6 * 10) / 10);
  const outroDur = Math.max(1.5, Math.round(total * 0.2 * 10) / 10);
  const xfDur = 0.6;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `urai-${movieId}-`));
  const outPath = path.join(tmpDir, "out.mp4");

  let titlePngLocal: string | null = null;
  if (movie.titlePngPath) {
    const pngFile = bucket.file(movie.titlePngPath);
    const [exists] = await pngFile.exists();
    if (exists) {
      titlePngLocal = path.join(tmpDir, "title.png");
      await pngFile.download({destination: titlePngLocal});
    }
  }

  let audioLocal: string | null = null;
  if (movie.audioPath) {
    const audioFile = bucket.file(movie.audioPath);
    const [exists] = await audioFile.exists();
    if (exists) {
      audioLocal = path.join(tmpDir, "track.mp3");
      await audioFile.download({destination: audioLocal});
    }
  }

  const args: string[] = ["-y"];
  args.push("-f", "lavfi", "-t", introDur.toFixed(3), "-i", "color=c=black:s=1920x1080:r=30");

  if (titlePngLocal) {
    args.push("-loop", "1", "-t", midDur.toFixed(3), "-i", titlePngLocal);
  } else {
    args.push("-f", "lavfi", "-t", midDur.toFixed(3), "-i", "color=c=black:s=1920x1080:r=30");
  }

  args.push("-f", "lavfi", "-t", outroDur.toFixed(3), "-i", "color=c=black:s=1920x1080:r=30");

  if (audioLocal) {
    args.push("-i", audioLocal);
  } else {
    args.push("-f", "lavfi", "-t", total.toFixed(3), "-i", "anullsrc=r=44100:cl=stereo");
  }

  const filterParts: string[] = [];
  if (titlePngLocal) {
    const midFrames = Math.round(midDur * 30);
    filterParts.push(
      "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease [mid_scaled]",
      "[mid_scaled]pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black [mid_padded]",
      `[mid_padded]zoompan=z='min(1.08,1+0.0005*n)':d=${midFrames}:fps=30 [mid_zoom]`,
      "[mid_zoom]format=yuv420p[v1]"
    );
  } else {
    filterParts.push("[1:v]format=yuv420p[v1]");
  }

  let videoLabel = "vout";
  const isV15 = (movie.renderProfile ?? "").toLowerCase() === "storymode_v1_5";
  if (isV15) {
    const off1 = Math.max(0, introDur - xfDur);
    const off2 = Math.max(0, introDur + midDur - xfDur);
    filterParts.unshift("[0:v]format=yuv420p[v0]", "[2:v]format=yuv420p[v2]");
    filterParts.push(
      `[v0][v1]xfade=transition=fade:duration=${xfDur}:offset=${off1}[xf1]`,
      `[xf1][v2]xfade=transition=fade:duration=${xfDur}:offset=${off2}[${videoLabel}]`
    );
  } else {
    const fadeOutStart = Math.max(0, midDur - 0.8);
    filterParts.push(
      "[v1]fade=t=in:st=0:d=0.8[v1f]",
      `[v1f]fade=t=out:st=${fadeOutStart}:d=0.8[${videoLabel}]`
    );
  }

  filterParts.push(`[3:a]atrim=0:${total},asetpts=N/SR/T[aout]`);
  args.push("-filter_complex", filterParts.join(";"));
  args.push("-map", `[${videoLabel}]`, "-map", "[aout]");
  args.push(
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "main",
    "-level",
    "4.0",
    outPath
  );

  await new Promise<void>((resolve, reject) => {
    const proc = spawn("ffmpeg", args, {stdio: ["ignore", "inherit", "inherit"]});
    proc.on("error", (error) => reject(error));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  return {localOut: outPath};
}

async function resolveAncientInput(ownerUid: string, payload: AncientSignalCallableInput) {
  if (payload.signals) {
    return {
      input: payload.signals,
      rawData: payload.rawData ?? null,
      sourceWindow: payload.sourceWindow ?? null,
      source: payload.source ?? "live",
    };
  }

  if (payload.rawData && !payload.usePassiveRollups) {
    return {
      input: mapRawAncientSignals(payload.rawData),
      rawData: payload.rawData,
      sourceWindow: payload.sourceWindow ?? null,
      source: payload.source ?? "live",
    };
  }

  const sourceWindow = resolveRollupWindow(payload);
  const rollup = await buildAncientSignalsFromPassiveRollups(firestore, {
    ownerUid,
    startAt: sourceWindow.startAt,
    endAt: sourceWindow.endAt,
    limitPerCollection: payload.limitPerCollection ?? 25,
  });

  if (!Object.keys(rollup.input).length && payload.rawData) {
    return {
      input: mapRawAncientSignals(payload.rawData),
      rawData: {
        ...payload.rawData,
        passiveRollupFallback: true,
        passiveRollupSources: rollup.sourceCollections,
      },
      sourceWindow,
      source: payload.source ?? "live",
    };
  }

  return {
    input: rollup.input,
    rawData: rollup.rawData,
    sourceWindow: rollup.sourceWindow,
    source: payload.source ?? "rollup",
  };
}

function requireAuthUid(auth: {uid?: string} | undefined): string {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Sign in before generating Ancient Signals snapshots.");
  }
  return auth.uid;
}

export const generateAncientSignalsSnapshot = onCall<AncientSignalCallableInput>(async (request) => {
  const ownerUid = requireAuthUid(request.auth);
  const payload = request.data ?? {};
  const resolved = await resolveAncientInput(ownerUid, payload);
  const computed = computeAncientSignalPayload(resolved.input);
  const now = admin.firestore.FieldValue.serverTimestamp();

  const doc = await firestore.collection("ancientSignals").add({
    ownerUid,
    userId: ownerUid,
    source: resolved.source,
    rawData: resolved.rawData,
    input: resolved.input,
    consentBasis: payload.consentBasis ?? {},
    sourceWindow: resolved.sourceWindow,
    ...computed,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: doc.id,
    source: resolved.source,
    sourceWindow: resolved.sourceWindow,
    ...computed,
  };
});

export const generateAuraAtmosphere = onCall<AncientSignalCallableInput>(async (request) => {
  const ownerUid = requireAuthUid(request.auth);
  const payload = request.data ?? {};
  const resolved = await resolveAncientInput(ownerUid, payload);
  const computed = computeAncientSignalPayload(resolved.input);

  return {
    source: resolved.source,
    sourceWindow: resolved.sourceWindow,
    preverbalState: computed.preverbalState,
    auraAtmosphere: computed.auraAtmosphere,
    visualState: computed.visualState,
  };
});

export const generatePreverbalInsight = onCall<AncientSignalCallableInput>(async (request) => {
  const ownerUid = requireAuthUid(request.auth);
  const payload = request.data ?? {};
  const resolved = await resolveAncientInput(ownerUid, payload);
  const computed = computeAncientSignalPayload(resolved.input);

  return {
    source: resolved.source,
    sourceWindow: resolved.sourceWindow,
    preverbalState: computed.preverbalState,
    confidence: computed.confidence,
    narratorHint: computed.narratorHint,
    safetyFlags: computed.safetyFlags,
  };
});

export const rollupAncientSignalsDaily = onCall<{date?: string; limitPerCollection?: number}>(async (request) => {
  const ownerUid = requireAuthUid(request.auth);
  const date = request.data?.date ?? new Date().toISOString().slice(0, 10);
  const sourceWindow = {
    startAt: `${date}T00:00:00.000Z`,
    endAt: `${date}T23:59:59.999Z`,
    durationMinutes: 1440,
  };
  const rollup = await buildAncientSignalsFromPassiveRollups(firestore, {
    ownerUid,
    startAt: sourceWindow.startAt,
    endAt: sourceWindow.endAt,
    limitPerCollection: request.data?.limitPerCollection ?? 25,
  });
  const computed = computeAncientSignalPayload(rollup.input);

  const doc = await firestore.collection("ancientSignals").add({
    ownerUid,
    userId: ownerUid,
    source: "rollup",
    rawData: rollup.rawData,
    input: rollup.input,
    consentBasis: {},
    sourceWindow: rollup.sourceWindow,
    ...computed,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    id: doc.id,
    date,
    sourceCollections: rollup.sourceCollections,
    sourceWindow: rollup.sourceWindow,
    ...computed,
  };
});
