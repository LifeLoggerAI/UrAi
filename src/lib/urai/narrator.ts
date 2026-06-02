import type {
  UraiNarratorReflection,
  UraiNarratorTone,
  UraiPassiveSignal,
} from "./types";

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function inferNarratorTone(signal: UraiPassiveSignal): UraiNarratorTone {
  if (signal.intensity !== undefined && signal.intensity >= 0.8) {
    return "protective";
  }

  if (signal.emotionalTone === "joy" || signal.emotionalTone === "hope") {
    return "celebratory";
  }

  if (signal.source === "manualSystemEvent") {
    return "clear";
  }

  return "calm";
}

export function createGenesisReflectionFromSignal(signal: UraiPassiveSignal): UraiNarratorReflection {
  const tone = inferNarratorTone(signal);

  const title =
    signal.title ??
    (signal.contextLabel ? `A shift around ${signal.contextLabel}` : "A new moment appeared");

  const body =
    tone === "protective"
      ? "URAI noticed a stronger signal. No judgment, no diagnosis — just a gentle marker for attention."
      : tone === "celebratory"
        ? "Something bright moved through this moment. URAI saved it as a point of light for your life map."
        : "URAI noticed a quiet pattern forming. This moment has been saved gently as part of your unfolding map.";

  return {
    id: createId("reflection"),
    userId: signal.userId,
    createdAt: new Date().toISOString(),
    signalIds: [signal.id],
    title,
    body,
    tone,
    visibleToUser: true,
  };
}
