# Home XR Proof Chain Command

Run this repository-side proof chain before claiming Home XR repository readiness:

```bash
node scripts/check-home-xr-proof-chain.mjs
```

This command runs the Home XR static lock, proof manifest check, live deploy proof gate, deploy workflow verifier, evidence index verifier, and completion summary verifier.

Passing this command is repository proof only. It does not replace a successful deployment workflow, live URL smoke, artifact review, or real headset validation.
