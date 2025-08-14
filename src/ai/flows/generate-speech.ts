/**
 * Temporary no-op speech generator to satisfy imports.
 * Replace with your real TTS pipeline when ready.
 */
export type GenerateSpeechInput = { text: string; voice?: string };
export type GenerateSpeechOutput = { url: string | null; text: string };

export async function generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
  console.warn('generateSpeech stub called with:', input);
  return { url: null, text: input.text };
}

export default generateSpeech;
