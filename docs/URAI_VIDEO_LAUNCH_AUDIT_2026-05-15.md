# URAI Video Launch Audit — 2026-05-15

Source video reviewed: `0e61bb8d-cd4a-4b0a-8ff3-6eb33d8bddde.mp4`.

## Verdict

The demo is visually close to the URAI direction but not public-launch ready. It is demo-credible after polish, with the largest launch blockers being visible browser/fullscreen chrome during capture, weak semantic proof that stars are generated from real/passive signals, remaining small-text readability issues, and memory-bloom density during selected-node mode.

## Frame audit method

The video was inspected at 0.1-second resolution and collapsed into contiguous ranges where the same visual/system issue persisted. The original video is 30.37 seconds at 30 FPS.

| Time range | Severity | Observed issue | Required fix | Likely files |
|---|---:|---|---|---|
| 0.0-1.6 | major | Home is cinematic and clear, but the UI still relies on abstract state language without a trust/provenance line visible in the hero. | Keep `Your patterns are becoming visible`; add one visible passive-signal proof line and keep symbolic labels secondary. | `src/components/urai/UraiResolvedHomeScene.tsx`, `src/lib/use-urai-home-state.ts` |
| 1.7-2.8 | launch-blocker for recording | Browser fullscreen overlay appears and breaks the illusion. Transition feels like fade/zoom instead of orb-recognition, sky-open, star-arrival. | Use clean `/demo-capture` route or browserless recording. Add 4-phase transition: recognition, thread-rise, ascent, arrival. | `src/components/urai/UraiResolvedHomeScene.tsx` |
| 2.9-4.2 | major | Life Map overview works, but stars still read as visual points before they read as data-backed memories. | Give star types stronger semantic signatures and default companion copy explaining stars = private passive signals. | `src/components/lifemap/LifeMapScene.tsx` |
| 4.3-9.7 | major | Memory bloom is improved but remains dense. The detail state needs more breathing room and clearer source/provenance hierarchy. | Keep memory bloom as cinematic sheet; prioritize summary, why-now, confidence, safety line, actions. Avoid internal scrollbars. | `src/components/lifemap/LifeMapScene.tsx` |
| 9.8-18.3 | minor/major | Overview has dead time and weak chapter feedback; category selection does not radically change the atmosphere. | Animate chapter lenses: threshold violet ring, recovery green bloom, dream fog, mirror clarity pulse. | `src/components/lifemap/LifeMapScene.tsx`, `WebGLLifeMapField.tsx` |
| 18.4-22.7 | major | Zoom/label state has good drama, but labels can feel prototype-like and low-readability. | Show one selected label and fade non-related labels; keep active thread visible. | `src/components/lifemap/LifeMapScene.tsx` |
| 22.8-25.4 | minor | Return to home works but feels route-based, not emotionally continuous. | Add return flare: Life Map star condenses back into home orb. | `src/components/urai/UraiResolvedHomeScene.tsx` |
| 25.5-28.9 | major | Body sheet is useful but dashboard-like. | Rewrite body field as a calming state card with source line and safety copy; avoid raw score overload as primary text. | `src/components/urai/UraiResolvedHomeScene.tsx` |
| 29.0-30.3 | polish | Home stabilizes. Visual mood is strong, but demo capture still needs clean chrome-free presentation. | Record in clean capture mode and validate mobile. | capture workflow/docs |

## Non-negotiable public demo gates

1. Chrome-free capture route.
2. No raw zoom percentage or debug UI in public mode.
3. Every major insight has `Why this appeared` and a safety line.
4. Mobile Life Map uses bottom sheets and larger tap targets.
5. Seed demo copy uses human public language, not internal symbolic status copy.
6. Memory Bloom never uses an awkward internal scrollbar in the primary demo path.
7. Star types communicate meaning through visual grammar, not color alone.
8. Firestore/demo mode must be obvious to developers but hidden from public users.
9. Sensitive copy avoids diagnosis and deterministic claims.
10. Smoke test: `/`, `/life-map`, `/demo/life-map`, selected memory bloom, body sheet, reduced motion.

## Launch verdict

Demo-ready after capture and copy polish. Not public-launch ready until trust, mobile, build, Firebase rules, and smoke testing pass.
