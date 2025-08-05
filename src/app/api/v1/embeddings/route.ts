import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { verifyApiKey } from '@/lib/b2b-auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await verifyApiKey(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // Check if user has permission to access embeddings
    if (!authResult.permissions?.includes('read:embeddings')) {
      return NextResponse.json({ 
        error: 'Insufficient permissions. Upgrade to Standard or Premium tier for embedding access.' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const queryText = searchParams.get('query');
    const similarityThreshold = parseFloat(searchParams.get('threshold') || '0.7');
    const maxResults = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 });
    }

    if (maxResults > 50) {
      return NextResponse.json({ error: 'limit cannot exceed 50' }, { status: 400 });
    }

    const embeddings = await getEmbeddingsForUser(userId, queryText, similarityThreshold, maxResults);

    return NextResponse.json({
      data: embeddings,
      meta: {
        userId,
        query: queryText,
        similarityThreshold,
        resultCount: embeddings.length,
        note: "Embedding vectors are simulated for demo purposes. In production, these would be computed using a vector database like Pinecone, Weaviate, or Chroma."
      }
    });

  } catch (error) {
    console.error('Error fetching embeddings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface EmbeddingData {
  id: string;
  type: 'voice' | 'dream' | 'reflection';
  content: string;
  vectorId: string;
  embedding: number[];
  similarity?: number;
  metadata: {
    createdAt: number;
    contentLength: number;
    language?: string;
    emotions?: string | string[];
    tags?: string[];
  };
}

async function getEmbeddingsForUser(
  userId: string,
  queryText?: string | null,
  similarityThreshold?: number,
  maxResults?: number
): Promise<EmbeddingData[]> {
  const embeddings: EmbeddingData[] = [];

  // Get voice events
  const voiceSnapshot = await getDocs(query(
    collection(db, 'voiceEvents'),
    where('uid', '==', userId),
    limit(maxResults || 10)
  ));

  voiceSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const embedding = generateSimulatedEmbedding(data.text);
    
    let similarity: number | undefined;
    if (queryText) {
      const queryEmbedding = generateSimulatedEmbedding(queryText);
      similarity = calculateCosineSimilarity(embedding, queryEmbedding);
      
      // Filter by similarity threshold if provided
      if (similarityThreshold && similarity < similarityThreshold) {
        return;
      }
    }

    embeddings.push({
      id: doc.id,
      type: 'voice',
      content: data.text,
      vectorId: `voice_${doc.id}`,
      embedding,
      similarity,
      metadata: {
        createdAt: data.createdAt,
        contentLength: data.text.length,
        emotions: data.emotion,
        tags: [...(data.people || []), ...(data.tasks || [])]
      }
    });
  });

  // Get dream events
  const dreamSnapshot = await getDocs(query(
    collection(db, 'dreamEvents'),
    where('uid', '==', userId),
    limit(maxResults || 10)
  ));

  dreamSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const embedding = generateSimulatedEmbedding(data.text);
    
    let similarity: number | undefined;
    if (queryText) {
      const queryEmbedding = generateSimulatedEmbedding(queryText);
      similarity = calculateCosineSimilarity(embedding, queryEmbedding);
      
      if (similarityThreshold && similarity < similarityThreshold) {
        return;
      }
    }

    embeddings.push({
      id: doc.id,
      type: 'dream',
      content: data.text,
      vectorId: `dream_${doc.id}`,
      embedding,
      similarity,
      metadata: {
        createdAt: data.createdAt,
        contentLength: data.text.length,
        emotions: data.emotions,
        tags: [...(data.themes || []), ...(data.symbols || [])]
      }
    });
  });

  // Sort by similarity if query was provided
  if (queryText && similarityThreshold) {
    embeddings.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  }

  return embeddings.slice(0, maxResults || 10);
}

/**
 * Generate a simulated embedding vector for demo purposes
 * In production, this would use a real embedding model like OpenAI, Cohere, or sentence-transformers
 */
function generateSimulatedEmbedding(text: string): number[] {
  const dimensions = 384; // Common dimension size for sentence embeddings
  const embedding: number[] = [];
  
  // Use text characteristics to create a somewhat meaningful embedding
  const textHash = simpleHash(text.toLowerCase());
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const charCount = text.length;
  
  for (let i = 0; i < dimensions; i++) {
    // Create pseudo-random but deterministic values based on text content
    const seed = (textHash + i * 7) % 1000000;
    let value = Math.sin(seed) * Math.cos(seed * 0.5);
    
    // Add some text-based features
    if (i < 10) {
      // First 10 dimensions based on content length
      value += (charCount % 100) / 1000;
    } else if (i < 20) {
      // Next 10 dimensions based on word count
      value += (wordCount % 50) / 100;
    } else if (i < 30) {
      // Next 10 dimensions based on emotional keywords
      const emotionWords = ['happy', 'sad', 'angry', 'fear', 'love', 'joy', 'calm', 'anxious'];
      const emotionScore = emotionWords.reduce((sum, word) => {
        return sum + (text.toLowerCase().includes(word) ? 1 : 0);
      }, 0);
      value += emotionScore / 10;
    }
    
    embedding.push(value);
  }
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (normA * normB);
}