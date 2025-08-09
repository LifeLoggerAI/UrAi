import { onDocumentWritten, Change, DocumentSnapshot } from 'firebase-functions/v2/firestore';

export const detectShadowEpisode = onDocumentWritten('timelineEvents/{uid}/{eventId}', async (event) => {
  const change: Change<DocumentSnapshot> | undefined = event.data;
  const before = change?.before;
  const after = change?.after;
  if (!after?.exists) return;
  const afterData = after.data();
  const beforeData = before?.exists ? before.data() : undefined;
  if (!afterData) return;
  // ...
});