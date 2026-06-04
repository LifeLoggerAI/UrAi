import { useState, useCallback } from "react";
import {
  SymbolicInferenceResult,
  SymbolicInferenceConfig,
  SymbolicInputSummary,
} from "../lib/intelligence";
import {
  generateLocalSymbolicInference,
  saveIntelligenceSignalDrafts,
} from "../lib/intelligence/intelligenceService";

export function useSymbolicInference(params: {
  userId?: string;
  openPassportLayerIds: string[];
  config?: Partial<SymbolicInferenceConfig>;
}) {
  const [result, setResult] = useState<SymbolicInferenceResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runInference = useCallback(
    async (inputs: SymbolicInputSummary[]) => {
      if (isRunning) {
        return;
      }
      setIsRunning(true);
      setError(null);
      try {
        const inferenceResult = await generateLocalSymbolicInference({
          inputs,
          openPassportLayerIds: params.openPassportLayerIds,
          config: params.config,
        });
        setResult(inferenceResult);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning, params.openPassportLayerIds, params.config]
  );

  const saveDrafts = useCallback(async () => {
    if (!params.userId || !result) {
      return;
    }
    try {
      await saveIntelligenceSignalDrafts({ userId: params.userId, result });
    } catch (e: any) {
      setError(e);
    }
  }, [params.userId, result]);

  const reset = useCallback(() => {
    setResult(null);
    setIsRunning(false);
    setError(null);
  }, []);

  return {
    result,
    isRunning,
    error,
    runInference,
    saveDrafts,
    reset,
  };
}
