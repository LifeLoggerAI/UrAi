# URAI Genesis Asset Pipeline

This document outlines the standard procedure for adding new static assets (images, icons, audio) to the project. Following this process ensures that all assets are managed consistently and efficiently.

## 1. Directory Structure

All static assets are located in the `public/assets/` directory, organized by type:

- **`public/assets/images/`**: For primary visual assets, such as the Genesis Orb, backgrounds, or larger illustrations. Prefer SVG for resolution independence where possible.
- **`public/assets/icons/`**: For UI icons. These should almost always be SVGs to allow for styling and scaling.
- **`public/assets/audio/`**: For sound effects and other audio clips (e.g., `.mp3`, `.wav`).

## 2. The Asset Registry

The single source of truth for all asset paths is the **Asset Registry**.

**File Location**: `src/lib/assets/assetRegistry.ts`

This file contains a mapping of human-readable keys to their corresponding public URL paths.

## 3. How to Add a New Asset

1.  **Place the File**: Add the new asset file to the appropriate subdirectory within `public/assets/`.
    -   Example: Add a new icon named `user-avatar.svg` to `public/assets/icons/`.

2.  **Optimize the Asset**: Before adding the asset to the registry, ensure it is optimized for the web.
    -   **Images**: Use a tool like [ImageOptim](https://imageoptim.com/) or [Squoosh](https://squoosh.app/) to compress PNGs or JPEGs.
    -   **SVGs**: Use a tool like [SVGOMG](https://jakearchibald.github.io/svgomg/) to clean up and minimize the SVG markup.

3.  **Update the Registry**: Open `src/lib/assets/assetRegistry.ts` and add a new entry for your asset. Use a clear, camelCase key.

    ```typescript
    // src/lib/assets/assetRegistry.ts

    export const assetRegistry = {
      // ... existing categories
      icons: {
        // ... existing icons
        userAvatar: '/assets/icons/user-avatar.svg', // Your new entry
      },
      // ... other categories
    };
    ```

4.  **Use in a Component**: Import the `assetRegistry` in your React component and reference the asset using its key.

    ```tsx
    // src/components/some-component/SomeComponent.tsx

    import { assetRegistry } from '@/lib/assets/assetRegistry';

    export const SomeComponent = () => {
      return (
        <img src={assetRegistry.icons.userAvatar} alt="User Avatar" />
      );
    };
    ```

## Benefits of this Approach

- **No Magic Strings**: Asset paths are not hardcoded in multiple components, which makes them easy to update.
- **Centralized Management**: All asset paths are in one file, providing a clear overview of what's available.
- **Type Safety (Future)**: This structure can be extended to provide type-safe asset references.
- **Easy Refactoring**: If asset paths or names change, you only need to update them in one location.
