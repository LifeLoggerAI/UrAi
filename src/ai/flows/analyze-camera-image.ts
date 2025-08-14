/**
 * Temporary no-op image analyzer to satisfy imports.
 * Replace with your real analyzer when ready.
 */
export type AnalyzeCameraImageInput = { dataUrl?: string; bytes?: Uint8Array };
export type AnalyzeCameraImageOutput = { labels: string[]; mood?: string };

export async function analyzeCameraImage(_input: AnalyzeCameraImageInput): Promise<AnalyzeCameraImageOutput> {
  console.warn('analyzeCameraImage stub called');
  return { labels: [], mood: undefined };
}

export default analyzeCameraImage;
