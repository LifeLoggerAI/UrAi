# URAI Genesis Audio Drop-In and Sensory QA

Status: Eighth Pass sound infrastructure lock

## Audio folders

Place final MP3 or OGG files here:

- `public/assets/audio/genesis/ambient/`
- `public/assets/audio/genesis/orb/`
- `public/assets/audio/genesis/portals/`
- `public/assets/audio/genesis/transitions/`
- `public/assets/audio/genesis/ui/`
- `public/assets/audio/genesis/notifications/`
- `public/assets/audio/genesis/mood/`

## Verification

Run:

```bash
npm run check:genesis:audio
```

This check warns when files are missing but does not break development. The audio engine safely no-ops for missing or blocked audio.

## Required behavior

- Sound is off by default.
- Audio only unlocks after user interaction or intentional sound enablement.
- Missing audio files do not create visible errors.
- Reduced sensory mode lowers intensity and avoids unnecessary continuous beds.
- Sound is never required for navigation or comprehension.

## QA checklist

- [ ] Sound toggle can enable audio intentionally.
- [ ] Orb tap plays a soft tap/wake only after unlock.
- [ ] Home ambience fades in after unlock.
- [ ] Mood bed is subtle.
- [ ] Portal sounds are short and gentle.
- [ ] Ground loop starts in Ground and stops on exit.
- [ ] Haptics are safe and silent when unsupported.
- [ ] Reduced sensory mode works.
- [ ] No debug sound controls are visible.
- [ ] No aggressive beeps, jumps, or game-like sounds.

## V1 lock rule

URAI Genesis sound should be subtle, cinematic, emotional, and user-controlled. It must never become noisy or mandatory.
