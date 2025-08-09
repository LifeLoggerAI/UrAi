import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { callInsightModel } from './utils/insight-ai';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const generateCausalInsight = onDocumentWritten('scrolls/{id}', async (event) => {
  const scroll = event.data?.after?.data();
  const scrollId = event.params.id;
  if (!scroll || !scroll.userId) return;

  const userId = scroll.userId;

  const recentRitualsSnap = await db.collection('rituals')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(3)
    .get();

  const rituals = recentRitualsSnap.docs.map(doc => doc.data().notes || '').join('\n');
  const insightsInput = scroll.insights.join('\n');

  const result = await callInsightModel(`${rituals}\n\n${insightsInput}`);

  await db.collection('insights').add({
    userId,
    type: 'causal',
    generatedFrom: [scrollId],
    content: result.text,
    confidenceScore: result.confidence || 0.7,
    createdAt: new Date().toISOString(),
  });

  console.log(`🧩 Generated causal insight for ${userId}: ${result.text}`);
});
