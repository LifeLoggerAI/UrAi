# Routes

## Routes touched directly

| Route | File | Result |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Now renders `NewHomeScene` |
| `/home` | `src/app/home/page.tsx` | Already renders `NewHomeScene` |

## Primary linked routes from home surface

| Route | Home label | Truth state |
| --- | --- | --- |
| `/ground` | Ground / Step inside Ground | Live route surface |
| `/life-map` | Life Map / Open Life Map preview | Preview surface |
| `/xr` | Check XR support | Capability-gated surface |
| `/focus` | Focus | Preview surface |
| `/replay` | Replay | Preview surface |
| `/mirror` | Mirror | Preview surface |
| `/passport` | Passport | Live trust/control surface |
| `/privacy-controls` | Self-state / permissions | Trust/control surface |
| `/status` | Status / Orb companion | System truth surface |

## Route handling decision

The primary nav does not hide unfinished concepts behind dead clicks. Items that are not full private production features are explicitly labeled as preview or route through status/privacy gates.

## Verification limitation

Static route existence was inspected through repository files and known app-router files. Full browser route verification was not executed in this connector-only session because there was no local checkout, dependency install, browser runner, or deployed environment access available here.
