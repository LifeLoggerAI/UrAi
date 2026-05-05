import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/lib/firebase";

export async function sendCognitiveMirrorEvent() {
  const fn = httpsCallable(getFunctions(app), "ingestEvent");
  return (await fn({ type: "manual", mood: "curious", text: "User signal" })).data;
}

export async function fetchLatestInsight() {
  return (await httpsCallable(getFunctions(app), "getLatestInsight")({})).data;
}

export async function fetchPersonalMirror() {
  return (await httpsCallable(getFunctions(app), "getPersonalMirror")({})).data;
}

export async function fetchPrediction() {
  return (await httpsCallable(getFunctions(app), "getPredictiveMirror")({})).data;
}

export async function fetchChallenge() {
  return (await httpsCallable(getFunctions(app), "getChallengeMirror")({})).data;
}

export async function fetchCoaching() {
  return (await httpsCallable(getFunctions(app), "getCoachingMirror")({})).data;
}
