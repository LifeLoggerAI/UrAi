import { getActiveAudioLoops, uraiAudioEngine } from "@/lib/audio/uraiAudioEngine";

describe("audio engine", () => {
  afterEach(async () => {
    await uraiAudioEngine.stopAll();
    uraiAudioEngine.applySettings({ enabled: false, reducedSensoryMode: false });
  });

  it("keeps sound off by default", () => {
    expect(uraiAudioEngine.getSettings().enabled).toBe(false);
  });

  it("missing audio no-ops and duplicate loops are prevented", async () => {
    uraiAudioEngine.applySettings({ enabled: true });
    await uraiAudioEngine.unlock();
    await expect(uraiAudioEngine.playOneShot("missing-audio-key")).resolves.toBeUndefined();
    await expect(uraiAudioEngine.playLoop("sky-calm-loop")).resolves.toBeUndefined();
    await expect(uraiAudioEngine.playLoop("sky-calm-loop")).resolves.toBeUndefined();
    expect(getActiveAudioLoops().filter((loop) => loop.key === "sky-calm-loop").length).toBeLessThanOrEqual(1);
  });

  it("stopAll clears loops", async () => {
    uraiAudioEngine.applySettings({ enabled: true });
    await uraiAudioEngine.unlock();
    await uraiAudioEngine.playLoop("sky-calm-loop");
    await uraiAudioEngine.stopAll();
    expect(getActiveAudioLoops()).toHaveLength(0);
  });

  it("reduced sensory mode can be enabled without enabling sound", () => {
    uraiAudioEngine.setReducedSensoryMode(true);
    expect(uraiAudioEngine.getSettings().reducedSensoryMode).toBe(true);
    expect(uraiAudioEngine.getSettings().enabled).toBe(false);
  });
});
