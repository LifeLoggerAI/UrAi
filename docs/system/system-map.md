# URAI System Map

This document provides a high-level overview of the URAI system architecture as implemented in the `UrAi` monorepo.

*Last Updated: 2024-05-23*

---

## Core Application: URAI Genesis (Next.js)

*   **Framework:** Next.js (App Router)
*   **Location:** `/src/app`
*   **Description:** The primary web application that serves as the entry point and container for the entire URAI experience. It handles all routing, rendering, and integration of the various product modules.

## Backend & Data Layer

*   **Platform:** Firebase
*   **Services Used:**
    *   **Authentication:** Firebase Auth for user identity.
    *   **Database:** Firestore for primary data storage.
    *   **Storage:** Firebase Storage for user-uploaded files and assets.
    *   **Serverless Functions:** Firebase Functions for backend logic (e.g., API endpoints, background jobs).
*   **Configuration:**
    *   **Rules:** `/firestore.rules`, `/storage.rules`
    *   **Functions:** `/functions`
    *   **Client SDK:** `/src/lib/firebase/firebaseClient.ts`

## UI & Component Library

*   **Location:** `/src/components`
*   **Description:** A vast library of React components organized by product (`genesis`, `passport`, `companion`, etc.) and shared UI elements (`ui`, `layout`).

## Core Logic & State Management

*   **Location:** `/src/lib` and `/src/providers`
*   **Description:** The `lib` directory contains the core business logic for each URAI product system. The `providers` directory contains React Context providers that manage and distribute state across the application.

## Standalone Product Routes

The application is structured to expose different URAI products via dedicated URL routes. Each of these routes renders a specific part of the URAI ecosystem.

*   `/` (Genesis Home)
*   `/passport`
*   `/companion` (via shell)
*   `/lifemap`
*   `/ground`
*   `/mirror`
*   `/shadow`
*   `/legacy`
*   `/studio`
*   `/spatial`
*   `/admin`

## Documentation & Governance

*   **Location:** `/docs`
*   **Description:** Contains all non-code artifacts, including system maps, evidence ledgers, product specifications, legal drafts, and governance documents for Foundation, Labs, and IP Holdings.

## Verification & Testing

*   **Location:** `/scripts` and `/tests`
*   **Description:** Contains scripts for running checks, building evidence, and performing various audits. The `/tests` directory contains unit, integration, and end-to-end tests.
