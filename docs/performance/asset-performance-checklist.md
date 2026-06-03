# URAI Genesis Asset Performance Checklist

Use this checklist before production release and after every major Genesis asset replacement.

## File Format

- [ ] Full-scene backgrounds have optimized production WebP copies when acceptable.
- [ ] PNG is used only where alpha precision is required.
- [ ] Transparent overlays are compressed.
- [ ] No giant uncompressed overlay ships by accident.
- [ ] Source masters are kept separate from shipped runtime assets.

## Dimensions

- [ ] Full-scene vertical source target: 1440x3120.
- [ ] Ground assets have enough width for desktop and mobile crop.
- [ ] Orb and portal assets are square and centered.
- [ ] Vignette assets match full-scene dimensions.
- [ ] No production image is visibly upscaled beyond useful quality.

## Loading

- [ ] Critical assets preload first.
- [ ] Noncritical portals and transition blooms lazy-load.
- [ ] Missing assets fail silently.
- [ ] No user-facing asset errors appear.
- [ ] Browser does not repeatedly download the same asset.

## Runtime Performance

- [ ] Mobile FPS remains acceptable.
- [ ] No heavy blur animation runs continuously.
- [ ] Large animated layers are minimized.
- [ ] Reduced sensory mode lowers animation and opacity changes.
- [ ] Orb shimmer and particles are subdued on reduced motion.
- [ ] Scene still works on low-memory mobile devices.

## Production Safety

- [ ] No debug layer inspector appears in production.
- [ ] No mock, test, placeholder, coming-soon, or missing-asset labels appear in user UI.
- [ ] CSS gradients are fallback/support only, not the main production scenery.
- [ ] Passport, Settings, Ground, Life Map, Mirror, Shadow, Legacy, Companion, Rituals, Exports, Voice, Sound, Notifications, Auth, Firebase, and AI still work after asset changes.
