# UrAi legacy quarantine authority

Status: **QUARANTINED LEGACY / REFERENCE REPOSITORY**

Canonical production authority is exclusively:

`LifeLoggerAI/urai-spatial` → `urai-tier1` → `main` → `urai.app`

## Controls applied

- The legacy Firebase production workflow is fail-closed and reads no secrets.
- The legacy Home XR deployment workflow is fail-closed and reads no secrets.
- This repository must not deploy Hosting, Firestore, Functions, App Hosting, DNS, or any public URAI surface.
- Local builds and historical evidence may be retained for controlled reference use.
- No legacy branch or artifact is a production rollback authority unless explicitly imported and certified through `urai-spatial`.

## Credential review and rotation register

The prior workflows referenced these credential classes. Their presence in repository settings cannot be inferred from source alone, and values must never be copied into issues, comments, logs, artifacts, or documentation.

| Credential class | Former source reference | Required owner action | Validation evidence required |
| --- | --- | --- | --- |
| Firebase service-account JSON | `FIREBASE_SERVICE_ACCOUNT_JSON` | Revoke/replace any credential ever used by this legacy workflow | IAM key inventory and successful canonical workflow authentication |
| Firebase CLI token | `FIREBASE_TOKEN` | Revoke any legacy CI token and remove it from this repository | Secret removed and token rejected or revoked |
| Firebase Admin fields | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Remove legacy repository copies and use protected canonical identity only | Repository secret inventory plus protected production receipt |
| OpenAI provider key | `OPENAI_API_KEY` | Remove from this legacy repository and rotate if exposure cannot be excluded | Provider key inventory and replacement validation |
| ElevenLabs provider keys | `ELEVENLABS_API_KEY` and voice configuration | Remove from this legacy repository and rotate if exposure cannot be excluded | Provider secret inventory and replacement validation |
| Public Firebase web configuration | `NEXT_PUBLIC_FIREBASE_*` | Retain only when needed for local reference builds; do not treat as deploy authority | Local-only configuration record |

## Remaining human-only settings review

A repository administrator must inspect and record:

- Actions secrets and variables;
- deployment environments and protection rules;
- Pages configuration;
- webhooks and installed applications;
- deploy keys;
- branch protection and rulesets;
- retained workflow artifacts;
- historic Git objects and releases for credential exposure;
- archive readiness after evidence retention is complete.

Do not delete the repository or historical evidence without explicit authorization. Do not re-enable production deployment here.
