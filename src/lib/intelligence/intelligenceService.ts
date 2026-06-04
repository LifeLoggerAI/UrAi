import { getFirestore, doc, writeBatch, serverTimestamp, setDoc } from "firebase/firestore";
import {
  SymbolicInferenceResult,
  SymbolicInferenceConfig,
  SymbolicInputSummary,
} from "./intelligenceTypes";
import {
  userIntelligenceSignalsPath,
  userIntelligenceRunsPath,
  userLifeMapStarDraftsPath,
  userGroundBloomDraftsPath,
  userMirrorReflectionDraftsPath,
  userRitualSuggestionDraftsPath,
} from "./intelligenceFirestorePaths";
import {
  toLifeMapStarDraft,
  toGroundBloomDraft,
  toMirrorReflectionDraft,
  toRitualSuggestionDraft,
} from "./intelligenceDestinations";
import { runSymbolicInference } from "./symbolicInferenceEngine";

export async function generateLocalSymbolicInference(params: {
  inputs: SymbolicInputSummary[];
  openPassportLayerIds: string[];
  config?: Partial<SymbolicInferenceConfig>;
}): Promise<SymbolicInferenceResult> {
  return runSymbolicInference(params);
}

export async function saveSymbolicInferenceRun(params: {
  userId: string;
  result: SymbolicInferenceResult;
}): Promise<void> {
  const db = getFirestore();
  const runRef = doc(db, userIntelligenceRunsPath(params.userId), params.result.generatedAt);

  await setDoc(runRef, {
    ...params.result,
    savedAt: serverTimestamp(),
  });
}

export async function saveIntelligenceSignalDrafts(params: {
  userId: string;
  result: SymbolicInferenceResult;
}): Promise<void> {
  const db = getFirestore();
  const batch = writeBatch(db);

  const signalPath = userIntelligenceSignalsPath(params.userId);
  params.result.signals.forEach(signal => {
    const signalRef = doc(db, signalPath, signal.id);
    batch.set(signalRef, signal);
  });

  const lifeMapPath = userLifeMapStarDraftsPath(params.userId);
  params.result.lifeMapCandidates.forEach(signal => {
    const draft = toLifeMapStarDraft(signal);
    if (draft) {
      const draftRef = doc(db, lifeMapPath, draft.id);
      batch.set(draftRef, { ...draft, savedAt: serverTimestamp() });
    }
  });

  const groundPath = userGroundBloomDraftsPath(params.userId);
  params.result.groundCandidates.forEach(signal => {
    const draft = toGroundBloomDraft(signal);
    if (draft) {
      const draftRef = doc(db, groundPath, draft.id);
      batch.set(draftRef, { ...draft, savedAt: serverTimestamp() });
    }
  });

  const mirrorPath = userMirrorReflectionDraftsPath(params.userId);
  params.result.mirrorCandidates.forEach(signal => {
    const draft = toMirrorReflectionDraft(signal);
    if (draft) {
      const draftRef = doc(db, mirrorPath, draft.id);
      batch.set(draftRef, { ...draft, savedAt: serverTimestamp() });
    }
  });

  const ritualPath = userRitualSuggestionDraftsPath(params.userId);
  params.result.ritualCandidates.forEach(signal => {
    const draft = toRitualSuggestionDraft(signal);
    if (draft) {
      const draftRef = doc(db, ritualPath, draft.id);
      batch.set(draftRef, { ...draft, savedAt: serverTimestamp() });
    }
  });

  await batch.commit();
}
