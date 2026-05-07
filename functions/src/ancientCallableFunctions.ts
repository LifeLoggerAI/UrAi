import * as admin from "firebase-admin";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {
  AncientSignalCallableInput,
  computeAncientSignalPayload,
  mapRawAncientSignals,
  resolveRollupWindow,
} from "./ancientSignalCompute";
import {buildAncientSignalsFromPassiveRollups} from "./ancientPassiveRollups";

if (!admin.apps.length) {
  admin.initializeApp();
}

const firestore = admin.firestore();

function requireAuthUid(auth: {uid?: string} | undefined): string {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Sign in before generating Ancient Signals snapshots.");
  }
  return auth.uid;
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

  return {id: doc.id, source: resolved.source, sourceWindow: resolved.sourceWindow, ...computed};
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

  return {id: doc.id, date, sourceCollections: rollup.sourceCollections, sourceWindow: rollup.sourceWindow, ...computed};
});
