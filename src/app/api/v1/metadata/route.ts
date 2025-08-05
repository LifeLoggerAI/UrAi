import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { verifyApiKey } from '@/lib/b2b-auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await verifyApiKey(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const metricType = searchParams.get('type'); // 'usage', 'analytics', 'summary'

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 });
    }

    const metadata = await aggregateUserMetadata(userId, metricType);

    return NextResponse.json({
      data: metadata,
      meta: {
        userId,
        metricType: metricType || 'all',
        generatedAt: Date.now()
      }
    });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function aggregateUserMetadata(userId: string, metricType?: string | null) {
  const metadata: any = {};

  // Usage metadata
  if (!metricType || metricType === 'usage') {
    metadata.usage = await getUserUsageMetadata(userId);
  }

  // Analytics metadata
  if (!metricType || metricType === 'analytics') {
    metadata.analytics = await getUserAnalyticsMetadata(userId);
  }

  // Summary metadata
  if (!metricType || metricType === 'summary') {
    metadata.summary = await getUserSummaryMetadata(userId);
  }

  return metadata;
}

async function getUserUsageMetadata(userId: string) {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  // Get voice event usage
  const voiceSnapshot = await getDocs(query(
    collection(db, 'voiceEvents'),
    where('uid', '==', userId),
    where('createdAt', '>=', thirtyDaysAgo)
  ));

  // Get dream event usage
  const dreamSnapshot = await getDocs(query(
    collection(db, 'dreamEvents'),
    where('uid', '==', userId),
    where('createdAt', '>=', thirtyDaysAgo)
  ));

  // Calculate daily usage
  const dailyUsage: Record<string, { voice: number; dreams: number }> = {};
  
  voiceSnapshot.docs.forEach(doc => {
    const date = new Date(doc.data().createdAt).toISOString().split('T')[0];
    if (!dailyUsage[date]) dailyUsage[date] = { voice: 0, dreams: 0 };
    dailyUsage[date].voice++;
  });

  dreamSnapshot.docs.forEach(doc => {
    const date = new Date(doc.data().createdAt).toISOString().split('T')[0];
    if (!dailyUsage[date]) dailyUsage[date] = { voice: 0, dreams: 0 };
    dailyUsage[date].dreams++;
  });

  return {
    totalVoiceEvents: voiceSnapshot.size,
    totalDreamEvents: dreamSnapshot.size,
    activeInLast30Days: Object.keys(dailyUsage).length,
    dailyAverageEvents: Object.values(dailyUsage).reduce((sum, day) => sum + day.voice + day.dreams, 0) / Math.max(Object.keys(dailyUsage).length, 1),
    dailyBreakdown: dailyUsage,
    lastActive: Math.max(
      ...voiceSnapshot.docs.map(doc => doc.data().createdAt),
      ...dreamSnapshot.docs.map(doc => doc.data().createdAt)
    )
  };
}

async function getUserAnalyticsMetadata(userId: string) {
  // Get all voice events for sentiment analysis
  const voiceSnapshot = await getDocs(query(
    collection(db, 'voiceEvents'),
    where('uid', '==', userId)
  ));

  // Get all dream events
  const dreamSnapshot = await getDocs(query(
    collection(db, 'dreamEvents'),
    where('uid', '==', userId)
  ));

  // Get people mentioned
  const peopleSnapshot = await getDocs(query(
    collection(db, 'people'),
    where('uid', '==', userId)
  ));

  const sentiments = [
    ...voiceSnapshot.docs.map(doc => doc.data().sentimentScore).filter(s => s !== undefined),
    ...dreamSnapshot.docs.map(doc => doc.data().sentimentScore).filter(s => s !== undefined)
  ];

  const emotions = [
    ...voiceSnapshot.docs.map(doc => doc.data().emotion),
    ...dreamSnapshot.docs.flatMap(doc => doc.data().emotions || [])
  ];

  const emotionCounts = emotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    sentimentAnalysis: {
      average: sentiments.length > 0 ? sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length : 0,
      distribution: {
        positive: sentiments.filter(s => s > 0.1).length,
        neutral: sentiments.filter(s => s >= -0.1 && s <= 0.1).length,
        negative: sentiments.filter(s => s < -0.1).length
      }
    },
    emotionBreakdown: emotionCounts,
    socialConnections: {
      totalPeople: peopleSnapshot.size,
      averageInteractionsPerPerson: peopleSnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.interactionCount || 0);
      }, 0) / Math.max(peopleSnapshot.size, 1)
    },
    dataQuality: {
      totalRecords: voiceSnapshot.size + dreamSnapshot.size,
      recordsWithSentiment: sentiments.length,
      recordsWithEmotions: emotions.length,
      completenessScore: (sentiments.length + emotions.length) / Math.max((voiceSnapshot.size + dreamSnapshot.size) * 2, 1)
    }
  };
}

async function getUserSummaryMetadata(userId: string) {
  // Get user profile
  const userDoc = await getDocs(query(
    collection(db, 'users'),
    where('uid', '==', userId)
  ));

  let userProfile = null;
  if (!userDoc.empty) {
    userProfile = userDoc.docs[0].data();
  }

  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

  // Get recent activity counts
  const recentVoiceSnapshot = await getDocs(query(
    collection(db, 'voiceEvents'),
    where('uid', '==', userId),
    where('createdAt', '>=', oneWeekAgo)
  ));

  const recentDreamSnapshot = await getDocs(query(
    collection(db, 'dreamEvents'),
    where('uid', '==', userId),
    where('createdAt', '>=', oneWeekAgo)
  ));

  return {
    userProfile: {
      displayName: userProfile?.displayName,
      createdAt: userProfile?.createdAt,
      isProUser: userProfile?.isProUser || false,
      onboardingComplete: userProfile?.onboardingComplete || false
    },
    activitySummary: {
      weeklyEvents: recentVoiceSnapshot.size + recentDreamSnapshot.size,
      averageDailyEvents: (recentVoiceSnapshot.size + recentDreamSnapshot.size) / 7,
      primarySourceFlow: recentVoiceSnapshot.size > recentDreamSnapshot.size ? 'voice_recording' : 'dream_journal'
    },
    dataExportInfo: {
      totalExportableRecords: await getTotalRecordCount(userId),
      estimatedSizeKB: await estimateDataSize(userId),
      supportedFormats: ['json', 'csv', 'pdf']
    }
  };
}

async function getTotalRecordCount(userId: string): Promise<number> {
  const collections = ['voiceEvents', 'dreamEvents', 'innerVoiceReflections', 'people', 'goals', 'tasks'];
  let total = 0;

  for (const collectionName of collections) {
    try {
      const snapshot = await getDocs(query(
        collection(db, collectionName),
        where('uid', '==', userId)
      ));
      total += snapshot.size;
    } catch (error) {
      // Collection might not exist, continue
      console.warn(`Collection ${collectionName} not found or error:`, error);
    }
  }

  return total;
}

async function estimateDataSize(userId: string): Promise<number> {
  // Rough estimation based on average record sizes
  const voiceSnapshot = await getDocs(query(
    collection(db, 'voiceEvents'),
    where('uid', '==', userId)
  ));

  const dreamSnapshot = await getDocs(query(
    collection(db, 'dreamEvents'),
    where('uid', '==', userId)
  ));

  // Estimate: voice event ~2KB, dream event ~1.5KB
  const estimatedSize = (voiceSnapshot.size * 2) + (dreamSnapshot.size * 1.5);
  return Math.round(estimatedSize);
}