import { db } from './firebase';
import { doc, writeBatch, collection, serverTimestamp } from 'firebase/firestore';
import type {
  User,
  VoiceEvent,
  Person,
  AudioEvent,
  MemoryBloom,
  Dream,
  InnerVoiceReflection,
  WeeklyScroll,
  Companion,
  PersonaProfile,
} from './types';

export const devMode = process.env.NODE_ENV === 'development';

export const DEMO_USER_ID = 'demo_user_001';

export async function seedDemoData(userId: string) {
  if (!userId) return;
  console.log(`🌱 Seeding demo data for user: ${userId}...`);

  try {
    const batch = writeBatch(db);
    const now = Date.now();

    // 1. User Profile
    const userRef = doc(db, 'users', userId);
    const demoPersonaProfile: PersonaProfile = {
      traits: {
        openness: 0.72,
        resilience: 0.41,
        socialTrust: 0.58,
        shadowDominance: 0.33,
      },
      traitChanges: [
        { trait: 'resilience', from: 0.2, to: 0.41, date: new Date(now - 86400000 * 5).toISOString() },
      ],
      dominantPersona: 'The Architect',
      moodAlignmentScore: 0.74,
      conflictEvents: ['voiceToneMismatch', 'avoidanceCluster'],
      highProductivityWhen: ['focused + isolated'],
      emotionalDrainWhen: ['social + high noise'],
    };
    const demoUser: Partial<User> = {
      displayName: 'Demo User',
      email: 'test@lifelogger.app',
      onboardingComplete: true,
      createdAt: now - 86400000 * 30, // 30 days ago
      mood: 'Curious',
      location: 'Studio',
      lastVoiceTranscript: 'Just had a deep conversation about the future.',
      lastActivity: 'Walking + Talking',
      demoMode: true,
      avatarUrl: `https://placehold.co/128x128.png?text=D`,
      personaProfile: demoPersonaProfile,
    };
    batch.set(userRef, demoUser, { merge: true });

    // 2. Default Companion
    const companionRef = doc(collection(db, 'companions'), userId);
    const newCompanion: Companion = {
      id: userId,
      uid: userId,
      archetype: 'Healer',
      tone: 'supportive',
      memoryThread: [],
      evolutionStage: 'Healer → Reclaimer',
      voicePreset: 'soft_neutral_female',
      isActive: true,
    };
    batch.set(companionRef, newCompanion);

    // 3. Sample Person "Alex"
    const personRef = doc(collection(db, 'people'));
    const person: Person = {
      id: personRef.id,
      uid: userId,
      name: 'Alex',
      lastSeen: now - 86400000, // 1 day ago
      familiarityIndex: 5,
      socialRoleHistory: [{ date: now - 86400000, role: 'Friend' }],
      avatarUrl: `https://placehold.co/128x128.png?text=A`,
    };
    batch.set(personRef, person);

    // 4. Multiple Voice Events
    const voiceEvents: Partial<VoiceEvent>[] = [
        { text: 'Meeting with Alex was intense today.', emotion: 'tense', sentimentScore: -0.6, voiceArchetype: 'Confidant', people: ['Alex'], createdAt: now - 86400000 * 2 },
        { text: 'Finally finished the big project, feeling so relieved.', emotion: 'relief', sentimentScore: 0.8, voiceArchetype: 'Achiever', tasks: ['Finish project'], createdAt: now - 86400000 },
        { text: 'Just woke up from the strangest dream about flying.', emotion: 'wonder', sentimentScore: 0.5, voiceArchetype: 'Dreamer', createdAt: now - 3600000 },
    ];
    
    voiceEvents.forEach(event => {
        const voiceEventId = doc(collection(db, 'voiceEvents')).id;
        const newVoiceEvent: VoiceEvent = {
            id: voiceEventId,
            uid: userId,
            audioEventId: 'dummy_audio_id',
            speakerLabel: 'user',
            ...event,
        } as VoiceEvent;
        batch.set(doc(db, 'voiceEvents', voiceEventId), newVoiceEvent);
    });

    // 5. Dream
    const dreamRef = doc(collection(db, 'dreamEvents'));
    const dream: Dream = {
      id: dreamRef.id,
      uid: userId,
      text: 'Dreamt of flying over a neon city.',
      createdAt: now - 86400000,
      emotions: ['wonder', 'freedom'],
      themes: ['flying', 'cityscape'],
      symbols: ['neon lights', 'height'],
      sentimentScore: 0.8,
    };
    batch.set(dreamRef, dream);

    // 6. Inner text reflection
    const innerTextRef = doc(collection(db, 'innerTexts'));
    const innerText: InnerVoiceReflection = {
      id: innerTextRef.id,
      uid: userId,
      text: 'Feeling a bit unfocused today, need to center myself.',
      createdAt: now - 3600000, // 1 hour ago
      sentimentScore: -0.2,
    };
    batch.set(innerTextRef, innerText);

    // 7. Mock Export Jobs for the user's subcollection
    const doneExportRef = doc(collection(db, `users/${userId}/exports`));
    batch.set(doneExportRef, {
      id: doneExportRef.id,
      type: 'weekly_scroll',
      status: 'done',
      url: '#', // Placeholder URL
      createdAt: serverTimestamp(),
    });

    const failedExportRef = doc(collection(db, `users/${userId}/exports`));
    batch.set(failedExportRef, {
      id: failedExportRef.id,
      type: 'aura_scroll',
      status: 'failed',
      error: 'FFmpeg process timed out after 3 minutes.',
      createdAt: serverTimestamp(),
    });

    await batch.commit();
    console.log('✅ Demo data seeded successfully.');
  } catch (error) {
    console.error('🔥 Error seeding demo data:', error);
  }
}
