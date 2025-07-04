
import { z } from "zod";

// Base sentiment type
export type Sentiment = "positive" | "negative" | "neutral";

// From Blueprint Data Model
export const UserSchema = z.object({
    uid: z.string(),
    displayName: z.string().optional(),
    email: z.string().email().optional(),
    createdAt: z.number(),
    avatarUrl: z.string().url().optional(),
    isProUser: z.boolean().default(false),
    onboardingComplete: z.boolean().default(false),
    pronouns: z.string().optional(),
    moodColor: z.string().optional(),
    avatarStyle: z.string().optional(),
    lastLoginAt: z.number().optional(),
    lastLogoutAt: z.number().optional(),
    settings: z.object({
        moodTrackingEnabled: z.boolean().default(true),
        passiveAudioEnabled: z.boolean().default(true),
        faceEmotionEnabled: z.boolean().default(false),
        dataExportEnabled: z.boolean().default(true),
        narratorVolume: z.number().min(0).max(1).default(0.8),
        ttsVoice: z.string().default('warmCalm'),
        pushNotifications: z.boolean().default(true),
        // New privacy fields
        gpsAllowed: z.boolean().default(false),
        contributeMoodData: z.boolean().default(true),
        allowAnonymizedExport: z.boolean().default(false),
        allowVoiceRetention: z.boolean().default(true),
        // New email fields
        receiveWeeklyEmail: z.boolean().default(true),
        receiveMilestones: z.boolean().default(true),
        emailTone: z.string().default('poetic'),
    }).optional(),
    narratorPrefs: z.object({
        toneStyle: z.string(),
        metaphorLexicon: z.array(z.string()),
        ttsConfig: z.object({ pitch: z.number(), speed: z.number() }),
    }).optional(),
    personaProfile: z.record(z.any()).optional(),
    symbolLexicon: z.record(z.any()).optional(),
    subscriptionTier: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const PermissionsSchema = z.object({
    micPermission: z.boolean(),
    gpsPermission: z.boolean(),
    motionPermission: z.boolean(),
    notificationsPermission: z.boolean(),
    shareAnonymizedData: z.boolean(),
    acceptedTerms: z.boolean(),
    acceptedPrivacyPolicy: z.boolean(),
    consentTimestamp: z.number(),
    acceptedTermsVersion: z.string().optional(),
});
export type Permissions = z.infer<typeof PermissionsSchema>;

export const AudioEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    storagePath: z.string(),
    startTs: z.number(),
    endTs: z.number(),
    durationSec: z.number(),
    voicePrintHashes: z.array(z.string()).optional(),
    transcriptionStatus: z.enum(["pending", "complete", "error"]),
    conversationId: z.string().optional(),
});
export type AudioEvent = z.infer<typeof AudioEventSchema>;

export const VoiceEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    audioEventId: z.string(),
    speakerLabel: z.string(),
    text: z.string(),
    emotion: z.string(),
    sentimentScore: z.number(),
    toneShift: z.number(),
    voiceArchetype: z.string(),
    createdAt: z.number(),
    people: z.array(z.string()).optional(),
    tasks: z.array(z.string()).optional(),
});
export type VoiceEvent = z.infer<typeof VoiceEventSchema>;

export const PersonSchema = z.object({
    id: z.string(),
    uid: z.string(),
    name: z.string(),
    lastSeen: z.number(),
    familiarityIndex: z.number().optional(),
    socialRoleHistory: z.array(z.object({
        date: z.number(),
        role: z.string(),
    })),
    avatarUrl: z.string().optional(),
    // New fields from 'socialContacts'
    voiceprintId: z.string().optional(),
    interactionCount: z.number().optional(),
    voiceMemoryStrength: z.number().optional(), // 0-100
    echoLoopScore: z.number().optional(), // 0-100
    silenceDurationDays: z.number().optional(),
    orbitRadius: z.number().optional(),
    isFlagged: z.boolean().optional(),
});
export type Person = z.infer<typeof PersonSchema>;

export const DreamSchema = z.object({
    id: z.string(),
    uid: z.string(),
    text: z.string(),
    createdAt: z.number(),
    emotions: z.array(z.string()),
    themes: z.array(z.string()),
    symbols: z.array(z.string()),
    sentimentScore: z.number(),
});
export type Dream = z.infer<typeof DreamSchema>;

export const InnerVoiceReflectionSchema = z.object({
    id: z.string(),
    uid: z.string(),
    text: z.string(),
    createdAt: z.number(),
    sentimentScore: z.number(),
});
export type InnerVoiceReflection = z.infer<typeof InnerVoiceReflectionSchema>;


export const FaceSnapshotSchema = z.object({
    id: z.string(),
    uid: z.string(),
    storagePath: z.string(),
    createdAt: z.number(),
    dominantEmotion: z.string(),
    confidence: z.number(),
});
export type FaceSnapshot = z.infer<typeof FaceSnapshotSchema>;

// Schemas for Emotion Overlay Engine
export const MoodLogSchema = z.object({
    timestamp: z.number(),
    emotion: z.string(),
    intensity: z.number(),
    physicalState: z.string().optional(),
    source: z.string(),
});
export type MoodLog = z.infer<typeof MoodLogSchema>;

export const AuraStateSchema = z.object({
    currentEmotion: z.string(),
    overlayColor: z.string(),
    overlayStyle: z.string(),
    startedAt: z.number(),
    lastUpdated: z.number(),
});
export type AuraState = z.infer<typeof AuraStateSchema>;

export const EmotionCycleSchema = z.object({
    windowStart: z.number(),
    dominantEmotion: z.string(),
    avgIntensity: z.number(),
    cycleType: z.string(),
});
export type EmotionCycle = z.infer<typeof EmotionCycleSchema>;

export const MemoryBloomSchema = z.object({
    bloomId: z.string(),
    emotion: z.string(),
    bloomColor: z.string(),
    triggeredAt: z.number(),
    description: z.string(),
});
export type MemoryBloom = z.infer<typeof MemoryBloomSchema>;

// Schemas for Torso Module
export const TorsoMetricsSchema = z.object({
    uid: z.string(),
    dateKey: z.string(),
    vitalityScore: z.number(),
    valueAlignmentScore: z.number(),
    selfConsistencyScore: z.number(),
    overstimIndex: z.number(),
    motivatorRankings: z.record(z.number()),
    updatedAt: z.number(),
});
export type TorsoMetrics = z.infer<typeof TorsoMetricsSchema>;

export const HabitEventSchema = z.object({
    uid: z.string(),
    eventId: z.string(),
    timestamp: z.number(),
    category: z.string(),
    intensity: z.number(),
    detectedBy: z.string(),
    source: z.string(),
});
export type HabitEvent = z.infer<typeof HabitEventSchema>;

export const NarratorInsightSchema = z.object({
    uid: z.string(),
    insightId: z.string(),
    insightType: z.string(),
    payload: z.record(z.any()),
    suggestedRitualId: z.string().optional(),
    consumed: z.boolean(),
    createdAt: z.number(),
});
export type NarratorInsight = z.infer<typeof NarratorInsightSchema>;


// Schemas for Legs/Movement Module
export const LegsMetricsSchema = z.object({
    uid: z.string(),
    dateKey: z.string(),
    dailyStabilityScore: z.number(),
    behaviorMomentum: z.number(),
    routinePathType: z.enum(["linear", "loop", "fragmented"]),
    avoidanceZoneScore: z.number(),
    groundingQuality: z.number(),
    updatedAt: z.number(),
});
export type LegsMetrics = z.infer<typeof LegsMetricsSchema>;

export const MovementPathSchema = z.object({
    uid: z.string(),
    dateKey: z.string(),
    polylineEncoded: z.string(),
    distanceMeters: z.number(),
    stepCount: z.number(),
    stillnessSecs: z.number(),
    runSecs: z.number(),
    visitClusters: z.array(z.any()), // GeoPoint
    updatedAt: z.number(),
});
export type MovementPath = z.infer<typeof MovementPathSchema>;

export const AvoidanceEventSchema = z.object({
    uid: z.string(),
    eventId: z.string(),
    timestamp: z.number(),
    contextType: z.string(),
    contextId: z.string(),
    intensity: z.number(),
    predictedCause: z.string(),
    source: z.string(),
});
export type AvoidanceEvent = z.infer<typeof AvoidanceEventSchema>;

// Schemas for Arms Module
export const ArmMetricsSchema = z.object({
    uid: z.string(),
    dateKey: z.string(),
    actionFollowThroughScore: z.number().min(0).max(100),
    emotionalEffortLoad: z.number().min(0).max(100),
    relationalInitiationRatio: z.number().min(0).max(1),
    delegationIndex: z.number().min(0).max(100),
    connectionEchoScore: z.number().min(0).max(100),
    leftRightBias: z.enum(["left", "right", "balanced"]),
    updatedAt: z.number(),
});
export type ArmMetrics = z.infer<typeof ArmMetricsSchema>;

export const RelationalGestureSchema = z.object({
    uid: z.string(),
    eventId: z.string(),
    timestamp: z.number(),
    gestureType: z.enum(["reach", "support", "withdrawal"]),
    contextType: z.enum(["call", "text", "voice", "touch"]),
    direction: z.enum(["initiated", "received"]),
    armSide: z.enum(["left", "right"]),
    toneAnalysis: z.record(z.number()),
    durationSecs: z.number(),
});
export type RelationalGesture = z.infer<typeof RelationalGestureSchema>;

// Schemas for Social Constellation
export const SocialEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    personId: z.string(),
    timestamp: z.number(),
    interactionType: z.enum(["voice", "text", "physical"]),
    toneVector: z.record(z.number()),
    emotionalAfterEffect: z.string(),
    durationSecs: z.number(),
});
export type SocialEvent = z.infer<typeof SocialEventSchema>;

// Schemas for Rotational Swipe Views
export const TimelineEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    timestamp: z.number(),
    tone: z.string(),
    intensity: z.number(),
    description: z.string(),
    linkedZone: z.string(),
});
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

export const ShadowEpisodeSchema = z.object({
    id: z.string(),
    uid: z.string(),
    startTimestamp: z.number(),
    endTimestamp: z.number(),
    shadowType: z.string(),
    resolutionStatus: z.enum(["unresolved", "recovering"]),
});
export type ShadowEpisode = z.infer<typeof ShadowEpisodeSchema>;

export const ForecastProfileSchema = z.object({
    id: z.string(),
    uid: z.string(),
    date: z.number(),
    predictedTone: z.string(),
    confidence: z.number(),
    ritualSuggestionId: z.string().optional(),
});
export type ForecastProfile = z.infer<typeof ForecastProfileSchema>;

export const ArchetypeStateSchema = z.object({
    id: z.string(),
    uid: z.string(),
    startDate: z.number(),
    endDate: z.number().nullable(),
    archetypeLabel: z.string(),
    morphProgress: z.number(),
});
export type ArchetypeState = z.infer<typeof ArchetypeStateSchema>;

export const LegacyThreadSchema = z.object({
    id: z.string(),
    uid: z.string(),
    theme: z.string(),
    plannedOutcome: z.string(),
    progressScore: z.number(),
});
export type LegacyThread = z.infer<typeof LegacyThreadSchema>;

export const PresentMetricsSchema = z.object({
    uid: z.string(),
    currentAuraColor: z.string(),
    heartbeat: z.number(),
    updatedAt: z.number(),
});
export type PresentMetrics = z.infer<typeof PresentMetricsSchema>;

// Schemas for Orb AI Coach System
export const OrbStateSchema = z.object({
    uid: z.string(),
    currentMode: z.enum(["idle", "chat", "ritual", "coreView"]),
    lastInsightAt: z.number(),
    moodColor: z.string(),
    forecastTrigger: z.string().optional(),
    isSpeaking: z.boolean().default(false),
});
export type OrbState = z.infer<typeof OrbStateSchema>;

export const OrbEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    eventType: z.enum(["tap", "triggered", "voiceReply", "ritualStart"]),
    timestamp: z.number(),
    promptUsed: z.string().optional(),
    aiResponseSummary: z.string().optional(),
    deliveryMethod: z.enum(["text", "tts", "symbolic"]),
    linkedView: z.string().optional(),
});
export type OrbEvent = z.infer<typeof OrbEventSchema>;

export const OrbDialogMemorySchema = z.object({
    id: z.string(),
    uid: z.string(),
    timestamp: z.number(),
    userPrompt: z.string(),
    aiNarration: z.string(),
    moodContext: z.string(),
    voicePlayed: z.boolean(),
});
export type OrbDialogMemory = z.infer<typeof OrbDialogMemorySchema>;

export const OrbSymbolicMapSchema = z.object({
    uid: z.string(),
    dominantSymbols: z.array(z.string()),
    toneMetaphors: z.record(z.string()),
    archetypeOverlay: z.string().optional(),
    preferredTone: z.string(),
});
export type OrbSymbolicMap = z.infer<typeof OrbSymbolicMapSchema>;


// Schemas for Onboarding
export const OnboardIntakeSchema = z.object({
    id: z.string(),
    uid: z.string(),
    fullTranscript: z.string(),
    createdAt: z.number(),
    detectedLanguage: z.string().optional(),
    audioUrl: z.string().url().optional(),
});
export type OnboardIntake = z.infer<typeof OnboardIntakeSchema>;

export const GoalSchema = z.object({
    id: z.string(),
    uid: z.string(),
    title: z.string(),
    createdAt: z.number(),
});
export type Goal = z.infer<typeof GoalSchema>;

export const TaskSchema = z.object({
    id: z.string(),
    uid: z.string(),
    title: z.string(),
    dueDate: z.number(),
    status: z.enum(["pending", "complete"]),
});
export type Task = z.infer<typeof TaskSchema>;

export const CalendarEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    title: z.string(),
    startTime: z.number(),
    contextSource: z.string(),
});
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export const HabitWatchSchema = z.object({
    id: z.string(),
    uid: z.string(),
    name: z.string(),
    frequency: z.string(),
    context: z.string(),
});
export type HabitWatch = z.infer<typeof HabitWatchSchema>;


// Schemas for Genkit Flows

export const ProcessOnboardingTranscriptInputSchema = z.object({
    transcript: z.string().describe("The full transcript of the user's onboarding conversation."),
});
export type ProcessOnboardingTranscriptInput = z.infer<typeof ProcessOnboardingTranscriptInputSchema>;

export const ProcessOnboardingTranscriptOutputSchema = z.object({
    goal: z.string().describe("The primary goal or dream the user mentioned."),
    task: z.string().describe("A single, small, actionable first step towards that goal."),
    reminderDate: z.string().describe("An ISO 8601 date string for when the user wants a reminder."),
    habitToTrack: z.string().describe("A habit the user wants to track related to their goal."),
});
export type ProcessOnboardingTranscriptOutput = z.infer<typeof ProcessOnboardingTranscriptOutputSchema>;

export const EnrichVoiceEventInputSchema = z.object({
  text: z.string().describe('The full text transcript from a voice recording.'),
});
export type EnrichVoiceEventInput = z.infer<typeof EnrichVoiceEventInputSchema>;

export const EnrichVoiceEventOutputSchema = z.object({
    emotion: z.string().describe("The primary emotion detected in the text."),
    sentimentScore: z.number().describe("A score from -1 (negative) to 1 (positive) representing the overall tone."),
    toneShift: z.number().describe("A score representing the change in tone within the text."),
    voiceArchetype: z.string().describe("The social archetype displayed (e.g., 'Mentor', 'Friend', 'Reporter')."),
    people: z.array(z.string()).describe("A list of names of people mentioned in the transcript."),
    tasks: z.array(z.string()).describe("A list of actionable tasks or to-do items mentioned in the transcript."),
});
export type EnrichVoiceEventOutput = z.infer<typeof EnrichVoiceEventOutputSchema>;


export const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

export const TranscribeAudioOutputSchema = z.object({
    transcript: z.string().describe("The transcribed text from the audio."),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

export const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The generated speech as a data URI in WAV format.'),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

export const SummarizeTextInputSchema = z.object({
  text: z.string().describe('A concatenation of text entries to be summarized.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

export const SummarizeTextOutputSchema = z.object({
    summary: z.string().describe("A concise summary of the key themes, moments, and overall mood from the provided text."),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export const AnalyzeDreamInputSchema = z.object({
  text: z.string().describe('The text of a dream entry.'),
});
export type AnalyzeDreamInput = z.infer<typeof AnalyzeDreamInputSchema>;

export const AnalyzeDreamOutputSchema = z.object({
    emotions: z.array(z.string()).describe("A list of primary emotions present in the dream."),
    themes: z.array(z.string()).describe("A list of recurring themes or topics in the dream."),
    symbols: z.array(z.string()).describe("A list of key symbols and their potential meanings within the dream's context."),
    sentimentScore: z.number().describe("A score from -1 (very negative) to 1 (very positive) for the dream's overall tone."),
});
export type AnalyzeDreamOutput = z.infer<typeof AnalyzeDreamOutputSchema>;

export const GenerateAvatarInputSchema = z.object({
  name: z.string().describe('The name of the person for whom to generate an avatar.'),
  role: z.string().describe('The social role associated with the person.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

export const GenerateAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe('The generated avatar image as a data URI.'),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export const AnalyzeFaceInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFaceInput = z.infer<typeof AnalyzeFaceInputSchema>;

export const AnalyzeFaceOutputSchema = z.object({
  dominantEmotion: z.string().describe('The primary emotion detected in the face (e.g., "joy", "sorrow", "anger").'),
  confidence: z.number().describe('The confidence score for the detected emotion (0 to 1).'),
});
export type AnalyzeFaceOutput = z.infer<typeof AnalyzeFaceOutputSchema>;

export const AnalyzeTextSentimentInputSchema = z.object({
    text: z.string().describe('The text to analyze.'),
});
export type AnalyzeTextSentimentInput = z.infer<typeof AnalyzeTextSentimentInputSchema>;

export const AnalyzeTextSentimentOutputSchema = z.object({
    sentimentScore: z.number().describe("A score from -1 (negative) to 1 (positive) representing the overall tone."),
});
export type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;


// Schema for Settings Form
export const UpdateUserSettingsSchema = z.object({
    displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50, "Display name cannot exceed 50 characters."),
    moodTrackingEnabled: z.boolean().default(true),
    passiveAudioEnabled: z.boolean().default(true),
    faceEmotionEnabled: z.boolean().default(false),
    dataExportEnabled: z.boolean().default(true),
    narratorVolume: z.number().min(0).max(1).default(0.8),
    ttsVoice: z.string().default('warmCalm'),
    // New privacy fields
    gpsAllowed: z.boolean().default(false),
    contributeMoodData: z.boolean().default(true),
    allowAnonymizedExport: z.boolean().default(false),
    allowVoiceRetention: z.boolean().default(true),
    // New email fields
    receiveWeeklyEmail: z.boolean().default(true),
    receiveMilestones: z.boolean().default(true),
    emailTone: z.enum(["poetic", "calm", "analytical"]).default("poetic"),
});
export type UpdateUserSettings = z.infer<typeof UpdateUserSettingsSchema>;

// Schemas for Dashboard View
export const SentimentDataPointSchema = z.object({
  date: z.string(),
  sentiment: z.number(),
});
export type SentimentDataPoint = z.infer<typeof SentimentDataPointSchema>;

export const EmotionCountSchema = z.object({
  name: z.string(),
  count: z.number(),
});
export type EmotionCount = z.infer<typeof EmotionCountSchema>;

export const DashboardDataSchema = z.object({
  sentimentOverTime: z.array(SentimentDataPointSchema),
  emotionBreakdown: z.array(EmotionCountSchema),
  stats: z.object({
    totalMemories: z.number(),
    totalDreams: z.number(),
    totalPeople: z.number(),
  }),
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;

// Schemas for Companion Chat
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const CompanionChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The latest message from the user.'),
});
export type CompanionChatInput = z.infer<typeof CompanionChatInputSchema>;

export const CompanionChatOutputSchema = z.object({
  response: z.string().describe('The AI companion\'s response.'),
});
export type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;


// Schemas for Ritual Suggestions
export const SuggestRitualInputSchema = z.object({
  zone: z.enum(['head', 'torso', 'legs', 'arms', 'aura']).describe("The area of the symbolic avatar that was clicked."),
  context: z.string().describe("Brief context about the user's current state, like overall mood or recent themes."),
});
export type SuggestRitualInput = z.infer<typeof SuggestRitualInputSchema>;

export const SuggestRitualOutputSchema = z.object({
  title: z.string().describe("A short, engaging title for the suggested ritual or reflection."),
  description: z.string().describe("A one or two-sentence description of the ritual, framed as a gentle suggestion."),
  suggestion: z.string().describe("A concrete action or journaling prompt for the user."),
});
export type SuggestRitualOutput = z.infer<typeof SuggestRitualOutputSchema>;

// Schemas for Advanced Optional Systems from Master Prompt
export const SafetyTriggerSchema = z.object({
    id: z.string(),
    uid: z.string(),
    triggerType: z.enum(["shout", "cry", "hypervent"]),
    detectedAt: z.number(),
    intensityScore: z.number(),
    ritualLaunched: z.boolean(),
});
export type SafetyTrigger = z.infer<typeof SafetyTriggerSchema>;

export const CrossAppContextCorrelationSchema = z.object({
    id: z.string(),
    uid: z.string(),
    summary: z.string(),
    correlatedApps: z.array(z.string()),
    emotionImpact: z.string(),
    lastDetected: z.number(),
    companionPrompted: z.boolean(),
});
export type CrossAppContextCorrelation = z.infer<typeof CrossAppContextCorrelationSchema>;

export const VisualStrainEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    durationMinutes: z.number(),
    postureAngle: z.number(),
    ambientLight: z.number(),
    detectedAt: z.number(),
    fatigueIndex: z.number(),
    recommendedBreakIssued: z.boolean(),
});
export type VisualStrainEvent = z.infer<typeof VisualStrainEventSchema>;

// Schemas for Monetization, Gamification, and B2B Systems
export const AchievementSchema = z.object({
    id: z.string(),
    uid: z.string(),
    name: z.string(),
    description: z.string(),
    unlockedAt: z.number(),
    visibleInGallery: z.boolean(),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const RitualStreakSchema = z.object({
    uid: z.string(),
    currentStreak: z.number(),
    longestStreak: z.number(),
    lastCompleted: z.number(),
});
export type RitualStreak = z.infer<typeof RitualStreakSchema>;

export const CurrencySchema = z.object({
    uid: z.string(),
    seeds: z.number(),
    threads: z.number(),
    lastEarned: z.number(),
});
export type Currency = z.infer<typeof CurrencySchema>;

export const MarketplaceItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    costSeeds: z.number(),
    type: z.string(),
    unlockEffect: z.string(),
});
export type MarketplaceItem = z.infer<typeof MarketplaceItemSchema>;

export const SubscriptionSchema = z.object({
    uid: z.string(),
    plan: z.enum(["free", "pro", "therapist"]),
    startedAt: z.number(),
    renewsAt: z.number(),
    status: z.enum(["active", "paused", "expired"]),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

// Additional Schemas from Final Master Prompt
export const LocationLogSchema = z.object({
    id: z.string(),
    uid: z.string(),
    timestamp: z.number(),
    coords: z.object({
        lat: z.number(),
        lng: z.number(),
        accuracy: z.number().optional(),
    }),
    placeId: z.string().optional(),
    eventType: z.enum(["motion", "stationary", "visit"]),
    source: z.enum(["gps", "wifi", "ble"]),
});
export type LocationLog = z.infer<typeof LocationLogSchema>;

export const ShadowMetricsWeeklySchema = z.object({
    id: z.string(),
    uid: z.string(),
    weekStart: z.number(),
    frictionTaps: z.number().optional(),
    motionAnxietyScore: z.number().optional(),
    bedtimeScrollingMins: z.number().optional(),
    stillnessEpisodes: z.number().optional(),
    compositeShadowStress: z.number().min(0).max(100),
});
export type ShadowMetricsWeekly = z.infer<typeof ShadowMetricsWeeklySchema>;

export const ObscuraPatternsWeeklySchema = z.object({
    id: z.string(),
    uid: z.string(),
    weekStart: z.number(),
    faceTiltVariance: z.number().optional(),
    microCancelRate: z.number().optional(),
    sensorStillnessScore: z.number().optional(),
    behavioralFatigue: z.number().min(0).max(100),
});
export type ObscuraPatternsWeekly = z.infer<typeof ObscuraPatternsWeeklySchema>;

const BaseClusterSchema = z.object({
    id: z.string(),
    uid: z.string(),
    month: z.number(),
});

export const PsycheMirrorsMonthlySchema = BaseClusterSchema.extend({
    selfConceptFragmentation: z.number(),
    influenceEcho: z.number(),
    emotionalCompassDrift: z.number(),
    memoryMutationRate: z.number(),
});
export type PsycheMirrorsMonthly = z.infer<typeof PsycheMirrorsMonthlySchema>;

export const SubconsciousSignalsMonthlySchema = BaseClusterSchema.extend({
    dreamSymptomSync: z.number(),
    moralConflictIndex: z.number(),
    narrativeCollapseProbability: z.number(),
});
export type SubconsciousSignalsMonthly = z.infer<typeof SubconsciousSignalsMonthlySchema>;

export const SoulSignalsMonthlySchema = BaseClusterSchema.extend({
    spiritualVoidDepth: z.number(),
    invisibleIdentityShift: z.number(),
    narrativeTruthDelta: z.number(),
});
export type SoulSignalsMonthly = z.infer<typeof SoulSignalsMonthlySchema>;

export const MythosMeaningMonthlySchema = BaseClusterSchema.extend({
    archetypalOverloadScore: z.number(),
    selfConceptDrift: z.number(),
    mythicAlignmentVector: z.record(z.number()),
});
export type MythosMeaningMonthly = z.infer<typeof MythosMeaningMonthlySchema>;

export const GoogleDataSchema = z.object({
    id: z.string(),
    uid: z.string(),
    dataType: z.enum(["calendar", "photos", "history", "gmail"]),
    externalId: z.string(),
    timestamp: z.number(),
    meta: z.record(z.any()),
    processed: z.boolean().default(false),
});
export type GoogleData = z.infer<typeof GoogleDataSchema>;

export const RitualSchema = z.object({
    id: z.string(),
    uid: z.string(),
    type: z.string(),
    createdAt: z.number(),
    status: z.enum(["planned", "done", "shared"]),
    mediaRef: z.string().optional(),
    archetype: z.string().optional(),
    triggers: z.array(z.object({
        type: z.string(),
        sourceId: z.string(),
    })).optional(),
    replyChainRef: z.string().optional(),
});
export type Ritual = z.infer<typeof RitualSchema>;

export const StoryExportSchema = z.object({
    id: z.string(),
    uid: z.string(),
    type: z.enum(["seasonal", "scroll", "dream", "companion"]),
    createdAt: z.number(),
    fileRef: z.string(),
    ttsRef: z.string().optional(),
    publicUrl: z.string().url().optional(),
    reactions: z.record(z.number()).optional(),
});
export type StoryExport = z.infer<typeof StoryExportSchema>;

export const ForecastsDailySchema = z.object({
    id: z.string(),
    uid: z.string(),
    date: z.number(),
    moodForecastVector: z.record(z.number()),
    rhythmState: z.string(),
    stressIndex: z.number(),
    skyShaderParams: z.record(z.any()),
    narratorScriptRef: z.string().optional(),
});
export type ForecastsDaily = z.infer<typeof ForecastsDailySchema>;

export const AutomationSchema = z.object({
    id: z.string(),
    uid: z.string(),
    category: z.enum(["trigger", "schedule", "conditional"]),
    sourceRef: z.string().optional(),
    action: z.enum(["notification", "narration", "ritualSuggestion"]),
    scheduleCron: z.string().optional(),
    enabled: z.boolean().default(true),
});
export type Automation = z.infer<typeof AutomationSchema>;

export const CulturalSettingsSchema = z.object({
    id: z.string(),
    uid: z.string(),
    language: z.string().default('en'),
    seasonalTheme: z.string().optional(),
});
export type CulturalSettings = z.infer<typeof CulturalSettingsSchema>;

export const MetaMetricsSchema = z.object({
    id: z.string(),
    uid: z.string(),
    date: z.number(),
    regretLoopScore: z.number().optional(),
    growthArcProgress: z.number().optional(),
    symbolicResonance: z.number().optional(),
});
export type MetaMetrics = z.infer<typeof MetaMetricsSchema>;

export const ThresholdEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    timestamp: z.number(),
    eventType: z.string(),
    payload: z.record(z.any()),
});
export type ThresholdEvent = z.infer<typeof ThresholdEventSchema>;

export const LockedMomentSchema = z.object({
    id: z.string(),
    uid: z.string(),
    eventId: z.string(),
    lockedAt: z.number(),
    reason: z.string(),
});
export type LockedMoment = z.infer<typeof LockedMomentSchema>;

export const CompanionThreadSchema = z.object({
    id: z.string(),
    uid: z.string(),
    archetypeId: z.string(),
    createdAt: z.number(),
    lastInteractionAt: z.number(),
    symbolicMemory: z.record(z.any()),
});
export type CompanionThread = z.infer<typeof CompanionThreadSchema>;

// Data Privacy Schemas
export const AnonymizedDataSchema = z.object({
    hashId: z.string(),
    metricId: z.string(),
    moodVector: z.array(z.number()),
    patternCluster: z.string(),
    recoveryArc: z.number(),
    metadata: z.object({
        timezoneGroup: z.string(),
        deviceType: z.string(),
    }),
});
export type AnonymizedData = z.infer<typeof AnonymizedDataSchema>;

export const B2BExportSchema = z.object({
    reportId: z.string(),
    week: z.string(),
    data: z.record(z.any()), // This would be structured reports
});
export type B2BExport = z.infer<typeof B2BExportSchema>;

// Email System Schemas
export const MailSchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    html: z.string(),
    template: z.string().optional(),
    attachments: z.array(z.object({ url: z.string(), type: z.string() })).optional(),
    ttsVoiceUrl: z.string().url().optional(),
});
export type Mail = z.infer<typeof MailSchema>;

export const EmailThreadReplySchema = z.object({
    id: z.string(),
    uid: z.string(),
    originalRitualId: z.string(),
    replyText: z.string(),
    timestamp: z.number(),
});
export type EmailThreadReply = z.infer<typeof EmailThreadReplySchema>;

export const DailyDigestQueueSchema = z.object({
    uid: z.string(),
    moodTrend: z.array(z.any()),
    ritualsPerformed: z.array(z.any()),
    dreamSummary: z.record(z.any()),
    stressScore: z.number(),
    narratorReflection: z.string(),
});
export type DailyDigestQueue = z.infer<typeof DailyDigestQueueSchema>;
