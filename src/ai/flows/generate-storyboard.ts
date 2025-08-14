/**
 * Temporary stub for generate-storyboard to satisfy imports during build.
 * Replace with your real storyboard generator later.
 */
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

  const summary = raw ? raw.slice(0, 160) : 'Storyboard stub';

  const scenes: StoryScene[] = [
    {
      sceneHeader: 'INT. OPENING - DAY',
      shots: [
        { description: 'Wide shot establishing the setting', durationSec: 3 },
        { description: 'Close-up on key subject', durationSec: 2 }
      ]
    },
    {
      sceneHeader: 'EXT. BEAT 1 - DAY',
      shots: [
        { description: 'Action moment / key event', durationSec: 4 },
        { description: 'Reaction shot / emotional cue', durationSec: 3 }
      ]
    },
    {
      sceneHeader: 'INT. BEAT 2 - EVENING',
      shots: [
        { description: 'Conflict or shift escalates', durationSec: 4 },
        { description: 'Cutaway to detail symbol', durationSec: 2 }
      ]
    },
    {
      sceneHeader: 'EXT. CLOSING - NIGHT',
      shots: [
        { description: 'Resolve / denouement', durationSec: 3 },
        { description: 'Final hold on motif', durationSec: 2 }
      ]
    }
  ];

  const structuredData = {
    location: { name: 'Default Location', environment: 'Indoor/Outdoor', lighting: 'Mixed' },
    people: [{ name: 'Protagonist' }],
    props: [],
    themes: []
  };

  return { scenes, summary, structuredData, validationIssues: [] };
}

export default generateStoryboard;
