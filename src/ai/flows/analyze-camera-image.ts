import { z } from 'zod';

export const AnalyzeCameraImageInput = z.object({
  imageBase64: z.string().min(1),
});

export type AnalyzeCameraImageInput = z.infer<typeof AnalyzeCameraImageInput>;

export async function analyzeCameraImage(input: AnalyzeCameraImageInput) {
  // TODO: replace with real model logic; this is a stub to unblock build
  return {
    ok: true,
    labels: [],
    note: 'stubbed analyzeCameraImage; replace with model inference',
  };
}

export type AnalyzeCameraImageOutput = Awaited<ReturnType<typeof analyzeCameraImage>>;
