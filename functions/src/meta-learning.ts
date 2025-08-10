import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const metaLearningFeedback = onDocumentWritten('rituals/{id}', async (event) => {
  const data = event.data?.after?.data();
  if (!data || !data.userId) return;

  const userId = data.userId;
  const ritualId = event.params.id;

  const forecastQuery = await db.collection('moodForecasts')
    .where('userId', '==', userId)
    .orderBy('forecastDate', 'desc')
    .limit(2)
    .get();

  if (forecastQuery.docs.length < 2) return;

  const [after, before] = forecastQuery.docs.map(doc => doc.data());

  const impactScore = before.dailyMood !== after.dailyMood ? 0.75 : 0.3;
  const result = impactScore > 0.6 ? 'positive' : 'neutral';

  await db.collection('metaLearning').add({
    userId,
    eventId: ritualId,
    eventType: 'ritual',
    result,
    impactScore,
    moodBefore: before.dailyMood,
    moodAfter: after.dailyMood,
    insightsUsed: data.notes ? [data.notes] : [],
    addedToMemory: true,
    createdAt: new Date().toISOString(),
  });

  console.log(`🧠 Meta learning update for ${userId} from ritual ${ritualId}`);
});
