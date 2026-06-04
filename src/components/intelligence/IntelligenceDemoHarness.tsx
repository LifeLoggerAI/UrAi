import React from "react";
import { useSymbolicInference } from "../../hooks/useSymbolicInference";
import { IntelligencePreviewPanel } from "./IntelligencePreviewPanel";
import { SymbolicInputSummary } from "../../lib/intelligence";

const sampleInputs: SymbolicInputSummary[] = [
  {
    id: "1",
    createdAt: new Date().toISOString(),
    layerId: "com.urai.journal",
    kind: "journal_summary",
    summary: "Feeling a real sense of accomplishment today. I finished a major project at work, and it feels like a huge milestone.",
    tags: ["milestone", "work"],
    intensity: 80,
  },
  {
    id: "2",
    createdAt: new Date().toISOString(),
    layerId: "com.urai.movement",
    kind: "movement_summary",
    summary: "A long walk in nature to ground myself. The quiet and the fresh air were exactly what I needed.",
    tags: ["nature", "grounding"],
    intensity: 60,
  },
  {
    id: "3",
    createdAt: new Date().toISOString(),
    layerId: "com.urai.calendar",
    kind: "calendar_summary",
    summary: "I seem to have a recurring pattern of scheduling too many meetings on Mondays. It leaves me feeling rushed and anxious at the start of the week.",
    tags: ["repeated pattern", "work"],
    intensity: 70,
  },
];

export function IntelligenceDemoHarness() {
  const { result, isRunning, error, runInference, saveDrafts, reset } = useSymbolicInference({
    userId: "demo-user",
    openPassportLayerIds: ["com.urai.journal", "com.urai.movement", "com.urai.calendar"],
  });

  return (
    <div>
      <h1>Intelligence Demo Harness</h1>
      <button onClick={() => runInference(sampleInputs)} disabled={isRunning}>
        Run Inference
      </button>
      {error && <p>Error: {error.message}</p>}
      <IntelligencePreviewPanel
        result={result}
        isRunning={isRunning}
        onSaveDrafts={saveDrafts}
        onReset={reset}
      />
    </div>
  );
}
