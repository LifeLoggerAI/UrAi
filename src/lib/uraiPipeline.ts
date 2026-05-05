import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/lib/firebase";

export type CognitiveMirrorInsight = {
  title?: string;
  summary?: string;
  createdAt?: string;
};

export async function sendCognitiveMirrorEvent() {
  const functions = getFunctions(app);
  const ingestEvent = httpsCallable(functions, "ingestEvent");
  const result = await ingestEvent({
    type: "manual",
    mood: "curious",
    source: "home_scene",
    text: "User tapped the Cognitive Mirror pulse.",
  });
  return result.data as { insight?: CognitiveMirrorInsight };
}

export async function fetchLatestInsight() {
  const functions = getFunctions(app);
  const getLatestInsight = httpsCallable(functions, "getLatestInsight");
  const result = await getLatestInsight({});
  return result.data as { insight?: CognitiveMirrorInsight | null; message?: string };
}
