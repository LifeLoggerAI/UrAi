import { uraiVoiceEngine } from "@/lib/voice/uraiVoiceEngine";

describe("voice engine", () => {
  afterEach(() => {
    uraiVoiceEngine.applySettings({ voiceEnabled: false, captionsEnabled: true, whispersEnabled: false, reducedSensoryMode: false });
    uraiVoiceEngine.clearCaption();
  });

  it("keeps voice off and captions on by default", async () => {
    await uraiVoiceEngine.playVoiceLine("orb.tap", { forceCaption: true });
    expect(uraiVoiceEngine.getCurrentCaption()).toContain("look gently");
  });

  it("missing voice line no-ops", async () => {
    await expect(uraiVoiceEngine.playVoiceLine("missing.voice.line")).resolves.toBeUndefined();
  });

  it("voice cooldowns prevent repeated caption changes", async () => {
    await uraiVoiceEngine.playVoiceLine("orb.tap", { forceCaption: true });
    const first = uraiVoiceEngine.getCurrentCaption();
    uraiVoiceEngine.clearCaption();
    await uraiVoiceEngine.playVoiceLine("orb.tap", { forceCaption: true });
    expect(uraiVoiceEngine.getCurrentCaption()).toBeNull();
    expect(first).toContain("look gently");
  });

  it("idle whispers stay disabled in reduced sensory", async () => {
    uraiVoiceEngine.applySettings({ whispersEnabled: true, reducedSensoryMode: true });
    await uraiVoiceEngine.playVoiceLine("orb.idleWhisper", { priority: "idle", forceCaption: true });
    expect(uraiVoiceEngine.getCurrentCaption()).toBeNull();
  });
});
