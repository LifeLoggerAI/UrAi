# Interactions

## Home surface interactions

- Logo: `/home`.
- Sky route card: `/life-map`, labeled preview.
- Ground route card: `/ground`, labeled live.
- Workforce card: `/ground`, no autonomous action claim.
- Primary CTA: `/ground`.
- Secondary CTA: `/life-map`, labeled preview.
- XR CTA: `/xr`, support check language only.
- Sky portal hit area: `/life-map` with accessible label.
- Ground portal hit area: `/ground` with accessible label.
- Orb companion panel: `/status`.
- Self-state panel: `/privacy-controls`.
- Ground reminder card: `/ground`.
- Bottom dock: `/home`, `/ground`, `/life-map`, `/focus`, `/replay`, `/mirror`, `/passport`, `/status`.

## Interaction truth rules applied

- Implemented links route to actual app-router paths instead of empty handlers.
- Preview concepts are marked as preview in the home data model.
- XR path says `Check XR support`, not `Enter headset`.
- Companion/workforce copy says review/approval and permissioned context, not autonomous production action.
- Health/body/self-state copy says guidance-only and never diagnosis.

## Accessibility improvements

- Primary spatial hit areas have accessible labels.
- Link/button-like elements use real `Link` elements.
- Focus-visible rings are present on major interactive surfaces.
- Dock is a named navigation landmark with `aria-label="URAI Spatial dock"`.
- Decorative stars are marked `aria-hidden`.
