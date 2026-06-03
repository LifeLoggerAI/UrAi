export type ConsentSensitivity = "low" | "medium" | "high" | "very_high";

export type ConsentCopy = {
  title: string;
  shortBody: string;
  confirmLabel: string;
  cancelLabel: string;
  sensitivity: ConsentSensitivity;
  requiresExplicitOptIn: boolean;
};

export type ConsentLayerId =
  | "passport" | "aiCompanion" | "lifeMap" | "ground" | "mirror" | "shadow" | "legacy" | "exports"
  | "audio" | "transcripts" | "location" | "gmail" | "calendar" | "health" | "relationships"
  | "notifications" | "cloudSync" | "accountDeletion" | "companionMemory";

export const CONSENT_COPY_REGISTRY: Record<ConsentLayerId, ConsentCopy> = {
  passport: { title: "Passport controls URAI", shortBody: "Passport is where you choose which layers may open, sync, export, or appear in AI context.", confirmLabel: "Open Passport", cancelLabel: "Keep closed", sensitivity: "medium", requiresExplicitOptIn: false },
  aiCompanion: { title: "AI Companion context", shortBody: "The Companion can use only summaries from layers you have opened. Closed layers stay closed.", confirmLabel: "Allow opened context", cancelLabel: "Keep minimal", sensitivity: "medium", requiresExplicitOptIn: false },
  lifeMap: { title: "Life Map", shortBody: "Life Map may use approved memory summaries to show symbolic moments. You can close this anytime.", confirmLabel: "Open Life Map", cancelLabel: "Keep closed", sensitivity: "medium", requiresExplicitOptIn: false },
  ground: { title: "Ground", shortBody: "Ground uses gentle stability and ritual state. It should not need sensitive private sources by default.", confirmLabel: "Open Ground", cancelLabel: "Keep closed", sensitivity: "low", requiresExplicitOptIn: false },
  mirror: { title: "Mirror", shortBody: "Mirror may reflect visible patterns, not verdicts. It should use summaries only.", confirmLabel: "Open Mirror", cancelLabel: "Keep closed", sensitivity: "medium", requiresExplicitOptIn: false },
  shadow: { title: "Shadow", shortBody: "Shadow is sensitive. It stays closed unless you explicitly open it. This is a reflection, not a verdict.", confirmLabel: "I understand, open Shadow", cancelLabel: "Keep Shadow closed", sensitivity: "very_high", requiresExplicitOptIn: true },
  legacy: { title: "Legacy", shortBody: "Legacy carries things forward only if you choose. Nothing becomes long-term memory by default.", confirmLabel: "I understand, open Legacy", cancelLabel: "Keep Legacy closed", sensitivity: "high", requiresExplicitOptIn: true },
  exports: { title: "Exports", shortBody: "Review what leaves URAI. Exports are off by default and should use summaries unless you explicitly allow more.", confirmLabel: "Review export", cancelLabel: "Do not export", sensitivity: "high", requiresExplicitOptIn: true },
  audio: { title: "Sound playback", shortBody: "Sound changes what URAI plays. It does not mean URAI is listening or recording.", confirmLabel: "Enable sound", cancelLabel: "Keep sound off", sensitivity: "high", requiresExplicitOptIn: true },
  transcripts: { title: "Audio capture and transcripts", shortBody: "Audio capture controls what URAI may listen to or transcribe. This requires separate explicit permission.", confirmLabel: "Allow transcripts", cancelLabel: "Do not allow", sensitivity: "very_high", requiresExplicitOptIn: true },
  location: { title: "Location", shortBody: "Location can be sensitive. URAI should use summaries by default and exact places only if you explicitly allow it.", confirmLabel: "Allow location", cancelLabel: "Keep location closed", sensitivity: "very_high", requiresExplicitOptIn: true },
  gmail: { title: "Gmail", shortBody: "Gmail content is closed unless you explicitly connect and allow it. Summaries are preferred.", confirmLabel: "Allow Gmail context", cancelLabel: "Keep Gmail closed", sensitivity: "very_high", requiresExplicitOptIn: true },
  calendar: { title: "Calendar", shortBody: "Calendar context is closed unless you explicitly connect and allow it. Summaries are preferred.", confirmLabel: "Allow calendar context", cancelLabel: "Keep calendar closed", sensitivity: "high", requiresExplicitOptIn: true },
  health: { title: "Health-adjacent data", shortBody: "Health context is sensitive. URAI does not diagnose, treat, or provide medical advice.", confirmLabel: "Allow health context", cancelLabel: "Keep health closed", sensitivity: "very_high", requiresExplicitOptIn: true },
  relationships: { title: "Relationships", shortBody: "Relationship context may reflect patterns, but it cannot prove intent, truth, or deception.", confirmLabel: "Allow relationship context", cancelLabel: "Keep relationships closed", sensitivity: "very_high", requiresExplicitOptIn: true },
  notifications: { title: "Whispers", shortBody: "URAI should whisper only when it matters. Notifications stay generic and can be turned off anytime.", confirmLabel: "Allow whispers", cancelLabel: "Keep off", sensitivity: "medium", requiresExplicitOptIn: false },
  cloudSync: { title: "Cloud sync", shortBody: "Sync copies only approved URAI state to your account. Passport still controls sensitive layers.", confirmLabel: "Enable sync", cancelLabel: "Keep local", sensitivity: "high", requiresExplicitOptIn: true },
  accountDeletion: { title: "Delete account data", shortBody: "This changes data URAI controls. It does not delete data from third-party services.", confirmLabel: "Continue to deletion", cancelLabel: "Cancel", sensitivity: "very_high", requiresExplicitOptIn: true },
  companionMemory: { title: "Companion memory", shortBody: "Companion memory stays off by default. Only summaries should be saved if you explicitly allow it.", confirmLabel: "Allow Companion memory", cancelLabel: "Keep memory off", sensitivity: "high", requiresExplicitOptIn: true },
};

export function getConsentCopy(layerId: ConsentLayerId): ConsentCopy {
  return CONSENT_COPY_REGISTRY[layerId];
}
