# URAI Reusable Components Map

This document maps the reusable components within the `src/components` directory, forming the building blocks of the URAI application.

*Last Updated: 2024-05-23*

---

## Summary

The component library is extensive but lacks clear organization. There appears to be significant overlap and potential duplication between component sets, particularly in the core visual and scene-related components (`/genesis`, `/lifemap`, `/life-map`, `/urai`, `/urai-production`).

The most clearly reusable components are located in the `/ui`, `/layout`, `/system`, `/auth`, and `/common` directories.

## Component Categories

### 1. UI Primitives (`src/components/ui`)

These are the most basic, stateless building blocks for the user interface.

| Component | Location | Purpose |
|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | Standard button element. |
| `Card` | `src/components/ui/Card.tsx` | A styled container for content. |
| `Chip` | `src/components/ui/Chip.tsx` | A small, pill-shaped element for tags or filters. |

### 2. Layout Components (`src/components/layout`)

These components define the overall structure and navigation of the application.

| Component | Location | Purpose |
|---|---|---|
| `MainLayout` | `src/components/layout/MainLayout.tsx` | The primary layout wrapper for most pages. |
| `BottomNav` | `src/components/layout/BottomNav.tsx` | The main navigation bar at the bottom of the screen. |
| `OnboardingGate` | `src/components/layout/OnboardingGate.tsx` | A wrapper that ensures the user has completed onboarding. |

### 3. System & State Components (`src/components/system`)

Components responsible for handling global application states.

| Component | Location | Purpose |
|---|---|---|
| `UraiErrorBoundary` | `src/components/system/UraiErrorBoundary.tsx` | Catches and displays errors within the application. |
| `UraiLoadingState` | `src/components/system/UraiLoadingState.tsx` | A global loading indicator. |
| `MaintenanceMode` | `src/components/system/MaintenanceMode.tsx` | A component to display when the system is down for maintenance. |
| `RouteErrorFallback`| `src/components/RouteErrorFallback.tsx` | Fallback component for routing errors.|

### 4. Auth & Privacy Components (`src/components/auth`, `src/components/privacy`)

Components related to user authentication, account management, and privacy consent.

| Component | Location | Purpose |
|---|---|---|
| `SignInPanel` | `src/components/auth/SignInPanel.tsx` | The UI for user sign-in. |
| `UraiAccountGate` | `src/components/auth/UraiAccountGate.tsx` | A component that gates content based on authentication status. |
| `DeleteAccountDialog` | `src/components/auth/DeleteAccountDialog.tsx` | The UI for account deletion. |
| `ConsentGate` | `src/components/privacy/ConsentGate.tsx` | A generic component to request user consent. |

### 5. Shared Feature Components

These are more complex components that provide specific, reusable functionality across different parts of the application.

| Component | Location | Purpose |
|---|---|---|
| `CompanionShell` | `src/components/companion/CompanionShell.tsx` | The main shell for the AI Companion interface. |
| `NotificationCenter` | `src/components/notifications/NotificationCenter.tsx` | Displays notifications to the user. |
| `UraiSoundControls` | `src/components/sound/UraiSoundControls.tsx` | UI for managing sound settings. |
| `WaitlistForm` | `src/components/WaitlistForm.tsx` | A form for users to join the waitlist. |

### 6. Product-Specific Components (Not Reusable)

These directories contain components that are tightly coupled to a specific product and are not designed for general reuse. They are built *using* the foundational components listed above.

*   `src/components/admin`
*   `src/components/ground`
*   `src/components/legacy`
*   `src/components/mirror`
*   `src/components/rituals`
*   `src/components/shadow`

### 7. Core Visual & Scene Components (Needs Review)

A large number of components are dedicated to the core WebGL and scene-based experiences. There is significant overlap and unclear separation of concerns between these folders. This is a major area for future refactoring and clarification.

*   `src/components/genesis`
*   `src/components/lifemap`
*   `src/components/life-map`
*   `src/components/spatial-life-map`
*   `src/components/urai`
*   `src/components/urai-production`
