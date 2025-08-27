
# ✅ URAI V1 — Definition of Done

### 1. Narration

* [ ] Cloud Text-to-Speech API enabled.
* [ ] `narrate` + `narrate-queue` deployed with middleware.
* [ ] “Speak Scene Now” works on device (first tap plays).
* [ ] Errors → visible toast, never silent.

### 2. Orb Animation

* [ ] Orb replaced with Lottie/Rive animation.
* [ ] Orb position bound to `groundPlanePx + offset`.
* [ ] HUD controls: play/pause, speed, opacity.
* [ ] Smooth animation verified across 5 random scenes.

### 3. Assets & Validator

* [ ] All sky/ground MP4s normalized (1440×3240 @30fps).
* [ ] Manifests regenerated (md5, width, height, duration).
* [ ] Validator clean (no missing/misnamed).
* [ ] CI passes green.

### 4. Export/Share

* [ ] HUD “Record 10s” button wired to `recordScene`.
* [ ] Export clip plays on mobile + desktop.
* [ ] Orb + narration render correctly in export.

### 5. QA & Demo

* [ ] iOS Safari + Android Chrome autoplay/narration/export tested.
* [ ] 10 randomized scenes cycle cleanly.
* [ ] 30–60s demo clip recorded (guides off).
* [ ] 3–5 stills captured for deck.

---

📌 **Done = V1 ready to demo + beta**
At that point, you’ll have: working narration, orb animation, validated assets, shareable exports, and a polished demo package.
