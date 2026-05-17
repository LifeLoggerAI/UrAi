export type ConsentStatus = "not-requested" | "granted" | "denied" | "revoked";

export type ConsentSource =
  | "audio"
  | "location"
  | "deviceActivity"
  | "notifications"
  | "appUsage"
  | "relationshipGraph"
  | "biometricVoiceprint"
  | "facialAnalysis"
  | "dataMarketplace";

export type ConsentRecord = {
  ownerUid: string;
  source: ConsentSource;
  status: ConsentStatus;
  updatedAt: string;
  version: "v1";
  notes?: string;
};

export const CONSENT_SOURCES: Record<ConsentSource, { label: string; liveInV1: boolean; sensitivity: "standard" | "sensitive" | "highly-sensitive" }> = {
  audio: { label: "Audio capture and transcription", liveInV1: false, sensitivity: "highly-sensitive" },
  location: { label: "Location and contextual intelligence", liveInV1: false, sensitivity: "highly-sensitive" },
  deviceActivity: { label: "Device and activity signals", liveInV1: false, sensitivity: "sensitive" },
  notifications: { label: "Notification metadata", liveInV1: false, sensitivity: "sensitive" },
  appUsage: { label: "App usage patterns", liveInV1: false, sensitivity: "sensitive" },
  relationshipGraph: { label: "Relationship and social graph insights", liveInV1: false, sensitivity: "highly-sensitive" },
  biometricVoiceprint: { label: "Voiceprint or biometric identity signals", liveInV1: false, sensitivity: "highly-sensitive" },
  facialAnalysis: { label: "Facial or camera-based analysis", liveInV1: false, sensitivity: "highly-sensitive" },
  dataMarketplace: { label: "Anonymized data marketplace participation", liveInV1: false, sensitivity: "highly-sensitive" }
};

export function isConsentGranted(record: Pick<ConsentRecord, "status"> | null | undefined): boolean {
  return record?.status === "granted";
}
