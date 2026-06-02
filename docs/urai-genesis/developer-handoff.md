# URAI Genesis Developer Handoff

## Component tree

- AppShell
- WorldRouter
- HomeWorld
- OrbCompanion
- MoodWeatherLayer
- GroundLayer
- GatewayGlow
- GalaxyView
- StarDetail
- MirrorView
- ShadowView
- LegacyView
- PassportView
- PermissionManager
- CouncilView
- SettingsView
- WhyExplanationPanel
- SoundManager
- MotionManager

## Required routes

- `/welcome`
- `/onboarding`
- `/home`
- `/orb/chat`
- `/galaxy`
- `/galaxy/star/:starId`
- `/galaxy/cluster/:clusterId`
- `/mirror`
- `/mirror/insight/:insightId`
- `/shadow`
- `/shadow/pattern/:patternId`
- `/legacy`
- `/legacy/scroll/:scrollId`
- `/passport`
- `/passport/data`
- `/passport/permissions`
- `/passport/exports`
- `/passport/consent-history`
- `/passport/identity`
- `/passport/future-value`
- `/council`
- `/settings`
- `/why/:entityType/:entityId`

`/` redirects to `/welcome` for new users and `/home` for returning users.

## Core Firestore collections

- users
- userProfiles
- permissions
- permissionEvents
- passports
- passiveSignals
- audioEvents
- transcripts
- locationEvents
- deviceEvents
- appUsageEvents
- calendarEvents
- contactSignals
- motionEvents
- notificationSignals
- moodStates
- moodForecasts
- cognitiveRhythms
- shadowPatterns
- recoveryEvents
- relationshipSignals
- memoryStars
- galaxyClusters
- mirrorInsights
- legacyScrolls
- councilMessages
- companionSessions
- whyExplanations
- exports
- notifications
- auditLogs

## Required generated insight fields

Every generated insight, star, pattern, forecast, scroll, notification, and permission suggestion must include:

- id
- userId
- type
- title
- summary
- createdAt
- updatedAt
- sourceSignals
- confidenceLevel
- explanationId
- visibility
- userFeedback
- permissionDependencies

## Signal-to-world pipeline

Permissioned Source -> Passive Signal -> Normalization -> Sensitivity Classification -> Pattern Detection -> Insight Generation -> Why Explanation Created -> Visual Symbol Assigned -> Sound Cue Assigned -> Displayed in Home, Galaxy, Mirror, Shadow, or Legacy -> User Feedback -> Updated visibility or correction state.

## Permission-off design rule

Every feature must degrade gracefully.

Use this message when a world has limited signal access:

> This part of your world is quieter right now. You can keep it simple, or allow more signals in Passport when you're ready.

## Build waves

### Wave 1: Foundation

Routing, auth/account, Home World, Orb visual, Orb tap interaction, Permissions shell, Passport shell, Firestore schema, Sound manager, Theme manager, Settings shell.

### Wave 2: Core Magic

Mood weather state, Galaxy, Memory stars, Star detail, Why explanations, Mirror, Companion chat shell, empty states, permission-off states.

### Wave 3: Depth

Shadow, Legacy, Council, Exports, Notification system, Recovery events, Consent history, and user data-control flows.

### Wave 4: Polish

Animation refinement, sound refinement, copy pass, privacy pass, accessibility pass, mobile responsiveness, performance optimization, debug cleanup, and QA pass.

## Launch QA essentials

- No debug, placeholder, raw JSON, demo, test, or mock language visible.
- Home loads beautifully.
- Orb appears and responds.
- Sky opens Galaxy.
- Star Detail has explanation.
- Mirror has reflection or polished empty state.
- Shadow uses safe language.
- Legacy has scrolls or polished empty state.
- Passport states URAI is ad-free.
- Passport shows permissions.
- Council uses final name.
- OS Crew is removed everywhere.
- Every insight has Why Am I Seeing This.
- Permission-off states are graceful.
- Sensitive language is non-diagnostic.
- Sound can be muted.
- Reduced motion exists.
- High contrast exists.
- Notifications are calm.
- Empty states are polished.
- Mobile layout works.
- Firestore rules protect user data.
- Audit logs capture permission/data actions.
- App feels magical, private, and alive.
