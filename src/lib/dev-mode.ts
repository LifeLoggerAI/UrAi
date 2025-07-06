import { db, auth } from '@/lib/firebase';
import { writeBatch, doc, collection, getDoc, serverTimestamp } from 'firebase/firestore';
import type { User as FirestoreUser, VoiceEvent, Dream, Person, MemoryBloom, AuraState } from '@/lib/types';

export const devMode = process.env.NODE_ENV === 'development';

// Fake mock user object for previewing the UI
export const mockUser = {
  uid: "demo_user_001",
  displayName: "Demo User",
  email: "demo@lifelogger.app",
  photoURL: "https://placehold.co/128x128.png"
};

// Use this helper to get the current user, with devMode override
export const getCurrentUser = () => {
  return devMode ? mockUser : auth.currentUser;
};

// Firestore mock data loader for fake user
export const loadMockData = async () => {
  if (!devMode) return;

  try {
    const userRef = doc(db, "users", mockUser.uid);
    const userDocSnap = await getDoc(userRef);

    if (userDocSnap.exists()) {
      // Data already loaded, no need to re-inject.
      return;
    }

    console.log("Injecting mock data for dev mode...");
    const batch = writeBatch(db);
    
    // User Document
    const userDocForDb: Partial<FirestoreUser> = {
        displayName: "Demo User",
        email: "test@lifelogger.app",
        onboardingComplete: true,
        createdAt: Date.now(),
        avatarUrl: mockUser.photoURL,
    };
    batch.set(userRef, userDocForDb, { merge: true });

    // Aura State
    const auraRef = doc(db, `users/${mockUser.uid}/auraStates/current`);
    const auraState: AuraState = {
        currentEmotion: "curiosity",
        overlayColor: "hsla(200, 80%, 70%, 0.7)",
        overlayStyle: "glow",
        lastUpdated: Date.now(),
    };
    batch.set(auraRef, auraState);

    // People (Social Silhouettes)
    const peopleData: Omit<Person, 'id'>[] = [
        { uid: mockUser.uid, name: 'Alex', lastSeen: Date.now() - 86400000, familiarityIndex: 5, socialRoleHistory: [{ date: Date.now(), role: 'Mentor' }], avatarUrl: 'https://placehold.co/128x128.png' },
        { uid: mockUser.uid, name: 'Jordan', lastSeen: Date.now() - 172800000, familiarityIndex: 8, socialRoleHistory: [{ date: Date.now(), role: 'Friend' }], avatarUrl: 'https://placehold.co/128x128.png' },
        { uid: mockUser.uid, name: 'Sam', lastSeen: Date.now() - 259200000, familiarityIndex: 2, socialRoleHistory: [{ date: Date.now(), role: 'Collaborator' }], avatarUrl: 'https://placehold.co/128x128.png' },
    ];
    peopleData.forEach(person => {
        const personRef = doc(collection(db, 'people'));
        batch.set(personRef, { ...person, id: personRef.id });
    });
    
    // Memory Blooms (Garden)
    const bloomData: Omit<MemoryBloom, 'bloomId'>[] = [
        { emotion: 'joy', bloomColor: '#7CFC00', triggeredAt: Date.now() - 86400000, description: 'A moment of pure joy was detected.' },
        { emotion: 'recovery', bloomColor: '#32CD32', triggeredAt: Date.now() - 259200000, description: 'A significant recovery took place.' },
        { emotion: 'calm', bloomColor: '#1E90FF', triggeredAt: Date.now() - 604800000, description: 'A period of calm reflection.' },
    ];
    bloomData.forEach(bloom => {
        const bloomRef = doc(collection(db, `users/${mockUser.uid}/memoryBlooms`));
        batch.set(bloomRef, { ...bloom, bloomId: bloomRef.id });
    });

    // Voice Event for dashboard
    const voiceEventRef = doc(collection(db, 'voiceEvents'));
    const voiceEvent: VoiceEvent = {
        id: voiceEventRef.id, uid: mockUser.uid, audioEventId: 'mock_audio_1', speakerLabel: 'user',
        text: "Just had a deep conversation about the future, feeling hopeful.",
        createdAt: Date.now() - 86400000 * 2,
        emotion: 'hope', sentimentScore: 0.7, toneShift: 0.1, voiceArchetype: 'Storyteller', people: ['Alex'], tasks: []
    };
    batch.set(voiceEventRef, voiceEvent);
    
    // Dream event for dashboard
    const dreamEventRef = doc(collection(db, 'dreamEvents'));
    const dreamEvent: Dream = {
        id: dreamEventRef.id, uid: mockUser.uid,
        text: "I dreamt I was flying over a city of lights.",
        createdAt: Date.now() - 86400000 * 3,
        emotions: ['joy', 'wonder'], themes: ['flying', 'city'], symbols: ['lights'], sentimentScore: 0.9
    };
    batch.set(dreamEventRef, dreamEvent);


    await batch.commit();
    console.log("✅ Mock Firestore data injected for dev mode.");
  } catch (error: any) {
    if (error.code === 'permission-denied' || error.code === 'unavailable') {
        console.warn("Firestore connection not available. Mock data not loaded. This is expected if emulators are not running.");
    } else {
      console.error("Error loading mock data:", error);
    }
  }
};
