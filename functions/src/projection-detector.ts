import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { detectProjection } from './utils/projection-ai';

// Declare global type for admin app flag
declare global {
  var ADMIN_APP_INITIALIZED: boolean | undefined;
}

// Initialize admin SDK if not already initialized
if (!global.ADMIN_APP_INITIALIZED) {
  initializeApp();
  global.ADMIN_APP_INITIALIZED = true;
}
const db = getFirestore();

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