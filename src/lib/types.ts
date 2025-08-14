// Core type definitions for UrAi application
import { z } from 'zod';

// Base types
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  displayName: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
  onboardingComplete: z.boolean().optional(),
  settings: z.object({
    moodTrackingEnabled: z.boolean(),
    passiveAudioEnabled: z.boolean(),
    faceEmotionEnabled: z.boolean(),
    dataExportEnabled: z.boolean(),
    narratorVolume: z.number(),
    ttsVoice: z.string(),
    receiveWeeklyEmail: z.boolean(),
    receiveMilestones: z.boolean(),
    emailTone: z.string(),
  }).optional(),
  personaProfile: z.any().optional(),
  symbolLexicon: z.any().optional(),
  subscriptionTier: z.string().optional(),
  isProUser: z.boolean().optional(),
  mood: z.string().optional(),
  location: z.string().optional(),
  lastVoiceTranscript: z.string().optional(),
  lastActivity: z.string().optional(),
  demoMode: z.boolean().optional(),
  avatarUrl: z.string().url().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const PersonSchema = z.object({
  id: z.string(),
  uid: z.string(),
  name: z.string(),
  lastSeen: z.number(),
  familiarityIndex: z.number(),
  socialRoleHistory: z.array(z.object({ date: z.number(), role: z.string() })),
  avatarUrl: z.string().url(),
  voiceMemoryStrength: z.number().optional(),
  silenceDurationDays: z.number().optional(),
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
  title: z.string().optional(),
  description: z.string().optional(),
});
export type Dream = z.infer<typeof DreamSchema>;

export const VoiceEventSchema = z.object({
  id: z.string(),
  uid: z.string(),
  audioEventId: z.string(),
  speakerLabel: z.string(),
  text: z.string(),
  createdAt: z.number(),
  emotion: z.string(),
  sentimentScore: z.number(),
  toneShift: z.number(),
  voiceArchetype: z.string(),
  people: z.array(z.string()).optional(),
  tasks: z.array(z.string()).optional(),
});
export type VoiceEvent = z.infer<typeof VoiceEventSchema>;

export const AudioEventSchema = z.object({
  id: z.string(),
  uid: z.string(),
  storagePath: z.string(),
  startTs: z.number(),
  endTs: z.number(),
  durationSec: z.number(),
  transcriptionStatus: z.string(),
});
export type AudioEvent = z.infer<typeof AudioEventSchema>;

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
  status: z.string(),
  isCompleted: z.boolean().optional(),
  completedAt: z.number().optional(),
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

export const MemoryBloomSchema = z.object({
  bloomId: z.string(),
  uid: z.string(),
  emotion: z.string(),
  bloomColor: z.string(),
  triggeredAt: z.any(),
  description: z.string(),
  trigger: z.string().optional(),
  id: z.string().optional(),
});
export type MemoryBloom = z.infer<typeof MemoryBloomSchema>;

export const InnerVoiceReflectionSchema = z.object({
  id: z.string(),
  uid: z.string(),
  text: z.string(),
  createdAt: z.number(),
  sentimentScore: z.number(),
});
export type InnerVoiceReflection = z.infer<typeof InnerVoiceReflectionSchema>;

export const WeeklyScrollSchema = z.object({
  id: z.string(),
  uid: z.string(),
  weekStart: z.number().optional(),
  weekEnd: z.number().optional(),
  title: z.string().optional(),
  summaryMood: z.string(),
  highlights: z.array(z.object({ type: z.string(), text: z.string() })),
  narrationScript: z.string(),
  exportLinks: z.object({ audio: z.string(), image: z.string() }),
  createdAt: z.number(),
  segments: z.array(z.string()).optional(),
  linkedUserIds: z.array(z.string()).optional(),
});
export type WeeklyScroll = z.infer<typeof WeeklyScrollSchema>;

export const CompanionSchema = z.object({
  id: z.string(),
  uid: z.string(),
  archetype: z.string(),
  tone: z.string(),
  memoryThread: z.array(z.string()),
  evolutionStage: z.string(),
  voicePreset: z.string(),
  isActive: z.boolean(),
});
export type Companion = z.infer<typeof CompanionSchema>;

export const PersonaProfileSchema = z.object({
  traits: z.record(z.number()),
  traitChanges: z.array(
    z.object({ trait: z.string(), from: z.number(), to: z.number(), date: z.string() })
  ),
  dominantPersona: z.string(),
  moodAlignmentScore: z.number(),
  conflictEvents: z.array(z.string()),
  highProductivityWhen: z.array(z.string()),
  emotionalDrainWhen: z.array(z.string()),
});
export type PersonaProfile = z.infer<typeof PersonaProfileSchema>;


export const AuraStateSchema = z.object({
  currentEmotion: z.string(),
  overlayColor: z.string(),
  overlayStyle: z.string(),
  lastUpdated: z.number(),
  energy: z.number().optional(),
  mood: z.string().optional(),
});
export type AuraState = z.infer<typeof AuraStateSchema>;

export const OnboardIntakeSchema = z.object({
  id: z.string(),
  uid: z.string(),
  fullTranscript: z.string(),
  createdAt: z.number(),
});
export type OnboardIntake = z.infer<typeof OnboardIntakeSchema>;

export const PermissionsSchema = z.object({
  micPermission: z.boolean(),
  gpsPermission: z.boolean(),
  motionPermission: z.boolean(),
  notificationsPermission: z.boolean(),
  shareAnonymizedData: z.boolean(),
  acceptedTerms: z.boolean(),
  acceptedPrivacyPolicy: z.boolean(),
  consentTimestamp: z.number(),
  acceptedTermsVersion: z.string(),
});
export type Permissions = z.infer<typeof PermissionsSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SentimentSchema = z.enum(['positive', 'negative', 'neutral']);
export type Sentiment = z.infer<typeof SentimentSchema>;

export const EmotionCycleSchema = z.object({
    windowStart: z.number(),
    dominantEmotion: z.string(),
    avgIntensity: z.number(),
    cycleType: z.enum(['neutral', 'recovery', 'strain']),
    createdAt: z.number(),
});
export type EmotionCycle = z.infer<typeof EmotionCycleSchema>;

export const MoodLogSchema = z.object({
  timestamp: z.number(),
  emotion: z.string(),
  intensity: z.number(),
  source: z.string(),
});
export type MoodLog = z.infer<typeof MoodLogSchema>;

// AI Flow Schemas
export const AnalyzeDreamInputSchema = z.object({
  text: z.string().describe('The dream content to analyze'),
});
export type AnalyzeDreamInput = z.infer<typeof AnalyzeDreamInputSchema>;

export const AnalyzeDreamOutputSchema = z.object({
  emotions: z.array(z.string()).describe('Primary emotions in the dream'),
  themes: z.array(z.string()).describe('Major themes or subjects'),
  symbols: z.array(z.string()).describe('Key symbols and their interpretations'),
  sentimentScore: z.number().min(-1).max(1).describe('Overall sentiment score'),
});
export type AnalyzeDreamOutput = z.infer<typeof AnalyzeDreamOutputSchema>;

export const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('Text to convert to speech'),
  useSSML: z.boolean().optional().describe('Whether to use SSML for enhanced speech'),
  voiceName: z.string().optional().describe('Voice to use for speech'),
  rate: z.number().optional().describe('Speech rate (0.25 to 4.0)'),
  pitch: z.string().optional().describe('Speech pitch (e.g., "+2st")'),
  enableEmphasis: z.boolean().optional().describe('Enable automatic emphasis'),
  addNaturalPauses: z.boolean().optional().describe('Add natural breathing pauses'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

export const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('Data URI of the generated WAV audio file'),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

export const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

export const TranscribeAudioOutputSchema = z.object({
  transcript: z.string().describe('Transcribed text'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export const CompanionChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('User message to the companion'),
});
export type CompanionChatInput = z.infer<typeof CompanionChatInputSchema>;

export const CompanionChatOutputSchema = z.object({
  response: z.string().describe('Companion response'),
});
export type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;

export const UpdateUserSettingsSchema = z.object({
  displayName: z.string().optional(),
  moodTrackingEnabled: z.boolean().optional(),
  passiveAudioEnabled: z.boolean().optional(),
  faceEmotionEnabled: z.boolean().optional(),
  dataExportEnabled: z.boolean().optional(),
  narratorVolume: z.number().min(0).max(1).optional(),
  ttsVoice: z.string().optional(),
  gpsAllowed: z.boolean().optional(),
  dataConsent: z.object({
    shareAnonymousData: z.boolean(),
    optedOutAt: z.number().nullable(),
  }).optional(),
  allowVoiceRetention: z.boolean().optional(),
  receiveWeeklyEmail: z.boolean().optional(),
  receiveMilestones: z.boolean().optional(),
  emailTone: z.string().optional(),
});
export type UpdateUserSettings = z.infer<typeof UpdateUserSettingsSchema>;

export const AnalyzeCameraImageInputSchema = z.object({
  imageDataUri: z.string().describe("A photo of the user's face, as a data URI."),
});
export type AnalyzeCameraImageInput = z.infer<typeof AnalyzeCameraImageInputSchema>;

export const AnalyzeCameraImageOutputSchema = z.object({
  emotionInference: z.record(z.number()),
  environmentInference: z.array(z.string()),
  objectTags: z.array(z.string()),
  lightLevel: z.number(),
  faceCount: z.number(),
  dominantColor: z.string(),
  symbolicTagSummary: z.string(),
  cameraAngle: z.string(),
  faceLayoutSummary: z.string(),
  backgroundMoodTags: z.array(z.string()),
  contextualSymbolMatches: z.array(z.string()),
  linkedArchetype: z.string(),
});
export type AnalyzeCameraImageOutput = z.infer<typeof AnalyzeCameraImageOutputSchema>;

export const EnrichVoiceEventInputSchema = z.object({
  text: z.string().describe('The transcribed text of the voice event'),
});
export type EnrichVoiceEventInput = z.infer<typeof EnrichVoiceEventInputSchema>;

export const EnrichVoiceEventOutputSchema = z.object({
  emotion: z.string(),
  sentimentScore: z.number(),
  toneShift: z.number(),
  voiceArchetype: z.string(),
  people: z.array(z.string()).optional(),
  tasks: z.array(z.string()).optional(),
});
export type EnrichVoiceEventOutput = z.infer<typeof EnrichVoiceEventOutputSchema>;

export const GenerateAvatarInputSchema = z.object({
  name: z.string(),
  role: z.string(),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

export const GenerateAvatarOutputSchema = z.object({
  avatarDataUri: z.string(),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export const GenerateSymbolicInsightInputSchema = z.object({
  analysis: AnalyzeCameraImageOutputSchema.describe('JSON object of camera image analysis'),
});
export type GenerateSymbolicInsightInput = z.infer<typeof GenerateSymbolicInsightInputSchema>;

export const GenerateSymbolicInsightOutputSchema = z.object({
  narratorReflection: z.string(),
  symbolAnimationTrigger: z.string(),
});
export type GenerateSymbolicInsightOutput = z.infer<typeof GenerateSymbolicInsightOutputSchema>;

export const ProcessOnboardingTranscriptInputSchema = z.object({
  transcript: z.string(),
  currentDate: z.string(),
});
export type ProcessOnboardingTranscriptInput = z.infer<typeof ProcessOnboardingTranscriptInputSchema>;

export const ProcessOnboardingTranscriptOutputSchema = z.object({
  goal: z.string(),
  task: z.string(),
  reminderDate: z.string(),
  habitToTrack: z.string(),
});
export type ProcessOnboardingTranscriptOutput = z.infer<typeof ProcessOnboardingTranscriptOutputSchema>;

export const SuggestRitualInputSchema = z.object({
  zone: z.string(),
  context: z.string(),
});
export type SuggestRitualInput = z.infer<typeof SuggestRitualInputSchema>;

export const SuggestRitualOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  suggestion: z.string(),
});
export type SuggestRitualOutput = z.infer<typeof SuggestRitualOutputSchema>;

export const SummarizeTextInputSchema = z.object({
  text: z.string().describe('Text content to summarize'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

export const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('Summarized text content'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export const AnalyzeTextSentimentInputSchema = z.object({
  text: z.string(),
});
export type AnalyzeTextSentimentInput = z.infer<typeof AnalyzeTextSentimentInputSchema>;

export const AnalyzeTextSentimentOutputSchema = z.object({
  sentimentScore: z.number(),
});
export type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;

export const DashboardDataSchema = z.object({
  sentimentOverTime: z.array(z.object({ date: z.string(), sentiment: z.number() })),
  emotionBreakdown: z.array(z.object({ name: z.string(), count: z.number() })),
  stats: z.object({
    totalMemories: z.number(),
    totalDreams: z.number(),
    totalPeople: z.number(),
  }),
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;

export const EventDataSchema = z.object({
  title: z.string().describe("Event title (e.g., 'Sarah's 30th Birthday')"),
  date: z.string().describe("Date of the event"),
  time: z.string().describe("Time of the event"),
  context: z.string().describe("Brief context or purpose"),
  duration: z.string().optional().describe("Duration of the event"),
});
export type EventData = z.infer<typeof EventDataSchema>;

export const LocationDataSchema = z.object({
  name: z.string().describe("Location name (e.g., 'Central Park')"),
  address: z.string().optional().describe("Address if available"),
  environment: z.string().describe("Description of the environment (e.g., 'lakeside picnic')"),
  weather: z.string().optional().describe("Weather conditions"),
  lighting: z.string().describe("Lighting conditions (e.g., 'bright afternoon sunlight')"),
  atmosphere: z.string().optional().describe("Overall atmosphere"),
});
export type LocationData = z.infer<typeof LocationDataSchema>;

export const PersonAppearanceSchema = z.object({
  height: z.string().optional(),
  build: z.string().optional(),
  skinTone: z.string().optional(),
  hairColor: z.string().optional(),
  hairStyle: z.string().optional(),
  eyeColor: z.string().optional(),
  distinguishingFeatures: z.array(z.string()).optional(),
  clothing: z.string().optional(),
  accessories: z.array(z.string()).optional(),
});
export type PersonAppearance = z.infer<typeof PersonAppearanceSchema>;

export const PersonDataSchema = z.object({
  name: z.string().describe("Person's name"),
  age: z.number().optional().describe("Person's age"),
  role: z.string().describe("Role in the event (e.g., 'birthday celebrant')"),
  height: z.string().optional(),
  build: z.string().optional(),
  skinTone: z.string().optional(),
  hairColor: z.string().optional(),
  hairStyle: z.string().optional(),
  eyeColor: z.string().optional(),
  facialHair: z.string().optional(), // Added this line
  distinguishingFeatures: z.array(z.string()).optional(),
  clothing: z.string().optional(),
  accessories: z.array(z.string()).optional(),
  expression: z.string().optional().describe("Dominant emotional expression"),
  posture: z.string().optional().describe("Body language or posture"),
});
export type PersonData = z.infer<typeof PersonDataSchema>;


export const ActionDataSchema = z.object({
  description: z.string().describe("Description of the action or moment"),
  participants: z.array(z.string()).describe("People involved"),
  duration: z.string().optional(),
  sequence: z.number().optional().describe("Sequence in the event timeline"),
});
export type ActionData = z.infer<typeof ActionDataSchema>;

export const PropObjectSchema = z.object({
  name: z.string().describe("Name of the prop"),
  description: z.string().describe("Description of the prop"),
  significance: z.string().optional().describe("Its significance in the scene"),
});
export type PropObject = z.infer<typeof PropObjectSchema>;

export const MoodToneSchema = z.object({
  musicStyle: z.string().optional(),
  colorPalette: z.array(z.string()).optional(),
  cameraMovement: z.string().optional(),
  emotionalTone: z.string(),
});
export type MoodTone = z.infer<typeof MoodToneSchema>;

export const ReferenceDataSchema = z.object({
  film: z.string().optional(),
  photography: z.string().optional(),
  art: z.string().optional(),
});
export type ReferenceData = z.infer<typeof ReferenceDataSchema>;

export const ValidationIssueSchema = z.object({
  type: z.string(),
  message: z.string(),
  personName: z.string().optional(),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

export const StoryboardDataSchema = z.object({
  event: EventDataSchema,
  location: LocationDataSchema,
  people: z.array(PersonDataSchema),
  actions: z.array(ActionDataSchema),
  props: z.array(PropObjectSchema).optional(),
  moodTone: MoodToneSchema,
  references: z.array(z.string()).optional(),
});
export type StoryboardData = z.infer<typeof StoryboardDataSchema>;

export const ShotDataSchema = z.object({
  type: z.string().describe("Type of shot (e.g., 'wide', 'close-up')"),
  subject: z.string().describe("Main subject of the shot"),
  action: z.string().describe("Action taking place in the shot"),
  camera: z.string().describe("Camera movement and lens details"),
  lighting: z.string().describe("Lighting setup and mood"),
  imagePrompt: z.string().describe("Detailed, photo-realistic image generation prompt"),
});
export type ShotData = z.infer<typeof ShotDataSchema>;

export const SceneDataSchema = z.object({
  sceneHeader: z.string().describe("Scene header (e.g., 'Scene 1 - Rooftop: Evening')"),
  shots: z.array(ShotDataSchema),
  dialogue: z.string().optional().describe("Dialogue or voice-over for the scene"),
});
export type SceneData = z.infer<typeof SceneDataSchema>;

export const GenerateStoryboardInputSchema = z.object({
  eventDescription: z.string().min(10).describe("Raw text or JSON string describing the event"),
});
export type GenerateStoryboardInput = z.infer<typeof GenerateStoryboardInputSchema>;

export const GenerateStoryboardOutputSchema = z.object({
  structuredData: StoryboardDataSchema, // Removed .optional()
  scenes: z.array(SceneDataSchema),
  validationIssues: z.array(ValidationIssueSchema).optional(),
});
export type GenerateStoryboardOutput = z.infer<typeof GenerateStoryboardOutputSchema>;
export type StoryboardOutput = GenerateStoryboardOutput;


export const NarrativeLoopSchema = z.object({
  loopId: z.string(),
  uid: z.string(),
  patternLabel: z.string(),
  loopEvents: z.array(z.string()),
  emotionalCore: z.string(),
  narratorOverlay: z.string(),
  loopIntensity: z.number(),
  suggestedAction: z.string().optional(),
  active: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type NarrativeLoop = z.infer<typeof NarrativeLoopSchema>;

export const RebirthMomentSchema = z.object({
  rebirthId: z.string().optional(),
  uid: z.string(),
  eventTrigger: z.string(),
  symbolicForm: z.string(),
  traitsBefore: z.record(z.number()),
  traitsAfter: z.record(z.number()),
  narratorInsight: z.string(),
  linkedLoopsBroken: z.array(z.string()).optional(),
  bloomUnlocked: z.boolean(),
  transformationScore: z.number(),
  createdAt: z.number(),
});
export type RebirthMoment = z.infer<typeof RebirthMomentSchema>;

export const ThresholdMomentSchema = z.object({
  thresholdId: z.string(),
  uid: z.string(),
  triggerEvent: z.string(),
  thresholdState: z.string(),
  coreInsight: z.string(),
  symbolicOverlay: z.string(),
  auraColorShift: z.string(),
  playbackMode: z.string(),
  replayDuration: z.string(),
  narratorVoice: z.string(),
  visualTransition: z.string(),
  createdAt: z.number(),
});
export type ThresholdMoment = z.infer<typeof ThresholdMomentSchema>;

export const AuraScrollSchema = z.object({
  scrollId: z.string(),
  uid: z.string(),
  createdAt: z.number(),
  weeklyAuraData: z.array(z.object({
    week: z.string(),
    mood: z.string(),
    color: z.string(),
    overlays: z.array(z.string()),
  })),
  narrationVoice: z.string(),
});
export type AuraScroll = z.infer<typeof AuraScrollSchema>;

export interface CrisisState {
  userId: string;
  isInCrisis: boolean;
  triggeredAt: string;
  triggerReason: string;
  score: number; // 0 to 1
  suggestedRitual?: string;
}

export interface RecoveryBloom {
  userId: string;
  triggerEventId: string;
  bloomColor: string; // e.g., "lavender-glow"
  auraVisual: string; // e.g., "rising-petals"
  recoveryDuration: number; // in days
  moodBefore: string;
  moodAfter: string;
  createdAt: string;
}

export interface SoulThread {
  userId: string;
  threadLabel: string;
  events: string[]; // Scroll IDs, dream IDs, crisis IDs
  coreSymbol?: string;
  dominantArchetype?: string;
  status: 'open' | 'looping' | 'resolving' | 'complete';
  rebirthCount: number;
  createdAt: string;
}

export const exportUserDataActionSchema: any = {};
