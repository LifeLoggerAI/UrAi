import { uraiAudioEngine } from "./uraiAudioEngine";

type NotificationSoundOptions = {
  quietHours?: boolean;
  allowDuringQuietHours?: boolean;
};

function canPlayNotificationSound(options: NotificationSoundOptions = {}): boolean {
  return !(options.quietHours && !options.allowDuringQuietHours);
}

export async function playGentleNotification(options?: NotificationSoundOptions): Promise<void> {
  if (!canPlayNotificationSound(options)) return;
  await uraiAudioEngine.playOneShot("gentle-chime", { category: "notification", volume: 0.26 });
}

export async function playPassportPulse(options?: NotificationSoundOptions): Promise<void> {
  if (!canPlayNotificationSound(options)) return;
  await uraiAudioEngine.playOneShot("passport-pulse", { category: "notification", volume: 0.22 });
}

export async function playMoodForecastChime(options?: NotificationSoundOptions): Promise<void> {
  if (!canPlayNotificationSound(options)) return;
  await uraiAudioEngine.playOneShot("gentle-chime", { category: "notification", volume: 0.2 });
}

export async function playRecoveryBloomChime(options?: NotificationSoundOptions): Promise<void> {
  if (!canPlayNotificationSound(options)) return;
  await uraiAudioEngine.playOneShot("recovery-bloom", { category: "notification", volume: 0.22 });
}

export async function playRitualReadyChime(options?: NotificationSoundOptions): Promise<void> {
  if (!canPlayNotificationSound(options)) return;
  await uraiAudioEngine.playOneShot("ritual-ready", { category: "notification", volume: 0.2 });
}

export async function playExportReadyChime(options?: NotificationSoundOptions): Promise<void> {
  if (!canPlayNotificationSound(options)) return;
  await uraiAudioEngine.playOneShot("export-ready", { category: "notification", volume: 0.18 });
}
