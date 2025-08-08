export async function callInsightModel(input: string) {
  // Replace with real NLP model later (e.g., hosted on Render)
  if (input.includes('resisted')) {
    return {
      text: 'When you resist emotion, it becomes louder later.',
      confidence: 0.85,
    };
  }

  return {
    text: 'Rituals connected to silence seem to calm your inner voice.',
    confidence: 0.75,
  };
}