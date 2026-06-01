import type {
  UraiMemoryStar,
  UraiNarratorReflection,
  UraiNarratorTone,
} from "./types";

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function auraColorForTone(tone: UraiNarratorTone): string {
  switch (tone) {
    case "protective":
      return "#7C8CFF";
    case "celebratory":
      return "#FFD166";
    case "mythic":
      return "#C77DFF";
    case "clear":
      return "#8EECF5";
    case "calm":
    default:
      return "#B8F2E6";
  }
}

function magnitudeForTone(tone: UraiNarratorTone): number {
  switch (tone) {
    case "protective":
      return 0.82;
    case "celebratory":
      return 0.9;
    case "mythic":
      return 0.86;
    case "clear":
      return 0.72;
    case "calm":
    default:
      return 0.62;
  }
}

export function createMemoryStarFromReflection(
  reflection: UraiNarratorReflection,
  index = 0,
): UraiMemoryStar {
  const angle = index * 0.89;
  const radius = 24 + ((index * 17) % 34);

  return {
    id: createId("star"),
    userId: reflection.userId,
    createdAt: new Date().toISOString(),
    reflectionId: reflection.id,
    label: reflection.title,
    constellation: "Genesis",
    auraColor: auraColorForTone(reflection.tone),
    magnitude: magnitudeForTone(reflection.tone),
    x: 50 + Math.cos(angle) * radius,
    y: 38 + Math.sin(angle) * radius,
    z: index % 7,
  };
}
