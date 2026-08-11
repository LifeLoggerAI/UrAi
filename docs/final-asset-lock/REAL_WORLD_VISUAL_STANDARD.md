# URAI Real-World Visual Standard

Status: active production rule
Date: 2026-08-11
Branch: `agent/final-asset-lock`

URAI may be magical, symbolic, and spatial, but its people and physical worlds must read as believable reality first.

## Human standard

- Human figures use real-world meter scale and recognizable anatomy.
- Faces must include readable eyes, nose, mouth, ears, skin, and hair rather than spheres, capsules, silhouettes, mannequins, or icons.
- Clothing must read as cloth with restrained roughness and ordinary tailoring unless a realm explicitly requires ceremonial wear.
- Skin is non-metallic and physically shaded.
- Hair is materially distinct from skin and clothing.
- People use subtle breathing, head movement, weight shift, and gaze motion rather than floating or pulsing as their primary idle behavior.
- Council members are people first; symbolic role lighting is secondary and subtle.
- Runtime procedural humans are acceptable only as a bridge to rigged/scanned GLBs and must preserve the same scene contract.

## World standard

- Environments are built at believable architectural scale.
- Ground, stone, wood, glass, water, vegetation, textiles, and metal use physically plausible roughness and reflectance.
- Lighting has motivated sources: daylight, sky fill, lamps, firelight, moonlight, practical fixtures, or clearly visible emissive objects.
- Shadows, contact grounding, fog depth, and environmental reflections must make objects feel physically present.
- Magical effects are layered onto physical reality; they do not replace physical reality.
- Portals, aura, glyphs, memory fields, and emotional weather must be restrained enough that the world still reads as a place a person could stand in.

## Council standard

- Six Council roles retain their existing reasoning/tone contracts.
- Each role is embodied as a distinct human presence with varied skin tone, hair, clothing, posture, and subtle role accent.
- The chamber uses a human-scale circular table, ordinary seating, architectural stone, windows/daylight, practical lamps, and believable camera height.
- No thrones, floating ghost people, mannequin silhouettes, glowing stick figures, or dashboard-only Council presentation in the primary experience.
- Selecting a Council person may reveal role information, but the interface remains subordinate to the scene.

## Home standard

- The Home world cannot use a box, capsule, icon, or glowing mannequin as its primary human representation.
- The compatibility `AvatarSilhouette` surface must resolve to the shared human-proportioned presence until a final rigged/scanned avatar is approved.
- The Home world remains a real navigable environment with camera movement, terrain, depth, natural materials, and physical grounding.

## Replacement path

The current renderer-authored human model is a production bridge, not the terminal character-asset pipeline. Final character promotion should move through:

1. approved rigged/scanned human GLB;
2. PBR skin, hair, eye, cloth, and shoe materials;
3. idle/listen/speak/gesture animation clips;
4. facial expression or blend-shape layer when supported;
5. LOD/mobile performance pass;
6. visual, technical, and experience QA;
7. manifest promotion with provenance/rights evidence.

## Lock rule

A realm is not visually locked if its primary human presence is still represented by a box, capsule-only mannequin, icon, silhouette, or ungrounded glowing placeholder. The final-lock ledger must keep that surface `IN REVIEW` or `BLOCKED` until the human-world standard passes in context.
