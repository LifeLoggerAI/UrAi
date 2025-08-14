import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import type { FirestoreEvent, DocumentSnapshot } from 'firebase-functions/v2/firestore';

export const synthesizeNarratorVoice = onDocumentCreated('narratorInsights/{uid}/{insightId}', 
  async (event: FirestoreEvent<DocumentSnapshot | undefined, {uid: string, insightId: string}>) => {
    const insight = event.data?.data();
    if (!insight) return;
    // ...
  }
);
