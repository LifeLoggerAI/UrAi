/**
 * A centralized registry for all static asset paths.
 * This prevents the use of magic strings in components and provides a single
 * source of truth for asset management. When adding a new asset, add its path
 * here and reference the key in the consuming component.
 */
export const assetRegistry = {
  // == GENESIS & CORE UI ==
  images: {
    // Placeholder for the real orb asset. To be replaced with final PNG/SVG.
    genesisOrb: '/assets/images/genesis-orb-placeholder.svg',
  },
  icons: {
    // Common UI Icons
    close: '/assets/icons/close.svg',
    settings: '/assets/icons/settings.svg',
    chevronRight: '/assets/icons/chevron-right.svg',
    lock: '/assets/icons/lock.svg',
    passport: '/assets/icons/passport.svg',
  },
  audio: {
    // UI Interaction Sounds
    uiClick: '/assets/audio/ui-click.mp3',
    uiHover: '/assets/audio/ui-hover.mp3',
    orbActivate: '/assets/audio/orb-activate.mp3',
  },
};
