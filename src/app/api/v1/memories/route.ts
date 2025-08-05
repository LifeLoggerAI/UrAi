import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, startAfter, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { verifyApiKey } from '@/lib/b2b-auth';
import { VoiceEvent, Dream, InnerVoiceReflection } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await verifyApiKey(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const tags = searchParams.get('tags')?.split(',') || [];
    const emotion = searchParams.get('emotion');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 });
    }

    if (pageSize > 100) {
      return NextResponse.json({ error: 'pageSize cannot exceed 100' }, { status: 400 });
    }

    // Aggregate memories from multiple collections
    const memories = await aggregateUserMemories({
      userId,
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      startDate: startDate ? parseInt(startDate) : undefined,
      endDate: endDate ? parseInt(endDate) : undefined,
      tags,
      emotion
    });

    return NextResponse.json({
      data: memories.data,
      pagination: {
        page,
        pageSize,
        total: memories.total,
        hasNext: memories.hasNext
      },
      meta: {
        includedCollections: ['voiceEvents', 'dreamEvents', 'innerVoiceReflections'],
        filters: {
          dateRange: startDate && endDate ? { start: startDate, end: endDate } : null,
          tags: tags.length > 0 ? tags : null,
          emotion: emotion || null
        }
      }
    });

  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface MemoryQueryParams {
  userId: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  startDate?: number;
  endDate?: number;
  tags: string[];
  emotion?: string;
}

interface MemoryData {
  id: string;
  type: 'voice' | 'dream' | 'reflection';
  content: string;
  createdAt: number;
  lastAccessed?: number;
  sourceFlow: string;
  tags: string[];
  emotions?: string | string[];
  sentimentScore?: number;
  crossReferences: {
    people?: string[];
    tasks?: string[];
    themes?: string[];
    symbols?: string[];
  };
  embeddings?: {
    vectorId?: string;
    embedding?: number[];
  };
  metadata: Record<string, any>;
}

async function aggregateUserMemories(params: MemoryQueryParams) {
  const {
    userId,
    page,
    pageSize,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    tags,
    emotion
  } = params;

  const memories: MemoryData[] = [];
  
  // Query voice events
  let voiceQuery = query(
    collection(db, 'voiceEvents'),
    where('uid', '==', userId),
    orderBy(sortBy, sortOrder)
  );

  if (startDate) {
    voiceQuery = query(voiceQuery, where('createdAt', '>=', startDate));
  }
  if (endDate) {
    voiceQuery = query(voiceQuery, where('createdAt', '<=', endDate));
  }

  const voiceSnapshot = await getDocs(voiceQuery);
  voiceSnapshot.docs.forEach(doc => {
    const data = doc.data() as VoiceEvent;
    
    // Apply filters
    if (emotion && data.emotion !== emotion) return;
    if (tags.length > 0 && (!data.people || !tags.some(tag => data.people?.includes(tag)))) return;

    memories.push({
      id: doc.id,
      type: 'voice',
      content: data.text,
      createdAt: data.createdAt,
      sourceFlow: 'voice_recording',
      tags: [...(data.people || []), ...(data.tasks || [])],
      emotions: data.emotion,
      sentimentScore: data.sentimentScore,
      crossReferences: {
        people: data.people,
        tasks: data.tasks
      },
      embeddings: {
        vectorId: `voice_${doc.id}`,
        // In production, this would come from a vector database
        embedding: undefined
      },
      metadata: {
        audioEventId: data.audioEventId,
        speakerLabel: data.speakerLabel,
        toneShift: data.toneShift,
        voiceArchetype: data.voiceArchetype
      }
    });
  });

  // Query dream events
  let dreamQuery = query(
    collection(db, 'dreamEvents'),
    where('uid', '==', userId),
    orderBy(sortBy, sortOrder)
  );

  if (startDate) {
    dreamQuery = query(dreamQuery, where('createdAt', '>=', startDate));
  }
  if (endDate) {
    dreamQuery = query(dreamQuery, where('createdAt', '<=', endDate));
  }

  const dreamSnapshot = await getDocs(dreamQuery);
  dreamSnapshot.docs.forEach(doc => {
    const data = doc.data() as Dream;
    
    // Apply filters
    if (emotion && !data.emotions.includes(emotion)) return;
    if (tags.length > 0 && (!data.themes || !tags.some(tag => data.themes?.includes(tag)))) return;

    memories.push({
      id: doc.id,
      type: 'dream',
      content: data.text,
      createdAt: data.createdAt,
      sourceFlow: 'dream_journal',
      tags: [...(data.themes || []), ...(data.symbols || [])],
      emotions: data.emotions,
      sentimentScore: data.sentimentScore,
      crossReferences: {
        themes: data.themes,
        symbols: data.symbols
      },
      embeddings: {
        vectorId: `dream_${doc.id}`,
        embedding: undefined
      },
      metadata: {
        inferredSleepTime: data.inferredSleepTime,
        wakeTime: data.wakeTime,
        dreamSignalStrength: data.dreamSignalStrength,
        dreamSymbolTags: data.dreamSymbolTags,
        emotionBeforeSleep: data.emotionBeforeSleep,
        emotionUponWaking: data.emotionUponWaking
      }
    });
  });

  // Query inner voice reflections
  let reflectionQuery = query(
    collection(db, 'innerVoiceReflections'),
    where('uid', '==', userId),
    orderBy(sortBy, sortOrder)
  );

  if (startDate) {
    reflectionQuery = query(reflectionQuery, where('createdAt', '>=', startDate));
  }
  if (endDate) {
    reflectionQuery = query(reflectionQuery, where('createdAt', '<=', endDate));
  }

  const reflectionSnapshot = await getDocs(reflectionQuery);
  reflectionSnapshot.docs.forEach(doc => {
    const data = doc.data() as InnerVoiceReflection;
    
    memories.push({
      id: doc.id,
      type: 'reflection',
      content: data.text,
      createdAt: data.createdAt,
      sourceFlow: 'inner_voice',
      tags: [],
      sentimentScore: data.sentimentScore,
      crossReferences: {},
      embeddings: {
        vectorId: `reflection_${doc.id}`,
        embedding: undefined
      },
      metadata: {}
    });
  });

  // Sort all memories
  memories.sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.createdAt - a.createdAt;
    }
    return a.createdAt - b.createdAt;
  });

  // Paginate
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMemories = memories.slice(startIndex, endIndex);

  return {
    data: paginatedMemories,
    total: memories.length,
    hasNext: endIndex < memories.length
  };
}