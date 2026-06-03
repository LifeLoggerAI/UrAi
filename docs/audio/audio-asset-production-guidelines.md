# URAI Audio Asset Production Guidelines

URAI audio should feel soft, cinematic, magical, intimate, private, premium, and optional. Sound must never be required to use the app.

## Formats

- Use MP3 for broad compatibility.
- OGG may be shipped as an optional secondary format later.
- Keep WAV files as source/master files only, not in the production bundle.

## Recommended Lengths

- Ambient loops: 20 to 60 seconds.
- Mood beds: 20 to 45 seconds.
- Orb hum: 10 to 30 seconds.
- UI sounds: under 1 second.
- Portal sounds: 1 to 4 seconds.
- Voice lines: under 6 seconds where possible.

## Compression

- Ambience: 96 to 160 kbps.
- UI one-shots: 96 to 128 kbps.
- Voice: 128 to 192 kbps.
- Avoid huge files.
- Normalize loudness gently.
- Avoid harsh peaks, sharp attacks, alarm tones, and game-menu beeps.

## Loop Production

- Loops must be seamless.
- Avoid obvious rhythmic repetition.
- Keep low-frequency content soft on mobile speakers.
- Export loop files with clean start and end points.
- Test loops on iOS Safari and Android Chrome after compression.

## Voice Production

- Voice is off by default.
- Captions are the primary fallback.
- Voice lines should be calm, short, and non-commanding.
- Never speak sensitive Shadow content.
- Never read arbitrary AI replies aloud unless a future explicit TTS setting is added.

## Reduced Sensory Mode

- Ambient volume should be reduced by at least 40 percent.
- Effects volume should be reduced by at least 50 percent.
- Idle whispers should remain disabled.
- Mood beds should be off or extremely low.
- No sudden sound changes.

## Production Safety

- Do not autoplay on first load.
- Do not preload the full audio library.
- Missing files must no-op silently.
- Do not show missing audio errors in user UI.
- Keep all sounds optional and user-controlled.
