import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function seedDemo(uid: string) {
  if (process.env.NODE_ENV !== 'development') return;
  // Example: add a mood log and a star event
  await addDoc(collection(db, 'moods'), {
    uid,
    mood: 'hopeful',
    score: 7,
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, 'stars'), {
    uid,
    type: 'memoryBloom',
    title: 'First Light',
    createdAt: serverTimestamp(),
  });
}
