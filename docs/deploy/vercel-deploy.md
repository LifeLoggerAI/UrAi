# URAI Vercel Deployment Notes

Vercel is optional. Use this if URAI's Next.js app is hosted on Vercel instead of Firebase Hosting.

## Steps

1. Import the GitHub repo into Vercel.
2. Set build command: `npm run build`.
3. Set install command: `npm ci`.
4. Set output/runtime using Vercel's Next.js defaults.
5. Add environment variables from `docs/deploy/environment-checklist.md`.
6. Add `urai.app` and any preview domains.
7. Verify API routes:
   - `/api/companion/respond`
   - `/api/waitlist`
   - `/api/admin/status`
8. Deploy Firebase rules separately:

```bash
npm run deploy:rules
```

## Safety

- Server-only variables must not use `NEXT_PUBLIC_`.
- Keep Firebase private key, OpenAI key, email provider key, and SMS keys server-only.
- Do not deploy if public demo, waitlist, Passport, Companion, or admin protection fail smoke tests.
