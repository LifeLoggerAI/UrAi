/**
 * SSML (Speech Synthesis Markup Language) Utilities
 *
 * This module provides utilities for generating high-quality SSML
 * for text-to-speech synthesis with neural voices.
 */

export interface SSMLOptions {
  voiceName?: string;
  rate?: number;
  pitch?: string;
  emphasis?: 'strong' | 'moderate' | 'reduced';
  breakBefore?: string;
  breakAfter?: string;
  prosodyPitch?: string;
}

export interface SSMLSegment {
  text: string;
  emphasis?: 'strong' | 'moderate' | 'reduced';
  pitch?: string;
  rate?: number;
}

/**
 * Generates SSML markup for enhanced text-to-speech output
 */
export function generateSSML(
  text: string | SSMLSegment[],
  options: SSMLOptions = {}
): string {
  const {
    voiceName = 'en-US-AriaNeural',
    rate = 0.95,
    pitch = '+1st',
    emphasis = 'moderate',
    breakBefore = '300ms',
    breakAfter = '200ms',
    prosodyPitch = '+2st',
  } = options;

  // If text is a string, convert to single segment
  const segments = typeof text === 'string' ? [{ text }] : text;

  // Generate SSML content
  let ssmlContent = '';

  segments.forEach((segment, index) => {
    if (index > 0) {
      ssmlContent += `<break time="150ms"/>`;
    }

    if (segment.emphasis) {
      ssmlContent += `<emphasis level="${segment.emphasis}">${segment.text}</emphasis>`;
    } else {
      ssmlContent += segment.text;
    }
  });

  // Add closing gratitude with enhanced prosody
  if (segments.length > 0) {
    ssmlContent += `
      <break time="${breakAfter}"/>
      <prosody pitch="${prosodyPitch}">Thank you!</prosody>`;
  }

  // Wrap in complete SSML structure
  const ssml = `<speak>
  <voice name="${voiceName}">
    <prosody rate="${rate}" pitch="${pitch}">
      <break time="${breakBefore}"/>
      ${ssmlContent}
    </prosody>
  </voice>
</speak>`;

  return ssml;
}

/**
 * Creates SSML for conversational responses with emotional context
 */
export function generateConversationalSSML(
  text: string,
  emotion:
    | 'neutral'
    | 'friendly'
    | 'empathetic'
    | 'excited'
    | 'calm' = 'friendly'
): string {
  const emotionSettings = {
    neutral: {
      voiceName: 'en-US-AriaNeural',
      rate: 1.0,
      pitch: '+0st',
      emphasis: 'moderate' as const,
    },
    friendly: {
      voiceName: 'en-US-AriaNeural',
      rate: 0.95,
      pitch: '+1st',
      emphasis: 'moderate' as const,
    },
    empathetic: {
      voiceName: 'en-US-AriaNeural',
      rate: 0.85,
      pitch: '-1st',
      emphasis: 'reduced' as const,
    },
    excited: {
      voiceName: 'en-US-AriaNeural',
      rate: 1.1,
      pitch: '+2st',
      emphasis: 'strong' as const,
    },
    calm: {
      voiceName: 'en-US-AriaNeural',
      rate: 0.8,
      pitch: '-2st',
      emphasis: 'reduced' as const,
    },
  };

  const settings = emotionSettings[emotion];

  return generateSSML(text, {
    ...settings,
    breakBefore: '400ms',
    breakAfter: '300ms',
  });
}

/**
 * Creates SSML for storytelling with dramatic pauses
 */
export function generateStorytellingSSML(segments: SSMLSegment[]): string {
  return generateSSML(segments, {
    voiceName: 'en-US-AriaNeural',
    rate: 0.9,
    pitch: '+1st',
    breakBefore: '500ms',
    breakAfter: '400ms',
  });
}

/**
 * Creates SSML for meditation or relaxation content
 */
export function generateMeditationSSML(text: string): string {
  return generateSSML(text, {
    voiceName: 'en-US-AriaNeural',
    rate: 0.7,
    pitch: '-3st',
    emphasis: 'reduced',
    breakBefore: '800ms',
    breakAfter: '600ms',
  });
}

/**
 * Escapes special characters for SSML
 */
export function escapeSSML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validates SSML markup
 */
export function validateSSML(ssml: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for required speak tag
  if (!ssml.includes('<speak>') || !ssml.includes('</speak>')) {
    errors.push('SSML must be wrapped in <speak> tags');
  }

  // Check for unclosed tags (basic validation)
  const openTags = ssml.match(/<[^/][^>]*>/g) || [];
  const closeTags = ssml.match(/<\/[^>]*>/g) || [];

  if (openTags.length !== closeTags.length) {
    errors.push('Mismatched opening and closing tags');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
