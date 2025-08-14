
import { db } from './firebase';
import { doc, writeBatch, collection } from 'firebase/firestore';
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
        { trait: 'resilience', from: 0.2, to: 0.41, date: '2025-07-02' },
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
      createdAt: Date.now(),
      mood: 'Curious',
      location: 'Downtown LA',
      lastVoiceTranscript: 'Just had a deep conversation about the future.',
      lastActivity: 'Walking + Talking',
      demoMode: true,
      avatarUrl: `https://placehold.co/128x128.png?text=D`,
      personaProfile: demoPersonaProfile,
    };
    batch.set(userRef, demoUser, { merge: true });

    // 2. Default Companion
    const companionRef = doc(collection(db, 'companions'));
    const newCompanion: Companion = {
      id: companionRef.id,
      uid: userId,
      archetype: 'Healer',
      tone: 'supportive',
      memoryThread: [],
      evolutionStage: 'Healer → Reclaimer',
      voicePreset: 'soft_neutral_female',
      isActive: true,
    };
    batch.set(companionRef, newCompanion);

    // 3. Sample Person "mom"
    const momRef = doc(collection(db, 'people'));
    const momPerson: Person = {
      id: momRef.id,
      uid: userId,
      name: 'mom',
      lastSeen: Date.now() - 86400000, // 1 day ago
      familiarityIndex: 5,
      socialRoleHistory: [{ date: Date.now() - 86400000, role: 'Family' }],
      avatarUrl: `https://placehold.co/128x128.png?text=M`,
    };
    batch.set(momRef, momPerson);

    // 4. Voice Event from previous request
    const audioEventRef = doc(collection(db, 'audioEvents'));
    const voiceEventRef = doc(collection(db, 'voiceEvents'));

    const intenseAudioEvent: AudioEvent = {
      id: audioEventRef.id,
      uid: userId,
      storagePath: 'dummy/path',
      startTs: Date.now() - 172800000, // 2 days ago
      endTs: Date.now() - 172800000 + 54000,
      durationSec: 54,
      transcriptionStatus: 'complete',
    };
    batch.set(audioEventRef, intenseAudioEvent);

    const intenseVoiceEvent: VoiceEvent = {
      id: voiceEventRef.id,
      uid: userId,
      audioEventId: audioEventRef.id,
      speakerLabel: 'user',
      text: 'Meeting with mom was intense today.',
      createdAt: Date.now() - 172800000,
      emotion: 'tense',
      sentimentScore: -0.6,
      toneShift: 0.8,
      voiceArchetype: 'Confidant',
      people: ['mom'],
      tasks: [],
    };
    batch.set(voiceEventRef, intenseVoiceEvent);

    // 5. Add the new voice log from the user's prompt
    const newVoiceLogRef = doc(collection(db, 'voiceEvents'));
    const newAudioEventRef = doc(collection(db, 'audioEvents'));
    const newAudioEvent: AudioEvent = {
      id: newAudioEventRef.id,
      uid: userId,
      storagePath: 'dummy/path',
      startTs: new Date('2025-07-05').getTime(),
      endTs: new Date('2025-07-05').getTime() + 30000,
      durationSec: 30,
      transcriptionStatus: 'complete',
    };
    batch.set(newAudioEventRef, newAudioEvent);

    const newVoiceLog: VoiceEvent = {
      id: newVoiceLogRef.id,
      uid: userId,
      audioEventId: newAudioEventRef.id,
      speakerLabel: 'system_insight',
      text: 'You were overwhelmed but kept going.',
      createdAt: new Date('2025-07-05').getTime(),
      emotion: 'resilience',
      sentimentScore: 0.3,
      toneShift: 0.2,
      voiceArchetype: 'Observer',
      people: [],
      tasks: [],
    };
    batch.set(newVoiceLogRef, newVoiceLog);

    // 6. Add more diverse data to populate the UI
    const bloomRef = doc(collection(db, 'memoryBlooms'));
    const bloom: MemoryBloom = {
      bloomId: bloomRef.id,
      uid: userId,
      emotion: 'joy',
      bloomColor: '#7CFC00',
      triggeredAt: Date.now() - 259200000, // 3 days ago
      description: 'A moment of pure joy was detected.',
    };
    batch.set(bloomRef, bloom);

    const recoveryBloomRef = doc(collection(db, 'memoryBlooms'));
    const recoveryBloom: MemoryBloom = {
      bloomId: recoveryBloomRef.id,
      uid: userId,
      emotion: 'recovery',
      bloomColor: 'hsl(140, 70%, 60%)', // A green color for recovery
      triggeredAt: new Date('2025-07-05').getTime(),
      description: 'After weeks of fog, you found focus again.',
      trigger: 'Shadow Rebound',
    };
    batch.set(recoveryBloomRef, recoveryBloom);

    const dreamRef = doc(collection(db, 'dreamEvents'));
    const dream: Dream = {
      id: dreamRef.id,
      uid: userId,
      text: 'Dreamt of flying over a neon city.',
      createdAt: Date.now() - 86400000,
      emotions: ['wonder', 'freedom'],
      themes: ['flying', 'cityscape'],
      symbols: ['neon lights', 'height'],
      sentimentScore: 0.8,
    };
    batch.set(dreamRef, dream);

    const innerTextRef = doc(collection(db, 'innerTexts'));
    const innerText: InnerVoiceReflection = {
      id: innerTextRef.id,
      uid: userId,
      text: 'Feeling a bit unfocused today, need to center myself.',
      createdAt: Date.now() - 3600000, // 1 hour ago
      sentimentScore: -0.2,
    };
    batch.set(innerTextRef, innerText);

    // 7. Weekly Scroll
    const scrollRef = doc(collection(db, 'weeklyScrolls'));
    const weeklyScroll: WeeklyScroll = {
      id: scrollRef.id,
      uid: userId,
      weekStart: new Date('2025-07-01').getTime(),
      weekEnd: new Date('2025-07-07').getTime(),
      summaryMood: 'rebuilding',
      highlights: [
        { type: 'event', text: 'Emotional talk with Alex' },
        { type: 'recovery', text: 'Hope restored' },
      ],
      narrationScript: 'This week, you moved through tension toward healing...',
      exportLinks: {
        audio: '/exports/audio/2025-07-07.mp3',
        image: '/exports/image/2025-07-07.png',
      },
      createdAt: new Date('2025-07-08').getTime(),
    };
    batch.set(scrollRef, weeklyScroll);

    const storyScrollRef = doc(collection(db, 'weeklyScrolls'));
    const storyScroll: WeeklyScroll = {
      id: storyScrollRef.id,
      uid: userId,
      title: 'Becoming the Reclaimer',
      segments: [
        'Winter fog',
        'Shadow spiral',
        'First dream of clarity',
        'Emotional bloom',
      ],
      highlights: [],
      narrationScript:
        'A story of transformation and reclaiming parts of oneself.',
      exportLinks: {
        audio: '/exports/audio/story_reclaimer.mp3',
        image: '/exports/image/story_reclaimer.png',
      },
      createdAt: new Date('2025-07-08').getTime(),
      linkedUserIds: ['parent_userId_001', 'child_userId_002'],
      summaryMood: 'transformative',
    };
    batch.set(storyScrollRef, storyScroll);

    await batch.commit();
    console.log('✅ Demo data seeded successfully.');
  } catch (error) {
    console.error('🔥 Error seeding demo data:', error);
  }
}
