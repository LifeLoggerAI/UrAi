# URAI Genesis Repo Map

This document outlines the repository structure and key technologies for the URAI Genesis project.

## 1. Repository Structure

Based on an analysis of the file system, the project is a monorepo containing the main web application. There are no separate repositories for Firebase, backend services, or mobile wrappers identified at this time.

- **`src/`**: Main application source code.
  - **`src/app/`**: Core application routing, following the Next.js App Router paradigm. Each sub-folder represents a public or authenticated route.
    - `src/app/api/`: API routes for server-side functions.
    - `src/app/demo/`: Public demo routes.
    - `src/app/admin/`: Administrative control panel routes.
    - `src/app/settings/`: User settings routes.
  - **`src/lib/`**: Core application libraries, business logic, and type definitions.
    - `src/lib/data/`: Passive data source foundation.
    - `src/lib/intelligence/`: Symbolic inference engine and related types.
    - `src/lib/spatial/`: Spatial/AR/VR foundation.
    - `src/lib/genesis/`: Genesis integration and stabilization layer.
  - **`src/components/`**: Reusable React components.
    - `src/components/genesis/`: High-level Genesis scene components.
    - `src/components/passport/`: Passport and permission-related UI.
    - `src/components/settings/`: Settings UI components.
    - `src/components/spatial/`: Spatial/AR/VR UI components.
  - **`src/providers/`**: React Context providers for managing global state (e.g., `UraiSpatialProvider`).
  - **`src/hooks/`**: Reusable React hooks.
- **`docs/`**: Project documentation.
  - **`docs/repo/`**: Repository structure and implementation strategy.
  - **`docs/launch/`**: Launch checklists and operational documents.
  - **`docs/legal-review/`**: Documents for legal and privacy review.
  - **`docs/privacy/`**: Drafts of privacy-related user-facing documents.
  - **`docs/qa/`**: Quality assurance checklists.
- **`public/`**: Static assets like images, icons, and fonts.
- **`scripts/`**: Utility and automation scripts.

## 2. Technology Stack

- **Framework**: Next.js with the App Router.
- **Language**: TypeScript (`.ts`, `.tsx`).
- **UI Library**: React.
- **Styling**: CSS Modules or a similar convention (e.g., `globals.css`).
- **Backend/Database**: Firebase (Firestore is implied by previous passes).
- **Package Manager**: `npm` (inferred from the presence of `package.json` and `package-lock.json`).

## 3. Key Architectural Patterns

- **Routing**: File-based routing via the Next.js App Router (`src/app`).
- **State Management**: React Context providers (`src/providers/`).
- **Data Fetching**: A mix of client-side hooks and server-side API routes.
- **Permissions**: A custom, granular permission system centered around "Passport" (`src/components/passport`, `src/lib/data`).
- **Modularity**: Features are organized into distinct library modules (`src/lib/*`) and component groups (`src/components/*`).
