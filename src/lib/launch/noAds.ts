export const PRIVATE_APP_ADS_ALLOWED = false as const;
export const PUBLIC_MEDIA_MONETIZATION_ALLOWED = true as const;

export const TRUST_COPY = {
  adFree: "URAI Private is ad-free. Your memory is not ad inventory.",
  noAds: "No ads inside your memory.",
  worlds: "URAI Worlds funds the public signal.",
  split: "URAI Private earns trust. URAI Worlds earns attention.",
  category: "Not a chatbot. A memory OS.",
  fragments: "Your phone has the fragments. URAI builds the world.",
} as const;

export const BLOCKED_PRIVATE_AD_SURFACES = [
  "Google AdMob",
  "Meta Audience Network",
  "AppLovin",
  "Unity Ads",
  "ironSource",
  "banner ads",
  "interstitial ads",
  "rewarded ads",
  "watch-ad-to-unlock flows",
  "private ad targeting",
  "sponsored private insights",
] as const;

export const NO_AD_COMPLIANCE_ITEMS = [
  "No Google AdMob installed",
  "No Meta Audience Network installed",
  "No AppLovin installed",
  "No Unity Ads installed",
  "No ironSource installed",
  "No banner ad components",
  "No interstitial ad components",
  "No rewarded ad components",
  "No watch-ad-to-unlock flows",
  "No private emotional ad targeting",
  "No sponsored private insights",
  "/trust published",
  "/app/home includes no-ad notice",
  "URAI Worlds public monetization separated",
] as const;
