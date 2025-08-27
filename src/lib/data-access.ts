// src/lib/data-access.ts
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { DashboardData } from './types';

/**
 * Fetches and aggregates data for the main user dashboard.
 * This is a server-side utility function.
 * @param uid The user's ID.
 * @returns A promise that resolves to the dashboard data.
 */
export async function getDashboardData(uid: string): Promise<DashboardData> {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  // 1. Sentiment over time from voice and text entries
  const voiceEventsRef = collection(db, 'voiceEvents');
  const voiceQuery = query(
    voiceEventsRef,
    where('uid', '==', uid),
    where('createdAt', '>=', thirtyDaysAgo),
    orderBy('createdAt', 'asc')
  );

  const innerTextsRef = collection(db, 'innerTexts');
  const innerTextQuery = query(
    innerTextsRef,
    where('uid', '==', uid),
    where('createdAt', '>=', thirtyDaysAgo),
    orderBy('createdAt', 'asc')
  );

  const [voiceSnap, innerTextSnap] = await Promise.all([
    getDocs(voiceQuery),
    getDocs(innerTextQuery),
  ]);

  const combinedEvents = [
    ...voiceSnap.docs.map(doc => ({
      date: new Date(doc.data().createdAt).toISOString().split('T')[0],
      sentiment: doc.data().sentimentScore,
    })),
    ...innerTextSnap.docs.map(doc => ({
      date: new Date(doc.data().createdAt).toISOString().split('T')[0],
      sentiment: doc.data().sentimentScore,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate sentiment by day (average)
  const sentimentByDay: { [key: string]: { total: number; count: number } } = {};
  for (const event of combinedEvents) {
    if (!sentimentByDay[event.date]) {
      sentimentByDay[event.date] = { total: 0, count: 0 };
    }
    sentimentByDay[event.date].total += event.sentiment;
    sentimentByDay[event.date].count++;
  }
  const sentimentOverTime = Object.entries(sentimentByDay).map(
    ([date, { total, count }]) => ({
      date,
      sentiment: total / count,
    })
  );

  // 2. Emotion breakdown
  const emotionCounts: { [key: string]: number } = {};
  for (const doc of voiceSnap.docs) {
    const emotion = doc.data().emotion;
    if (emotion) {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }
  }

  const emotionBreakdown = Object.entries(emotionCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 emotions

  // 3. Core Stats
  const memoriesQuery = query(collection(db, 'voiceEvents'), where('uid', '==', uid));
  const dreamsQuery = query(collection(db, 'dreamEvents'), where('uid', '==', uid));
  const peopleQuery = query(collection(db, 'people'), where('uid', '==', uid));

  const [memoriesSnap, dreamsSnap, peopleSnap] = await Promise.all([
    getDocs(memoriesQuery),
    getDocs(dreamsQuery),
    getDocs(peopleQuery),
  ]);

  const stats = {
    totalMemories: memoriesSnap.size,
    totalDreams: dreamsSnap.size,
    totalPeople: peopleSnap.size,
  };

  return {
    sentimentOverTime,
    emotionBreakdown,
    stats,
  };
}
