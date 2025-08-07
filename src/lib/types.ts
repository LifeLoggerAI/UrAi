// src/lib/types.ts
import { z } from "zod";

/* ---------------------------------- */
/*   Sentiment & Persona              */
/* ---------------------------------- */
export type Sentiment = "positive" | "negative" | "neutral";

export const TraitChangeSchema = z.object({
  trait: z.string(),
  from: z.number(),
  to: z.number(),
  date: z.string(),
});
export type TraitChange = z.infer<typeof TraitChangeSchema>;

export const PersonaProfileSchema = z.object({
  traits: z.record(z.number()).optional(),
  traitChanges: z.array(TraitChangeSchema).optional(),
  dominantPersona: z.string().optional(),
  moodAlignmentScore: z.number().optional(),
  conflictEvents: z.array(z.string()).optional(),
  highProductivityWhen: z.array(z.string()).optional(),
  emotionalDrainWhen: z.array(z.string()).optional(),
});
export type PersonaProfile = z.infer<typeof PersonaProfileSchema>;

/* ---------------------------------- */
/*   User & Permissions               */
/* ---------------------------------- */
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
  stats: z.record(z.any()).optional(),
  socialGraph: z.record(z.any()).optional(),
  constellation: z.record(z.any()).optional(),
  mood: z.string().optional(),
  location: z.string().optional(),
  lastVoiceTranscript: z.string().optional(),
  lastActivity: z.string().optional(),
  demoMode: z.boolean().optional(),
  settings: z.object({
    moodTrackingEnabled: z.boolean().default(true),
    passiveAudioEnabled: z.boolean().default(true),
    faceEmotionEnabled: z.boolean().default(false),
    dataExportEnabled: z.boolean().default(true),
    narratorVolume: z.number().min(0).max(1).default(0.8),
    ttsVoice: z.string().default("warmCalm"),
    pushNotifications: z.boolean().default(true),
    gpsAllowed: z.boolean().default(false),
    allowVoiceRetention: z.boolean().default(true),
    receiveWeeklyEmail: z.boolean().default(true),
    receiveMilestones: z.boolean().default(true),
    emailTone: z.string().default("poetic"),
    dataConsent: z.object({
      shareAnonymousData: z.boolean(),
      optedOutAt: z.number().nullable(),
    }).optional(),
    telemetryPermissionsGranted: z.boolean().default(false),
    cameraCapturePermissionsGranted: z.boolean().default(false),
    identityModelOptIn: z.boolean().default(false),
  }).optional(),
  narratorPrefs: z.object({
    toneStyle: z.string(),
    metaphorLexicon: z.array(z.string()),
    ttsConfig: z.object({ pitch: z.number(), speed: z.number() }),
  }).optional(),
  personaProfile: PersonaProfileSchema.optional(),
  symbolLexicon: z.record(z.any()).optional(),
  subscriptionTier: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const PermissionsSchema = z.object({
  micPermission: z.boolean(),
  gpsPermission: z.boolean(),
  motionPermission: z.boolean(),
  notificationsPermission: z.boolean(),
  cameraCapturePermissionsGranted: z.boolean().default(false),
  shareAnonymizedData: z.boolean(),
  acceptedTerms: z.boolean(),
  acceptedPrivacyPolicy: z.boolean(),
  consentTimestamp: z.number(),
  acceptedTermsVersion: z.string().optional(),
});
export type Permissions = z.infer<typeof PermissionsSchema>;

/* ---------------------------------- */
/*   Storyboard Generation Types      */
/* ---------------------------------- */
export const PersonAppearanceSchema = z.object({
  name: z.string().describe("Full name of the person"),
  age: z.number().optional(),
  role: z.string().optional(),
  height: z.string().optional(),
  build: z.string().optional(),
  skinTone: z.string().optional(),
  hairColor: z.string().optional(),
  hairStyle: z.string().optional(),
  eyeColor: z.string().optional(),
  facialHair: z.string().optional(),
  distinguishingFeatures: z.array(z.string()).optional(),
  clothing: z.string().optional(),
  accessories: z.array(z.string()).optional(),
  expression: z.string().optional(),
  posture: z.string().optional(),
});
export type PersonAppearance = z.infer<typeof PersonAppearanceSchema>;

export const LocationDetailsSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  environment: z.string(),
  weather: z.string().optional(),
  lighting: z.string(),
  atmosphere: z.string().optional(),
});
export type LocationDetails = z.infer<typeof LocationDetailsSchema>;

export const EventDetailsSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  time: z.string().optional(),
  context: z.string(),
  duration: z.string().optional(),
});
export type EventDetails = z.infer<typeof EventDetailsSchema>;

export const ActionSequenceSchema = z.object({
  description: z.string(),
  participants: z.array(z.string()),
  duration: z.string().optional(),
  sequence: z.number(),
});
export type ActionSequence = z.infer<typeof ActionSequenceSchema>;

export const PropObjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  significance: z.string().optional(),
});
export type PropObject = z.infer<typeof PropObjectSchema>;

export const MoodToneSchema = z.object({
  musicStyle: z.string().optional(),
  colorPalette: z.array(z.string()),
  cameraMovement: z.string(),
  emotionalTone: z.string(),
});
export type MoodTone = z.infer<typeof MoodToneSchema>;

export const ShotSchema = z.object({
  type: z.string(),
  subject: z.string(),
  action: z.string(),
  camera: z.string(),
  lighting: z.string(),
  imagePrompt: z.string(),
});
export type Shot = z.infer<typeof ShotSchema>;

export const SceneSchema = z.object({
  sceneHeader: z.string(),
  shots: z.array(ShotSchema),
  dialogue: z.string().optional(),
});
export type Scene = z.infer<typeof SceneSchema>;

export const StructuredEventDataSchema = z.object({
  event: EventDetailsSchema,
  location: LocationDetailsSchema,
  people: z.array(PersonAppearanceSchema),
  actions: z.array(ActionSequenceSchema),
  props: z.array(PropObjectSchema),
  moodTone: MoodToneSchema,
  references: z.array(z.string()).optional(),
});
export type StructuredEventData = z.infer<typeof StructuredEventDataSchema>;

export const ValidationIssueSchema = z.object({
  type: z.string(),
  message: z.string(),
  personName: z.string().optional(),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

export const GenerateStoryboardInputSchema = z.object({
  eventData: z.string(),
});
export type GenerateStoryboardInput = z.infer<typeof GenerateStoryboardInputSchema>;

export const GenerateStoryboardOutputSchema = z.object({
  structuredData: StructuredEventDataSchema,
  scenes: z.array(SceneSchema),
  validationIssues: z.array(ValidationIssueSchema),
});
export type GenerateStoryboardOutput = z.infer<typeof GenerateStoryboardOutputSchema>;

/* ---------------------------------- */
/*   Advanced Symbolic Tracking       */
/* ---------------------------------- */
export const NarrativeLoopSchema = z.object({
  uid: z.string(),
  loopId: z.string(),
  patternLabel: z.string(),
  loopEvents: z.array(z.string()),
  emotionalCore: z.string(),
  narratorOverlay: z.string(),
  active: z.boolean().default(true),
  firstDetectedAt: z.number(),
  loopIntensity: z.number().min(0).max(1),
  suggestedAction: z.string().optional(),
});
export type NarrativeLoop = z.infer<typeof NarrativeLoopSchema>;

export const RebirthMomentSchema = z.object({
  uid: z.string(),
  rebirthId: z.string(),
  eventTrigger: z.string(),
  symbolicForm: z.string(),
  traitsBefore: z.record(z.number()),
  traitsAfter: z.record(z.number()),
  narratorInsight: z.string(),
  linkedLoopsBroken: z.array(z.string()).optional(),
  bloomUnlocked: z.boolean().default(false),
  createdAt: z.number(),
});
export type RebirthMoment = z.infer<typeof RebirthMomentSchema>;

export const ThresholdMomentSchema = z.object({
  uid: z.string(),
  thresholdId: z.string(),
  triggerEvent: z.string(),
  thresholdState: z.string(),
  narratorVoice: z.string(),
  symbolicOverlay: z.string(),
  auraColorShift: z.string(),
  visualTransition: z.string(),
  coreInsight: z.string(),
  replayDuration: z.string(),
  playbackMode: z.string(),
  createdAt: z.number(),
});
export type ThresholdMoment = z.infer<typeof ThresholdMomentSchema>;

export const LegacyThreadSchemaNew = z.object({
  uid: z.string(),
  threadId: z.string(),
  title: z.string(),
  introNarration: z.string(),
  momentsIncluded: z.array(z.string()),
  publicVisibility: z.boolean().default(false),
  sharedWith: z.array(z.string()).optional(),
  narratorTone: z.string(),
  finalSymbol: z.string(),
  createdAt: z.number(),
});
export type LegacyThreadNew = z.infer<typeof LegacyThreadSchemaNew>;

export const CompanionMemorySchema = z.object({
  uid: z.string(),
  memoryVersion: z.string(),
  symbolicDataLinked: z.array(z.string()),
  voicePersonalityShift: z.object({
    currentMode: z.string(),
    voiceTone: z.string(),
  }),
  recurringMotifs: z.array(z.string()),
  memoryRecallScripts: z.array(z.string()),
  lastUpdated: z.number(),
});
export type CompanionMemory = z.infer<typeof CompanionMemorySchema>;

export const BecomingScrollSchema = z.object({
  uid: z.string(),
  scrollId: z.string(),
  title: z.string(),
  chapterIds: z.array(z.string()),
  narratorStyle: z.string(),
  voiceBlend: z.object({
    innerVoice: z.string(),
    companion: z.string(),
    contrast: z.string(),
  }),
  visualMotifs: z.array(z.string()),
  durationEstimate: z.string(),
  exportTypes: z.array(z.string()),
  createdAt: z.number(),
});
export type BecomingScroll = z.infer<typeof BecomingScrollSchema>;

export const AuraScrollSchema = z.object({
  uid: z.string(),
  scrollId: z.string(),
  weeklyAuraData: z.array(z.object({
    week: z.string(),
    mood: z.string(),
    color: z.string(),
    overlays: z.array(z.string()),
  })),
  narrationVoice: z.string(),
  autoplay: z.boolean().default(true),
  createdAt: z.number(),
});
export type AuraScroll = z.infer<typeof AuraScrollSchema>;

export const FinalScrollSchema = z.object({
  uid: z.string(),
  scrollId: z.string(),
  phases: z.array(z.string()),
  moodGradient: z.array(z.string()),
  audioNarration: z.string(),
  exportType: z.array(z.string()),
  createdAt: z.number(),
});
export type FinalScroll = z.infer<typeof FinalScrollSchema>;

export const UserExportSchema = z.object({
  uid: z.string(),
  exports: z.array(z.object({
    type: z.string(),
    url: z.string().optional(),
    files: z.array(z.string()).optional(),
    format: z.string().optional(),
    createdAt: z.number(),
  })),
  bundleReady: z.boolean().default(false),
  archiveUrl: z.string().optional(),
});
export type UserExport = z.infer<typeof UserExportSchema>;

export const MetaMirrorSchema = z.object({
  uid: z.string(),
  generatedAt: z.number(),
  patterns: z.object({
    moodLoops: z.array(z.string()),
    socialFlares: z.array(z.string()),
    archetypePath: z.array(z.string()),
    shadowTriggers: z.array(z.string()),
    recoveryPatterns: z.array(z.string()),
  }),
  voiceToneShift: z.record(z.any()),
  narratorSummary: z.string(),
});
export type MetaMirror = z.infer<typeof MetaMirrorSchema>;

export const ReanimatedNarrationSchema = z.object({
  uid: z.string(),
  sceneId: z.string(),
  source: z.string(),
  voiceModel: z.string(),
  companionOverlay: z.boolean().default(false),
  moodOverlay: z.string(),
  transcript: z.string(),
  audioUrl: z.string().optional(),
  visuals: z.object({
    background: z.string(),
    bloomColor: z.string(),
    particleEffect: z.string(),
  }),
  createdAt: z.number(),
});
export type ReanimatedNarration = z.infer<typeof ReanimatedNarrationSchema>;

export const MarketplaceSignalSchema = z.object({
  signalId: z.string(),
  anonymized: z.boolean().default(true),
  dataType: z.string(),
  patternSummary: z.string(),
  contributingUsers: z.number(),
  avgAccuracyScore: z.number(),
  originLayer: z.string(),
  availableForLicense: z.boolean().default(false),
  licenseRevenue: z.object({
    total: z.number(),
    userShare: z.number(),
  }).optional(),
  buyerType: z.string().optional(),
});
export type MarketplaceSignal = z.infer<typeof MarketplaceSignalSchema>;
