import type { GenesisMoodState } from "@/lib/companion/companionTypes";

export type GroundingAction = {
  id: string;
  title: string;
  shortText: string;
  durationHint?: string;
  moodTags?: GenesisMoodState[];
  intensity: "low" | "medium";
};

export const GROUNDING_ACTIONS: GroundingAction[] = [
  { id: "quiet-breath", title: "One quiet breath", shortText: "Take one slow breath and let the next moment arrive.", durationHint: "10 sec", moodTags: ["calm", "heavy", "anxious"], intensity: "low" },
  { id: "name-one-thing", title: "Name one thing you can see", shortText: "Choose one simple object near you and name it softly.", durationHint: "20 sec", moodTags: ["anxious", "threshold"], intensity: "low" },
  { id: "lower-noise", title: "Lower the noise", shortText: "Turn down one input if you can.", durationHint: "1 min", moodTags: ["anxious", "focused"], intensity: "low" },
  { id: "step-outside", title: "Step outside for a moment", shortText: "Let a little air touch the day if it is available.", durationHint: "2 min", moodTags: ["heavy", "recovering"], intensity: "medium" },
  { id: "drink-water", title: "Drink water", shortText: "A small sip is enough to begin again.", durationHint: "30 sec", moodTags: ["focused", "recovering"], intensity: "low" },
  { id: "one-sentence", title: "Write one sentence", shortText: "Write one sentence about what feels true right now.", durationHint: "1 min", moodTags: ["shadow", "threshold"], intensity: "low" },
  { id: "put-one-thing-down", title: "Put one thing down", shortText: "Set down one object, tab, or thought for now.", durationHint: "30 sec", moodTags: ["heavy", "anxious"], intensity: "low" },
  { id: "return-sky", title: "Return to the sky", shortText: "Look back up when you want more distance.", durationHint: "Anytime", moodTags: ["luminous", "hopeful"], intensity: "low" },
];

export function getGroundingActionsForMood(moodState?: GenesisMoodState): GroundingAction[] {
  if (!moodState) return GROUNDING_ACTIONS.slice(0, 4);
  const tagged = GROUNDING_ACTIONS.filter((action) => action.moodTags?.includes(moodState));
  return (tagged.length ? tagged : GROUNDING_ACTIONS).slice(0, 4);
}
