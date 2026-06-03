export type UraiAuthMode = "local" | "anonymous" | "authenticated";

export type UraiAccountStatus =
  | "active"
  | "signed_out"
  | "pending_deletion"
  | "deleted"
  | "error";

export type UraiUserProfile = {
  userId: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  authMode: UraiAuthMode;
  accountStatus: UraiAccountStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  onboardingCompleted?: boolean;
  passportInitialized?: boolean;
  cloudSyncEnabled?: boolean;
  schemaVersion?: number;
};

export type UraiAuthState = {
  userId?: string;
  profile?: UraiUserProfile;
  authMode: UraiAuthMode;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLocalOnly: boolean;
  loading: boolean;
  error?: string;
};

export type UraiSignOutChoice = "keep_local" | "clear_local" | "cancel";
export type UraiDeleteAccountChoice = "cloud_only" | "cloud_and_local" | "cancel";
