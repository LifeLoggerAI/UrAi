import { getVoiceLine, type UraiVoiceLine } from "./uraiVoiceManifest";

export type UraiVoiceSettings = {
  voiceEnabled: boolean;
  captionsEnabled: boolean;
  voiceVolume: number;
  whispersEnabled: boolean;
  councilNarrationEnabled: boolean;
  reducedSensoryMode: boolean;
};

type PlayVoiceOptions = {
  forceCaption?: boolean;
  priority?: "idle" | "normal" | "portal" | "council" | "high";
};

const DEFAULT_SETTINGS: UraiVoiceSettings = {
  voiceEnabled: false,
  captionsEnabled: true,
  voiceVolume: 0.8,
  whispersEnabled: false,
  councilNarrationEnabled: true,
  reducedSensoryMode: false,
};

function priorityRank(priority?: PlayVoiceOptions["priority"]): number {
  if (priority === "high") return 4;
  if (priority === "portal" || priority === "council") return 3;
  if (priority === "normal") return 2;
  if (priority === "idle") return 1;
  return 2;
}

class UraiVoiceEngine {
  private settings: UraiVoiceSettings = { ...DEFAULT_SETTINGS };
  private currentAudio: HTMLAudioElement | null = null;
  private currentPriority: PlayVoiceOptions["priority"] | null = null;
  private currentCaption: string | null = null;
  private captionListeners = new Set<(caption: string | null) => void>();
  private cooldowns = new Map<string, number>();
  private captionTimer: number | null = null;

  applySettings(settings: Partial<UraiVoiceSettings>): void {
    this.settings = { ...this.settings, ...settings };
    if (!this.settings.voiceEnabled || this.settings.reducedSensoryMode) this.stopVoiceLine(!this.settings.captionsEnabled);
  }

  subscribe(listener: (caption: string | null) => void): () => void {
    this.captionListeners.add(listener);
    listener(this.currentCaption);
    return () => this.captionListeners.delete(listener);
  }

  async playVoiceLine(key: string, options: PlayVoiceOptions = {}): Promise<void> {
    const line = getVoiceLine(key);
    if (!line) return;
    if (!this.canPlayLine(line, options)) return;

    const nextPriority = options.priority ?? "normal";
    if (this.currentAudio && priorityRank(nextPriority) < priorityRank(this.currentPriority ?? "normal")) return;

    this.cooldowns.set(key, Date.now() + (line.cooldownMs ?? 0));

    if (this.settings.captionsEnabled && line.allowTextFallback !== false) {
      this.setCaption(line.text);
      this.scheduleCaptionClear(line);
    }

    if (!this.settings.voiceEnabled || options.forceCaption || !line.audioPath || this.settings.reducedSensoryMode) return;
    if (options.priority === "idle") return;

    try {
      this.stopVoiceLine(false);
      const audio = new Audio(line.audioPath);
      audio.preload = "none";
      audio.volume = this.resolveVolume(line);
      this.currentAudio = audio;
      this.currentPriority = nextPriority;
      audio.onended = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.currentPriority = null;
        }
      };
      await audio.play();
    } catch {
      this.currentAudio = null;
      this.currentPriority = null;
      return;
    }
  }

  stopVoiceLine(clearCaption = true): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // no-op
      } finally {
        this.currentAudio = null;
        this.currentPriority = null;
      }
    }
    if (clearCaption) this.clearCaption();
  }

  setVoiceEnabled(enabled: boolean): void {
    this.settings.voiceEnabled = enabled;
    if (!enabled) this.stopVoiceLine();
  }

  setVoiceVolume(value: number): void {
    this.settings.voiceVolume = Math.max(0, Math.min(1, value));
    if (this.currentAudio) this.currentAudio.volume = this.settings.voiceVolume;
  }

  setCaptionsEnabled(enabled: boolean): void {
    this.settings.captionsEnabled = enabled;
    if (!enabled) this.clearCaption();
  }

  getCurrentCaption(): string | null {
    return this.currentCaption;
  }

  clearCaption(): void {
    if (this.captionTimer) window.clearTimeout(this.captionTimer);
    this.captionTimer = null;
    this.setCaption(null);
  }

  private canPlayLine(line: UraiVoiceLine, options: PlayVoiceOptions): boolean {
    if (typeof window === "undefined") return false;
    if (options.priority === "idle" && (!this.settings.whispersEnabled || this.settings.reducedSensoryMode)) return false;
    if (options.priority === "council" && !this.settings.councilNarrationEnabled) return false;
    if (!this.settings.captionsEnabled && !this.settings.voiceEnabled) return false;
    const cooldownUntil = this.cooldowns.get(line.key) ?? 0;
    return Date.now() >= cooldownUntil;
  }

  private resolveVolume(line: UraiVoiceLine): number {
    const intensityFactor = line.intensity === "high" ? 1 : line.intensity === "medium" ? 0.82 : 0.68;
    return Math.max(0, Math.min(1, this.settings.voiceVolume * intensityFactor));
  }

  private setCaption(caption: string | null): void {
    this.currentCaption = caption;
    for (const listener of this.captionListeners) listener(caption);
  }

  private scheduleCaptionClear(line: UraiVoiceLine): void {
    if (this.captionTimer) window.clearTimeout(this.captionTimer);
    const manifestDuration = "captionDurationMs" in line && typeof line.captionDurationMs === "number" ? line.captionDurationMs : undefined;
    this.captionTimer = window.setTimeout(() => {
      if (this.currentCaption === line.text) this.clearCaption();
    }, manifestDuration ?? this.estimateCaptionDuration(line.text));
  }

  private estimateCaptionDuration(text: string): number {
    return Math.max(2400, Math.min(7000, text.length * 58));
  }
}

export const uraiVoiceEngine = new UraiVoiceEngine();
