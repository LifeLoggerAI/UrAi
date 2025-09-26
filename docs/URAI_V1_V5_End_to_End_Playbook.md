# URAI v5 – End-to-End Completion Playbook (Versions 1–5)

This playbook codifies the complete path for delivering the URAI experience across five product versions with zero stubs, production-ready polish, and full launch readiness. It blends execution guidance, code-level direction, safety checks, and launch collateral so each version can ship as a self-contained milestone.

---

## 🎯 North Star
- Deliver a cinematic, emotionally intelligent “mirror” that transforms user memories into insights, rituals, dashboards, and story experiences.
- Maintain privacy, safety, and performance guardrails from day one.
- Reach Version 5 with all five pillars production-ready: Narrator Memory Engine, Symbolic Journey Map, Insight Marketplace & Ritual Library, Pro User Dashboard & Export Hub, and Narrator Story Mode.

---

## 🚦 Version Ladder & Definition of Done

| Version | Core Outcomes | Definition of Done | Acceptance Tests | Launch Assets |
| --- | --- | --- | --- | --- |
| **V1 – Core Live Mirror** | Sky → Map → Star → Insight → Share; narrator whispers, weekly digest, export card | p95 TTI < 4s on mid Android; crash-free > 99%; hardened Firestore rules; offline cache of last 100 stars | Full flow smoke test; weekly digest delivered; export card renders | 60s demo capture; mini press kit; ToS & Privacy live |
| **V2 – Memory & Motion** | Real memory shards, smooth map LOD, push, PDF week export, Pro Dashboard lite | ≥30 fps on mid devices; PDF < 45s; notifications respect quiet hours | Insights dedupe across 14 days; PDF + PNG batch ready; push delivery under 30s | Clips for map motion, dashboard, push; copy refresh |
| **V3 – Story Mode & Free Catalog** | Story template with TTS + captions, CapCut/SRT export, marketplace browse (free), Pro dashboard full | Story timing drift < 200 ms; CapCut import validated; security pass on Storage | E2E story creation + export; import into CapCut; screen reader labels | Story teaser video; walkthrough blog; updated docs |
| **V4 – Monetization & Community** | Stripe payments, paid marketplace, referral loop, creator CMS alpha (internal) | Purchase latency < 5s; refund path works; moderation log ready | Sandbox purchase unlocks ritual; fraud/rate limiting logged | Pricing page, refund policy, creator outreach kit |
| **V5 – Five Pillars Polished** | All pillars at GA polish, AA accessibility, localization scaffolding, press/investor-ready | Crash-free > 99%, p95 < 2.5 s, exports < 60 s; rollback rehearsed | Full regression, golden screenshots, audio timing, load test | 15s teaser + 60s demo, press deck, investor kit, store assets |

Each version is frozen to the defined scope. Bugs do not roll forward—every milestone must be demoable and production-ready.

---

## 🧱 Cross-Cutting Foundations

### Product Architecture & Code Quality
- Monorepo layout: `apps/web` (Next.js), `functions` (Cloud Functions), `packages/ui`, `packages/config`.
- Type-safe APIs, strict TypeScript, ESLint + Prettier enforced via CI.
- Environment validation (`env.ts`) and `.env.local.example` with required keys.
- Feature flags & remote config for risky surfaces (map, story mode, marketplace, exports).

### Firebase & GCP
- Firestore Schema v3 with shards for narrator memory, journeys, marketplace, exports, story scripts, telemetry.
- Composite indexes pre-created for insight ranking, journey chapters, export status, and shards by entity.
- Storage buckets partitioned (`exports`, `story/audio`, `story/captions`) with 20 MB upload limit.
- Functions runbook: schedulers (`dailyGenerateInsights`, `weeklyRecap`, `rollupDaily`, `exportGC`), HTTP/callables (`requestExport`, `purchaseWebhook`, `ttsRender`, `storyAssemble`), triggers for purchases and exports.
- Secrets managed with `firebase functions:secrets:set` (Stripe, SendGrid, TTS provider).

### Performance & Accessibility
- Route-level bundle budgets, dynamic imports, shader cache strategy.
- Frame-rate presets (60 → 30 fps degrade) and low-end device fallbacks (static starfield, reduced particles).
- Screen reader labels, focus order, caption availability, `prefers-reduced-motion` compliance.
- Lighthouse mobile ≥ 85, LCP < 2.5 s, CLS < 0.1, accessibility ≥ 90.

### Legal, Safety, Compliance
- Privacy policy, Terms of Service, Monetization FAQ, consent toggles, crisis resource linking.
- Consent ledger for email/push/marketplace, data retention schedule, delete/export flows.
- Safety classification for marketplace items, moderation queue, DMCA/abuse reporting.

### QA & Release Management
- CI pipeline: lint → typecheck → unit → integration → Playwright smoke → bundle budgets → Lighthouse → deploy preview → gated production deploy.
- Canary rollout plan (5% → 25% → 50% → 100%) with instant kill switches.
- Regression suite with 60+ cases, golden screenshots, audio timing harness.
- On-call rotation, incident response, rollback drills, backup verification.

---

## 🧭 Workplan Overview (Week 0 → Week 5)
1. **Week 0:** Repo setup, env scaffolding, Firebase config, base schema/rules, telemetry instrumentation.
2. **Week 1:** Narrator memory MVP, static journey map, export card, weekly email digest, privacy/consent screens, smoke tests.
3. **Week 2:** Memory decay & scoring, LOD map, push notifications, PDF exports, Pro Dashboard lite, offline caching.
4. **Week 3:** Story Mode template (script → TTS → captions), CapCut/SRT export pack, marketplace browse (free), My Rituals binder.
5. **Week 4:** Stripe purchase flow, paid marketplace gating, referral loop, creator CMS alpha, moderation pipeline.
6. **Week 5:** Polish pass (a11y, perf, localization scaffolding), press/investor kits, store metadata, QA signoff, launch rehearsal.

---

## 📊 Telemetry & KPIs
- Event taxonomy prefix `v5_`: `home_loaded`, `map_opened`, `star_opened`, `insight_shown`, `insight_tapped`, `ritual_started`, `purchase_completed`, `export_requested`, `export_ready`, `story_played`, `recap_played`, `tone_feedback`.
- KPI targets: daily active sessions, 7-day retention, insight → ritual conversion, average story watch time, export success rate, NPS.
- Observability: Sentry (app + functions), structured logs with release tags, cost guard alerts.

---

## 🧪 QA Matrix
- **Devices:** Android mid/low (2–4 GB), iPhone 11/12/14, iPad/tablet landscape.
- **Networks:** Online, 3G throttled, offline resume.
- **Locales:** en-US baseline; scaffolding for i18n keys; RTL sanity check.
- **Accessibility:** VoiceOver/TalkBack passes, captions, color contrast AA, focus order verified.
- **Regression:** Playwright flows per pillar, manual motion review, export validation.

---

## 🧭 Pillar Completion Guides

### 1. Companion AI Narrator Memory Engine
- **Data Model:** `narratorMemory/{userId}/shards/{id}`, `insights/{id}`, `rituals/{id}`, `consents/{userId}`.
- **Core Jobs:** daily insight generation, ranking with recency/diversity, weekly recap script + TTS queue.
- **Client Surfaces:** home whisper card, narrator inbox timeline, settings (tone sliders, quiet hours, safety toggle).
- **Acceptance:** 3–5 insights/week, dedupe across 14 days, quiet hours enforced, consent gating, telemetry hooks.
- **Risks:** tone mismatch (user feedback loops), over-notification (hard caps, silent hours), cost guard for TTS.

### 2. Symbolic Journey Map Viewer
- **Rendering:** WebGL with CPU fallback, frustum culling, object pooling, LOD tiers, constellations, aura overlays.
- **Interactions:** tap sky → starfield, pinch zoom, swipe seasons, keyboard navigation.
- **Export:** share card for current view, chapter scroll export to hub.
- **Acceptance:** ≥30 fps mid devices, export card < 2 s, accessible focus states, low-end preset available.

### 3. Insight Marketplace & Ritual Library
- **Catalog:** metadata with safety class, eligibility, price, required signals; free & paid items.
- **Flows:** browse → detail → preview → add; purchase via Stripe; My Rituals binder; refunds/revocations handled server-side.
- **Admin:** internal CMS for submission, review, moderation logs.
- **Acceptance:** sandbox purchase unlocks instantly, safety gating obeyed, telemetry on browse/purchase.

### 4. Pro User Dashboard & Export Hub
- **Dashboards:** mood and rhythm trends, compare mode, milestones, off-rhythm indicators.
- **Exports:** PDF week/month, PNG card batches, CapCut/SRT bundles, checksum verification.
- **Infrastructure:** scheduled rollups, export job queue with retries, status transitions.
- **Acceptance:** dashboards load < 1 s on 3G, exports < 60 s, retry/resume logic, storage cleanup.

### 5. Narrator Story Mode Generator
- **Pipeline:** select era → outline → beat fill → TTS render → timing sheet → export pack.
- **Assets:** script packs (themes × durations × tones), audio mix, captions, visual scenes, end-cards.
- **Player:** playback controls, captions, voice switching, re-render option.
- **Acceptance:** timing drift < 200 ms, CapCut import validated, fallback voice ready, multi-language scaffolding.

---

## 🎨 Content & Asset Pipeline
- Versioned asset packs with checksum manifest and CDN paths.
- QA contact sheets for overlays/constellations, LUT validation (HDR → SDR), premultiplied alpha assets at 1440×3120.
- Motion standards: easing curves catalog, timing table for zoom/pan, microcopy tone guardrails.

---

## 💼 Launch & Growth Readiness
- **Onboarding:** three-screen intro, consent capture, demo mode, restore backup.
- **Lifecycle:** weekly recap push/email, streaks (opt-in), narrator nudge caps.
- **Referrals:** share cards, invite link with attribution, reward catalog.
- **Store Readiness:** PWA manifest/service worker, Capacitor shells, FCM/APNs, deep links (`assetlinks.json`, `apple-app-site-association`), icon/splash generation, metadata drafts.
- **Press & Investor:** press release, media pitch, founder bio, decks, metrics snapshot, scheduled press outreach.

---

## 🔐 Security & Privacy Checklist
- CSP, HSTS, X-Frame-Options, SameSite, CSRF tokens.
- Dependency auditing, lockfile policy, supply chain monitoring.
- Firestore/Storage rules deny sensitive fields to clients; purchase/export status server-only.
- Data export & deletion flows, audit logging, retention schedule.

---

## 🧩 Tooling & Automation
- GitHub Actions workflows for CI, deploy previews, production releases.
- Scripts: `scripts/setup-env.sh` (secrets), `scripts/create-issues.{sh,ts}`, seeding demo stars/chapters.
- Makefile targets: `install`, `lint`, `test`, `build`, `deploy`, `emulators`, `seed`, `issues` for one-command operations.

---

## ✅ “Done-Done” Verification Gate
- All pillar acceptance criteria satisfied.
- KPIs hit: crash-free > 99%, export success > 98%, payment success > 99%, 7-day retention target reached.
- Legal & support assets live; rollback rehearsed; investor/press kits published.
- Everything checklist signed off: engineering, UX, a11y, legal, growth, support.

---

## 📎 Reference Appendices
- **Issue Templates:** Feature & bug templates with owners, estimates, labels.
- **Owners Matrix:** Suggested owner/estimate table per sprint pack.
- **Firebase CLI Commands:** Deploy hosting, functions, indexes, storage rules.
- **Support Macros:** Refund, export stuck, TTS failure, account deletion.
- **Troubleshooting:** Sitemap conflicts, Firestore PERMISSION_DENIED, emulator timeouts, webpack cache issues.

---

With this playbook, every release from V1 through V5 can be executed as a focused sprint, yielding production-quality functionality, polish, and launch collateral without revisiting earlier phases.
