import React from "react";
import { SymbolicInferenceResult } from "@/lib/intelligence";

type IntelligencePreviewPanelProps = {
  result: SymbolicInferenceResult | null;
  isRunning?: boolean;
  onSaveDrafts?: () => void;
  onReset?: () => void;
};

export function IntelligencePreviewPanel({
  result,
  isRunning,
  onSaveDrafts,
  onReset,
}: IntelligencePreviewPanelProps) {
  if (isRunning) {
    return <div>Running inference...</div>;
  }

  if (!result) {
    return null;
  }

  const confidenceLabel = {
    low: "faint",
    medium: "forming",
    high: "strong",
  };

  return (
    <div>
      <h2>Symbolic Reflections</h2>
      <p>These are symbolic reflections, not certainty claims.</p>
      <p>Total signals: {result.signals.length}</p>

      <div>
        <h3>Life Map Candidates ({result.lifeMapCandidates.length})</h3>
        <ul>
          {result.lifeMapCandidates.map((signal) => (
            <li key={signal.id}>
              {signal.title} ({confidenceLabel[signal.confidence]})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Ground Bloom Candidates ({result.groundCandidates.length})</h3>
        <ul>
          {result.groundCandidates.map((signal) => (
            <li key={signal.id}>
              {signal.title} ({confidenceLabel[signal.confidence]})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Mirror Reflection Candidates ({result.mirrorCandidates.length})</h3>
        <ul>
          {result.mirrorCandidates.map((signal) => (
            <li key={signal.id}>
              {signal.title} ({confidenceLabel[signal.confidence]})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Ritual Suggestions ({result.ritualCandidates.length})</h3>
        <ul>
          {result.ritualCandidates.map((signal) => (
            <li key={signal.id}>
              {signal.title} ({confidenceLabel[signal.confidence]})
            </li>
          ))}
        </ul>
      </div>

      {result.shadowCandidates.length > 0 && (
        <div>
          <h3>Shadow Candidates ({result.shadowCandidates.length})</h3>
          <ul>
            {result.shadowCandidates.map((signal) => (
              <li key={signal.id}>
                {signal.title} ({confidenceLabel[signal.confidence]})
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.legacyCandidates.length > 0 && (
        <div>
          <h3>Legacy Candidates ({result.legacyCandidates.length})</h3>
          <ul>
            {result.legacyCandidates.map((signal) => (
              <li key={signal.id}>
                {signal.title} ({confidenceLabel[signal.confidence]})
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onSaveDrafts}>Save as drafts</button>
      <button onClick={onReset}>Clear reflections</button>
    </div>
  );
}
