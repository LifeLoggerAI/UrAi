# Firebase Studio Final Launch Prompt

Use this prompt in Firebase Studio / Cursor for final launch verification:

```text
You are finalizing URAI Genesis for production launch.

Install dependencies, verify the file structure, check environment placeholders, run typecheck, run tests, build, deploy Firestore rules, deploy Storage rules, and verify the public demo route, waitlist route, and protected admin route.

Required commands:
- npm ci
- npm run verify:routes
- npm run verify:assets
- npm run verify:privacy
- npm run typecheck
- npm run lint
- npm run test
- npm run build
- npm run deploy:rules

Verify:
- /demo loads sample data only.
- /u/adamclamp loads sample/founder demo only.
- /launch loads with safe public copy.
- /api/waitlist fails gracefully if backend is unavailable.
- /admin is denied unless authorized.
- Companion demo responses reference sample data and Passport boundaries.
- Shadow, Legacy, Exports, Notifications, Companion memory, and sensitive cloud sync remain off by default.
- No debug labels, missing asset text, or test labels appear in production UI.

Do not alter URAI's privacy defaults to make deployment easier.
Do not enable sensitive layers by default.
Do not make Firestore or Storage public.
Do not expose secrets in client code or UI.
```
