'use server';

/**
 * @fileOverview Unified Memory & Cross-Reference Service
 * 
 * Provides a centralized system for AI flows to store and retrieve tagged memories
 * across chat, transcription, embedding, TTS, and other AI-driven processes.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Memory, 
  SaveMemoryInput, 
  GetMemoriesInput,
  MemorySchema,
  SaveMemoryInputSchema,
  GetMemoriesInputSchema
} from '@/lib/types';

/**
 * Unified Memory Service for AI-driven flows
 * 
 * Provides model-agnostic interface for storing and retrieving tagged context
 * that can be used across all AI flows for cross-referencing and context building.
 */
export class MemoryService {
  private static readonly COLLECTION_NAME = 'memories';

  /**
   * Save a memory with a specific tag for later retrieval
   * 
   * @param userId - Unique user identifier
   * @param tag - Simple string tag or category for the memory
   * @param payload - Arbitrary JSON data to persist
   * @param source - Optional source flow that created this memory
   * @returns Promise that resolves when memory is saved
   */
  static async saveMemory(
    userId: string, 
    tag: string, 
    payload: any,
    source?: string
  ): Promise<void> {
    // Validate input
    const input = SaveMemoryInputSchema.parse({ userId, tag, payload, source });
    
    const now = Date.now();
    const memoryId = `${userId}_${tag}_${now}`;
    
    const memory: Memory = {
      id: memoryId,
      userId: input.userId,
      tag: input.tag,
      payload: input.payload,
      createdAt: now,
      updatedAt: now,
      source: input.source,
    };

    // Validate the memory object
    MemorySchema.parse(memory);

    const memoriesRef = collection(db, this.COLLECTION_NAME);
    const memoryDocRef = doc(memoriesRef, memoryId);
    
    await setDoc(memoryDocRef, memory);
  }

  /**
   * Retrieve memories for a user, optionally filtered by tag pattern
   * 
   * @param userId - Unique user identifier
   * @param tagPattern - Optional tag pattern for filtering (supports simple wildcards with *)
   * @param limit - Maximum number of memories to return (default: 50)
   * @param orderBy - Field to order results by (default: 'createdAt')
   * @param order - Sort direction (default: 'desc')
   * @returns Promise that resolves to array of matching memories
   */
  static async getMemories(
    userId: string,
    tagPattern?: string,
    limit: number = 50,
    orderByField: 'createdAt' | 'updatedAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<Memory[]> {
    // Validate input
    const input = GetMemoriesInputSchema.parse({ 
      userId, 
      tagPattern, 
      limit, 
      orderBy: orderByField, 
      order 
    });
    
    const memoriesRef = collection(db, this.COLLECTION_NAME);
    let q = query(
      memoriesRef,
      where('userId', '==', input.userId),
      orderBy(input.orderBy, input.order),
      firestoreLimit(input.limit)
    );

    // If tagPattern is provided and doesn't contain wildcards, filter by exact tag
    if (input.tagPattern && !input.tagPattern.includes('*')) {
      q = query(
        memoriesRef,
        where('userId', '==', input.userId),
        where('tag', '==', input.tagPattern),
        orderBy(input.orderBy, input.order),
        firestoreLimit(input.limit)
      );
    }

    const querySnapshot = await getDocs(q);
    const memories: Memory[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Memory;
      
      // If tagPattern contains wildcards, filter in memory
      if (input.tagPattern && input.tagPattern.includes('*')) {
        const pattern = input.tagPattern.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (!regex.test(data.tag)) {
          return;
        }
      }
      
      memories.push(data);
    });

    return memories;
  }

  /**
   * Get memories by specific tags (exact matches)
   * 
   * @param userId - Unique user identifier  
   * @param tags - Array of exact tag names to match
   * @param limit - Maximum number of memories to return per tag
   * @returns Promise that resolves to array of matching memories
   */
  static async getMemoriesByTags(
    userId: string,
    tags: string[],
    limit: number = 10
  ): Promise<Memory[]> {
    if (tags.length === 0) return [];

    const batch = writeBatch(db);
    const memories: Memory[] = [];

    // Use batched queries for better performance with multiple tags
    for (const tag of tags) {
      const tagMemories = await this.getMemories(userId, tag, limit);
      memories.push(...tagMemories);
    }

    // Sort by creation date and limit total results
    return memories
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit * tags.length);
  }

  /**
   * Delete a specific memory by ID
   * 
   * @param memoryId - The ID of the memory to delete
   * @returns Promise that resolves when memory is deleted
   */
  static async deleteMemory(memoryId: string): Promise<void> {
    const memoryDocRef = doc(db, this.COLLECTION_NAME, memoryId);
    const memoryDoc = await getDoc(memoryDocRef);
    
    if (!memoryDoc.exists()) {
      throw new Error(`Memory with ID ${memoryId} not found`);
    }

    await setDoc(memoryDocRef, { deleted: true, deletedAt: Date.now() }, { merge: true });
  }

  /**
   * Update an existing memory's payload
   * 
   * @param memoryId - The ID of the memory to update
   * @param payload - New payload data
   * @returns Promise that resolves when memory is updated
   */
  static async updateMemory(memoryId: string, payload: any): Promise<void> {
    const memoryDocRef = doc(db, this.COLLECTION_NAME, memoryId);
    const memoryDoc = await getDoc(memoryDocRef);
    
    if (!memoryDoc.exists()) {
      throw new Error(`Memory with ID ${memoryId} not found`);
    }

    await setDoc(memoryDocRef, { 
      payload, 
      updatedAt: Date.now() 
    }, { merge: true });
  }
}

/**
 * Convenience function for saving a memory
 * 
 * @param userId - Unique identifier for the user
 * @param tag - Simple string tag or wildcard pattern for categorization
 * @param payload - Arbitrary JSON to persist
 * @param source - Optional source flow identifier
 */
export async function saveMemory(
  userId: string, 
  tag: string, 
  payload: any, 
  source?: string
): Promise<void> {
  return MemoryService.saveMemory(userId, tag, payload, source);
}

/**
 * Convenience function for retrieving memories
 * 
 * @param userId - Unique identifier for the user
 * @param tagPattern - Optional simple string tag or wildcard pattern
 * @returns Promise resolving to array of matching memories
 */
export async function getMemories(
  userId: string,
  tagPattern?: string
): Promise<any[]> {
  const memories = await MemoryService.getMemories(userId, tagPattern);
  return memories.map(memory => memory.payload);
}