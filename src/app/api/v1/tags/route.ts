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
    const category = searchParams.get('category'); // 'people', 'emotions', 'themes', 'symbols', 'tasks'

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 });
    }

    const tags = await aggregateUserTags(userId, category);

    return NextResponse.json({
      data: tags,
      meta: {
        userId,
        category: category || 'all',
        totalUniqueFlags: tags.length
      }
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface TagData {
  tag: string;
  category: string;
  frequency: number;
  firstSeen: number;
  lastSeen: number;
  associatedEmotions: string[];
  sentiment: {
    average: number;
    range: [number, number];
  };
}

async function aggregateUserTags(userId: string, categoryFilter?: string | null): Promise<TagData[]> {
  const tagMap = new Map<string, {
    category: string;
    frequency: number;
    firstSeen: number;
    lastSeen: number;
    emotions: string[];
    sentiments: number[];
  }>();

  // Collect tags from voice events
  const voiceSnapshot = await getDocs(query(
    collection(db, 'voiceEvents'),
    where('uid', '==', userId)
  ));

  voiceSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const timestamp = data.createdAt;
    const emotion = data.emotion;
    const sentiment = data.sentimentScore;

    // People tags
    if (data.people && (!categoryFilter || categoryFilter === 'people')) {
      data.people.forEach((person: string) => {
        updateTagMap(tagMap, person, 'people', timestamp, emotion, sentiment);
      });
    }

    // Task tags
    if (data.tasks && (!categoryFilter || categoryFilter === 'tasks')) {
      data.tasks.forEach((task: string) => {
        updateTagMap(tagMap, task, 'tasks', timestamp, emotion, sentiment);
      });
    }

    // Emotion tags
    if (emotion && (!categoryFilter || categoryFilter === 'emotions')) {
      updateTagMap(tagMap, emotion, 'emotions', timestamp, emotion, sentiment);
    }
  });

  // Collect tags from dream events
  const dreamSnapshot = await getDocs(query(
    collection(db, 'dreamEvents'),
    where('uid', '==', userId)
  ));

  dreamSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const timestamp = data.createdAt;
    const sentiment = data.sentimentScore;

    // Theme tags
    if (data.themes && (!categoryFilter || categoryFilter === 'themes')) {
      data.themes.forEach((theme: string) => {
        updateTagMap(tagMap, theme, 'themes', timestamp, 'dream', sentiment);
      });
    }

    // Symbol tags
    if (data.symbols && (!categoryFilter || categoryFilter === 'symbols')) {
      data.symbols.forEach((symbol: string) => {
        updateTagMap(tagMap, symbol, 'symbols', timestamp, 'dream', sentiment);
      });
    }

    // Emotion tags from dreams
    if (data.emotions && (!categoryFilter || categoryFilter === 'emotions')) {
      data.emotions.forEach((emotion: string) => {
        updateTagMap(tagMap, emotion, 'emotions', timestamp, emotion, sentiment);
      });
    }
  });

  // Convert map to array and calculate aggregated data
  const tags: TagData[] = Array.from(tagMap.entries()).map(([tag, data]) => {
    const sentiments = data.sentiments.filter(s => s !== undefined && !isNaN(s));
    const avgSentiment = sentiments.length > 0 
      ? sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length 
      : 0;
    const minSentiment = sentiments.length > 0 ? Math.min(...sentiments) : 0;
    const maxSentiment = sentiments.length > 0 ? Math.max(...sentiments) : 0;

    return {
      tag,
      category: data.category,
      frequency: data.frequency,
      firstSeen: data.firstSeen,
      lastSeen: data.lastSeen,
      associatedEmotions: [...new Set(data.emotions)],
      sentiment: {
        average: parseFloat(avgSentiment.toFixed(3)),
        range: [parseFloat(minSentiment.toFixed(3)), parseFloat(maxSentiment.toFixed(3))]
      }
    };
  });

  // Sort by frequency descending
  return tags.sort((a, b) => b.frequency - a.frequency);
}

function updateTagMap(
  tagMap: Map<string, any>,
  tag: string,
  category: string,
  timestamp: number,
  emotion: string,
  sentiment: number
) {
  const existing = tagMap.get(tag);
  
  if (existing) {
    existing.frequency++;
    existing.lastSeen = Math.max(existing.lastSeen, timestamp);
    existing.firstSeen = Math.min(existing.firstSeen, timestamp);
    existing.emotions.push(emotion);
    if (sentiment !== undefined && !isNaN(sentiment)) {
      existing.sentiments.push(sentiment);
    }
  } else {
    tagMap.set(tag, {
      category,
      frequency: 1,
      firstSeen: timestamp,
      lastSeen: timestamp,
      emotions: [emotion],
      sentiments: sentiment !== undefined && !isNaN(sentiment) ? [sentiment] : []
    });
  }
}