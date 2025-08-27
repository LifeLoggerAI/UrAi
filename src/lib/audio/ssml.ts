/**
 * @fileOverview SSML (Speech Synthesis Markup Language) Utilities
 *
 * This module provides utilities for generating high-quality SSML
 * for text-to-speech synthesis with neural voices.
 */

export interface SSMLOptions {
  voiceName?: string;
  rate?: number; // Represented as a multiplier, e.g., 0.95 for 95%
  pitch?: string; // e.g., "+1st", "-2st"
  emphasis?: 'strong' | 'moderate' | 'reduced';
  breakBefore?: string; // e.g., "300ms"
  breakAfter?: string; // e.g., "200ms"
  prosodyPitch?: string; // e.g., "+2st"
}

export interface SSMLSegment {
  text: string;
  emphasis?: 'strong' | 'moderate' | 'reduced';
  pitch?: string;
  rate?: number;
}

/**
 * Escapes special characters for safe inclusion in SSML.
 * @param text The plain text to escape.
 * @returns The escaped text.
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
 * Generates a complete SSML string from segments and options.
 * @param text A string or an array of SSMLSegment objects.
 * @param options Configuration for the overall speech synthesis.
 * @returns A full SSML document as a string.
 */
export function generateSSML(
  text: string | SSMLSegment[],
  options: SSMLOptions = {}
): string {
  const {
    voiceName = 'en-US-AriaNeural',
    rate = 0.95,
    pitch = '+0st', // A more neutral default pitch
    breakBefore = '300ms',
    breakAfter = '200ms',
  } = options;

  const segments = typeof text === 'string' ? [{ text }] : text;

  let content = segments
    .map(segment => {
      const escapedText = escapeSSML(segment.text);
      if (segment.emphasis) {
        return `<emphasis level="${segment.emphasis}">${escapedText}</emphasis>`;
      }
      return escapedText;
    })
    .join(`<break time="150ms"/>`);

  const prosodyAttrs = `rate="${rate * 100}%" pitch="${pitch}"`;

  const ssml = `
<speak>
  <voice name="${voiceName}">
    <prosody ${prosodyAttrs}>
      <break time="${breakBefore}"/>
      ${content}
      <break time="${breakAfter}"/>
    </prosody>
  </voice>
</speak>
  `.trim();

  // Validate the generated SSML
  const { isValid, errors } = validateSSML(ssml);
  if (!isValid) {
    // In a real app, you might throw an error or log this more formally.
    console.warn('Generated invalid SSML:', errors.join(', '));
  }

  return ssml;
}

/**
 * Creates SSML for conversational responses with emotional context.
 * @param text The conversational text.
 * @param emotion The emotional tone to convey.
 * @returns A full SSML document as a string.
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
  const emotionSettings: Record<string, SSMLOptions> = {
    neutral: { voiceName: 'en-US-AriaNeural', rate: 1.0, pitch: '+0st', emphasis: 'moderate' },
    friendly: { voiceName: 'en-US-AriaNeural', rate: 1.05, pitch: '+1st', emphasis: 'moderate' },
    empathetic: { voiceName: 'en-US-AriaNeural', rate: 0.9, pitch: '-1st', emphasis: 'reduced' },
    excited: { voiceName: 'en-US-AriaNeural', rate: 1.1, pitch: '+2st', emphasis: 'strong' },
    calm: { voiceName: 'en-US-AriaNeural', rate: 0.85, pitch: '-2st', emphasis: 'reduced' },
  };

  return generateSSML(text, {
    ...emotionSettings[emotion],
    breakBefore: '400ms',
    breakAfter: '300ms',
  });
}

/**
 * Validates basic well-formedness of an SSML string.
 * @param ssml The SSML string to validate.
 * @returns An object indicating validity and a list of errors.
 */
export function validateSSML(ssml: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!ssml.startsWith('<speak>') || !ssml.endsWith('</speak>')) {
    errors.push('SSML must be wrapped in <speak> tags.');
  }

  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z0-9]+)/g;
  let match;

  while ((match = tagRegex.exec(ssml)) !== null) {
    const tagName = match[1];
    if (match[0].startsWith('</')) {
      // Closing tag
      if (tagStack.length === 0 || tagStack.pop() !== tagName) {
        errors.push(`Mismatched or unexpected closing tag: </${tagName}>`);
      }
    } else {
      // Opening tag (ignore self-closing for this simple check e.g. <break />)
      if (!ssml.includes(`</${tagName}>`, match.index) && !match[0].endsWith('/>')) {
         // This check is imperfect but catches simple cases.
      }
      if(!['break'].includes(tagName)) { // Self-closing tags
        tagStack.push(tagName);
      }
    }
  }

  if (tagStack.length > 0) {
    errors.push(`Unclosed tags remaining in stack: ${tagStack.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
