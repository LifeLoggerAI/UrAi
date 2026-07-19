export type InterestType =
  | "private_beta"
  | "founding_access"
  | "make_mine"
  | "creator"
  | "investor"
  | "partner"
  | "press";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";
export type FulfillmentStatus = "new" | "reviewed" | "in_progress" | "delivered" | "archived";
export type CreatorStatus = "new" | "reviewing" | "accepted" | "rejected" | "archived";
export type FoundingTier = "early_believer" | "founding_member" | "lab_circle";
export type PublicPermission = "none" | "anonymized" | "okay_to_feature";

export interface WaitlistEntry {
  name: string;
  email: string;
  phone?: string;
  interestType: InterestType;
  desiredMemoryWorld: string;
  source: string;
  consentAccepted: boolean;
  emailOptIn: boolean;
  smsOptIn: boolean;
  createdAt: unknown;
}

export interface MakeMineRequest {
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  memoryTheme: string;
  storyText: string;
  emotionalTone: string;
  desiredVisualStyle: string;
  privateOnly: boolean;
  publicPermission: PublicPermission;
  interestedInFoundingAccess: boolean;
  consentAccepted: boolean;
  paymentStatus: PaymentStatus;
  paymentProvider: "stripe" | "gumroad" | "lemon_squeezy" | "manual" | "none";
  fulfillmentStatus: FulfillmentStatus;
  internalNotes?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface FoundingAccessMember {
  userId?: string;
  name: string;
  email: string;
  tier: FoundingTier;
  paymentStatus: PaymentStatus;
  accessStatus: "founding";
  whyURAI?: string;
  updateOptIn: boolean;
  consentAccepted: boolean;
  joinedAt: unknown;
  updatedAt: unknown;
}

export interface CreatorApplication {
  name: string;
  email: string;
  creatorType: string;
  portfolioUrl: string;
  platformHandles: string;
  toolsUsed: string;
  whyURAI: string;
  sampleTheme: string;
  acceptsOriginalAssetRules: boolean;
  acceptsNoPrivateUserDataWithoutConsent: boolean;
  consentAccepted: boolean;
  status: CreatorStatus;
  internalNotes?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface PublicWorld {
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  platform: string;
  tags: string[];
  language: string;
  featured: boolean;
  publishedAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface WatchVideo {
  title: string;
  description: string;
  platform: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: "featured" | "founder_lab" | "signal_breakdown" | "memory_cinema" | "most_shared";
  language: string;
  featured: boolean;
  publishedAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}
