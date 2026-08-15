# URAI Human + World Realism Standard

Date: 2026-08-11
Branch: `agent/final-asset-lock`

This standard overrides any visual interpretation that makes URAI people read as mannequins, icons, glowing silhouettes, fantasy statues, low-detail avatars, or UI art instead of believable humans in a believable world.

## Core rule

URAI is magical because reality becomes emotionally intelligent — not because everything looks synthetic.

The base layer must be physically believable first:

- human anatomy and posture
- real-world scale
- believable skin, hair, cloth, stone, wood, glass, earth, water, vegetation and atmosphere
- natural key/fill/rim lighting
- contact shadows and grounded feet
- camera height and lens behavior consistent with human perception
- environmental wear, variation and imperfection

Symbolic/magical effects are layered on top of that physical foundation.

## Human lock gate

A human-facing asset is not final if it looks like any of the following:

- capsule + sphere construction at normal viewing distance
- faceless silhouette used as the primary person representation
- glowing outline with no believable volume/material response
- generic fantasy robe mannequin
- identical cloned bodies with only color changes
- floating or ungrounded feet
- impossible limb proportions
- plastic skin, hair or clothing
- symbolic avatar presented where a real human is intended

Minimum production read:

1. 1.55–2.05 m plausible world height range.
2. Anatomically believable torso/head/limb proportions.
3. Distinct face planes, ears, nose, eyes, mouth and hair mass at medium distance.
4. Clothing with roughness/material response different from skin and hair.
5. Ground contact shadow.
6. Subtle idle breathing/head motion rather than floating bob animation.
7. Diverse skin tones, hair, clothing silhouettes and posture.
8. Replaceable contract for future scanned/rigged GLB without rewriting scene logic.

## Council standard

The Council must read as people first, archetypes second.

- Six distinct human presences around a real-scale table/chamber.
- No throne-room fantasy unless narratively earned.
- Calm professional/civic/ritual architecture: stone, wood, glass, daylight and warm practical lighting.
- Eye-level camera around 1.55–1.75 m.
- 35–50 mm-equivalent visual feel; avoid exaggerated wide-angle distortion.
- Role identity is conveyed with clothing, posture, material accents, lighting and behavior — not neon costumes.
- Selected Council member may receive a restrained ground/accent signal, but the human remains visually dominant.

## Home / Ground standard

The Home world must look traversable and physically inhabitable.

- Terrain has real slope, soil/stone/vegetation breakup and believable scale.
- Trees/plants use real botanical structure or scanned/photogrammetric assets where feasible.
- Water has physically plausible reflection/refraction and shoreline contact.
- Buildings/ritual structures use coherent construction logic and material aging.
- The sky/weather system uses physically believable atmosphere before emotional augmentation.
- The orb is the extraordinary object inside an otherwise believable environment.

## Galaxy / Life Map standard

The Life Map can be surreal, but spatial depth must remain physically legible:

- true parallax
- depth haze
- coherent camera acceleration/deceleration
- believable volumetric light falloff
- memory stars feel suspended in space, not flat UI icons

## Memory / Mirror / Shadow / Legacy standard

Each realm must retain a recognizable physical substrate:

- Memory: real rooms/places/objects beneath reconstructed field effects.
- Mirror: believable glass, reflection, surface roughness and optical distortion.
- Shadow: real space under altered light/fog, not abstract black void by default.
- Legacy: human-scale archival/architectural environment with real materials and objects.

## Visual effects rule

VFX may reveal meaning but may not replace geometry/material quality.

Bad: hide a primitive person under bloom and particles.
Good: start with a believable person, then add a subtle role field, aura, memory trace or emotional light behavior.

## Lock sequence

1. Physical model/material quality.
2. Human/world scale.
3. Lighting and shadows.
4. Camera composition.
5. Interaction and motion.
6. Emotional/symbolic VFX.
7. Audio.
8. Multi-device QA.

If steps 1–4 fail, the asset remains `IN REVIEW` even if the effects look impressive.
