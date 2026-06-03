export type PassportContextPermissions = {
  allowMoodContext: boolean;
  allowMemoryContext: boolean;
  allowRelationshipContext: boolean;
  allowLocationContext: boolean;
  allowAudioTranscriptContext: boolean;
  allowCalendarContext: boolean;
  allowGmailContext: boolean;
  allowDeviceBehaviorContext: boolean;
  allowLongTermPatternContext: boolean;
  allowShadowCloudSync: boolean;
  allowLegacyCloudSync: boolean;
  allowCompanionSessionMemory: boolean;
  allowCompanionCloudSync: boolean;
  allowExportMetadataCloudSync: boolean;
};

export const DEFAULT_PASSPORT_CONTEXT_PERMISSIONS: PassportContextPermissions = {
  allowMoodContext: false,
  allowMemoryContext: false,
  allowRelationshipContext: false,
  allowLocationContext: false,
  allowAudioTranscriptContext: false,
  allowCalendarContext: false,
  allowGmailContext: false,
  allowDeviceBehaviorContext: false,
  allowLongTermPatternContext: false,
  allowShadowCloudSync: false,
  allowLegacyCloudSync: false,
  allowCompanionSessionMemory: false,
  allowCompanionCloudSync: false,
  allowExportMetadataCloudSync: false,
};

export function normalizePassportContextPermissions(permissions?: Partial<PassportContextPermissions> | null): PassportContextPermissions {
  return {
    ...DEFAULT_PASSPORT_CONTEXT_PERMISSIONS,
    ...(permissions ?? {}),
  };
}
