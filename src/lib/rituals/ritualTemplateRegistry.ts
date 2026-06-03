import type { RitualTemplate } from "./ritualTypes";

export const RITUAL_TEMPLATES: RitualTemplate[] = [
  { id: "one-quiet-breath", title: "One Quiet Breath", type: "grounding", intensity: "tiny", summary: "A single breath to mark this moment.", steps: [{ id: "breathe", text: "Take one slow breath.", durationHint: "10 sec", sensoryHint: "breath" }, { id: "enough", text: "Let that be enough for now.", sensoryHint: "stillness" }] },
  { id: "name-visible-thing", title: "Name One Visible Thing", type: "grounding", intensity: "tiny", summary: "A small return to what is near.", steps: [{ id: "look", text: "Look around gently.", sensoryHint: "sight" }, { id: "name", text: "Name one thing you can see.", durationHint: "20 sec", sensoryHint: "sight" }] },
  { id: "return-ground", title: "Return to the Ground", type: "grounding", intensity: "soft", summary: "A quiet step back into steadiness.", steps: [{ id: "feet", text: "Notice where your body meets the floor or chair.", sensoryHint: "touch" }, { id: "root", text: "Imagine one small root beneath you.", sensoryHint: "stillness" }] },
  { id: "small-return", title: "Small Return", type: "recovery", intensity: "tiny", summary: "One small return, without claiming the whole day.", steps: [{ id: "choose", text: "Choose one small thing that can be easier now." }, { id: "mark", text: "Mark it as a small return." }] },
  { id: "look-without-judging", title: "Look Without Judging", type: "reflection", intensity: "soft", summary: "See the pattern without turning it into blame.", steps: [{ id: "look", text: "Look at the pattern as if it belongs to the weather." }, { id: "soft", text: "Use the word maybe before any conclusion." }] },
  { id: "name-pattern-softly", title: "Name the Pattern Softly", type: "reflection", intensity: "tiny", summary: "A gentle name, not a label.", steps: [{ id: "name", text: "Give the pattern a soft temporary name." }, { id: "release", text: "Let the name remain temporary." }] },
  { id: "put-one-thing-down", title: "Put One Thing Down", type: "release", intensity: "tiny", summary: "Set down one thing for now.", steps: [{ id: "choose", text: "Choose one object, tab, or thought to set down." }, { id: "down", text: "Put it down for now." }] },
  { id: "carry-forward", title: "Carry This Forward", type: "legacy", intensity: "soft", summary: "Choose one summary to preserve.", steps: [{ id: "choose", text: "Choose one thing worth carrying." }, { id: "keep", text: "Keep only the summary." }] },
  { id: "write-one-line", title: "Write One Line", type: "legacy", intensity: "tiny", summary: "One line can be enough.", steps: [{ id: "line", text: "Write one line about what matters here." }] },
  { id: "keep-light-on", title: "Keep the Light On", type: "shadow_softening", intensity: "tiny", summary: "A soft light near a difficult place.", steps: [{ id: "light", text: "Imagine a small light nearby, not inside the hard thing." }, { id: "ground", text: "Step back toward Ground." }] },
  { id: "soften-sentence", title: "Soften the Sentence", type: "shadow_softening", intensity: "tiny", summary: "Make one hard sentence less sharp.", steps: [{ id: "sentence", text: "Find one hard sentence." }, { id: "maybe", text: "Begin it with maybe." }] },
  { id: "step-back-ground", title: "Step Back to Ground", type: "shadow_softening", intensity: "tiny", summary: "Leave the deeper room and return to a root.", steps: [{ id: "turn", text: "Turn attention away from Shadow." }, { id: "root", text: "Open or imagine the Ground root." }] },
  { id: "clear-surface", title: "Clear One Surface", type: "focus", intensity: "tiny", summary: "Clear one small surface without making it a mission.", steps: [{ id: "surface", text: "Choose one small surface." }, { id: "clear", text: "Move one thing away." }] },
  { id: "next-small-step", title: "Choose the Next Small Step", type: "focus", intensity: "tiny", summary: "Only the next step, not the whole path.", steps: [{ id: "choose", text: "Choose the next small step." }, { id: "stop", text: "Stop there for now." }] },
];

export function getRitualTemplate(id: string): RitualTemplate | undefined {
  return RITUAL_TEMPLATES.find((template) => template.id === id);
}
