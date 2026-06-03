import { getAudioAsset, type UraiAudioCategory, type UraiAudioKey } from "./uraiAudioManifest";

export type { UraiAudioCategory, UraiAudioKey };

export type UraiAudioSettings = { enabled: boolean; masterVolume: number; ambientVolume: number; effectsVolume: number; voiceVolume: number; hapticsEnabled: boolean; reducedSensoryMode: boolean };
export type ActiveAudioLoop = { key: string; category: UraiAudioCategory; volume: number; paused: boolean };
type PlayOptions = { volume?: number; category?: UraiAudioCategory };
type LoopOptions = PlayOptions & { fadeMs?: number };

const DEFAULT_SETTINGS: UraiAudioSettings = { enabled: false, masterVolume: 0.65, ambientVolume: 0.35, effectsVolume: 0.55, voiceVolume: 0.8, hapticsEnabled: true, reducedSensoryMode: false };
const DEFAULT_CATEGORY_VOLUMES: Record<UraiAudioCategory, number> = { ambient: DEFAULT_SETTINGS.ambientVolume, orb: DEFAULT_SETTINGS.effectsVolume, portal: DEFAULT_SETTINGS.effectsVolume, transition: DEFAULT_SETTINGS.effectsVolume, ui: DEFAULT_SETTINGS.effectsVolume, notification: DEFAULT_SETTINGS.effectsVolume, mood: DEFAULT_SETTINGS.ambientVolume };
function clampVolume(value: number): number { if (Number.isNaN(value)) return 0; return Math.max(0, Math.min(1, value)); }
function categorySensoryFactor(category: UraiAudioCategory, reduced: boolean): number { if (!reduced) return 1; if (category === "ambient" || category === "mood") return 0.6; if (category === "ui" || category === "notification") return 0.5; if (category === "portal" || category === "transition" || category === "orb") return 0.48; return 0.5; }
type LoopRecord = { audio: HTMLAudioElement; key: string; category: UraiAudioCategory; baseVolume: number; fadeTimer?: number };

class UraiAudioEngine {
  private settings: UraiAudioSettings = { ...DEFAULT_SETTINGS };
  private unlocked = false;
  private loops = new Map<string, LoopRecord>();
  private categoryVolumes: Record<UraiAudioCategory, number> = { ...DEFAULT_CATEGORY_VOLUMES };
  async init(): Promise<void> { return; }
  isUnlocked(): boolean { return this.unlocked; }
  getSettings(): UraiAudioSettings { return { ...this.settings }; }
  getActiveAudioLoops(): ActiveAudioLoop[] {
    if (process.env.NODE_ENV === "production") return [];
    return [...this.loops.values()].map((record) => ({ key: record.key, category: record.category, volume: record.audio.volume, paused: record.audio.paused }));
  }
  applySettings(settings: Partial<UraiAudioSettings>): void { this.settings = { ...this.settings, ...settings }; this.categoryVolumes.ambient = this.settings.ambientVolume; this.categoryVolumes.mood = this.settings.ambientVolume; this.categoryVolumes.orb = this.settings.effectsVolume; this.categoryVolumes.portal = this.settings.effectsVolume; this.categoryVolumes.transition = this.settings.effectsVolume; this.categoryVolumes.ui = this.settings.effectsVolume; this.categoryVolumes.notification = this.settings.effectsVolume; this.rebalanceLoops(); if (!this.settings.enabled) void this.stopAll({ fadeMs: 700 }); }
  async unlock(): Promise<void> { if (typeof window === "undefined") return; this.unlocked = true; }
  async playOneShot(key: UraiAudioKey | string, options: PlayOptions = {}): Promise<void> { if (!this.canPlay()) return; const asset = getAudioAsset(key); if (!asset || asset.loop) return; try { const audio = new Audio(asset.path); audio.preload = "none"; audio.volume = this.resolveVolume(options.category ?? asset.category, options.volume ?? asset.defaultVolume); await audio.play(); } catch { return; } }
  async playLoop(key: UraiAudioKey | string, options: LoopOptions = {}): Promise<void> { if (!this.canPlay()) return; const asset = getAudioAsset(key); if (!asset || !asset.loop) return; const category = options.category ?? asset.category; const baseVolume = options.volume ?? asset.defaultVolume; const targetVolume = this.resolveVolume(category, baseVolume); const existing = this.loops.get(asset.key); if (existing) { existing.category = category; existing.baseVolume = baseVolume; await this.fadeTo(existing, targetVolume, options.fadeMs ?? 900); return; } try { const audio = new Audio(asset.path); audio.loop = true; audio.preload = "none"; audio.volume = options.fadeMs ? 0 : targetVolume; const record: LoopRecord = { audio, key: asset.key, category, baseVolume }; this.loops.set(asset.key, record); await audio.play(); if (options.fadeMs) await this.fadeTo(record, targetVolume, options.fadeMs); } catch { this.loops.delete(asset.key); return; } }
  async stopLoop(key: UraiAudioKey | string, options: { fadeMs?: number } = {}): Promise<void> { const asset = getAudioAsset(key); const loopKey = asset?.key ?? key; const record = this.loops.get(loopKey); if (!record) return; if (options.fadeMs) await this.fadeTo(record, 0, options.fadeMs); try { record.audio.pause(); record.audio.currentTime = 0; } catch { } if (record.fadeTimer) window.clearTimeout(record.fadeTimer); this.loops.delete(loopKey); }
  async crossfadeLoop(fromKey: UraiAudioKey | string, toKey: UraiAudioKey | string, options: { durationMs?: number; toVolume?: number; category?: UraiAudioCategory } = {}): Promise<void> { if (!this.canPlay()) return; const durationMs = options.durationMs ?? 2400; const toAsset = getAudioAsset(toKey); await Promise.all([this.stopLoop(fromKey, { fadeMs: durationMs }), toAsset ? this.playLoop(toAsset.key, { fadeMs: durationMs, volume: options.toVolume ?? toAsset.defaultVolume, category: options.category ?? toAsset.category }) : Promise.resolve()]); }
  async stopCategory(category: UraiAudioCategory, options: { fadeMs?: number } = {}): Promise<void> { const keys = [...this.loops.values()].filter((record) => record.category === category).map((record) => record.key); await Promise.all(keys.map((key) => this.stopLoop(key, options))); }
  setMasterVolume(value: number): void { this.settings.masterVolume = clampVolume(value); this.rebalanceLoops(); }
  setCategoryVolume(category: UraiAudioCategory, value: number): void { this.categoryVolumes[category] = clampVolume(value); if (category === "ambient") this.settings.ambientVolume = clampVolume(value); if (category === "mood") this.settings.ambientVolume = clampVolume(value); if (["orb", "portal", "transition", "ui", "notification"].includes(category)) this.settings.effectsVolume = clampVolume(value); this.rebalanceLoops(); }
  setEnabled(enabled: boolean): void { this.settings.enabled = enabled; if (!enabled) void this.stopAll({ fadeMs: 900 }); }
  setReducedSensoryMode(enabled: boolean): void { this.settings.reducedSensoryMode = enabled; this.rebalanceLoops(); if (enabled) void this.stopCategory("mood", { fadeMs: 1200 }); }
  async stopAll(options: { fadeMs?: number } = {}): Promise<void> { await Promise.all([...this.loops.keys()].map((key) => this.stopLoop(key, options))); }
  private canPlay(): boolean { return typeof window !== "undefined" && this.settings.enabled && this.unlocked; }
  private resolveVolume(category: UraiAudioCategory, volume = 1): number { const sensoryFactor = categorySensoryFactor(category, this.settings.reducedSensoryMode); return clampVolume(volume * this.settings.masterVolume * (this.categoryVolumes[category] ?? 1) * sensoryFactor); }
  private rebalanceLoops(): void { for (const record of this.loops.values()) record.audio.volume = this.resolveVolume(record.category, record.baseVolume); }
  private fadeTo(record: LoopRecord, targetVolume: number, durationMs: number): Promise<void> { if (record.fadeTimer) window.clearTimeout(record.fadeTimer); return new Promise((resolve) => { const startVolume = record.audio.volume; const startedAt = Date.now(); const duration = Math.max(1, durationMs); const tick = () => { const progress = Math.min(1, (Date.now() - startedAt) / duration); record.audio.volume = startVolume + (targetVolume - startVolume) * progress; if (progress >= 1) { record.fadeTimer = undefined; resolve(); return; } record.fadeTimer = window.setTimeout(tick, 40); }; tick(); }); }
}
export const uraiAudioEngine = new UraiAudioEngine();
export function getActiveAudioLoops(): ActiveAudioLoop[] { return uraiAudioEngine.getActiveAudioLoops(); }
