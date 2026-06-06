import React from 'react';
import { assetRegistry } from '@/lib/assets/assetRegistry';
import './Genesis.css';

interface GenesisOrbProps {
  onOpenCompanion?: () => void;
}

/**
 * The central interactive element of the Genesis experience.
 * It is now rendered as an image, sourced from the assetRegistry.
 */
export const GenesisOrb: React.FC<GenesisOrbProps> = ({ onOpenCompanion }) => {
  const handleClick = () => {
    onOpenCompanion?.();
  };

  return (
    <div className="genesis-orb-container">
      <button
        type="button"
        className="genesis-orb-button"
        onClick={handleClick}
        aria-label="Open URAI Companion"
      >
        <img
          src={assetRegistry.images.genesisOrb}
          alt="Genesis Orb"
          className="genesis-orb"
        />
      </button>
    </div>
  );
};
