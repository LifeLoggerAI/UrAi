/**
 * Temporary stub for generate-avatar to satisfy imports during build.
 * Replace with your real image/avatar generator later.
 */
export type GenerateAvatarInput = {
  seed?: string;
  style?: string;   // e.g., "minimal", "comic", "realistic"
  mood?: string;    // e.g., "calm", "focused"
};

export type GenerateAvatarOutput = {
  imageUrl: string | null;
  meta?: Record<string, unknown>;
};

export async function generateAvatar(
  input: GenerateAvatarInput
): Promise<GenerateAvatarOutput | null> {
  // Stub just echoes intent; no image generated yet
  return {
    imageUrl: null,
    meta: {
      seed: input?.seed ?? null,
      style: input?.style ?? null,
      mood: input?.mood ?? null,
      stub: true
    }
  };
}

export default generateAvatar;
