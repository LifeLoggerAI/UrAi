export type GenerateStoryboardInput = {
  transcript?: string;
  mood?: string;
  eventDescription?: string;
  text?: string;
};

export type StoryShot = { description: string; durationSec?: number };
export type StoryScene = { sceneHeader: string; shots: StoryShot[] };
export type StoryFrame = StoryShot;

export type GenerateStoryboardOutput = {
  scenes: StoryScene[];
  summary: string;
  structuredData: {
    location: {
      name: string;
      environment: string;
      lighting: string;
      address?: string;
      weather?: string;
      atmosphere?: string;
    };
    people: Array<{ name: string; role?: string }>;
    props: string[];
    themes: string[];
    music?: string[];
  };
  validationIssues?: Array<{ code: string; message: string }>;
};

export async function generateStoryboard(
  input: GenerateStoryboardInput
): Promise<GenerateStoryboardOutput | null> {
  const raw =
    (input?.transcript ?? '').trim() ||
    (input?.eventDescription ?? '').trim() ||
    (input?.text ?? '').trim();

  if (!raw) return null;

  const sentences = raw
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const scenes: StoryScene[] = sentences.map((sentence, idx) => ({
    sceneHeader: `SCENE ${idx + 1}`,
    shots: [{ description: sentence, durationSec: 3 }],
  }));

  const summary = sentences.slice(0, 2).join(' ');

  const structuredData = {
    location: { name: 'Unknown', environment: 'unknown', lighting: 'unknown' },
    people: [],
    props: [],
    themes: [],
  };

  return { scenes, summary, structuredData, validationIssues: [] };
}

export default generateStoryboard;
