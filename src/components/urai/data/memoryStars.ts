import type { MemoryCategory } from "./emotionPalette";

export type PrivacyState = "private" | "local" | "shareable";

export interface MemoryStar {
  id: string;
  title: string;
  subtitle: string;
  category: MemoryCategory;
  x: number;
  y: number;
  z: number;
  magnitude: number;
  confidence: number;
  privacy: PrivacyState;
  narratorText: string;
  dateLabel: string;
  signalCount: number;
  threadIds: string[];
  memoryImageUrl?: string;
  symbolicImageUrl?: string;
}

export const memoryStars: MemoryStar[] = [
  { id: "blue-fog-memory", title: "Blue Fog Memory", subtitle: "quiet grief marker", category: "threshold", x: -310, y: -18, z: 0.44, magnitude: 1.18, confidence: 72, privacy: "private", narratorText: "A soft weather system formed around this moment. URAI marked it as grief, but not collapse.", dateLabel: "Winter thread · inferred", signalCount: 4, threadIds: ["winter-threshold", "soft-recovery"] },
  { id: "protected-hour", title: "Protected Hour", subtitle: "became returned", category: "becoming", x: 76, y: -94, z: 0.8, magnitude: 1.34, confidence: 70, privacy: "local", narratorText: "A protected hour became a small doorway back into clarity.", dateLabel: "Today · focus signal", signalCount: 1, threadIds: ["clarity-thread", "winter-threshold"] },
  { id: "morning-return", title: "Morning Return", subtitle: "body rhythm stabilized", category: "recovery", x: 218, y: -62, z: 0.68, magnitude: 1.08, confidence: 81, privacy: "local", narratorText: "Your rhythm steadied here; URAI saw recovery as an ordinary morning, not a performance.", dateLabel: "Recent week", signalCount: 5, threadIds: ["soft-recovery"] },
  { id: "relationship-spark", title: "Warm Thread", subtitle: "contact felt safe", category: "relationship", x: 308, y: 30, z: 0.58, magnitude: 0.92, confidence: 64, privacy: "private", narratorText: "A familiar signal softened the field. The relationship thread brightened without demanding action.", dateLabel: "Social echo", signalCount: 3, threadIds: ["social-orbit"] },
  { id: "dream-door", title: "Dream Door", subtitle: "symbolic image surfaced", category: "dream", x: -92, y: 104, z: 0.52, magnitude: 0.88, confidence: 58, privacy: "private", narratorText: "A dream symbol repeated. URAI preserved it as image-language, not a conclusion.", dateLabel: "Night field", signalCount: 2, threadIds: ["dream-field"] },
  { id: "mirror-line", title: "Mirror Line", subtitle: "pattern reflected back", category: "mirror", x: 4, y: -12, z: 0.95, magnitude: 1.42, confidence: 88, privacy: "local", narratorText: "This is a mirror moment: not a diagnosis, just a pattern with enough signal to deserve tenderness.", dateLabel: "Pattern index", signalCount: 7, threadIds: ["clarity-thread", "social-orbit", "dream-field"] },
  { id: "golden-pause", title: "Golden Pause", subtitle: "nervous system exhaled", category: "recovery", x: 176, y: 116, z: 0.5, magnitude: 0.82, confidence: 76, privacy: "shareable", narratorText: "The field became less sharp. URAI marked a small restoration bloom.", dateLabel: "Recovery arc", signalCount: 4, threadIds: ["soft-recovery"] },
  { id: "threshold-flare", title: "Threshold Flare", subtitle: "transition pressure rose", category: "threshold", x: -42, y: -142, z: 0.72, magnitude: 1.05, confidence: 69, privacy: "private", narratorText: "A threshold appeared as pressure, not failure. URAI kept the context around it.", dateLabel: "Life shift", signalCount: 6, threadIds: ["winter-threshold"] },
  { id: "soft-laugh", title: "Soft Laugh", subtitle: "relational weather cleared", category: "relationship", x: 382, y: -82, z: 0.4, magnitude: 0.72, confidence: 61, privacy: "shareable", narratorText: "A small laugh changed the social weather more than the transcript alone could show.", dateLabel: "Ambient social", signalCount: 2, threadIds: ["social-orbit"] },
  { id: "future-self", title: "Future Self", subtitle: "becoming thread strengthened", category: "becoming", x: -178, y: 86, z: 0.62, magnitude: 1, confidence: 79, privacy: "local", narratorText: "A becoming thread strengthened. URAI marked this as direction without forcing a plan.", dateLabel: "Purpose signal", signalCount: 5, threadIds: ["clarity-thread"] },
];

export const memoryThreads = [
  ["blue-fog-memory", "threshold-flare", "mirror-line", "protected-hour"],
  ["blue-fog-memory", "dream-door", "golden-pause", "morning-return"],
  ["mirror-line", "relationship-spark", "soft-laugh"],
  ["future-self", "mirror-line", "protected-hour", "morning-return"],
];
