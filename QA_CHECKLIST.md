# QA Checklist: Sky → Ground → Avatar → Orb

Run through this whenever you add new sky/ground/avatar/orb files (or regenerate manifests).

---

### 1. Sky Layer

- [ ] Sky video **fills entire viewport** (no letterboxing).
- [ ] **Aspect ratio correct** (test grid lines stay straight, not stretched).
- [ ] **Loop is seamless** (no flicker or jump cut at end).
- [ ] Z-order = lowest (`z-10`).

### 2. Ground Layer

- [ ] Ground video **covers bottom portion** of screen (overlaps sky).
- [ ] Text “GROUND_TEST” visible, not cropped.
- [ ] Ground motion loops seamlessly.
- [ ] Z-order = above sky (`z-20`).

### 3. Avatar Layer

- [ ] Avatar silhouette anchored at **bottom ~700px** (feet touch ground plane).
- [ ] “AVATAR_TEST” text visible at torso, not stretched.
- [ ] Transparent background shows sky + ground behind.
- [ ] Z-order = above ground (`z-30`).

### 4. Orb Layer

- [ ] Orb centered horizontally over avatar’s head.
- [ ] Vertical position = `groundPlanePx + offset` (~+60px).
- [ ] “ORB_TEST” text inside orb legible.
- [ ] Pulse animation loops smoothly.
- [ ] Z-order = highest (`z-40`).

### 5. Full Scene

- [ ] When stacked, scene visually matches `qa-scene-reference.mp4` (combined baked test).
- [ ] No gaps between layers (sky bleeds through only where intended).
- [ ] All assets scale to fit screen (test labels not cut off).
- [ ] Randomize + persona toggles still work with QA assets.

---

## 📋 Pass Condition:
If all checks hold, you’re guaranteed that production skies/grounds will also stack, scale, and loop correctly.
