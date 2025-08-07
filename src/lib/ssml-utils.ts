/**
 * @fileOverview SSML (Speech Synthesis Markup Language) utilities for natural TTS
 * 
 * Provides functions to wrap text in SSML tags for more human-sounding speech synthesis
 * compatible with neural TTS engines (Google Cloud, Azure, Amazon Polly, etc.)
 */

export interface SSMLOptions {
  voiceName?: string;
  rate?: number;
  pitch?: string;
  enableEmphasis?: boolean;
  addNaturalPauses?: boolean;
}

/**
 * Wraps text in SSML markup for more natural, human-sounding speech
 * @param text - The text to convert to speech
 * @param options - SSML configuration options
 * @returns SSML-formatted string
 */
export function wrapTextWithSSML(text: string, options: SSMLOptions = {}): string {
  const {
    voiceName = "en-US-Wavenet-D",
    rate = 0.95,
    pitch = "+1st",
    enableEmphasis = true,
    addNaturalPauses = true
  } = options;

  // Process text to add emphasis and pauses
  let processedText = text;

  if (enableEmphasis) {
    // Add emphasis to important words and phrases
    processedText = addEmphasisToText(processedText);
  }

  if (addNaturalPauses) {
    // Add natural breathing pauses
    processedText = addNaturalBreaks(processedText);
  }

  // Build the SSML
  const ssml = `<speak>
  <!-- Choose a high-quality neural voice -->
  <voice name="${voiceName}">
    <!-- Slow down just a hair and add slight pitch variation -->
    <prosody rate="${rate}" pitch="${pitch}">
      <!-- Start with a small pause for realism -->
      <break time="300ms"/>
      
      <!-- Your actual text goes here -->
      ${processedText}
      
      <!-- A final little uptick in pitch at the end makes it feel like a real person -->
      <prosody pitch="+2st">😊</prosody>
    </prosody>
  </voice>
</speak>`;

  return ssml;
}

/**
 * Adds emphasis tags to important words in the text
 * @param text - The input text
 * @returns Text with emphasis tags added
 */
function addEmphasisToText(text: string): string {
  // Words that should be emphasized for natural speech
  const emphasisWords = [
    'important', 'crucial', 'essential', 'critical', 'significant',
    'amazing', 'incredible', 'wonderful', 'fantastic', 'excellent',
    'never', 'always', 'definitely', 'absolutely', 'certainly',
    'remember', 'focus', 'listen', 'attention', 'notice',
    'special', 'unique', 'different', 'new', 'first', 'last',
    'best', 'worst', 'great', 'terrible', 'love', 'hate'
  ];

  let result = text;
  
  // Add emphasis to identified words (case insensitive)
  emphasisWords.forEach(word => {
    const regex = new RegExp(`\\b(${word})\\b`, 'gi');
    result = result.replace(regex, '<emphasis level="moderate">$1</emphasis>');
  });

  return result;
}

/**
 * Adds natural breathing pauses to text
 * @param text - The input text
 * @returns Text with natural pause breaks added
 */
function addNaturalBreaks(text: string): string {
  let result = text;

  // Add pauses after sentences (longer pause)
  result = result.replace(/([.!?])\s+/g, '$1<break time="400ms"/>');
  
  // Add pauses after commas and semicolons (shorter pause)
  result = result.replace(/([,;])\s+/g, '$1<break time="200ms"/>');
  
  // Add pauses before conjunctions for natural flow
  result = result.replace(/\s+(and|but|or|so|yet|for|nor)\s+/gi, '<break time="150ms"/>$1 ');
  
  // Add pause before important transition words
  const transitionWords = ['however', 'therefore', 'meanwhile', 'furthermore', 'moreover', 'consequently'];
  transitionWords.forEach(word => {
    const regex = new RegExp(`\\s+(${word})\\s+`, 'gi');
    result = result.replace(regex, '<break time="250ms"/>$1 ');
  });

  return result;
}

/**
 * Gets a list of recommended neural voice names for different TTS engines
 */
export const NEURAL_VOICES = {
  google: [
    'en-US-Wavenet-A', 'en-US-Wavenet-B', 'en-US-Wavenet-C', 'en-US-Wavenet-D',
    'en-US-Wavenet-E', 'en-US-Wavenet-F', 'en-US-Wavenet-G', 'en-US-Wavenet-H',
    'en-US-Wavenet-I', 'en-US-Wavenet-J'
  ],
  azure: [
    'en-US-Neural2-A', 'en-US-Neural2-B', 'en-US-Neural2-C', 'en-US-Neural2-D',
    'en-US-AriaNeural', 'en-US-JennyNeural', 'en-US-GuyNeural'
  ],
  amazon: [
    'Neural2-Joanna', 'Neural2-Matthew', 'Neural2-Ivy', 'Neural2-Justin',
    'Neural2-Kendra', 'Neural2-Kimberly', 'Neural2-Salli', 'Neural2-Joey'
  ]
} as const;

/**
 * Validates if a voice name appears to be a neural/wavenet voice
 * @param voiceName - The voice name to validate
 * @returns True if it looks like a neural voice
 */
export function isNeuralVoice(voiceName: string): boolean {
  const neuralPatterns = [
    /wavenet/i,
    /neural/i,
    /premium/i,
    /studio/i,
    /journey/i,
    /nova/i
  ];

  return neuralPatterns.some(pattern => pattern.test(voiceName));
}