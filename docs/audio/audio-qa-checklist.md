# URAI Audio QA Checklist

Use this checklist before release and after every production audio or voice asset update.

## Browsers

- [ ] Safari iOS.
- [ ] Chrome Android.
- [ ] Chrome desktop.
- [ ] Safari desktop.
- [ ] Firefox desktop.

## Core Scenarios

- [ ] First load with sound off.
- [ ] Enable sound from a user action.
- [ ] Disable sound.
- [ ] Refresh after enabling sound.
- [ ] Switch mood state.
- [ ] Open orb.
- [ ] Close orb / Companion.
- [ ] Open Life Map.
- [ ] Open Ground.
- [ ] Open Mirror.
- [ ] Open Shadow.
- [ ] Open Legacy.
- [ ] Open Passport.
- [ ] Open Settings.
- [ ] Open Export Center.
- [ ] Start Ritual Flow.
- [ ] Run Onboarding.
- [ ] Reduced sensory mode.
- [ ] Quiet hours.
- [ ] Missing audio file.
- [ ] Offline mode.

## Acceptance Checks

- [ ] No autoplay violation on first load.
- [ ] No audio plays before sound is enabled.
- [ ] No voice plays before voice is enabled.
- [ ] Captions work while voice is off.
- [ ] Missing files fail silently.
- [ ] No console promise spam.
- [ ] No duplicate loops.
- [ ] Mood beds crossfade cleanly.
- [ ] Ambient loops stop on close/unmount.
- [ ] Master volume works.
- [ ] Ambient volume works.
- [ ] Effects volume works.
- [ ] Voice volume works.
- [ ] Mute works.
- [ ] Haptics respect settings.
- [ ] Reduced sensory mode lowers ambience by at least 40 percent.
- [ ] Reduced sensory mode lowers effects by at least 50 percent.
- [ ] Hover sounds are disabled or absent in reduced sensory mode.
- [ ] Idle whispers do not play in reduced sensory mode.
- [ ] Notification sounds respect quiet hours.
- [ ] Shadow notifications never reveal Shadow content.
- [ ] No loud peaks, sharp attacks, alarm tones, or gamey UI beeps.
- [ ] No arbitrary AI response is read aloud by default.

## Area-by-Area QA

- [ ] Genesis home has subtle optional ambience.
- [ ] Orb has hum, wake, tap, thinking, and close cues where wired.
- [ ] Companion shell does not duplicate voice or loops.
- [ ] Life Map has a soft portal/swell cue.
- [ ] Ground has a grounding bloom and optional loop.
- [ ] Mirror uses a soft ripple cue.
- [ ] Shadow uses protected, non-scary sound.
- [ ] Legacy uses warm archival sound.
- [ ] Passport uses a gentle protected tone.
- [ ] Settings uses quiet UI sound.
- [ ] Export Center uses non-urgent readiness sound.
- [ ] Ritual Flow uses gentle readiness/completion sound.
- [ ] Onboarding keeps sound optional.
