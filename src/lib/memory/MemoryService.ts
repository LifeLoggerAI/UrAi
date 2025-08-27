/**
 * @fileOverview A service for interacting with the user's memories in Firestore.
 *
 * This service provides a centralized API for saving and retrieving memories,
 * ensuring that all AI flows have access to a consistent, shared context.
 */

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import type { Memory } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export class MemoryService {
  private uid: string;
  private memoriesCollection;

  constructor(uid: string) {
    if (!uid) {
      throw new Error('A user ID must be provided to the MemoryService.');
    }
    this.uid = uid;
    this.memoriesCollection = collection(db, 'memories');
  }

  /**
   * Saves a new memory to Firestore.
   * @param memory - The memory object to save, uid and createdAt will be overwritten.
   * @returns The ID of the newly created memory document.
   */
  async saveMemory(memory: Omit<Memory, 'id' | 'uid' | 'createdAt'>): Promise<string> {
    const memoryId = uuidv4();
    const newMemory: Memory = {
      ...memory,
      id: memoryId,
      uid: this.uid,
      createdAt: Date.now(),
    };

    const memoryDocRef = doc(this.memoriesCollection, memoryId);
    await setDoc(memoryDocRef, newMemory);
    
    return memoryId;
  }

  /**
   * Retrieves memories for the user, filtered by tags and ordered by date.
   * @param tags - An array of tags to filter by.
   * @param count - The maximum number of memories to retrieve.
   * @returns A promise that resolves to an array of memory objects.
   */
  async retrieveMemories(tags: string[], count: number = 10): Promise<Memory[]> {
    const q = query(
      this.memoriesCollection,
      where('uid', '==', this.uid),
      where('tags', 'array-contains-any', tags),
      orderBy('createdAt', 'desc'),
      limit(count)
    );

    const querySnapshot = await getDocs(q);
    const memories = querySnapshot.docs.map(doc => doc.data() as Memory);
    
    // Firestore queries are sorted by one field, so we need to re-sort by date client-side
    // after fetching, as the `array-contains-any` prevents multiple orderBy clauses.
    return memories.sort((a, b) => a.createdAt - b.createdAt);
  }
}
