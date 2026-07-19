import { addLaunchDocument, trackLaunchEvent } from "./firebaseClient";
import type { FoundingTier } from "./types";

export async function createMakeMineCheckout(requestId: string, amountTier: 49 | 99 | 149) {
  await trackLaunchEvent("make_mine_checkout_click", { requestId, amountTier });
  await addLaunchDocument("paymentEvents", {
    provider: "placeholder",
    eventType: "checkout_started",
    paymentType: "make_mine",
    amount: amountTier,
    currency: "USD",
    relatedCollection: "makeMineRequests",
    relatedId: requestId,
    status: "pending",
  });
  return { url: `/make-mine?checkout=placeholder&requestId=${encodeURIComponent(requestId)}&amount=${amountTier}` };
}

export async function createFoundingAccessCheckout(memberId: string, tier: FoundingTier) {
  const amount = tier === "early_believer" ? 99 : tier === "founding_member" ? 249 : 499;
  await trackLaunchEvent("founding_checkout_click", { memberId, tier, amount });
  await addLaunchDocument("paymentEvents", {
    provider: "placeholder",
    eventType: "checkout_started",
    paymentType: "founding_access",
    amount,
    currency: "USD",
    relatedCollection: "foundingAccessMembers",
    relatedId: memberId,
    status: "pending",
  });
  return { url: `/founding?checkout=placeholder&memberId=${encodeURIComponent(memberId)}&tier=${tier}` };
}

export async function handlePaymentWebhook(event: unknown) {
  await addLaunchDocument("paymentEvents", {
    provider: "placeholder",
    eventType: "webhook_received",
    paymentType: "other",
    amount: 0,
    currency: "USD",
    status: "received",
    rawPayload: event,
  });
}
