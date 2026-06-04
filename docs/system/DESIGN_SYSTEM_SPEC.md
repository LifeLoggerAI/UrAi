# URAI Design System Spec

This document outlines the current state of the URAI design system, including its use of Tailwind CSS, custom styles, and other visual primitives.

*Last Updated: 2024-05-23*

---

## Overview

The URAI design system is a mix of the Tailwind CSS utility-first framework and a significant amount of highly specific, custom CSS. There is no formal design token system in place, which presents a major challenge for maintainability and consistency.

## Technology

### Tailwind CSS

*   **Configuration:** The project uses a default Tailwind CSS configuration, as seen in `tailwind.config.ts`.
*   **Adoption:** Tailwind is used for basic layout and component styling, as evidenced by the `content` configuration pointing to `src/app`, `src/components`, and `src/lib`.
*   **Theme:** The default Tailwind theme has not been customized. All colors, spacing, and typography are either default values or are overridden with custom CSS.

### Custom CSS

*   **File:** The primary custom stylesheet is `src/app/globals.css`.
*   **Styling:** This file contains a large number of custom styles, including:
    *   **Base Styles:** A `body` style that sets a black background (`#000`) and white text (`#fff`).
    *   **Scene Styling:** Extremely detailed and complex styles for the `.home-scene` and `.urai-home-shell` selectors. These styles are responsible for the core visual experience of the Genesis scene, using a combination of gradients, transforms, and blend modes to create a layered, atmospheric effect.
    *   **Animations:** Keyframe animations for pulsing effects (`uraiOrbCorePulse`, `uraiAvatarHeartPulse`).
    *   **Responsive Design:** Media queries to adjust the layout for smaller screen sizes.

## Visual Primitives

### Color

There is no formal color palette or token system. Colors are hardcoded directly in the CSS, primarily using `rgba()` values for transparency and layering effects. The base colors are black and white.

**Recommendation:** Establish a formal color palette with design tokens to ensure consistency and make future theme updates easier.

### Typography

*   **Font Stack:** The primary font is `'SF Pro Text'`, an Apple system font. It is backed by a standard set of sans-serif fallbacks.
*   **Hierarchy:** There is no formal typographic hierarchy (e.g., for headings, body text, etc.) defined in a central location. Typography is likely handled on a component-by-component basis.

**Recommendation:** Define a typographic scale with design tokens and reusable classes for headings and body text.

### Spacing

There is no formal spacing scale or token system. Spacing is likely handled using Tailwind's default spacing scale or with hardcoded values in custom CSS.

**Recommendation:** Define a spacing scale with design tokens to ensure consistent padding and margins throughout the application.

### Iconography

There is no information in the provided files about the use of an icon library or system.

## Conclusion

The URAI design system is functional but lacks a solid, maintainable foundation. The heavy reliance on custom, hardcoded styles for the core visual experience makes it difficult to modify or extend. The lack of a formal design token system is a significant liability.

**Key areas for improvement:**

1.  **Establish a Design Token System:** Define tokens for colors, typography, spacing, and other visual primitives.
2.  **Refactor Custom CSS:** Abstract the complex scene styling into a more manageable and reusable system. Replace hardcoded values with design tokens.
3.  **Component Library:** Continue to build out the reusable component library in `src/components/ui` and ensure that all components use the design token system.
