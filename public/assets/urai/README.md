# URAI Asset Factory

This folder is the source of truth for launch-grade URAI spatial assets.

The rule is simple: no orphan assets, no loose files, and no random pretty generations. Every asset must map to a route, component, product moment, and launch purpose before money is spent or a model is integrated.

## Folder map

- `world/home` - default Home threshold world
- `world/ground` - reachable grounded terrain and real-life world surfaces
- `world/sky` - Life Map galaxy sky domes and large atmosphere assets
- `world/portals` - spatial portal kit for route travel
- `lifemap/stars` - memory star nodes and interaction states
- `lifemap/constellations` - memory graph lines and pattern structures
- `lifemap/memory-interiors` - spaces revealed inside selected stars
- `focus/star-entry` - Focus camera fly-in/tunnel assets
- `focus/memory-chambers` - Focus chambers inside stars
- `focus/tunnel-effects` - procedural/texture effects for transitions
- `replay/film-objects` - memory film objects and replay anchors
- `replay/timeline-particles` - replay timeline trails and sequence particles
- `replay/memory-theaters` - cinematic replay spaces
- `ui/holograms` - spatial UI surfaces
- `ui/loading` - cinematic loading and first-frame scenes
- `ui/status-layers` - status control layers
- `ui/passport-room` - passport room/layer assets
- `textures/materials` - shared PBR/material textures
- `textures/hdri` - environment lighting maps
- `textures/particles` - particle sprites/configs
- `fallbacks` - placeholder references that keep routes from breaking

## Naming rules

Use lowercase snake-case asset IDs and stable numeric suffixes:

```txt
urai_<domain>_<specific_thing>_<###>
```

Examples:

```txt
urai_world_home_core_001.glb
urai_lifemap_memory_star_001.glb
urai_focus_star_entry_tunnel_001.glb
```

Do not rename an asset ID after it has been added to `manifest.json`; replace the `file_path`, `source`, `cost`, `license`, and `status` fields instead.

## Accepted formats

Preferred launch formats:

- Models: `.glb` / `.gltf`
- Textures: `.webp`, `.ktx2`, `.png` only when transparency or source fidelity requires it
- Config/procedural fallbacks: `.json`
- Audio later: `.mp3`, `.ogg`, `.wav` only when the product has an audio manifest

## Model optimization requirements

Launch models must be web-safe:

- Prefer `.glb` for runtime delivery.
- Keep single interactive hero models under 5 MB where possible.
- Keep route-level bundles under 20 MB before lazy-loading.
- Use Draco/Meshopt compression when practical.
- Use baked lighting or lightweight realtime lighting unless the route explicitly needs dynamic light.
- Keep draw calls low. Merge static geometry where possible.
- Use LOD or impostors for repeated stars/particles/props.

## Texture limits

- Default texture target: 1024 px or 2048 px.
- 4096 px only for hero/world surfaces that visibly need it.
- Prefer `.webp` or `.ktx2` for runtime.
- Avoid uncompressed large PNGs in launch paths.

## Route mapping

Routes read their asset slots from `manifest.json`:

- `/` and `/home`: Home world, portals, cinematic loading
- `/ground`: ground terrain, portals, light trails
- `/life-map`: galaxy sky, memory stars, star feedback, light trails
- `/focus`: star-entry tunnel, memory chamber, selected star, light trails
- `/replay`: replay film object, memory chamber, light trails
- `/passport`: passport/status room layer, portals
- `/status`: passport/status room layer, cinematic loading

## Replacing placeholders safely

1. Add the final asset file under the matching folder.
2. Confirm license ownership and source.
3. Optimize the file for web runtime.
4. Update `manifest.json`:
   - set `file_path`
   - set `status` to `ready`
   - update `license`, `cost`, and `source`
   - keep `fallback` in place
5. Run:

```bash
npm run assets:audit
npm run assets:report
npm run assets:missing
```

## Launch-ready checklist

An asset is launch-ready only when:

- It has a manifest entry.
- It maps to at least one real route.
- Its `file_path` exists.
- Its fallback exists.
- Its license/source/cost are recorded.
- It is optimized for mobile web.
- It preserves the URAI spatial product vision.

## Experience rules

- Home is a 3D world.
- Ground is reachable from the default world.
- Life Map feels like looking up into a galaxy sky.
- Focus feels like flying into a selected star.
- Replay feels like opening a memory film inside that star.
- Passport and Status feel like rooms or control layers inside the world.
- Loading must feel cinematic, not blank.
- Mobile first-frame composition must look intentional and premium.
