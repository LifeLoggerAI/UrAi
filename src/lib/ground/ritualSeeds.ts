import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { GroundElementType } from "./groundTypes";

export type RitualSeed = {
  id: string;
  title: string;
  intention: string;
  suggestedWhen: GenesisMoodState[];
  visualType: GroundElementType;
  defaultActionIds: string[];
};

export const RITUAL_SEEDS: RitualSeed[] = [
  { id: "calm-seed", title: "Calm Seed", intention: "Return to one quiet point.", suggestedWhen: ["calm", "anxious", "heavy"], visualType: "ritualSeed", defaultActionIds: ["quiet-breath", "name-one-thing"] },
  { id: "recovery-seed", title: "Recovery Seed", intention: "Let one small bloom come back slowly.", suggestedWhen: ["recovering", "heavy"], visualType: "recoveryBloom", defaultActionIds: ["drink-water", "step-outside"] },
  { id: "focus-root", title: "Focus Root", intention: "Clear one path without forcing the day.", suggestedWhen: ["focused", "anxious"], visualType: "root", defaultActionIds: ["lower-noise", "put-one-thing-down"] },
  { id: "threshold-lantern", title: "Threshold Lantern", intention: "Hold a light at the edge of change.", suggestedWhen: ["threshold", "shadow"], visualType: "lantern", defaultActionIds: ["one-sentence", "quiet-breath"] },
  { id: "shadow-softening", title: "Shadow Softening", intention: "Meet the dim place without making it a threat.", suggestedWhen: ["shadow", "heavy"], visualType: "shadowMoss", defaultActionIds: ["one-sentence", "put-one-thing-down"] },
  { id: "legacy-branch", title: "Legacy Branch", intention: "Let one meaningful thread keep growing.", suggestedWhen: ["hopeful", "luminous", "recovering"], visualType: "legacyTree", defaultActionIds: ["return-sky", "one-sentence"] },
];

export function getRitualSeedsForMood(moodState?: GenesisMoodState): RitualSeed[] {
  if (!moodState) return RITUAL_SEEDS.slice(0, 4);
  const matches = RITUAL_SEEDS.filter((seed) => seed.suggestedWhen.includes(moodState));
  return (matches.length ? matches : RITUAL_SEEDS).slice(0, 4);
}
