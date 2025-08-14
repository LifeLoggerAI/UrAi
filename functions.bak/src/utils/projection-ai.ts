export async function detectProjection(transcript: string) {
  const triggers = ['they made me', 'they never listen', 'they abandoned'];
  if (triggers.some(trigger => transcript.includes(trigger))) {
    return {
      insight: 'You may be projecting old abandonment onto this relationship.',
      confidence: 0.72,
    };
  }

  return null;
}