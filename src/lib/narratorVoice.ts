export type NarratorTone = "calm" | "curious" | "steady";

function getVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang.startsWith("en") && /female|samantha|victoria|zira/i.test(voice.name)) || voices.find((voice) => voice.lang.startsWith("en")) || null;
}

export function speakNarrator(text: string, tone: NarratorTone = "calm") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const cleanText = text.trim();
  if (!cleanText) return false;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voice = getVoice();
  if (voice) utterance.voice = voice;

  utterance.rate = tone === "curious" ? 0.92 : 0.86;
  utterance.pitch = tone === "steady" ? 0.88 : 1.02;
  utterance.volume = 0.82;

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopNarrator() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
