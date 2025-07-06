import { db, auth } from '@/lib/firebase';
import { writeBatch, doc, collection, getDoc } from 'firebase/firestore';
import type { User as FirestoreUser, VoiceEvent, Dream, Person } from '@/lib/types';

export const devMode = process.env.NODE_ENV === 'development';

// Fake mock user object for previewing the UI
export const mockUser = {
  uid: "demo_user_001",
  displayName: "Demo User",
  email: "demo@lifelogger.app",
  photoURL: "https://i.imgur.com/abc123.png"
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
      console.log("✅ Dev mode user data already exists. Skipping mock data load.");
      return;
    }

    const batch = writeBatch(db);
    const now = Date.now();
    
    const userDocForDb: Partial<FirestoreUser> = {
        uid: mockUser.uid,
        displayName: mockUser.displayName,
        email: mockUser.email,
        avatarUrl: mockUser.photoURL,
        onboardingComplete: true,
        isProUser: true,
        createdAt: now,
        lastLogin: now,
        avatarState: "evolving",
        mood: "curious",
        stats: {
          focus: 72,
          emotion: "balanced",
          reflectionScore: 88,
          rhythmState: "Stable"
        },
        socialGraph: {
          connections: 4,
          topEmotion: "supportive"
        },
        location: {
          city: "San Francisco",
          weather: "Partly Cloudy"
        },
        constellation: {
          memories: 8,
          currentTheme: "Growth",
          archetype: "Seeker"
        }
    };
    batch.set(userRef, userDocForDb, { merge: true });

    // Mock Voice Events
    const voiceEvent1Id = doc(collection(db, 'voiceEvents')).id;
    const voiceEvent1: VoiceEvent = {
        id: voiceEvent1Id,
        uid: mockUser.uid,
        audioEventId: 'mock_audio_1',
        speakerLabel: 'user',
        text: "Had a breakthrough on the project today. Feeling really proud of the team. I should remember to thank Sarah for her help.",
        createdAt: now - 86400000 * 2, // 2 days ago
        emotion: 'joy',
        sentimentScore: 0.8,
        toneShift: 0.2,
        voiceArchetype: 'Leader',
        people: ['Sarah'],
        tasks: ['Thank Sarah for her help'],
    };
    batch.set(doc(db, "voiceEvents", voiceEvent1Id), voiceEvent1);
    
    const voiceEvent2Id = doc(collection(db, 'voiceEvents')).id;
    const voiceEvent2: VoiceEvent = {
        id: voiceEvent2Id,
        uid: mockUser.uid,
        audioEventId: 'mock_audio_2',
        speakerLabel: 'user',
        text: "Feeling a bit stressed about the upcoming deadline. It's a lot of pressure, but I think I can handle it.",
        createdAt: now - 86400000, // 1 day ago
        emotion: 'anxiety',
        sentimentScore: -0.4,
        toneShift: 0.5,
        voiceArchetype: 'Reporter',
        people: [],
        tasks: [],
    };
    batch.set(doc(db, "voiceEvents", voiceEvent2Id), voiceEvent2);

    // Mock Dream Event
    const dreamEventId = doc(collection(db, 'dreamEvents')).id;
    const dreamEvent: Dream = {
        id: dreamEventId,
        uid: mockUser.uid,
        text: "I dreamt I was flying over a city made of glass. It was beautiful but I was afraid of falling.",
        createdAt: now - 86400000 * 3, // 3 days ago
        emotions: ['wonder', 'fear'],
        themes: ['ambition', 'vulnerability'],
        symbols: ['flying', 'glass city'],
        sentimentScore: 0.3,
    };
    batch.set(doc(db, "dreamEvents", dreamEventId), dreamEvent);
    
    // Mock Person
    const personId = doc(collection(db, 'people')).id;
    const person: Person = {
        id: personId,
        uid: mockUser.uid,
        name: 'Sarah',
        lastSeen: now - 86400000 * 2,
        familiarityIndex: 5,
        socialRoleHistory: [{ date: now - 86400000 * 2, role: 'Collaborator' }],
        avatarUrl: `https://placehold.co/128x128.png?text=S`,
    };
    batch.set(doc(db, "people", personId), person);
    
    await batch.commit();
    console.log("✅ Mock Firestore data injected for dev mode.");
  } catch (error: any) {
    if (error.code === 'permission-denied') {
        console.warn("Firestore permission denied. Mock data not loaded. Ensure your Firestore rules are open for dev mode.");
    } else {
      console.error("Error loading mock data:", error);
    }
  }
};
