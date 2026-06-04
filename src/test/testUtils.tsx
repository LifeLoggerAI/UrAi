import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import { UraiDemoProvider } from "@/providers/UraiDemoProvider";
import { UraiFeatureFlagProvider } from "@/providers/UraiFeatureFlagProvider";

export function createMockPassportProfile(overrides: Partial<PassportContextPermissions> = {}): PassportContextPermissions {
  return { ...DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, ...overrides };
}

export function createSafeDefaultPassportProfile(): PassportContextPermissions {
  return { ...DEFAULT_PASSPORT_CONTEXT_PERMISSIONS };
}

export function createSensitiveClosedPassportProfile(): PassportContextPermissions {
  return { ...DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, allowMoodContext: true, allowMemoryContext: true };
}

export function mockLocalStorage(initial: Record<string, string> = {}) {
  window.localStorage.clear();
  Object.entries(initial).forEach(([key, value]) => window.localStorage.setItem(key, value));
  return window.localStorage;
}

export function mockFirebaseUnavailable() {
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "";
  process.env.FIREBASE_PROJECT_ID = "";
}

export function mockAIUnavailable() {
  process.env.OPENAI_API_KEY = "";
}

export function mockReducedSensoryMode() {
  window.localStorage.setItem("urai.settings.reducedSensoryMode", "true");
}

export function createDemoModeWrapper() {
  return function DemoWrapper({ children }: { children: ReactNode }) {
    return <UraiDemoProvider initialMode="public_demo" profileId="public"><UraiFeatureFlagProvider>{children}</UraiFeatureFlagProvider></UraiDemoProvider>;
  };
}

export function renderWithUraiProviders(ui: ReactElement, options?: RenderOptions) {
  const Wrapper = options?.wrapper ?? (({ children }: { children: ReactNode }) => <UraiFeatureFlagProvider>{children}</UraiFeatureFlagProvider>);
  return render(ui, { ...options, wrapper: Wrapper });
}
