# URAI Genesis AI Integration Evidence

Generated: 2026-06-30 America/Chicago
Repo: LifeLoggerAI/UrAi

## Summary

URAI Genesis has two companion API surfaces with different launch status:

1. `/api/companion` is deterministic/local mock behavior.
2. `/api/companion/respond` is provider-capable and can call OpenAI when `OPENAI_API_KEY` is configured, but this pass did not verify deployed provider credentials or a live provider call.

Therefore the safe claim is:

> URAI Genesis includes a provider-capable companion endpoint with safety and permission gates, but live AI generation is not production-proven until deployment env credentials, provider call logs, smoke tests, safety logs, and privacy gates are captured.

## Evidence inspected

### Deterministic companion endpoint

Source: `src/app/api/companion/route.ts`

- Accepts POST JSON body.
- Normalizes message/history.
- Returns `buildCompanionReply(message, history)`.
- This path is deterministic/local behavior and must not be claimed as real provider-backed AI.

### Provider-capable companion endpoint

Source: `src/app/api/companion/respond/route.ts`

Observed behavior:

- Uses AI rate limiting.
- Classifies input safety.
- Builds permissioned companion context.
- Normalizes Passport context permissions.
- Has explicit demo-mode replies.
- Enforces closed-layer boundaries for Gmail, location, transcripts, relationship context, health-adjacent context, shadow, and legacy.
- Calls `generateAIReply(...)` only after safety and permission checks.

### Provider selection

Source: `src/lib/ai/generateAIReply.ts` and `src/lib/ai/aiConfig.ts`

Observed behavior:

- `getServerAIConfig()` reads `OPENAI_API_KEY`.
- If no API key exists, provider is `local_fallback`.
- If `OPENAI_API_KEY` exists, provider is `openai`.
- OpenAI API URL is `https://api.openai.com/v1/chat/completions`.
- Default model is `gpt-4o-mini` unless `OPENAI_MODEL` is set.
- If OpenAI returns an error or throws, code falls back to local response.
- Replies are sanitized before return.
- Metadata is logged without needing to expose raw private content in this evidence pass.

## Current classification

| Capability | Status | Reason |
| --- | --- | --- |
| Local deterministic companion | Done/source-proven | `/api/companion` returns deterministic `buildCompanionReply`. |
| Provider-capable companion | Partial/source-proven | `/api/companion/respond` can call OpenAI if env is configured. |
| Live provider-backed AI | Not launch-proven | No deployed env proof, live provider call receipt, or production smoke log in this pass. |
| Safety gates | Partial/source-proven | Input safety and permission boundaries exist in source; runtime logs/tests not verified here. |
| Private context usage | Gated/source-proven | Permission checks exist; privacy gate still not passed. |

## Required proof before claiming live AI generation

1. Confirm deployment has `OPENAI_API_KEY` set in server-only env.
2. Confirm no API key is exposed to client bundle.
3. Run safe controlled smoke against `/api/companion/respond` with `demoMode: false` and no private context.
4. Capture response metadata showing provider path without logging private user content.
5. Run safety boundary smoke tests for Gmail/location/transcript/relationship/health/shadow/legacy prompts with permissions closed.
6. Verify local fallback works when provider fails or key is absent.
7. Confirm privacy release gate is passed or keep all private context closed.
8. Add command logs and provider evidence to this proof folder.

## Launch rule

Do not market URAI Genesis as having live AI generation until `/api/companion/respond` is deployed, configured, smoke-tested, logged, privacy-gated, and evidence is recorded. Until then, use: `AI-capable companion foundation with local fallback and safety gates; live provider path pending production evidence.`
