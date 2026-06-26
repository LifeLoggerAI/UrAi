# Staging Smoke Evidence

Repo: LifeLoggerAI/UrAi
Branch/commit tested: main @ bde5449820ac132cbbad1cd1e5ef5b8bca3af790 plus subsequent staging evidence commits
Date/time tested: 2026-06-25T22:37:56-05:00

| Check | Command or URL | Expected result | Actual result | Pass/fail | Blocker | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Canonical public root | `Invoke-WebRequest https://urai-4dc1d.web.app/` | HTTP 200 | HTTP 200, body length 11338 | pass | This is existing public deploy evidence, not proof of latest commit | Deploy latest staging/canonical build before claiming `/system` live |
| Product system route | `Invoke-WebRequest https://urai-4dc1d.web.app/system` | HTTP 200 and `URAI release truth` marker | HTTP 200, body length 11338, marker missing | fail | `/system` code is not proven deployed at checked URL | Build/deploy staging preview and rerun smoke |
| Local registry check | `npm run check:system-registry` | Pass | Not run; `npm` unavailable on PATH | fail | Environment issue | Restore Node/npm and rerun |
| Genesis spine smoke script | `npm run smoke:genesis-spine` | Required URLs pass, optional gaps reported | Not run; `npm` unavailable on PATH | fail | Environment issue | Restore Node/npm and rerun |

Logs or output excerpt:

```txt
https://urai-4dc1d.web.app/ STATUS 200 LENGTH 11338
https://urai-4dc1d.web.app/system STATUS 200 LENGTH 11338
UrAi /system does not contain system route marker
```

No secrets were used or recorded.
