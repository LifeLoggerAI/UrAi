# ✅ UrAi QA Runbook – Checklist

## 🔴 Stage P0 – Core Stability & Security

| Step | Task                                                                                                              | Pass/Fail |
| ---- | ----------------------------------------------------------------------------------------------------------------- | --------- |
| [ ] | Confirm final Firebase project IDs (`urai`, `urai-marketing`) and domains (`urai.app`, `geturai.app`, `ruai.app`) |           |
| [ ] | Validate `.env` values (API keys, domains, secrets) are correct in all environments                               |           |
| [ ] | Deploy Firestore & Storage rules, confirm unauthorized writes blocked                                             |           |
| [ ] | Run queries to confirm required Firestore indexes exist and no errors                                             |           |
| [ ] | Enforce App Check, test fresh install (reject unverified client)                                                  |           |
| [ ] | Send test push notification via FCM, confirm received on device                                                   |           |
| [ ] | Trigger `computeDailyForecasts` Cloud Function, confirm correct Firestore writes                                  |           |
| [ ] | Trigger `weeklyDigest` Cloud Function, confirm digest export works                                                |           |

---

## 🟡 Stage P1 – Feature Completion & User Magic

| Step | Task                                                                          | Pass/Fail |
| ---- | ----------------------------------------------------------------------------- | --------- |
| [ ] | Record sessions, confirm events appear on timeline                            |           |
| [ ] | Create ritual, confirm playback with visuals + narrator                       |           |
| [ ] | Export weekly scroll → validate PNG, WebP, MP4 all render correctly           |           |
| [ ] | Simulate stress/obscura events → confirm metrics aggregate in `shadowMetrics` |           |
| [ ] | Narrator surfaces mental load alert from shadow/obscura                       |           |
| [ ] | Run Therapist Replay → overlays (fog, tension lines) appear                   |           |
| [ ] | Narrator delivers contextual replay voice lines                               |           |
| [ ] | Validate CI/CD pipeline (GitHub Actions → Firebase deploy succeeds)           |           |
| [ ] | Confirm monitoring (Crashlytics, Sentry, Firebase Alerts) active              |           |
| [ ] | Open `/privacy` and `/tos` pages → confirm rendering                          |           |
| [ ] | Submit Data Subject Request (DSR) → confirm processing                        |           |

---

## 🟢 Stage P2 – Advanced & “Wow” Features

| Step | Task                                                             | Pass/Fail |
| ---- | ---------------------------------------------------------------- | --------- |
| [ ] | Trigger Threshold Mode (simulate crisis), confirm mode activates |           |
| [ ] | Run Mirror of Becoming replay, confirm symbolic playback         |           |
| [ ] | Review Insight Ledger → insights traceable to source             |           |
| [ ] | Open Data Marketplace → confirm placeholder/prototype loads      |           |
| [ ] | Join Collective Room → confirm real-time connection works        |           |
| [ ] | Trigger Companion Evolution → confirm Firestore updates state    |           |
| [ ] | Validate Health Dashboard (sleep + motion data) populates        |           |
| [ ] | Open Social Relationship Map → constellation renders             |           |
| [ ] | Generate Legacy Scroll → confirm symbolic export loads           |           |
| [ ] | Run What-If Simulator → confirm alternate narrative produced     |           |
| [ ] | Run Lighthouse audit → confirm scores ≥90 across categories      |           |
| [ ] | Test VoiceOver/Android TalkBack → confirm accessibility works    |           |
| [ ] | Validate keyboard navigation across major flows                  |           |
