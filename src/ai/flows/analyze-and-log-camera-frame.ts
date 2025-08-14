export type AnalyzeAndLogCameraFrameInput = { dataUrl?: string };
export type AnalyzeAndLogCameraFrameOutput = { logged: boolean };
export async function analyzeAndLogCameraFrameAction(
  _input: AnalyzeAndLogCameraFrameInput
): Promise<AnalyzeAndLogCameraFrameOutput | null> {
  return { logged: true };
}
export default analyzeAndLogCameraFrameAction;
