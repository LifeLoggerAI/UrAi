import { getAudioPath, type UraiAudioCategory, type UraiAudioKey } from "./uraiAudioManifest";

export type { UraiAudioCategory, UraiAudioKey };

export type UraiAudioSettings = {
  enabled: boolean;
  masterVolume: number;
  ambientVolume: number;
  effectsVolume: number;
  voiceVolume: number;
  hapticsEnabled: boolean;
  reducedSensoryMode: boolean;
};

type PlayOptions = {
  volume?: number;
  category?: UraiAudioCategory;
};

type LoopOptions = PlayOptions & {
  fadeMs?: number;
};

const DEFAULT_SETTINGS: UraiAudioSettings = {
  enabled: false,
  masterVolume: 0.65,
  ambientVolume: 0.35,
  effectsVolume: 0.55,
  voiceVolume: 0.8,
  hapticsEnabled: true,
  reducedSensoryMode: false,
};

function clampVolume(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

class UraiAudioEngine {
  private settings: UraiAudioSettings = { ...DEFAULT_SETTINGS };
  private unlocked = false;
  private loops = new Map<string, HTMLAudioElement>();
  private categoryVolumes: Record<UraiAudioCategory, number> = {
    ambient: DEFAULT_SETTINGS.ambientVolume,
    orb: DEFAULT_SETTINGS.effectsVolume,
    portal: DEFAULT_SETTINGS.effectsVolume,
    transition: DEFAULT_SETTINGS.effectsVolume,
    ui: DEFAULT_SETTINGS.effectsVolume,
    notification: DEFAULT_SETTINGS.effectsVolume,
    mood: DEFAULT_SETTINGS.ambientVolume,
  };

  async init(): Promise<void> {
    return;
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }

  getSettings(): UraiAudioSettings {
    return { ...this.settings };
  }

  applySettings(settings: Partial<UraiAudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.categoryVolumes.ambient = this.settings.ambientVolume;
    this.categoryVolumes.mood = this.settings.ambientVolume;
    this.categoryVolumes.orb = this.settings.effectsVolume;
    this.categoryVolumes.portal = this.settings.effectsVolume;
    this.categoryVolumes.transition = this.settings.effectsVolume;
    this.categoryVolumes.ui = this.settings.effectsVolume;
    this.categoryVolumes.notification = this.settings.effectsVolume;
    if (!this.settings.enabled) void this.stopAll({ fadeMs: 700 });
  }

  async unlock(): Promise<void> {
    if (typeof window === "undefined") return;
    this.unlocked = true;
  }

  async playOneShot(key: UraiAudioKey | string, options: PlayOptions = {}): Promise<void> {
    if (!this.canPlay()) return;
    const src = getAudioPath(key);
    if (!src) return;

    try {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = this.resolveVolume(options.category ?? "ui", options.volume);
      await audio.play();
    } catch {
      return;
    }
  }

  async playLoop(key: UraiAudioKey | string, options: LoopOptions = {}): Promise<void> {
    if (!this.canPlay()) return;
    const src = getAudioPath(key);
    if (!src) return;

    const existing = this.loops.get(key);
    const targetVolume = this.resolveVolume(options.category ?? "ambient", options.volume);
    if (existing) {
      await this.fadeTo(existing, targetVolume, options.fadeMs ?? 900);
      return;
    }

    try {
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = options.fadeMs ? 0 : targetVolume;
      this.loops.set(key, audio);
      await audio.play();
      if (options.fadeMs) await this.fadeTo(audio, targetVolume, options.fadeMs);
    } catch {
      this.loops.delete(key);
      return;
    }
  }

  async stopLoop(key: UraiAudioKey | string, options: { fadeMs?: number } = {}): Promise<void> {
    const audio = this.loops.get(key);
    if (!audio) return;
    if (options.fadeMs) await this.fadeTo(audio, 0, options.fadeMs);
    audio.pause();
    audio.currentTime = 0;
    this.loops.delete(key);
  }

  async crossfadeLoop(
    fromKey: UraiAudioKey | string,
    toKey: UraiAudioKey | string,
    options: { durationMs?: number; toVolume?: number; category?: UraiAudioCategory } = {},
  ): Promise<void> {
    const durationMs = options.durationMs ?? 2400;
    await Promise.all([
      this.stopLoop(fromKey, { fadeMs: durationMs }),
      this.playLoop(toKey, { fadeMs: durationMs, volume: options.toVolume, category: options.category ?? "mood" }),
    ]);
  }

  setMasterVolume(value: number): void {
    this.settings.masterVolume = clampVolume(value);
    this.rebalanceLoops();
  }

  setCategoryVolume(category: UraiAudioCategory, value: number): void {
    this.categoryVolumes[category] = clampVolume(value);
    if (category === "ambient") this.settings.ambientVolume = clampVolume(value);
    if (category === "mood") this.settings.ambientVolume = clampVolume(value);
    if (["orb", "portal", "transition", "ui", "notification"].includes(category)) this.settings.effectsVolume = clampVolume(value);
    this.rebalanceLoops();
  }

  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    if (!enabled) void this.stopAll({ fadeMs: 900 });
  }

  setReducedSensoryMode(enabled: boolean): void {
    this.settings.reducedSensoryMode = enabled;
    this.rebalanceLoops();
  }

  async stopAll(options: { fadeMs?: number } = {}): Promise<void> {
    await Promise.all([...this.loops.keys()].map((key) => this.stopLoop(key, options)));
  }

  private canPlay(): boolean {
    return typeof window !== "undefined" && this.settings.enabled && this.unlocked;
  }

  private resolveVolume(category: UraiAudioCategory, volume = 1): number {
    const sensoryFactor = this.settings.reducedSensoryMode ? 0.45 : 1;
    return clampVolume(volume * this.settings.masterVolume * (this.categoryVolumes[category] ?? 1) * sensoryFactor);
  }

  private rebalanceLoops(): void {
    for (const audio of this.loops.values()) {
      audio.volume = Math.min(audio.volume, this.settings.masterVolume);
    }
  }

  private fadeTo(audio: HTMLAudioElement, targetVolume: number, durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      const startVolume = audio.volume;
      const startedAt = Date.now();
      const duration = Math.max(1, durationMs);
      const tick = () => {
        const progress = Math.min(1, (Date.now() - startedAt) / duration);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;
        if (progress >= 1) {
          resolve();
          return;
        }
        window.setTimeout(tick, 40);
      };
      tick();
    });
  }
}

export const uraiAudioEngine = new UraiAudioEngine();
