import type { PassportContextPermissions } from "@/lib/passport/passportContextTypes";

export type DemoPassportProfile = PassportContextPermissions & {
  demoNotice: string;
  demoMode: true;
  cloudSyncEnabled: false;
  exportEnabled: false;
};

export function createDemoPassportProfile(): DemoPassportProfile {
  return {
    allowMoodContext: true,
    allowMemoryContext: true,
    allowLongTermPatternContext: true,
    allowCompanionSessionMemory: false,
    allowCompanionCloudSync: false,
    allowShadowCloudSync: false,
    allowLegacyCloudSync: false,
    allowExportMetadataCloudSync: false,
    allowAudioTranscriptContext: false,
    allowLocationContext: false,
    allowGmailContext: false,
    allowCalendarContext: false,
    allowRelationshipContext: false,
    allowDeviceBehaviorContext: false,
    demoNotice: "Demo mode uses sample data. Private layers remain closed.",
    demoMode: true,
    cloudSyncEnabled: false,
    exportEnabled: false,
  };
}
