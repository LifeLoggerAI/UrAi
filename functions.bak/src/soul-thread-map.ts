import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const updateSoulThreadMap = onDocumentWritten('scrolls/{id}', async (event) => {
  const data = event.data?.after?.data();
  const scrollId = event.params.id;
  if (!data || !scrollId) return;

  const { userId, scrollType, insights } = data;

  // Very simple pattern matcher (improve later with NLP model)
  const matchedSymbol = matchSymbol(insights);
  const threadLabel = labelThread(matchedSymbol);

  const threadsRef = db.collection('soulThreads').where('userId', '==', userId);
  const existing = await threadsRef.get();

  let threadId = null;

  for (const doc of existing.docs) {
    if (doc.data().coreSymbol === matchedSymbol) {
      threadId = doc.id;
      const threadData = doc.data();
      await doc.ref.update({
        events: [...new Set([...threadData.events, scrollId])],
        rebirthCount: scrollType === 'crisis' ? threadData.rebirthCount + 1 : threadData.rebirthCount,
        status: scrollType === 'ritual' ? 'resolving' : threadData.status,
      });
    }
  }

  if (!threadId && matchedSymbol) {
    await db.collection('soulThreads').add({
      userId,
      threadLabel,
      events: [scrollId],
      coreSymbol: matchedSymbol,
      dominantArchetype: 'Seeker',
      status: 'open',
      rebirthCount: scrollType === 'crisis' ? 1 : 0,
      createdAt: new Date().toISOString(),
    });
  }
});

function matchSymbol(insights: string[]): string | null {
  const keywords = ['fire', 'mirror', 'ocean', 'ashes', 'moon', 'voice'];
  for (const i of insights) {
    for (const k of keywords) {
      if (i.includes(k)) return k;
    }
  }
  return null;
}

function labelThread(symbol: string | null): string {
  const labels: Record<string, string> = {
    fire: 'The Burning Path',
    mirror: 'The Healer\'s Wound',
    ocean: 'The Depth of Self',
    ashes: 'The Cycle of Rebirth',
    moon: 'The Forgotten Self',
    voice: 'The Silenced Song',
  };
  return symbol ? labels[symbol] || `Thread of ${symbol}` : 'Unnamed Thread';
}
