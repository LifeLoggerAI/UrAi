# URAI Genesis V1 Asset Drop-In and Visual QA

Status: V1 visual lock support doc

## Final asset folders

Place final PNG/WebP files here:

- `public/assets/genesis/sky/`
- `public/assets/genesis/overlays/`
- `public/assets/genesis/body/`
- `public/assets/genesis/orb/`
- `public/assets/genesis/ground/`
- `public/assets/genesis/transitions/`
- `public/assets/genesis/portals/`

## Required asset filenames

The asset manifest expects these paths:

- `/assets/genesis/sky/sky-background.png`
- `/assets/genesis/sky/cloud-far.png`
- `/assets/genesis/sky/cloud-mid.png`
- `/assets/genesis/sky/cloud-near.png`
- `/assets/genesis/overlays/mood-atmosphere.png`
- `/assets/genesis/overlays/starfield.png`
- `/assets/genesis/overlays/aurora.png`
- `/assets/genesis/body/body-silhouette-base.png`
- `/assets/genesis/body/body-silhouette-glow.png`
- `/assets/genesis/body/aura-field.png`
- `/assets/genesis/orb/orb-core.png`
- `/assets/genesis/orb/orb-glow.png`
- `/assets/genesis/orb/orb-particles.png`
- `/assets/genesis/ground/ground-base.png`
- `/assets/genesis/ground/ground-bloom.png`
- `/assets/genesis/ground/ground-mist.png`
- `/assets/genesis/overlays/foreground-vignette.png`
- `/assets/genesis/transitions/transition-bloom.png`
- `/assets/genesis/portals/galaxy-portal.png`
- `/assets/genesis/portals/mirror-portal.png`
- `/assets/genesis/portals/shadow-portal.png`
- `/assets/genesis/portals/legacy-portal.png`
- `/assets/genesis/portals/passport-portal.png`

## Preferred asset specs

- Full vertical scenic layers: 1440 x 3120 PNG or WebP.
- Transparent overlays: PNG.
- Optimized production copies: WebP where transparency and quality allow.
- Painterly scene layers should not be SVG.

## Visual QA breakpoints

Check these widths:

- 375px mobile
- 430px mobile
- 768px tablet
- 1024px desktop
- 1440px desktop

## Composition QA

- [ ] Sky fills the full screen with no broken-image icons.
- [ ] Cloud layers create depth without washing out copy.
- [ ] Mood overlay tints the whole scene without muddying the body.
- [ ] Starfield and aurora are subtle, not noisy.
- [ ] Body silhouette sits lower-middle and feels embedded.
- [ ] Aura field surrounds the body/orb zone.
- [ ] Ground is bottom anchored and does not cover too much body on mobile.
- [ ] Orb is reachable and visually primary.
- [ ] Passport portal is subtle and readable.
- [ ] Foreground vignette unifies the frame without crushing contrast.

## Interaction QA

- [ ] Sky opens Life Map.
- [ ] Orb opens companion fallback / Life Map until chat is wired.
- [ ] Ground opens Ground.
- [ ] Passport zone is keyboard reachable.
- [ ] Portal navigation still works.
- [ ] ESC from Life Map returns Home.
- [ ] ESC from Ground returns Home.
- [ ] ESC from Focus returns Home.
- [ ] ESC from Replay returns Life Map.

## Polish QA

- [ ] No debug labels.
- [ ] No placeholder labels.
- [ ] No visible test boxes.
- [ ] No CSS-looking scenery on Home.
- [ ] No generic dashboard Home.
- [ ] No awkward mobile crop.
- [ ] No unreadable nav.
- [ ] No dead tap zones.
- [ ] Reduced motion remains usable.
- [ ] Build passes.

## V1 lock rule

Genesis Home is now asset-backed. Future visual changes should replace layer files or tune layer variables, not rebuild the scene architecture.
