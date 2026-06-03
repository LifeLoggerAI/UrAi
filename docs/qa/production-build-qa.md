# URAI Production Build QA

Run and verify:

```bash
npm run build
npm run lint
npm run typecheck
npm run test
```

If available, also run:

- [ ] Firebase deploy dry run.
- [ ] Next production start.
- [ ] Lighthouse check.
- [ ] Mobile simulator check.

Acceptance:

- [ ] No build-blocking TypeScript errors.
- [ ] No known hydration warnings.
- [ ] No production debug labels.
- [ ] No API keys in client output.
- [ ] No heavy export renderer loaded at Genesis startup unless intentionally lazy-loaded.
- [ ] No full audio library preload.
- [ ] App opens with missing Firebase config.
- [ ] App opens with missing AI config.
