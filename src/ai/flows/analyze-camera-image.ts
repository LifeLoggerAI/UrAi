import vision from '@google-cloud/vision';
import logger from '@/utils/logger';

export type AnalyzeCameraImageInput = { dataUrl?: string; bytes?: Uint8Array };
export type AnalyzeCameraImageOutput = { labels: string[]; mood?: string };

/**
 * Analyze an image using Google Cloud Vision and derive simple mood.
 */
export async function analyzeCameraImage(
  input: AnalyzeCameraImageInput
): Promise<AnalyzeCameraImageOutput> {
  const client = new vision.ImageAnnotatorClient();
  let image: vision.protos.google.cloud.vision.v1.IImage | undefined;

  if (input.dataUrl) {
    const base64 = input.dataUrl.split(',')[1];
    image = { content: base64 };
  } else if (input.bytes) {
    image = { content: Buffer.from(input.bytes).toString('base64') };
  } else {
    logger.warn('analyzeCameraImage called without image data');
    return { labels: [], mood: undefined };
  }

  try {
    const [result] = await client.labelDetection({ image });
    const labels = result.labelAnnotations?.map((l) => l.description || '') || [];

    // Naive mood detection
    const mood = labels.find((l) => /happy|smile|joy/i.test(l))
      ? 'positive'
      : undefined;

    logger.info('analyzeCameraImage labels', labels);
    return { labels, mood };
  } catch (err) {
    logger.error('analyzeCameraImage failed', err);
    return { labels: [], mood: undefined };
  }
}

export default analyzeCameraImage;
