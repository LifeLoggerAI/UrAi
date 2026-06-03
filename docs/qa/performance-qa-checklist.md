# URAI Performance QA Checklist

## Genesis

- [ ] First load is smooth.
- [ ] Critical asset fade-in feels polished.
- [ ] Orb animation does not jank.
- [ ] Portal hover/tap remains responsive.
- [ ] Background layers do not cause visible stutter.
- [ ] Reduced sensory mode simplifies motion and opacity shifts.

## Navigation

- [ ] Life Map open/close.
- [ ] Ground open/close.
- [ ] Mirror open/close.
- [ ] Shadow open/close.
- [ ] Legacy open/close.
- [ ] Passport open/close.
- [ ] Settings open/close.
- [ ] Companion open/close.
- [ ] Export Center open/close.
- [ ] Ritual Flow open/close.

## State

- [ ] Local-only mode works.
- [ ] Signed-in mode works.
- [ ] Offline mode works.
- [ ] Missing Firebase config does not break app.
- [ ] Missing AI config uses local fallback.
- [ ] Missing assets fail silently.
- [ ] Missing audio fails silently.
- [ ] Skipped onboarding works.
- [ ] Completed onboarding works.

## Performance

- [ ] Mobile FPS acceptable.
- [ ] Memory usage stable after five minutes.
- [ ] No duplicate listeners.
- [ ] No duplicate audio loops.
- [ ] Slow network still opens Genesis.
- [ ] Route transitions are not stuck.
- [ ] Noncritical overlays lazy-load.
- [ ] Bundle size reviewed.
