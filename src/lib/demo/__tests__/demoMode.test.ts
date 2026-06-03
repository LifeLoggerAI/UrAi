import { URAI_DEMO_DATA, getDemoProfile } from "@/lib/demo/demoDataRegistry";
import { createDemoPassportProfile } from "@/lib/demo/createDemoPassportProfile";

describe("demo mode", () => {
  it("uses synthetic sample data only", () => {
    expect(getDemoProfile("public").sensitivity).toBe("synthetic");
    expect(URAI_DEMO_DATA.lifeMapStars.every((item) => item.sample)).toBe(true);
    expect(URAI_DEMO_DATA.groundElements.every((item) => item.sample)).toBe(true);
    expect(URAI_DEMO_DATA.mirrorReflections.every((item) => item.sample)).toBe(true);
    expect(URAI_DEMO_DATA.legacyChapters.every((item) => item.sample)).toBe(true);
  });

  it("keeps sensitive demo Passport layers closed", () => {
    const profile = createDemoPassportProfile();
    expect(profile.demoMode).toBe(true);
    expect(profile.allowShadowCloudSync).toBe(false);
    expect(profile.allowLegacyCloudSync).toBe(false);
    expect(profile.allowGmailContext).toBe(false);
    expect(profile.allowLocationContext).toBe(false);
    expect(profile.allowAudioTranscriptContext).toBe(false);
    expect(profile.allowExportMetadataCloudSync).toBe(false);
  });

  it("keeps demo export disabled or sample-only", () => {
    expect(getDemoProfile("public").allowExports).toBe(false);
    expect(URAI_DEMO_DATA.exportExamples.every((item) => item.sampleOnly)).toBe(true);
  });
});
