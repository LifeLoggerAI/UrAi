/**
 * SSML (Speech Synthesis Markup Language) Utility
 * Provides enhanced voice quality and natural speech patterns for TTS
 */

export interface SSMLOptions {
  voice?: string;
  rate?: number;
  pitch?: string;
  pauseBefore?: number;
  pauseAfter?: number;
  emphasis?: 'strong' | 'moderate' | 'reduced';
  endPitch?: string;
  endText?: string;
}

export interface VoiceConfig {
  name: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  neural: boolean;
}

// Best neural voices for different use cases
export const NEURAL_VOICES: Record<string, VoiceConfig> = {
  'en-US-AriaNeural': {
    name: 'en-US-AriaNeural',
    language: 'en-US',
    gender: 'female',
    neural: true,
  },
  'en-US-JennyNeural': {
    name: 'en-US-JennyNeural',
    language: 'en-US',
    gender: 'female',
    neural: true,
  },
  'en-US-GuyNeural': {
    name: 'en-US-GuyNeural',
    language: 'en-US',
    gender: 'male',
    neural: true,
  },
  'en-US-DavisNeural': {
    name: 'en-US-DavisNeural',
    language: 'en-US',
    gender: 'male',
    neural: true,
  },
  'en-US-AmberNeural': {
    name: 'en-US-AmberNeural',
    language: 'en-US',
    gender: 'female',
    neural: true,
  },
};

export class SSMLGenerator {
  private defaultVoice: string;
  private defaultOptions: SSMLOptions;

  constructor(defaultVoice: string = 'en-US-AriaNeural') {
    this.defaultVoice = defaultVoice;
    this.defaultOptions = {
      voice: defaultVoice,
      rate: 0.95,
      pitch: '+1st',
      pauseBefore: 300,
      pauseAfter: 200,
      emphasis: 'moderate',
      endPitch: '+2st',
      endText: 'Thank you!',
    };
  }

  /**
   * Wraps text in SSML with enhanced voice quality settings
   */
  generateSSML(text: string, options: Partial<SSMLOptions> = {}): string {
    const config = { ...this.defaultOptions, ...options };

    const ssml = `<speak>
  <voice name="${config.voice}">
    <prosody rate="${config.rate}" pitch="${config.pitch}">
      <break time="${config.pauseBefore}ms"/>
      ${this.processText(text, config)}
      <break time="${config.pauseAfter}ms"/>
      ${config.endText ? `<prosody pitch="${config.endPitch}">${config.endText}</prosody>` : ''}
    </prosody>
  </voice>
</speak>`;

    return ssml.trim();
  }

  /**
   * Process text to add emphasis and natural speech patterns
   */
  private processText(text: string, config: SSMLOptions): string {
    let processedText = text;

    // Add emphasis to important words (basic heuristic)
    const importantWords = [
      'important',
      'critical',
      'urgent',
      'please',
      'thank you',
      'welcome',
      'congratulations',
    ];
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processedText = processedText.replace(
        regex,
        `<emphasis level="${config.emphasis}">${word}</emphasis>`
      );
    });

    // Add natural pauses after punctuation
    processedText = processedText
      .replace(/\. /g, '. <break time="400ms"/>')
      .replace(/\? /g, '? <break time="500ms"/>')
      .replace(/! /g, '! <break time="400ms"/>')
      .replace(/; /g, '; <break time="300ms"/>')
      .replace(/, /g, ', <break time="200ms"/>');

    return processedText;
  }

  /**
   * Generate SSML for different conversation contexts
   */
  generateConversationalSSML(
    text: string,
    context: 'greeting' | 'question' | 'response' | 'farewell' = 'response'
  ): string {
    const contextOptions: Record<string, Partial<SSMLOptions>> = {
      greeting: {
        voice: 'en-US-AriaNeural',
        rate: 0.9,
        pitch: '+2st',
        pauseBefore: 200,
        endText: '',
        emphasis: 'moderate',
      },
      question: {
        voice: 'en-US-JennyNeural',
        rate: 0.95,
        pitch: '+1st',
        pauseBefore: 300,
        endText: '',
        emphasis: 'moderate',
      },
      response: {
        voice: 'en-US-AriaNeural',
        rate: 0.95,
        pitch: '+1st',
        pauseBefore: 300,
        endText: '',
        emphasis: 'moderate',
      },
      farewell: {
        voice: 'en-US-AmberNeural',
        rate: 0.9,
        pitch: '+1st',
        pauseBefore: 300,
        endText: 'Take care!',
        endPitch: '+3st',
        emphasis: 'moderate',
      },
    };

    return this.generateSSML(text, contextOptions[context]);
  }

  /**
   * Generate SSML for emotional contexts
   */
  generateEmotionalSSML(
    text: string,
    emotion: 'calm' | 'excited' | 'empathetic' | 'professional' = 'calm'
  ): string {
    const emotionOptions: Record<string, Partial<SSMLOptions>> = {
      calm: {
        voice: 'en-US-AriaNeural',
        rate: 0.9,
        pitch: '0st',
        pauseBefore: 400,
        emphasis: 'reduced',
      },
      excited: {
        voice: 'en-US-JennyNeural',
        rate: 1.1,
        pitch: '+3st',
        pauseBefore: 200,
        emphasis: 'strong',
      },
      empathetic: {
        voice: 'en-US-AmberNeural',
        rate: 0.85,
        pitch: '-1st',
        pauseBefore: 500,
        emphasis: 'moderate',
      },
      professional: {
        voice: 'en-US-DavisNeural',
        rate: 0.95,
        pitch: '0st',
        pauseBefore: 300,
        emphasis: 'moderate',
      },
    };

    return this.generateSSML(text, emotionOptions[emotion]);
  }

  /**
   * Clean and validate SSML
   */
  validateSSML(ssml: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic SSML validation
    if (!ssml.includes('<speak>') || !ssml.includes('</speak>')) {
      errors.push('SSML must be wrapped in <speak> tags');
    }

    if (!ssml.includes('<voice') && !ssml.includes('<prosody')) {
      errors.push('SSML should include voice or prosody elements for better quality');
    }

    // Check for unclosed tags (basic)
    const openTags = (ssml.match(/<[^\/][^>]*>/g) || []).length;
    const closeTags = (ssml.match(/<\/[^>]*>/g) || []).length;
    const selfClosingTags = (ssml.match(/<[^>]*\/>/g) || []).length;

    if (openTags !== closeTags + selfClosingTags) {
      errors.push('Potential unclosed SSML tags detected');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get the best voice for a given purpose
   */
  getBestVoice(
    purpose: 'assistant' | 'companion' | 'narrator' | 'professional' = 'assistant'
  ): string {
    const voiceMap = {
      assistant: 'en-US-AriaNeural',
      companion: 'en-US-AmberNeural',
      narrator: 'en-US-JennyNeural',
      professional: 'en-US-DavisNeural',
    };

    return voiceMap[purpose];
  }
}

// Export singleton instance
export const ssmlGenerator = new SSMLGenerator();

// Export convenience functions
export const generateSSML = (text: string, options?: Partial<SSMLOptions>) =>
  ssmlGenerator.generateSSML(text, options);

export const generateConversationalSSML = (
  text: string,
  context?: 'greeting' | 'question' | 'response' | 'farewell'
) => ssmlGenerator.generateConversationalSSML(text, context);

export const generateEmotionalSSML = (
  text: string,
  emotion?: 'calm' | 'excited' | 'empathetic' | 'professional'
) => ssmlGenerator.generateEmotionalSSML(text, emotion);

export const validateSSML = (ssml: string) => ssmlGenerator.validateSSML(ssml);
