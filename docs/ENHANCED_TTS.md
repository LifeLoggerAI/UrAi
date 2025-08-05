# Enhanced TTS with SSML Support

This implementation adds SSML (Speech Synthesis Markup Language) support to the text-to-speech generation flow, enabling much more natural, human-sounding voice synthesis.

## Features

- **Neural Voice Support**: Automatic detection and selection of high-quality neural voices
- **Natural Speech Patterns**: Automatic addition of breathing pauses and emphasis
- **Prosody Controls**: Adjustable speech rate and pitch for natural flow
- **Emphasis Detection**: Automatic emphasis on important words
- **Backwards Compatibility**: Works with existing plain text inputs

## Usage Examples

### Basic Usage (Plain Text)
```typescript
const result = await generateSpeech({
  text: "Hello, this is a basic text-to-speech conversion."
});
```

### Enhanced Usage with SSML
```typescript
const result = await generateSpeech({
  text: "This is very important! Remember to focus on the essential details.",
  useSSML: true,
  voiceName: "en-US-Wavenet-D",
  rate: 0.95,
  pitch: "+1st",
  enableEmphasis: true,
  addNaturalPauses: true
});
```

### Custom Voice Configuration
```typescript
const result = await generateSpeech({
  text: "Welcome to our app. Let me guide you through the features.",
  useSSML: true,
  voiceName: "en-US-Wavenet-F",
  rate: 0.9,
  pitch: "+0.5st"
});
```

## SSML Template Features

The generated SSML includes:

1. **Neural Voice Selection**: Automatically chooses high-quality neural voices
2. **Prosody Controls**: 
   - Rate: Slightly slower (0.95x) for clarity
   - Pitch: Small variations (+1st to +2st) for naturalness
3. **Natural Pauses**:
   - 300ms initial pause for realism
   - 400ms pauses after sentences
   - 200ms pauses after commas
   - 150-250ms pauses before conjunctions and transitions
4. **Emphasis**: Automatic emphasis on important words like "important", "remember", "focus"
5. **Natural Ending**: Slight pitch uptick at the end for human-like delivery

## Supported Neural Voices

### Google Cloud TTS (Wavenet)
- en-US-Wavenet-A through en-US-Wavenet-J

### Azure Cognitive Services
- en-US-Neural2-A, en-US-Neural2-B, en-US-Neural2-C
- en-US-AriaNeural, en-US-JennyNeural, en-US-GuyNeural

### Amazon Polly (Neural2)
- Neural2-Joanna, Neural2-Matthew, Neural2-Ivy, Neural2-Justin

## Implementation Details

The implementation automatically:
1. Detects if neural voice features are requested
2. Wraps text in appropriate SSML markup
3. Adds natural speech patterns and emphasis
4. Maintains compatibility with existing configurations

## Example Generated SSML

Input: "This is very important! Remember to focus."

Generated SSML:
```xml
<speak>
  <voice name="en-US-Wavenet-D">
    <prosody rate="0.95" pitch="+1st">
      <break time="300ms"/>
      This is very <emphasis level="moderate">important</emphasis>!<break time="400ms"/>
      <emphasis level="moderate">Remember</emphasis> to <emphasis level="moderate">focus</emphasis>.
      <prosody pitch="+2st">😊</prosody>
    </prosody>
  </voice>
</speak>
```

This transforms flat, robotic speech into natural, human-sounding narration that feels like a real person speaking.