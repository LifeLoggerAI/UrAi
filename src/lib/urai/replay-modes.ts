export type ReplayMode = "memory-star" | "constellation" | "timeline";

export const replayModes: Array<{
  id: ReplayMode;
  label: string;
  description: string;
}> = [
  {
    id: "memory-star",
    label: "Memory Star",
    description: "One moment opens as a sacred focal point.",
  },
  {
    id: "constellation",
    label: "Constellation",
    description: "The memory appears with nearby emotional echoes.",
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "The memory becomes part of a luminous life path.",
  },
];
