export class LegacyPaidProviderQuarantinedError extends Error {
  readonly code = "legacy_paid_provider_quarantined";
  constructor() {
    super("Paid provider execution is quarantined in this legacy repository. Current admission belongs to the canonical UrAi runtime.");
    this.name = "LegacyPaidProviderQuarantinedError";
  }
}

// This is an immutable source boundary. Environment flags and credentials do
// not confer current account, consent, source or atomic spending authority.
export function requireLegacyPaidProviderAuthority(): never {
  throw new LegacyPaidProviderQuarantinedError();
}
