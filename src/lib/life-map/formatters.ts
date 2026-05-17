import type { MemoryStar } from "./types";

export function formatMemoryConfidence(memory?: MemoryStar) {
  if (!memory) return "privacy-safe summary";

  const confidence = Math.max(72, Math.min(96, Math.round((memory.intensity || memory.glow || 0.82) * 100)));
  const signalCount = Math.max(1, memory.sourceSignals?.length ?? 1);
  const signalCopy = signalCount === 1 ? "1 passive signal" : `${signalCount} passive signals`;

  return `${confidence}% confidence · ${signalCopy} · privacy-safe summary`;
}

export function memoryTypeLabel(memory?: MemoryStar) {
  if (!memory) return "Memory star";
  const labels: Record<string, string> = {
    memory: "Memory star",
    ritual: "Ritual anchor",
    relationship: "Relationship orbit",
    threshold: "Threshold moment",
    recovery: "Recovery thread",
    dream: "Dream field",
    mirror: "Mirror signal",
    shadow: "Shadow pattern",
    legacy: "Legacy thread",
    joy: "Joy marker",
    grief: "Quiet grief marker",
    purpose: "Purpose north",
    companion: "Companion signal",
    rebirth: "Rebirth bloom",
  };
  return labels[memory.type] ?? "Memory star";
}

export function companionLineForState(memory?: MemoryStar, state?: "idle" | "focus" | "replay" | "mirror" | "ritual" | "privacy") {
  if (state === "replay") return "Ready to narrate this thread.";
  if (state === "mirror") return "The mirror is reflecting this signal without judging it.";
  if (state === "ritual") return "A small ritual can help this memory settle.";
  if (state === "privacy") return "URAI can explain the pattern without exposing the private source.";
  if (!memory) return "Your sky is listening softly.";
  if (memory.type === "threshold") return "This was a crossing point, not a diagnosis.";
  return memory.narratorText || "This memory carried weight, so URAI rendered it softly.";
}
