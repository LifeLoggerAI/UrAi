import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { detectProjection } from './utils/projection-ai';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const detectProjectionInsight = onDocumentWritten('voiceEvents/{id}', async (event) => {
  const data = event.data?.after?.data();
  if (!data || !data.userId || !data.transcript) return;

  const { userId, transcript } = data;

  const result = await detectProjection(transcript);

  if (result && result.insight) {
    await db.collection('insights').add({
      userId,
      type: 'projection',
      generatedFrom: [event.params.id],
      content: result.insight,
      confidenceScore: result.confidence || 0.65,
      createdAt: new Date().toISOString(),
    });

    console.log(`🪞 Projection insight stored for ${userId}: ${result.insight}`);
  }
});
