# Cross Repo Dependencies

Updated: 2026-06-25

## Canonical Spine

`LifeLoggerAI/UrAi` currently depends on the following repos for the safest launchable spine:

- `LifeLoggerAI/urai-staging`
- `LifeLoggerAI/urai-privacy`
- `LifeLoggerAI/urai-admin`
- `LifeLoggerAI/urai-jobs`
- `LifeLoggerAI/urai-content`

## Dependency Rules

### `UrAi`

- May consume content/templates from `urai-content`
- May use staging proof workflows from `urai-staging`
- Must be gated by `urai-privacy` for any user data, inference, consent, export, delete, monetization, or admin access
- Should use `urai-admin` for release control, operator audit, and feature flag visibility
- Should use `urai-jobs` for approved background execution

### `urai-privacy`

- Gates `UrAi`
- Gates `urai-admin`
- Gates `urai-jobs` when user data is involved
- Must gate `urai-analytics`
- Must gate `urai-communications`
- Must gate `urai-storytime`
- Must gate any passive sensing or derived personal signal flow in `urai-spatial`

### `urai-admin`

- Observes `UrAi`
- Observes `urai-jobs`
- Should observe `urai-privacy` requests and audit state
- Later may observe `urai-analytics`, `asset-factory`, `urai-communications`, `urai-spatial`

### `urai-jobs`

- Executes launch-approved async work
- Later may call `asset-factory`
- Later may feed `urai-analytics`
- Should report state back to `urai-admin`

### `urai-content`

- Provides canonical content contracts to `UrAi`
- Later provides content/templates to `urai-storytime`, `urai-studio`, `urai-spatial`

### `asset-factory`

- Produces artifacts for later `urai-studio`, `urai-storytime`, `urai-spatial`, and possibly `UrAi`
- Must not be treated as a current canonical runtime dependency until domain and provider proof are stable

### `urai-analytics`

- Consumes privacy-approved derived data only
- Produces aggregate/operator-facing outputs
- Must not directly become a source of truth for canonical app behavior until privacy and live evidence are complete

### `urai-storytime`

- Will eventually consume `urai-content`, `asset-factory`, `urai-jobs`, and `urai-privacy`
- Must remain roadmap-only until safety/legal/provider proof exists

### `urai-spatial`

- Will eventually consume content, memory/story data, and possibly artifacts/analytics
- Must remain launch-safe and fallback-first until privacy-reviewed data paths are proven

### `B2Bportal`

- Depends on `urai-analytics`, `urai-communications`, `urai-privacy`, and `urai-admin`
- Must remain separate from the canonical consumer product launch path

## Dependencies That Must Not Be Wired Yet

- `UrAi` -> `urai-communications`
- `UrAi` -> `urai-storytime`
- `UrAi` -> passive/live `urai-analytics` flows
- `UrAi` -> provider-backed `asset-factory` generation
- `UrAi` -> non-reviewed spatial private data paths
