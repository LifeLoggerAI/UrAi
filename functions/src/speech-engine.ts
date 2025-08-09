import { onDocumentCreated } from 'firebase-functions/v2/firestore';

export const synthesizeNarratorVoice = onDocumentCreated('narratorInsights/{uid}/{insightId}', async (event) => {
  const insight = event.data?.data();
  if (!insight) return;
  // ...
});