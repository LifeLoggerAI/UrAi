import { uraiAudioEngine } from "./uraiAudioEngine";

export async function playGentleNotification(): Promise<void> {
  await uraiAudioEngine.playOneShot("gentle-chime", { category: "notification", volume: 0.44 });
}

export async function playPassportPulse(): Promise<void> {
  await uraiAudioEngine.playOneShot("passport-pulse", { category: "notification", volume: 0.4 });
}

export async function playMoodForecastChime(): Promise<void> {
  await uraiAudioEngine.playOneShot("gentle-chime", { category: "notification", volume: 0.34 });
}

export async function playRecoveryBloomChime(): Promise<void> {
  await uraiAudioEngine.playOneShot("soft-bloom", { category: "transition", volume: 0.42 });
}
