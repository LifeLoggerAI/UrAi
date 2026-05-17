"use client";

import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { ConversationInsight, OrbChat, OrbMessage } from "@/lib/types";

const CHAT_COLLECTION = "orbChats";
const MESSAGE_COLLECTION = "orbMessages";
const INSIGHT_COLLECTION = "conversationInsights";
const MEMORY_COLLECTION = "companionMemory";

export function createLocalChatId() {
  return `local-${Date.now()}`;
}

export async function createOrbChat(ownerUid: string, title = "Orb conversation") {
  if (!isFirebaseConfigured() || ownerUid === "demo-user") return createLocalChatId();

  const now = new Date().toISOString();
  const chat: Omit<OrbChat, "id"> & { ownerUid: string; createdAtServer: unknown; updatedAtServer: unknown } = {
    ownerUid,
    userId: ownerUid,
    title,
    createdAt: now,
    updatedAt: now,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  };

  const ref = await addDoc(collection(db(), CHAT_COLLECTION), chat);
  return ref.id;
}

export async function saveOrbMessage(ownerUid: string, chatId: string, message: OrbMessage) {
  if (!isFirebaseConfigured() || ownerUid === "demo-user" || chatId.startsWith("local-")) return;

  await setDoc(doc(db(), MESSAGE_COLLECTION, message.id), {
    ...message,
    ownerUid,
    userId: ownerUid,
    chatId,
    createdAtServer: serverTimestamp(),
  });

  await setDoc(
    doc(db(), CHAT_COLLECTION, chatId),
    {
      ownerUid,
      userId: ownerUid,
      updatedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp(),
      lastMessagePreview: message.content.slice(0, 140),
    },
    { merge: true },
  );
}

export async function saveConversationInsight(
  ownerUid: string,
  insight: ConversationInsight,
  sourceMessage?: OrbMessage,
) {
  if (!isFirebaseConfigured() || ownerUid === "demo-user") return;

  await setDoc(doc(db(), INSIGHT_COLLECTION, insight.id), {
    ...insight,
    ownerUid,
    userId: ownerUid,
    createdAtServer: serverTimestamp(),
  });

  if (sourceMessage && insight.memoryImportanceScore >= 0.5) {
    await setDoc(doc(db(), MEMORY_COLLECTION, `memory-${sourceMessage.id}`), {
      ownerUid,
      userId: ownerUid,
      sourceMessageId: sourceMessage.id,
      summary: insight.insight,
      importanceScore: insight.memoryImportanceScore,
      emotionTags: insight.emotionTags,
      createdAt: insight.createdAt,
      createdAtServer: serverTimestamp(),
    });
  }
}

export function subscribeToOrbMessages(
  ownerUid: string,
  chatId: string | null,
  onMessages: (messages: OrbMessage[]) => void,
): Unsubscribe {
  if (!isFirebaseConfigured() || ownerUid === "demo-user" || !chatId || chatId.startsWith("local-")) {
    return () => undefined;
  }

  const messagesQuery = query(
    collection(db(), MESSAGE_COLLECTION),
    orderBy("createdAt", "asc"),
    limit(80),
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs
      .map((messageDoc) => messageDoc.data() as OrbMessage & { chatId?: string; ownerUid?: string })
      .filter((message) => message.ownerUid === ownerUid && message.chatId === chatId);

    onMessages(messages);
  });
}
